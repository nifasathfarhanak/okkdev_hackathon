"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const discoveryService_1 = require("../services/discoveryService");
const seed_1 = require("../db/seed");
(0, vitest_1.describe)('Agent Discovery Engine', () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, seed_1.seed)();
    });
    (0, vitest_1.it)('should discover and rank candidate supplier agents matching laboratory requirements', async () => {
        const result = await discoveryService_1.discoveryService.discoverAgents({
            category: 'Laboratory Equipment & Glassware',
            productName: 'Laboratory Glass Reactor',
            quantity: 100,
            budget: 10000,
            currency: 'USDC',
            deadlineDays: 14,
            minReputation: 80
        });
        (0, vitest_1.expect)(result.totalFound).toBeGreaterThanOrEqual(3);
        (0, vitest_1.expect)(result.qualifiedCount).toBeGreaterThanOrEqual(2);
        (0, vitest_1.expect)(result.candidates[0].matchScore).toBeGreaterThan(80);
        (0, vitest_1.expect)(result.candidates.some(c => c.name.includes('PrecisionLab'))).toBe(true);
    });
});
