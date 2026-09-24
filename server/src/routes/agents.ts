import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const agentsRouter = Router();

// GET /api/agents - List all agents
agentsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const agents = await (prisma.agent.findMany as any)({
      include: { capabilities: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, agents: agents || [] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/agents/:id - Agent detail
agentsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const agent = await (prisma.agent.findUnique as any)({
      where: { id: req.params.id },
      include: { capabilities: true }
    });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    return res.json({ success: true, agent });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
