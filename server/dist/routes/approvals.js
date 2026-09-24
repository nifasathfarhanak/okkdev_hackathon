"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
exports.approvalsRouter = (0, express_1.Router)();
// GET /api/approvals - List all approvals
exports.approvalsRouter.get('/', async (req, res) => {
    try {
        const approvals = await prisma_1.prisma.approval.findMany({
            include: { intent: { include: { simulations: true } } },
            orderBy: { requestedAt: 'desc' }
        });
        return res.json({ success: true, approvals });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});
