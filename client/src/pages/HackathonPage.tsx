import React from 'react';

const items = [
  { req: 'Agent service', impl: 'AgentMirror exposes a full REST + A2A API for simulation, challenge, and decision', file: '/api/mirror/', status: 'COMPLETE' },
  { req: 'Data/API service', impl: '9 REST endpoints with JSON schemas for all simulation, calibration, and outcome data', file: '/api/mirror/calibration', status: 'COMPLETE' },
  { req: 'Agent discovery/coordination', impl: 'Agent registry with 6 typed agents; simulation coordinates candidate agents per plan', file: '/api/agents/', status: 'COMPLETE' },
  { req: 'Automated workflow', impl: 'Intent → Plan → Simulate → Counter-Agent → Decision → Approval → Execution → Calibration', file: '/api/mirror/simulate', status: 'COMPLETE' },
  { req: 'OKX AI integration', impl: 'OKX AI Tool Protocol schema with mirror_simulate, mirror_challenge, mirror_what_if, mirror_execute', file: '/api/integrations/okx/', status: 'DEMO' },
  { req: 'OKX A2A bus', impl: 'A2A message protocol for external agent ↔ AgentMirror coordination', file: '/api/a2a/', status: 'DEMO' },
  { req: 'OKX Agentic Wallet', impl: 'ERC-4337 session key execution adapter for approved plan transactions', file: '/api/mirror/simulation/:id/execute', status: 'DEMO' },
  { req: 'OKX X Layer', impl: 'X Layer Sepolia (Chain ID 195) testnet as settlement network for escrow contracts', file: 'env: XLAYER_RPC', status: 'DEMO' },
  { req: 'End-to-end workflow', impl: 'Complete lifecycle from intent through calibration in a single /simulate call', file: '/api/mirror/', status: 'COMPLETE' },
  { req: 'Counterfactual simulation', impl: 'Seeded Monte Carlo engine (Mulberry32 PRNG) with 5 scenario types and P10/P50/P90 distributions', file: 'simulationEngine.ts', status: 'COMPLETE' },
  { req: 'Counter-Agent', impl: 'Adversarial challenge generator targeting assumption fragility for each plan strategy', file: 'counterAgentService.ts', status: 'COMPLETE' },
  { req: 'What-If Explorer', impl: 'Before/after delta computation when constraints are perturbed', file: 'whatIfService.ts', status: 'COMPLETE' },
  { req: 'Decision Brief', impl: 'Multi-attribute scoring with configurable weights, trade-off analysis, and failure modes', file: 'DecisionBrief model', status: 'COMPLETE' },
  { req: 'Human Approval Gate', impl: 'POST /approve endpoint with policy checks and audit logging', file: '/api/mirror/simulation/:id/approve', status: 'COMPLETE' },
  { req: 'Prediction vs. Reality', impl: 'ActualOutcome + Calibration models with HIGH_ACCURACY / CLOSE_PREDICTION tiers', file: 'calibrationService.ts', status: 'COMPLETE' },
  { req: 'No fabricated tx hashes', impl: 'All executions are clearly labeled isDemo=true. No real blockchain state is modified.', file: 'Execution.isDemo', status: 'COMPLETE' },
  { req: 'Working demo', impl: 'Pre-seeded simulation AM-00182 with 4 plans, 3 counter challenges, 10 calibration records', file: 'seed.ts', status: 'COMPLETE' }
];

export const HackathonPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-10">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-slate-900">Hackathon Compliance</h1>
      <p className="text-sm text-slate-500 mt-1">OKX Dev Day 2026 — Build a Company Track — AgentMirror</p>
    </div>

    <div className="am-card p-5 mb-6 bg-blue-50/40 border-blue-100">
      <h2 className="text-sm font-semibold text-slate-900 mb-2">Product Summary</h2>
      <p className="text-sm text-slate-700 leading-relaxed">
        <strong>AgentMirror</strong> is a counterfactual decision engine that sits between an AI agent's intent and its action. It generates competing plans, runs 4,000 Monte Carlo scenario simulations, deploys an adversarial Counter-Agent to challenge assumptions, provides a multi-attribute Decision Brief, enforces a Human Approval Gate, executes via OKX integration adapters, and calibrates prediction vs. reality over time.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="badge-blue">Build a Company</span>
        <span className="badge-green">Remote Build</span>
        <span className="badge-indigo">OKX Dev Day 2026</span>
      </div>
    </div>

    <div className="am-card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 text-sm font-semibold text-slate-900">Compliance Matrix</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 text-left">Requirement</th>
              <th className="px-4 py-3 text-left">Implementation</th>
              <th className="px-4 py-3 text-left">Reference</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{item.req}</td>
                <td className="px-4 py-3 text-slate-600 max-w-xs">{item.impl}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{item.file}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`badge-${item.status === 'COMPLETE' ? 'green' : 'amber'}`}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="mt-8 am-card p-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-3">3-Minute Demo Script</h2>
      <div className="space-y-3 text-xs text-slate-600">
        {[
          ['0:00', '"AI agents can act quickly. The problem is they normally act on a single plan."'],
          ['0:15', 'Enter: "Buy 100 laboratory reactors, 10,000 USDC, 14 days."'],
          ['0:30', 'Primary Agent generates Plan A, B, C, D with strategy and assumptions.'],
          ['0:50', 'Run 4,000 Monte Carlo simulation iterations — watch the P10/P50/P90 distributions populate.'],
          ['1:10', 'Show Future Map: each plan\'s simulated success rate, delay %, and failure %.'],
          ['1:25', 'Counter-Agent activates: challenges Plan C\'s single-corridor assumption. Severity: HIGH.'],
          ['1:40', 'Stress test: reduce supplier capacity by 20% → Plan C success drops from 87% to 63%.'],
          ['1:55', 'Open What-If Explorer. Reduce budget to $9,000 USDC.'],
          ['2:10', 'Recalculate: Plan B now violates budget constraint. Plan C becomes preferred.'],
          ['2:25', 'Generate Decision Brief. Score: Plan B 91.6/100 under original constraints.'],
          ['2:40', 'Human approves. Execute via OKX Agentic Wallet (Demo adapter labeled clearly).'],
          ['3:05', 'Record actual outcome: $9,750 / 7 days. Calibration: HIGH_ACCURACY.'],
          ['3:20', 'Show AgentMirror REST API → A2A integration schema.'],
          ['3:40', '"AgentMirror is the simulation layer between an agent\'s intention and its action."']
        ].map(([time, action]) => (
          <div key={time} className="flex gap-3">
            <span className="font-mono text-slate-400 w-10 flex-shrink-0">{time}</span>
            <span>{action}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
