import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const activityRouter = Router();

// GET /api/activity - List all activity logs
activityRouter.get('/', async (req: Request, res: Response) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: { intent: true },
      orderBy: { timestamp: 'desc' },
      take: 100
    });
    return res.json({ success: true, logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
