import { describe, it, expect, beforeAll } from 'vitest';
import { discoveryService } from '../services/discoveryService';
import { prisma } from '../db/prisma';
import { seed } from '../db/seed';

describe('Agent Discovery Engine', () => {
  beforeAll(async () => {
    await seed();
  });

  it('should discover and rank candidate supplier agents matching laboratory requirements', async () => {
    const result = await discoveryService.discoverAgents({
      category: 'Laboratory Equipment & Glassware',
      productName: 'Laboratory Glass Reactor',
      quantity: 100,
      budget: 10000,
      currency: 'USDC',
      deadlineDays: 14,
      minReputation: 80
    });

    expect(result.totalFound).toBeGreaterThanOrEqual(3);
    expect(result.qualifiedCount).toBeGreaterThanOrEqual(2);
    expect(result.candidates[0].matchScore).toBeGreaterThan(80);
    expect(result.candidates.some(c => c.name.includes('PrecisionLab'))).toBe(true);
  });
});
