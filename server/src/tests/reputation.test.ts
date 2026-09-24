import { describe, it, expect, beforeAll } from 'vitest';
import { reputationService } from '../services/reputationService';
import { seed } from '../db/seed';

describe('Reputation Transparent Calculation Engine', () => {
  beforeAll(async () => {
    await seed();
  });

  it('should accurately compute composite reputation score and component breakdown', () => {
    const result = reputationService.calculateScore({
      fulfillmentRate: 98.8,
      avgResponseMs: 240,
      totalCompletedDeals: 127,
      disputeRate: 0.2,
      avgImprovementPct: 6.8
    });

    expect(result.overallScore).toBeGreaterThan(90);
    expect(result.components.fulfillmentScore).toBeCloseTo(39.5, 0);
    expect(result.components.disputePenalty).toBe(2);
    expect(result.components.historyScore).toBe(25);
  });
});
