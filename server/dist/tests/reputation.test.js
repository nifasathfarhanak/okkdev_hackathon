"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const reputationService_1 = require("../services/reputationService");
const seed_1 = require("../db/seed");
(0, vitest_1.describe)('Reputation Transparent Calculation Engine', () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, seed_1.seed)();
    });
    (0, vitest_1.it)('should accurately compute composite reputation score and component breakdown', () => {
        const result = reputationService_1.reputationService.calculateScore({
            fulfillmentRate: 98.8,
            avgResponseMs: 240,
            totalCompletedDeals: 127,
            disputeRate: 0.2,
            avgImprovementPct: 6.8
        });
        (0, vitest_1.expect)(result.overallScore).toBeGreaterThan(90);
        (0, vitest_1.expect)(result.components.fulfillmentScore).toBeCloseTo(39.5, 0);
        (0, vitest_1.expect)(result.components.disputePenalty).toBe(2);
        (0, vitest_1.expect)(result.components.historyScore).toBe(25);
    });
});
