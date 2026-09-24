import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const transactionsRouter = Router();

// GET /api/transactions - List all executions / transaction records
transactionsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const executions = await prisma.execution.findMany({
      include: { intent: true },
      orderBy: { executedAt: 'desc' }
    });
    return res.json({ success: true, transactions: executions });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
