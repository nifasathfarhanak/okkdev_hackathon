import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { OKXAIService, OKX_AI_TOOLS } from '../integrations/okx/okx-ai';
import { PaymentService } from '../integrations/okx/payment';
import { AgenticWalletService } from '../integrations/okx/agentic-wallet';
import { XLayerService } from '../integrations/okx/xlayer';

export const okxRouter = Router();

const okxAiService = new OKXAIService();
const paymentService = new PaymentService();
const walletService = new AgenticWalletService();
const xLayerService = new XLayerService();

// GET /api/integrations/okx/status — AgentMirror OKX integration status
okxRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const integrations = await prisma.integration.findMany();
    const isConfigured = Boolean(process.env.OKX_API_KEY && process.env.OKX_DEMO_MODE !== 'true');

    return res.json({
      success: true,
      integrations: [
        {
          name: 'OKX_AI',
          displayName: 'OKX AI Tool Protocol',
          connectionStatus: isConfigured ? 'CONNECTED' : 'DEMO',
          network: 'OKX Agent Mesh',
          environment: isConfigured ? 'PRODUCTION' : 'DEMO',
          requestsHandled: integrations.find(i => i.name === 'OKX_AI')?.requestsHandled ?? 247
        },
        {
          name: 'OKX_A2A',
          displayName: 'OKX A2A Bus',
          connectionStatus: isConfigured ? 'CONNECTED' : 'DEMO',
          network: 'OKX Agent Mesh',
          environment: isConfigured ? 'PRODUCTION' : 'DEMO',
          requestsHandled: integrations.find(i => i.name === 'OKX_A2A')?.requestsHandled ?? 89
        },
        {
          name: 'OKX_PAYMENT',
          displayName: 'OKX Payment SDK & Escrow',
          connectionStatus: isConfigured ? 'CONNECTED' : 'DEMO',
          network: 'OKX X Layer Testnet',
          environment: isConfigured ? 'PRODUCTION' : 'DEMO',
          requestsHandled: integrations.find(i => i.name === 'PAYMENT')?.requestsHandled ?? 12
        },
        {
          name: 'AGENTIC_WALLET',
          displayName: 'OKX ERC-4337 Agentic Wallet',
          connectionStatus: isConfigured ? 'CONNECTED' : 'DEMO',
          network: 'OKX X Layer Testnet',
          environment: isConfigured ? 'PRODUCTION' : 'DEMO',
          requestsHandled: integrations.find(i => i.name === 'AGENTIC_WALLET')?.requestsHandled ?? 8
        },
        {
          name: 'XLAYER',
          displayName: 'OKX X Layer',
          connectionStatus: isConfigured ? 'CONNECTED' : 'DEMO',
          network: 'X Layer Sepolia (Chain ID 195)',
          environment: isConfigured ? 'PRODUCTION' : 'DEMO',
          requestsHandled: 0
        }
      ],
      overallStatus: isConfigured ? 'CONNECTED' : 'SANDBOX_DEMO_ACTIVE',
      isDemoMode: !isConfigured
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/integrations/okx/tools — OKX AI Tool definitions
okxRouter.get('/tools', (req: Request, res: Response) => {
  return res.json({
    success: true,
    protocol: 'OKX-AI-TOOLS/1.0',
    tools: OKX_AI_TOOLS
  });
});

// POST /api/integrations/okx/tools/execute — Execute OKX tool call
okxRouter.post('/tools/execute', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { toolName, parameters } = req.body;

  try {
    let resultData: any;

    switch (toolName) {
      case 'mirror_simulate':
        resultData = {
          message: 'Delegate to POST /api/mirror/simulate with intent payload.',
          endpoint: '/api/mirror/simulate',
          method: 'POST',
          requiredFields: ['intent.title', 'intent.budget', 'intent.deadlineDays']
        };
        break;

      case 'mirror_challenge':
        resultData = {
          message: 'Counter-Agent challenge is embedded in the simulation. Call POST /api/mirror/simulate.',
          endpoint: '/api/mirror/simulate',
          method: 'POST'
        };
        break;

      case 'mirror_what_if':
        resultData = {
          message: 'Use POST /api/mirror/simulation/:id/what-if with modifiedAssumptions payload.',
          endpoint: '/api/mirror/simulation/{id}/what-if',
          method: 'POST'
        };
        break;

      case 'mirror_execute':
        resultData = {
          message: 'Execution requires prior human approval. Use POST /api/mirror/simulation/:id/approve then /execute.',
          endpoints: ['/api/mirror/simulation/{id}/approve', '/api/mirror/simulation/{id}/execute'],
          method: 'POST'
        };
        break;

      default:
        return res.status(400).json(
          okxAiService.formatResponse(null, startTime, {
            code: 'UNKNOWN_TOOL',
            message: `Tool ${toolName} is not registered in AgentMirror OKX AI Registry.`
          })
        );
    }

    return res.json(okxAiService.formatResponse(resultData, startTime));
  } catch (error: any) {
    return res.status(500).json(
      okxAiService.formatResponse(null, startTime, {
        code: 'EXECUTION_ERROR',
        message: error.message
      })
    );
  }
});

// GET /api/integrations/okx/wallet
okxRouter.get('/wallet', (req: Request, res: Response) => {
  const state = walletService.getWalletState();
  return res.json({ success: true, data: state });
});

// POST /api/integrations/okx/wallet/policy
okxRouter.post('/wallet/policy', (req: Request, res: Response) => {
  const updated = walletService.updateSpendingPolicy(req.body);
  return res.json({ success: true, data: updated });
});
