"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const negotiationService_1 = require("../services/negotiationService");
const prisma_1 = require("../db/prisma");
const seed_1 = require("../db/seed");
(0, vitest_1.describe)('A2A Multi-Round Negotiation Engine', () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, seed_1.seed)();
    });
    (0, vitest_1.it)('should negotiate multi-round concessions and achieve target price without infinite loops', async () => {
        const buyer = await prisma_1.prisma.user.findFirst({ where: { role: 'BUYER' } });
        const precisionLab = await prisma_1.prisma.agent.findFirst({ where: { name: { contains: 'PrecisionLab' } } });
        const buyerAgent = await prisma_1.prisma.agent.findFirst({ where: { type: 'BUYER' } });
        const deal = await prisma_1.prisma.deal.create({
            data: {
                buyerId: buyer.id,
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
        const result = await negotiationService_1.negotiationService.executeNegotiation(deal.id, buyerAgent.id, precisionLab.id, 10000, 14);
        (0, vitest_1.expect)(result.status).toBe('CONCLUDED');
        (0, vitest_1.expect)(result.rounds.length).toBeLessThanOrEqual(3);
        (0, vitest_1.expect)(result.finalPrice).toBe(10000);
        (0, vitest_1.expect)(result.totalSavings).toBe(500); // 10500 - 10000
    });
});
