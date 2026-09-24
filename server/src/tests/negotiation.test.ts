import { describe, it, expect, beforeAll } from 'vitest';
import { negotiationService } from '../services/negotiationService';
import { prisma } from '../db/prisma';
import { seed } from '../db/seed';

describe('A2A Multi-Round Negotiation Engine', () => {
  beforeAll(async () => {
    await seed();
  });

  it('should negotiate multi-round concessions and achieve target price without infinite loops', async () => {
    const buyer = await prisma.user.findFirst({ where: { role: 'BUYER' } });
    const precisionLab = await prisma.agent.findFirst({ where: { name: { contains: 'PrecisionLab' } } });
    const buyerAgent = await prisma.agent.findFirst({ where: { type: 'BUYER' } });

    const deal = await prisma.deal.create({
      data: {
        buyerId: buyer!.id,
        title: 'Test Reaction Unit',
        description: 'Test units for negotiation check',
        productCategory: 'Laboratory Equipment & Glassware',
        quantity: 100,
        budget: 10000,
        currency: 'USDC',
        deadlineDays: 14,
        status: 'NEGOTIATING'
      }
    });

    const result = await negotiationService.executeNegotiation(
      deal.id,
      buyerAgent!.id,
      precisionLab!.id,
      10000,
      14
    );

    expect(result.status).toBe('CONCLUDED');
    expect(result.rounds.length).toBeLessThanOrEqual(3);
    expect(result.finalPrice).toBe(10000);
    expect(result.totalSavings).toBe(500); // 10500 - 10000
  });
});
