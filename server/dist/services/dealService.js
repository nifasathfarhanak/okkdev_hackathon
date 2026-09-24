"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealService = void 0;
/**
 * dealService.ts — Stub (legacy DealMesh module, replaced by AgentMirror simulationEngine)
 * This file exists for compilation compatibility only.
 */
exports.dealService = {
    createDeal: async (_data) => ({ id: 'stub', message: 'Use /api/mirror/simulate instead.' }),
    executeDealTransaction: async (_dealId) => ({ success: false, message: 'Use /api/mirror/simulation/:id/execute instead.' })
};
