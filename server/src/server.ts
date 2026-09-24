import { app } from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`
============================================================
  AGENTMIRROR — The Counterfactual Decision Engine for AI Agents
  OKX Dev Day 2026 - Build a Company Track
============================================================
  🚀 Server running on: http://localhost:${PORT}
  📡 SSE Events stream: http://localhost:${PORT}/api/events
  🤖 Mirror Simulate API: http://localhost:${PORT}/api/mirror/simulate
  🌐 A2A Protocol Bus:   http://localhost:${PORT}/api/a2a/agents
  ❤️  Health check:      http://localhost:${PORT}/health
============================================================
  `);
});
