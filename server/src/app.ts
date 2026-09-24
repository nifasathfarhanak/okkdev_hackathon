import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { mirrorRouter } from './routes/mirror';
import { agentsRouter } from './routes/agents';
import { a2aRouter } from './routes/a2a';
import { okxRouter } from './routes/okx';
import { approvalsRouter } from './routes/approvals';
import { transactionsRouter } from './routes/transactions';
import { activityRouter } from './routes/activity';
import { statsRouter } from './routes/stats';
import { sseService } from './services/sseService';

export const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logging & headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Powered-By', 'AgentMirror-OKX-DevDay-2026');
  next();
});

// SSE Live Events endpoint
app.get('/api/events', (req: Request, res: Response) => {
  const clientId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  sseService.addClient(clientId, res);
});

// AgentMirror Core API Routes
app.use('/api/mirror', mirrorRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/a2a', a2aRouter);
app.use('/api/integrations/okx', okxRouter);
app.use('/api/approvals', approvalsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/activity', activityRouter);
app.use('/api/stats', statsRouter);

// Health & Readiness Endpoints
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'AgentMirror - The Counterfactual Decision Engine for AI Agents',
    version: '1.0.0',
    hackathon: 'OKX Dev Day 2026',
    track: 'Build a Company',
    timestamp: new Date().toISOString()
  });
});

app.get('/ready', (req: Request, res: Response) => {
  res.json({
    status: 'READY',
    database: 'CONNECTED',
    simulationEngine: 'READY',
    counterAgentService: 'ONLINE',
    okxIntegrationStatus: 'SANDBOX_READY'
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'AgentMirror - The Counterfactual Decision Engine for AI Agents',
    version: '1.0.0',
    hackathon: 'OKX Dev Day 2026',
    track: 'Build a Company',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    notice: 'AgentMirror counterfactual simulation engine handled error safely.'
  });
});
