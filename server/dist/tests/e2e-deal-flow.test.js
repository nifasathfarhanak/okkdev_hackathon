"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const dealService_1 = require("../services/dealService");
const seed_1 = require("../db/seed");
(0, vitest_1.describe)('End-to-End Autonomous Deal Lifecycle Flow', () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, seed_1.seed)();
    });
    (0, vitest_1.it)('should execute full autonomous lifecycle: create -> discover -> quote -> negotiate -> human approve -> transact -> complete', async () => {
        // 1. Create Deal
        const deal = await dealService_1.dealService.createDeal({
            title: 'Automated E2E Bio-Reactor Deal',
            description: 'End to end testing procurement deal',
            productCategory: 'Laboratory Equipment & Glassware',
            quantity: 100,
            budget: 10000,
            currency: 'USDC',
            deadlineDays: 14
        });
        (0, vitest_1.expect)(deal.status).toBe('CREATED');
        // 2. Start Discovery & Autonomous Negotiation Workflow
        const startedDeal = await dealService_1.dealService.startDealWorkflow(deal.id);
        (0, vitest_1.expect)(startedDeal?.status).toBe('AWAITING_APPROVAL');
        (0, vitest_1.expect)(startedDeal?.quotes.length).toBeGreaterThanOrEqual(1);
        (0, vitest_1.expect)(startedDeal?.savingsAmount).toBeGreaterThanOrEqual(0);
        (0, vitest_1.expect)(startedDeal?.selectedAgentId).toBeDefined();
        // 3. Human Operator Approval Gate
        const approvedDeal = await dealService_1.dealService.approveDeal(deal.id, 'user-admin-01', 'Approved by test suite');
        (0, vitest_1.expect)(approvedDeal?.status).toBe('APPROVED');
        // 4. Execute Transaction & Escrow Lock
        const completedDeal = await dealService_1.dealService.executeDealTransaction(deal.id);
        (0, vitest_1.expect)(completedDeal?.status).toBe('COMPLETED');
        (0, vitest_1.expect)(completedDeal?.transactions.length).toBe(1);
        (0, vitest_1.expect)(completedDeal?.transactions[0].status).toBe('COMPLETED');
        (0, vitest_1.expect)(completedDeal?.transactions[0].payment?.escrowStatus).toBe('FUNDS_HELD_IN_ESCROW');
    });
});
