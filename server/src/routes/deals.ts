import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { dealService } from '../services/dealService';
import { discoveryService } from '../services/discoveryService';
import { negotiationService } from '../services/negotiationService';
import { getAIProvider } from '../ai/aiProvider';

export const dealsRouter = Router();

// GET /api/deals - List all deals
dealsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        buyer: true,
        selectedAgent: true,
        quotes: true,
        approvals: true,
        transactions: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: deals });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/deals - Create new deal requirement
dealsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, productCategory, quantity, budget, currency, deadlineDays, preferredLocation, qualitySpecs } = req.body;
    if (!title || !quantity || !budget) {
      return res.status(400).json({ success: false, error: 'Title, quantity, and budget are required.' });
    }

    const deal = await dealService.createDeal({
      title,
      description: description || `Procurement of ${quantity} units of ${title}`,
      productCategory: productCategory || 'Laboratory Equipment & Glassware',
      quantity: Number(quantity),
      budget: Number(budget),
      currency: currency || 'USDC',
      deadlineDays: deadlineDays ? Number(deadlineDays) : 14,
      preferredLocation: preferredLocation || 'Global',
      qualitySpecs: qualitySpecs || 'ISO-9001, GMP standard'
    });

    res.status(201).json({ success: true, data: deal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/deals/demo - 1-Click Launch Demo Deal
dealsRouter.post('/demo', async (req: Request, res: Response) => {
  try {
    const deal = await dealService.createDeal({
      title: 'Laboratory Glass Reactor',
      description: '100 units of double-jacketed 50L borosilicate chemical reactors with PTFE bottom drain valve and ISO-9001 certs.',
      productCategory: 'Laboratory Equipment & Glassware',
      quantity: 100,
      budget: 10000,
      currency: 'USDC',
      deadlineDays: 14,
      preferredLocation: 'North America / Europe / Asia',
      qualitySpecs: 'ISO-9001, GMP Certified, 3.3 Borosilicate glass, Pressure -0.1 to 0.5 MPa'
    });

    res.status(201).json({ success: true, data: deal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/deals/:id - Get full deal workspace details
dealsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deal = await dealService.getDeal(id);
    if (!deal) {
      return res.status(404).json({ success: false, error: 'Deal not found' });
    }
    res.json({ success: true, data: deal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/deals/:id/start - Run full discovery + qualification + quoting + negotiation workflow
dealsRouter.post('/:id/start', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updatedDeal = await dealService.startDealWorkflow(id);
    res.json({ success: true, data: updatedDeal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/deals/:id/discover - Run standalone discovery step
dealsRouter.post('/:id/discover', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });

    const result = await discoveryService.discoverAgents({
      dealId: deal.id,
      category: deal.productCategory,
      productName: deal.title,
      quantity: deal.quantity,
      budget: deal.budget,
      currency: deal.currency,
      deadlineDays: deal.deadlineDays
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/deals/:id/negotiate - Run standalone negotiation step
dealsRouter.post('/:id/negotiate', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { supplierAgentId, targetPrice, targetDeliveryDays } = req.body;
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });

    const buyerAgent = await prisma.agent.findFirst({ where: { type: 'BUYER' } });
    const result = await negotiationService.executeNegotiation(
      deal.id,
      buyerAgent?.id || 'agent-buyer-01',
      supplierAgentId || 'agent-precisionlab-02',
      targetPrice || deal.budget,
      targetDeliveryDays || deal.deadlineDays
    );

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/deals/:id/approve - Human Operator approves proposal
dealsRouter.post('/:id/approve', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { userId, notes } = req.body;
    const updatedDeal = await dealService.approveDeal(id, userId || 'user-buyer-01', notes);
    res.json({ success: true, data: updatedDeal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/deals/:id/reject - Human Operator rejects proposal
dealsRouter.post('/:id/reject', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { userId, reason } = req.body;
    const updatedDeal = await dealService.rejectDeal(id, userId || 'user-buyer-01', reason || 'Price or terms unacceptable');
    res.json({ success: true, data: updatedDeal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/deals/:id/transaction - Execute settlement
dealsRouter.post('/:id/transaction', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updatedDeal = await dealService.executeDealTransaction(id);
    res.json({ success: true, data: updatedDeal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/deals/:id/ai-analysis - Get AI analysis of deal quotes
dealsRouter.get('/:id/ai-analysis', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        quotes: {
          include: { agent: { include: { reputation: true } } }
        }
      }
    });
    if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });

    const ai = getAIProvider();
    const quotesList = deal.quotes || [];
    const analysis = await ai.analyzeQuotes({
      dealTitle: deal.title,
      requirement: deal.description,
      quantity: deal.quantity,
      budget: deal.budget,
      currency: deal.currency,
      quotes: quotesList.map((q: any) => ({
        agentId: q.agentId,
        agentName: q.agent?.name || 'Supplier Agent',
        price: q.price,
        deliveryDays: q.deliveryDays,
        reputationScore: q.agent?.reputation?.overallScore ?? 90,
        fulfillmentRate: q.agent?.reputation?.fulfillmentRate ?? 95,
        terms: q.terms
      }))
    });

    res.json({ success: true, data: analysis });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
