"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.okxRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
const okx_ai_1 = require("../integrations/okx/okx-ai");
const payment_1 = require("../integrations/okx/payment");
const agentic_wallet_1 = require("../integrations/okx/agentic-wallet");
const xlayer_1 = require("../integrations/okx/xlayer");
exports.okxRouter = (0, express_1.Router)();
const okxAiService = new okx_ai_1.OKXAIService();
const paymentService = new payment_1.PaymentService();
const walletService = new agentic_wallet_1.AgenticWalletService();
const xLayerService = new xlayer_1.XLayerService();
// GET /api/integrations/okx/status — AgentMirror OKX integration status
exports.okxRouter.get('/status', async (req, res) => {
    try {
        const integrations = await prisma_1.prisma.integration.findMany();
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
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/integrations/okx/tools — OKX AI Tool definitions
exports.okxRouter.get('/tools', (req, res) => {
    return res.json({
        success: true,
        protocol: 'OKX-AI-TOOLS/1.0',
        tools: okx_ai_1.OKX_AI_TOOLS
    });
});
// POST /api/integrations/okx/tools/execute — Execute OKX tool call
exports.okxRouter.post('/tools/execute', async (req, res) => {
    const startTime = Date.now();
    const { toolName, parameters } = req.body;
    try {
        let resultData;
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
                return res.status(400).json(okxAiService.formatResponse(null, startTime, {
                    code: 'UNKNOWN_TOOL',
                    message: `Tool ${toolName} is not registered in AgentMirror OKX AI Registry.`
                }));
        }
        return res.json(okxAiService.formatResponse(resultData, startTime));
    }
    catch (error) {
        return res.status(500).json(okxAiService.formatResponse(null, startTime, {
            code: 'EXECUTION_ERROR',
            message: error.message
        }));
    }
});
// GET /api/integrations/okx/wallet
exports.okxRouter.get('/wallet', (req, res) => {
    const state = walletService.getWalletState();
    return res.json({ success: true, data: state });
});
// POST /api/integrations/okx/wallet/policy
exports.okxRouter.post('/wallet/policy', (req, res) => {
    const updated = walletService.updateSpendingPolicy(req.body);
    return res.json({ success: true, data: updated });
});
