import { describe, it, expect, beforeAll } from 'vitest';
import { dealService } from '../services/dealService';
import { prisma } from '../db/prisma';
import { seed } from '../db/seed';

describe('End-to-End Autonomous Deal Lifecycle Flow', () => {
  beforeAll(async () => {
    await seed();
  });

  it('should execute full autonomous lifecycle: create -> discover -> quote -> negotiate -> human approve -> transact -> complete', async () => {
    // 1. Create Deal
    const deal = await dealService.createDeal({
      title: 'Automated E2E Bio-Reactor Deal',
      description: 'End to end testing procurement deal',
      productCategory: 'Laboratory Equipment & Glassware',
      quantity: 100,
      budget: 10000,
      currency: 'USDC',
      deadlineDays: 14
    });

    expect(deal.status).toBe('CREATED');

    // 2. Start Discovery & Autonomous Negotiation Workflow
    const startedDeal = await dealService.startDealWorkflow(deal.id);
    expect(startedDeal?.status).toBe('AWAITING_APPROVAL');
    expect(startedDeal?.quotes.length).toBeGreaterThanOrEqual(1);
    expect(startedDeal?.savingsAmount).toBeGreaterThanOrEqual(0);
    expect(startedDeal?.selectedAgentId).toBeDefined();

    // 3. Human Operator Approval Gate
    const approvedDeal = await dealService.approveDeal(deal.id, 'user-admin-01', 'Approved by test suite');
    expect(approvedDeal?.status).toBe('APPROVED');

    // 4. Execute Transaction & Escrow Lock
    const completedDeal = await dealService.executeDealTransaction(deal.id);
    expect(completedDeal?.status).toBe('COMPLETED');
    expect(completedDeal?.transactions.length).toBe(1);
    expect(completedDeal?.transactions[0].status).toBe('COMPLETED');
    expect(completedDeal?.transactions[0].payment?.escrowStatus).toBe('FUNDS_HELD_IN_ESCROW');
  });
});
