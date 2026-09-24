import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const approvalsRouter = Router();

// GET /api/approvals - List all approvals
approvalsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const approvals = await prisma.approval.findMany({
      include: { intent: { include: { simulations: true } } },
      orderBy: { requestedAt: 'desc' }
    });
    return res.json({ success: true, approvals });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
