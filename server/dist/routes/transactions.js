"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
exports.transactionsRouter = (0, express_1.Router)();
// GET /api/transactions - List all executions / transaction records
exports.transactionsRouter.get('/', async (req, res) => {
    try {
        const executions = await prisma_1.prisma.execution.findMany({
            include: { intent: true },
            orderBy: { executedAt: 'desc' }
        });
        return res.json({ success: true, transactions: executions });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});
