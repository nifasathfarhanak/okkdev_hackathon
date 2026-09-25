import React, { useState } from 'react';

const endpoint = (method: string, path: string, desc: string, req: any, res: any) => ({ method, path, desc, req, res });

const ENDPOINTS = [
  endpoint('POST', '/api/mirror/simulate', 'Create intent, generate 4 competing plans, run Monte Carlo simulations, deploy Counter-Agent.',
    { intent: { title: 'Buy 100 lab reactors', budget: 10000, currency: 'USDC', deadlineDays: 14, quantity: 100 }, iterations: 4000, seed: 4289, assumptions: { supplierDelayProb: 15, priceVolatility: 8, logisticsReliability: 92, negotiationSuccessRate: 75 } },
    { success: true, simulationId: 'uuid', simulationCode: 'AM-00183', plans: [], metrics: [], comparison: {}, challenges: [] }
  ),
  endpoint('POST', '/api/mirror/generate-plans', 'Generate 4 competing action paths for a given intent without running simulations.',
    { title: 'Buy 100 lab reactors', budget: 10000, deadlineDays: 14, quantity: 100 },
    { success: true, plans: [] }
  ),
  endpoint('GET', '/api/mirror/simulation/:id', 'Fetch a full simulation with all plans, metrics, counter-challenges, and decision brief.',
    null,
    { success: true, simulation: {}, plans: [], metrics: [], comparison: {}, assumptions: {} }
  ),
  endpoint('POST', '/api/mirror/simulation/:id/what-if', 'Recalculate futures under perturbed assumptions. Returns before/after delta for all plans.',
    { modifiedAssumptions: { budgetLimit: 9000, deadlineDays: 10, supplierDelayProb: 25 } },
    { success: true, deltaResult: { planDeltas: [], preferenceChanged: true, explanation: '...' } }
  ),
  endpoint('POST', '/api/mirror/simulation/:id/approve', 'Record human approval for a selected plan.',
    { selectedPlanKey: 'PLAN_B', decisionNotes: 'Approved after reviewing Decision Brief.' },
    { success: true, approval: { id: 'uuid', status: 'APPROVED', selectedPlanKey: 'PLAN_B' } }
  ),
  endpoint('POST', '/api/mirror/simulation/:id/execute', 'Execute the approved plan via OKX Agentic Wallet adapter (demo/production).',
    { planKey: 'PLAN_B' },
    { success: true, execution: { amount: 10000, currency: 'USDC', network: 'OKX X Layer Testnet', txHash: '0x...', isDemo: true } }
  ),
  endpoint('POST', '/api/mirror/simulation/:id/outcome', 'Record actual outcome and update calibration feedback loop.',
    { actualCost: 9750, actualDeliveryDays: 7, actualStatus: 'SUCCESSFUL', notes: 'Delivery completed on time.' },
    { success: true, calibrationResult: { accuracyTier: 'HIGH_ACCURACY', feedbackNote: '...' } }
  ),
  endpoint('GET', '/api/mirror/calibration', 'Get aggregate calibration statistics across all recorded simulations.',
    null,
    { success: true, calibrationStats: { totalRecords: 10, highAccuracyCount: 8, aggregateAccuracyRate: 94.5 } }
  )
];

