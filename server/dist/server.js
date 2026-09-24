"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
app_1.app.listen(PORT, () => {
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
