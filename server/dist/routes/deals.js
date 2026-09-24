"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
const dealService_1 = require("../services/dealService");
const discoveryService_1 = require("../services/discoveryService");
const negotiationService_1 = require("../services/negotiationService");
const aiProvider_1 = require("../ai/aiProvider");
exports.dealsRouter = (0, express_1.Router)();
// GET /api/deals - List all deals
exports.dealsRouter.get('/', async (req, res) => {
    try {
        const deals = await prisma_1.prisma.deal.findMany({
            include: {
                buyer: true,
                selectedAgent: true,
                quotes: true,
                approvals: true,
                transactions: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: deals });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/deals - Create new deal requirement
exports.dealsRouter.post('/', async (req, res) => {
    try {
        const { title, description, productCategory, quantity, budget, currency, deadlineDays, preferredLocation, qualitySpecs } = req.body;
        if (!title || !quantity || !budget) {
            return res.status(400).json({ success: false, error: 'Title, quantity, and budget are required.' });
        }
        const deal = await dealService_1.dealService.createDeal({
            title,
            description: description || `Procurement of ${quantity} units of ${title}`,
            productCategory: productCategory || 'Laboratory Equipment & Glassware',
            quantity: Number(quantity),
            budget: Number(budget),
            currency: currency || 'USDC',
            deadlineDays: deadlineDays ? Number(deadlineDays) : 14,
            preferredLocation: preferredLocation || 'Global',
            qualitySpecs: qualitySpecs || 'ISO-9001, GMP standard'
        });
        res.status(201).json({ success: true, data: deal });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/deals/demo - 1-Click Launch Demo Deal
exports.dealsRouter.post('/demo', async (req, res) => {
    try {
        const deal = await dealService_1.dealService.createDeal({
            title: 'Laboratory Glass Reactor',
            description: '100 units of double-jacketed 50L borosilicate chemical reactors with PTFE bottom drain valve and ISO-9001 certs.',
            productCategory: 'Laboratory Equipment & Glassware',
            quantity: 100,
            budget: 10000,
            currency: 'USDC',
            deadlineDays: 14,
            preferredLocation: 'North America / Europe / Asia',
            qualitySpecs: 'ISO-9001, GMP Certified, 3.3 Borosilicate glass, Pressure -0.1 to 0.5 MPa'
        });
        res.status(201).json({ success: true, data: deal });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/deals/:id - Get full deal workspace details
exports.dealsRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deal = await dealService_1.dealService.getDeal(id);
        if (!deal) {
            return res.status(404).json({ success: false, error: 'Deal not found' });
        }
        res.json({ success: true, data: deal });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/deals/:id/start - Run full discovery + qualification + quoting + negotiation workflow
exports.dealsRouter.post('/:id/start', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedDeal = await dealService_1.dealService.startDealWorkflow(id);
        res.json({ success: true, data: updatedDeal });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/deals/:id/discover - Run standalone discovery step
exports.dealsRouter.post('/:id/discover', async (req, res) => {
    try {
        const id = req.params.id;
        const deal = await prisma_1.prisma.deal.findUnique({ where: { id } });
        if (!deal)
            return res.status(404).json({ success: false, error: 'Deal not found' });
        const result = await discoveryService_1.discoveryService.discoverAgents({
            dealId: deal.id,
            category: deal.productCategory,
            productName: deal.title,
            quantity: deal.quantity,
            budget: deal.budget,
            currency: deal.currency,
            deadlineDays: deal.deadlineDays
        });
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/deals/:id/negotiate - Run standalone negotiation step
exports.dealsRouter.post('/:id/negotiate', async (req, res) => {
    try {
        const id = req.params.id;
        const { supplierAgentId, targetPrice, targetDeliveryDays } = req.body;
        const deal = await prisma_1.prisma.deal.findUnique({ where: { id } });
        if (!deal)
            return res.status(404).json({ success: false, error: 'Deal not found' });
        const buyerAgent = await prisma_1.prisma.agent.findFirst({ where: { type: 'BUYER' } });
        const result = await negotiationService_1.negotiationService.executeNegotiation(deal.id, buyerAgent?.id || 'agent-buyer-01', supplierAgentId || 'agent-precisionlab-02', targetPrice || deal.budget, targetDeliveryDays || deal.deadlineDays);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/deals/:id/approve - Human Operator approves proposal
exports.dealsRouter.post('/:id/approve', async (req, res) => {
    try {
        const id = req.params.id;
        const { userId, notes } = req.body;
        const updatedDeal = await dealService_1.dealService.approveDeal(id, userId || 'user-buyer-01', notes);
        res.json({ success: true, data: updatedDeal });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/deals/:id/reject - Human Operator rejects proposal
exports.dealsRouter.post('/:id/reject', async (req, res) => {
    try {
        const id = req.params.id;
        const { userId, reason } = req.body;
        const updatedDeal = await dealService_1.dealService.rejectDeal(id, userId || 'user-buyer-01', reason || 'Price or terms unacceptable');
        res.json({ success: true, data: updatedDeal });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/deals/:id/transaction - Execute settlement
exports.dealsRouter.post('/:id/transaction', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedDeal = await dealService_1.dealService.executeDealTransaction(id);
        res.json({ success: true, data: updatedDeal });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/deals/:id/ai-analysis - Get AI analysis of deal quotes
exports.dealsRouter.get('/:id/ai-analysis', async (req, res) => {
    try {
        const id = req.params.id;
        const deal = await prisma_1.prisma.deal.findUnique({
            where: { id },
            include: {
                quotes: {
                    include: { agent: { include: { reputation: true } } }
                }
            }
        });
        if (!deal)
            return res.status(404).json({ success: false, error: 'Deal not found' });
        const ai = (0, aiProvider_1.getAIProvider)();
        const quotesList = deal.quotes || [];
        const analysis = await ai.analyzeQuotes({
            dealTitle: deal.title,
            requirement: deal.description,
            quantity: deal.quantity,
            budget: deal.budget,
            currency: deal.currency,
            quotes: quotesList.map((q) => ({
                agentId: q.agentId,
                agentName: q.agent?.name || 'Supplier Agent',
                price: q.price,
                deliveryDays: q.deliveryDays,
                reputationScore: q.agent?.reputation?.overallScore ?? 90,
                fulfillmentRate: q.agent?.reputation?.fulfillmentRate ?? 95,
                terms: q.terms
            }))
        });
        res.json({ success: true, data: analysis });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
