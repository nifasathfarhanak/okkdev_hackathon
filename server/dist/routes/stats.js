"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
exports.statsRouter = (0, express_1.Router)();
// GET /api/stats - Aggregate statistics for AgentMirror dashboard
exports.statsRouter.get('/', async (req, res) => {
    try {
        const [totalIntents, totalSimulations, totalApprovals, totalExecutions] = await Promise.all([
            prisma_1.prisma.intent.count(),
            prisma_1.prisma.simulation.count(),
            prisma_1.prisma.approval.count({ where: { status: 'APPROVED' } }),
            prisma_1.prisma.execution.count({ where: { status: 'COMPLETED' } })
        ]);
        return res.json({
            success: true,
            stats: {
                totalIntents,
                totalSimulations,
                totalApprovedDecisions: totalApprovals,
                totalExecutions
            }
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});
