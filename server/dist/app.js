"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mirror_1 = require("./routes/mirror");
const agents_1 = require("./routes/agents");
const a2a_1 = require("./routes/a2a");
const okx_1 = require("./routes/okx");
const approvals_1 = require("./routes/approvals");
const transactions_1 = require("./routes/transactions");
const activity_1 = require("./routes/activity");
const stats_1 = require("./routes/stats");
const sseService_1 = require("./services/sseService");
exports.app = (0, express_1.default)();
// Middleware
exports.app.use((0, cors_1.default)({ origin: '*' }));
exports.app.use(express_1.default.json());
// Request logging & headers
exports.app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'AgentMirror-OKX-DevDay-2026');
    next();
});
// SSE Live Events endpoint
exports.app.get('/api/events', (req, res) => {
    const clientId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    sseService_1.sseService.addClient(clientId, res);
});
// AgentMirror Core API Routes
exports.app.use('/api/mirror', mirror_1.mirrorRouter);
exports.app.use('/api/agents', agents_1.agentsRouter);
exports.app.use('/api/a2a', a2a_1.a2aRouter);
exports.app.use('/api/integrations/okx', okx_1.okxRouter);
exports.app.use('/api/approvals', approvals_1.approvalsRouter);
exports.app.use('/api/transactions', transactions_1.transactionsRouter);
exports.app.use('/api/activity', activity_1.activityRouter);
exports.app.use('/api/stats', stats_1.statsRouter);
// Health & Readiness Endpoints
exports.app.get('/health', (req, res) => {
    res.json({
        status: 'HEALTHY',
        service: 'AgentMirror - The Counterfactual Decision Engine for AI Agents',
        version: '1.0.0',
        hackathon: 'OKX Dev Day 2026',
        track: 'Build a Company',
        timestamp: new Date().toISOString()
    });
});
exports.app.get('/ready', (req, res) => {
    res.json({
        status: 'READY',
        database: 'CONNECTED',
        simulationEngine: 'READY',
        counterAgentService: 'ONLINE',
        okxIntegrationStatus: 'SANDBOX_READY'
    });
});
exports.app.get('/api/health', (req, res) => {
    res.json({
        status: 'HEALTHY',
        service: 'AgentMirror - The Counterfactual Decision Engine for AI Agents',
        version: '1.0.0',
        hackathon: 'OKX Dev Day 2026',
        track: 'Build a Company',
        timestamp: new Date().toISOString()
    });
});
// Serve frontend static files if client/dist is built
const clientDistPath = path_1.default.resolve(__dirname, '../../client/dist');
const altClientDistPath = path_1.default.resolve(__dirname, '../client/dist');
const activeStaticPath = fs_1.default.existsSync(clientDistPath)
    ? clientDistPath
    : fs_1.default.existsSync(altClientDistPath)
        ? altClientDistPath
        : null;
if (activeStaticPath) {
    exports.app.use(express_1.default.static(activeStaticPath));
    exports.app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path === '/health' || req.path === '/ready') {
            return next();
        }
        res.sendFile(path_1.default.join(activeStaticPath, 'index.html'));
    });
}
else {
    exports.app.get('/', (req, res) => {
        res.json({
            name: 'AgentMirror API Engine',
            tagline: 'Before your agent acts, see what could happen.',
            status: 'ONLINE',
            hackathon: 'OKX Dev Day 2026',
            track: 'Build a Company',
            endpoints: {
                health: '/health',
                events: '/api/events',
                simulate: '/api/mirror/simulate',
                agents: '/api/agents',
                activity: '/api/activity',
                stats: '/api/stats'
            }
        });
    });
}
// Global Error Handler
exports.app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal Server Error',
        notice: 'AgentMirror counterfactual simulation engine handled error safely.'
    });
});
