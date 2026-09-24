"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
exports.activityRouter = (0, express_1.Router)();
// GET /api/activity - List all activity logs
exports.activityRouter.get('/', async (req, res) => {
    try {
        const logs = await prisma_1.prisma.activityLog.findMany({
            include: { intent: true },
            orderBy: { timestamp: 'desc' },
            take: 100
        });
        return res.json({ success: true, logs });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});
