/**
 * dealService.ts — Stub (legacy DealMesh module, replaced by AgentMirror simulationEngine)
 * This file exists for compilation compatibility only.
 */
export const dealService = {
  createDeal: async (_data: any) => ({ id: 'stub', message: 'Use /api/mirror/simulate instead.' }),
  executeDealTransaction: async (_dealId: string) => ({ success: false, message: 'Use /api/mirror/simulation/:id/execute instead.' })
};
