import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const statsRouter = Router();

// GET /api/stats - Aggregate statistics for AgentMirror dashboard
statsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const [totalIntents, totalSimulations, totalApprovals, totalExecutions] = await Promise.all([
      prisma.intent.count(),
      prisma.simulation.count(),
      prisma.approval.count({ where: { status: 'APPROVED' } }),
      prisma.execution.count({ where: { status: 'COMPLETED' } })
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
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
