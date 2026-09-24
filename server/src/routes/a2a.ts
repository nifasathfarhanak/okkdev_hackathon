import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const a2aRouter = Router();

// GET /api/a2a/agents - A2A-discoverable agent roster
a2aRouter.get('/agents', async (req: Request, res: Response) => {
  try {
    const agents = await (prisma.agent.findMany as any)({
      where: { status: 'ACTIVE' },
      include: { capabilities: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({
      success: true,
      protocol: 'A2A_AGENTMIRROR_V1',
      agents: (agents || []).map((a: any) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        industry: a.industry,
        endpoint: a.endpoint,
        protocol: a.protocol,
        capabilities: (a.capabilities || []).map((c: any) => c.name),
        status: a.status
      }))
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/a2a/message/:agentId - Send message to agent
a2aRouter.post('/message/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { type, intentDescription, budget, currency, deadlineDays, candidateAgents } = req.body;

    const agent = await (prisma.agent.findUnique as any)({ where: { id: agentId } });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    // For SIMULATE_INTENT type, forward to AgentMirror simulation
    if (type === 'SIMULATE_INTENT') {
      return res.json({
        success: true,
        agentId,
        agentName: agent.name,
        messageType: type,
        response: {
          accepted: true,
          message: 'Intent received by AgentMirror. Use POST /api/mirror/simulate to run full counterfactual simulation.',
          nextAction: 'POST /api/mirror/simulate',
          intentEcho: { intentDescription, budget, currency, deadlineDays, candidateAgents }
        },
        a2aProtocol: 'A2A_AGENTMIRROR_V1',
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      agentId,
      agentName: agent.name,
      messageType: type || 'GENERIC',
      response: { accepted: true, message: `Message received by ${agent.name}. Processing in AgentMirror context.` },
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
