"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
exports.agentsRouter = (0, express_1.Router)();
// GET /api/agents - List all agents
exports.agentsRouter.get('/', async (req, res) => {
    try {
        const agents = await prisma_1.prisma.agent.findMany({
            include: { capabilities: true },
            orderBy: { createdAt: 'desc' }
        });
        return res.json({ success: true, agents: agents || [] });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});
// GET /api/agents/:id - Agent detail
exports.agentsRouter.get('/:id', async (req, res) => {
    try {
        const agent = await prisma_1.prisma.agent.findUnique({
            where: { id: req.params.id },
            include: { capabilities: true }
        });
        if (!agent)
            return res.status(404).json({ error: 'Agent not found' });
        return res.json({ success: true, agent });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});