const CopyBtn: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="text-[10px] text-slate-400 hover:text-slate-700 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export const DeveloperPage: React.FC = () => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Developer API</h1>
        <p className="text-sm text-slate-500 mt-1">AgentMirror REST API — Counterfactual simulation engine for AI agents</p>
      </div>

      {/* Base URL */}
      <div className="am-card p-4 mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 mb-0.5">Base URL</div>
          <code className="text-sm font-mono text-slate-900">{BASE_URL}</code>
        </div>
        <CopyBtn text={BASE_URL} />
      </div>

      {/* A2A Schema */}
      <div className="am-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">OKX A2A Integration</h2>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          AgentMirror exposes itself as an A2A-compatible service. An external agent can send an intent to AgentMirror via the A2A bus and receive back a structured Decision Brief and recommended plan.
        </p>
        <div className="bg-slate-50 rounded-md p-4 text-xs font-mono text-slate-700 relative">
          <CopyBtn text={JSON.stringify({ type: 'SIMULATE_INTENT', intentDescription: 'Buy 100 lab reactors', budget: 10000, currency: 'USDC', deadlineDays: 14, candidateAgents: ['agent-supplier-a', 'agent-supplier-b', 'agent-supplier-c'] }, null, 2)} />
          <pre className="mt-2 overflow-x-auto">{JSON.stringify({ type: 'SIMULATE_INTENT', intentDescription: 'Buy 100 lab reactors', budget: 10000, currency: 'USDC', deadlineDays: 14, candidateAgents: ['agent-supplier-a', 'agent-supplier-b', 'agent-supplier-c'] }, null, 2)}</pre>
        </div>
      </div>

      {/* Agent Capabilities */}
      <div className="am-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">OKX AI Tool Schema</h2>
        <p className="text-xs text-slate-500 mb-3">AgentMirror registered capabilities as OKX AI Tool definitions:</p>
        <div className="space-y-2">
          {[
            { name: 'mirror_simulate', desc: 'Run Monte Carlo simulations across competing plans for an intent' },
            { name: 'mirror_challenge', desc: 'Deploy Counter-Agent to adversarially challenge a proposed plan' },
            { name: 'mirror_what_if', desc: 'Recalculate decision futures under perturbed constraint assumptions' },
            { name: 'mirror_decision_brief', desc: 'Generate a structured Decision Brief with scoring and trade-off analysis' },
            { name: 'mirror_execute', desc: 'Execute approved plan via OKX Agentic Wallet adapter' }
          ].map(t => (
            <div key={t.name} className="flex items-center gap-3 text-xs">
              <code className="font-mono bg-slate-100 border border-slate-200 rounded px-2 py-0.5 text-slate-700 flex-shrink-0">{t.name}</code>
              <span className="text-slate-500">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Endpoints */}
      <h2 className="text-sm font-semibold text-slate-900 mb-4">REST Endpoints</h2>
      <div className="space-y-3">
        {ENDPOINTS.map((ep, i) => (
          <div key={i} className="am-card overflow-hidden">
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              className="w-full px-5 py-3.5 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
            >
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{ep.method}</span>
              <code className="text-xs font-mono text-slate-700 flex-1">{ep.path}</code>
              <span className="text-xs text-slate-500 hidden sm:block">{ep.desc}</span>
              <span className="text-slate-400 text-xs">{expandedIdx === i ? '▲' : '▼'}</span>
            </button>
            {expandedIdx === i && (
              <div className="border-t border-slate-100 px-5 py-4 space-y-4">
                <p className="text-xs text-slate-600">{ep.desc}</p>
                {ep.req && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Request Body</div>
                      <CopyBtn text={JSON.stringify(ep.req, null, 2)} />
                    </div>
                    <pre className="text-[11px] font-mono bg-slate-50 border border-slate-100 rounded p-3 overflow-x-auto text-slate-700">{JSON.stringify(ep.req, null, 2)}</pre>
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Response</div>
                    <CopyBtn text={JSON.stringify(ep.res, null, 2)} />
                  </div>
                  <pre className="text-[11px] font-mono bg-slate-50 border border-slate-100 rounded p-3 overflow-x-auto text-slate-700">{JSON.stringify(ep.res, null, 2)}</pre>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">cURL Example</div>
                  <CopyBtn text={`curl -X ${ep.method} ${BASE_URL}${ep.path.replace(':id', 'sim-demo-00182')}${ep.req ? ` \\\n  -H 'Content-Type: application/json' \\\n  -d '${JSON.stringify(ep.req)}'` : ''}`} />
                  <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto mt-1">
{`curl -X ${ep.method} ${BASE_URL}${ep.path.replace(':id', 'sim-demo-00182')}${ep.req ? ` \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(ep.req)}'` : ''}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
