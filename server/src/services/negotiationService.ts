import { prisma } from '../db/prisma';
import { getAIProvider } from '../ai/aiProvider';
import { auditService } from './auditService';
import { sseService } from './sseService';

export interface NegotiationStepResult {
  round: number;
  buyerOffer: {
    price: number;
    deliveryDays: number;
    reasoning: string;
    protocolMessage: string;
  };
  supplierResponse: {
    status: 'COUNTER' | 'ACCEPTED' | 'REJECTED';
    price: number;
    deliveryDays: number;
    reasoning: string;
    protocolMessage: string;
  };
  concluded: boolean;
  savingsVsInitial: number;
}

class NegotiationService {
  public async executeNegotiation(
    dealId: string,
    buyerAgentId: string,
    supplierAgentId: string,
    targetPrice: number,
    targetDeliveryDays: number
  ) {
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { requirement: true }
    });
    const supplier = await prisma.agent.findUnique({
      where: { id: supplierAgentId },
      include: { reputation: true }
    });

    if (!deal || !supplier) {
      throw new Error('Deal or Supplier Agent not found');
    }

    const ai = getAIProvider();

    // Determine supplier profile rules based on agent characteristics
    let initialPrice = 10500;
    let initialDelivery = 8;

    if (supplier.name.includes('GlassWorks')) {
      initialPrice = 10800;
      initialDelivery = 12;
    } else if (supplier.name.includes('LabCore')) {
      initialPrice = 10300;
      initialDelivery = 10;
    } else if (supplier.name.includes('PrecisionLab')) {
      initialPrice = 10500;
      initialDelivery = 8;
    }

    // Create or find Negotiation record
    let negotiation = await prisma.negotiation.findFirst({
      where: { dealId, sellerAgentId: supplierAgentId }
    });

    if (!negotiation) {
      negotiation = await prisma.negotiation.create({
        data: {
          dealId,
          buyerAgentId,
          sellerAgentId: supplierAgentId,
          status: 'IN_PROGRESS',
          currentRound: 1,
          maxRounds: 3,
          initialPrice,
          currentPrice: initialPrice,
          initialDelivery,
          currentDelivery: initialDelivery,
          startedAt: new Date()
        }
      });
    }

    const roundsExecuted: NegotiationStepResult[] = [];
    let currentPrice = initialPrice;
    let currentDelivery = initialDelivery;
    let isConcluded = false;

    // Run up to 3 rounds of structured A2A negotiation
    for (let round = 1; round <= 3 && !isConcluded; round++) {
      // 1. Buyer Agent generates tactical counter-offer
      const strategy = await ai.generateNegotiationStrategy(targetPrice, currentPrice, currentDelivery, round);
      const buyerCounterPrice = strategy.counterPrice;
      const buyerCounterDelivery = Math.min(targetDeliveryDays, currentDelivery);

      // Record Buyer Message
      const buyerMsgPayload = {
        protocol: 'OKX-A2A/1.0',
        action: 'NEGOTIATE',
        round,
        target_price: buyerCounterPrice,
        currency: deal.currency,
        delivery_days: buyerCounterDelivery,
        terms: 'OKX_ESCROW_RELEASE_ON_VERIFICATION',
        strategy_tactics: strategy.tactics
      };

      await prisma.negotiationMessage.create({
        data: {
          negotiationId: negotiation.id,
          round,
          senderAgentId: buyerAgentId,
          receiverAgentId: supplierAgentId,
          messageType: 'NEGOTIATE',
          summary: `Buyer Agent offers $${buyerCounterPrice.toLocaleString()} at ${buyerCounterDelivery}d delivery`,
          payload: JSON.stringify(buyerMsgPayload)
        }
      });

      // 2. Supplier Agent autonomous logic (PrecisionLab Agent specifically agrees to target price on round 2/3)
      let supplierAction: 'COUNTER' | 'ACCEPTED' | 'REJECTED' = 'COUNTER';
      let suppPrice = currentPrice;
      let suppDelivery = currentDelivery;
      let suppReasoning = '';

      if (supplier.name.includes('PrecisionLab')) {
        if (round === 1) {
          suppPrice = 10200;
          suppDelivery = 8;
          suppReasoning = 'PrecisionLab counter-offers $10,200 with guaranteed 8-day expedited air freight and ISO-9001 certified batch documentation.';
        } else {
          // Round 2 or 3: PrecisionLab accepts target budget $10,000
          suppPrice = targetPrice;
          suppDelivery = 8;
          supplierAction = 'ACCEPTED';
          suppReasoning = `PrecisionLab accepts target budget of $${targetPrice.toLocaleString()} ${deal.currency} for 100 units with 8-day delivery conditioned on OKX Escrow smart contract lock.`;
          isConcluded = true;
        }
      } else if (supplier.name.includes('LabCore')) {
        if (round === 1) {
          suppPrice = 10150;
          suppDelivery = 10;
          suppReasoning = 'LabCore offers $10,150 with standard QA inspection.';
        } else {
          suppPrice = 10100;
          suppDelivery = 9;
          suppReasoning = 'LabCore final firm counter-offer: $10,100, 9 days.';
          isConcluded = true;
        }
      } else {
        // GlassWorks Agent
        suppPrice = Math.max(10400, currentPrice - 200);
        suppDelivery = 11;
        suppReasoning = `GlassWorks offers discounted batch rate of $${suppPrice.toLocaleString()} at 11 days.`;
        if (round >= 3) isConcluded = true;
      }

      currentPrice = suppPrice;
      currentDelivery = suppDelivery;

      // Record Supplier Response Message
      const suppMsgPayload = {
        protocol: 'OKX-A2A/1.0',
        action: supplierAction === 'ACCEPTED' ? 'ACCEPT' : 'COUNTER_OFFER',
        round,
        price: suppPrice,
        currency: deal.currency,
        delivery_days: suppDelivery,
        terms: 'OKX_ESCROW_APPROVED',
        status: supplierAction,
        notes: suppReasoning
      };

      await prisma.negotiationMessage.create({
        data: {
          negotiationId: negotiation.id,
          round,
          senderAgentId: supplierAgentId,
          receiverAgentId: buyerAgentId,
          messageType: supplierAction === 'ACCEPTED' ? 'ACCEPT' : 'COUNTER_OFFER',
          summary: `${supplier.name} ${supplierAction === 'ACCEPTED' ? 'ACCEPTED offer at' : 'counters with'} $${suppPrice.toLocaleString()}`,
          payload: JSON.stringify(suppMsgPayload)
        }
      });

      roundsExecuted.push({
        round,
        buyerOffer: {
          price: buyerCounterPrice,
          deliveryDays: buyerCounterDelivery,
          reasoning: strategy.justification,
          protocolMessage: JSON.stringify(buyerMsgPayload, null, 2)
        },
        supplierResponse: {
          status: supplierAction,
          price: suppPrice,
          deliveryDays: suppDelivery,
          reasoning: suppReasoning,
          protocolMessage: JSON.stringify(suppMsgPayload, null, 2)
        },
        concluded: isConcluded,
        savingsVsInitial: initialPrice - suppPrice
      });

      // Update Negotiation record
      await prisma.negotiation.update({
        where: { id: negotiation.id },
        data: {
          currentRound: round,
          currentPrice: suppPrice,
          currentDelivery: suppDelivery,
          finalPrice: isConcluded ? suppPrice : null,
          finalDelivery: isConcluded ? suppDelivery : null,
          status: isConcluded ? 'CONCLUDED' : 'IN_PROGRESS',
          completedAt: isConcluded ? new Date() : null,
          aiStrategyReasoning: `Strategy: ${strategy.justification}. Result: ${suppReasoning}`
        }
      });

      // Broadcast real-time SSE event
      sseService.broadcast('negotiation.message', {
        dealId,
        negotiationId: negotiation.id,
        round,
        buyerOffer: roundsExecuted[roundsExecuted.length - 1].buyerOffer,
        supplierResponse: roundsExecuted[roundsExecuted.length - 1].supplierResponse,
        isConcluded
      });
    }

    const totalSavings = initialPrice - currentPrice;
    await auditService.log({
      dealId,
      actorType: 'BUYER_AGENT',
      actorName: 'DealMesh Autonomous Buyer Agent',
      action: 'NEGOTIATE',
      result: `Negotiation concluded with ${supplier.name}: final price $${currentPrice.toLocaleString()} (saved $${totalSavings.toLocaleString()})`,
      details: { rounds: roundsExecuted.length, finalPrice: currentPrice, finalDelivery: currentDelivery, totalSavings }
    });

    return {
      negotiationId: negotiation.id,
      supplierName: supplier.name,
      initialPrice,
      finalPrice: currentPrice,
      initialDelivery,
      finalDelivery: currentDelivery,
      totalSavings,
      rounds: roundsExecuted,
      status: 'CONCLUDED'
    };
  }
}

export const negotiationService = new NegotiationService();
