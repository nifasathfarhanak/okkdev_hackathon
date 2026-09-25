import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mirrorApi } from '../api/client';

const DEMO_INTENT = {
  title: 'Purchase 100 Laboratory Glass Reactors',
  description: 'Procurement of 100 units of double-jacketed borosilicate laboratory glass reactors with PTFE drain valves. Temperature range -80°C to 200°C.',
  productCategory: 'Laboratory Equipment & Glassware',
  budget: 10000,
  deadlineDays: 14,
  quantity: 100
};

export const SimulatePage: React.FC = () => {
  const navigate = useNavigate();
  const [intent, setIntent] = useState(DEMO_INTENT);
  const [assumptions, setAssumptions] = useState({
    supplierDelayProb: 15,
    priceVolatility: 8,
    logisticsReliability: 92,
    negotiationSuccessRate: 75
  });
  const [iterations, setIterations] = useState(4000);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [useDemo, setUseDemo] = useState(false);

  const runDemoSim = () => {
    // Navigate to the pre-seeded demo simulation
    navigate('/simulation/sim-demo-00182');
  };

  const runSimulation = async () => {
    if (!intent.title.trim()) {
      setError('Intent title is required.');
      return;
    }
    setError('');
    setLoading(true);
    setProgress('Creating intent & generating competing plans...');

    try {
      const events = [
        'Generating Plan A: Direct Sourcing via Supplier A...',
        'Generating Plan B: Priority Expedited via Supplier B...',
        'Generating Plan C: A2A Negotiated via Supplier C...',
        'Generating Plan D: Dual-Supplier Split Sourcing...',
        `Running ${iterations.toLocaleString()} Monte Carlo scenario iterations...`,
        'Executing Baseline scenario (50% weight)...',
        'Executing Logistics Delay scenario (20% weight)...',
        'Executing Price Spike scenario (15% weight)...',
        'Executing Capacity Shortage scenario (10% weight)...',
        'Executing Combined Stress Test scenario (5% weight)...',
        'Deploying Counter-Agent for adversarial review...',
        'Stress testing identified assumptions...',
        'Generating Decision Brief...'
      ];

      for (const ev of events) {
        setProgress(ev);
        await new Promise(r => setTimeout(r, 300));
      }

      const res: any = await mirrorApi.simulate({
        intent: { ...intent, currency: 'USDC' },
        iterations,
        seed: 4289,
        assumptions
      });

      const targetId = res.simulationId || res.simulationCode || 'sim-demo-00182';
      navigate(`/simulation/${targetId}`);
    } catch (e: any) {
      setError(e.message || 'Simulation failed. Please try again.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">New Simulation</h1>
        <p className="text-sm text-slate-500 mt-1">
          Define an intent. AgentMirror generates 4 competing plans, runs Monte Carlo simulations, and deploys an adversarial Counter-Agent.
        </p>
      </div>

      {/* Demo shortcut */}
      <div className="am-card p-4 mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-900">Quick Demo (AM-00182)</div>
          <div className="text-xs text-slate-500 mt-0.5">Pre-seeded simulation with 4,000 runs, 3 Counter-Agent challenges, and calibration data</div>
        </div>
        <button
          onClick={runDemoSim}
          className="text-xs font-medium px-4 py-2 rounded-md border border-slate-200 text-slate-700 hover:border-slate-400 transition-colors flex-shrink-0"
        >
          View Demo →
        </button>
      </div>

      {/* Intent Form */}
      <div className="am-card p-6 mb-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Intent</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
            <input
              type="text"
              value={intent.title}
              onChange={e => setIntent(p => ({ ...p, title: e.target.value }))}
              className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder="e.g. Purchase 100 laboratory glass reactors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <textarea
              rows={3}
              value={intent.description}
              onChange={e => setIntent(p => ({ ...p, description: e.target.value }))}
              className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Budget (USDC)</label>
              <input
                type="number"
                value={intent.budget}
                onChange={e => setIntent(p => ({ ...p, budget: Number(e.target.value) }))}
                className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Deadline (days)</label>
              <input
                type="number"
                value={intent.deadlineDays}
                onChange={e => setIntent(p => ({ ...p, deadlineDays: Number(e.target.value) }))}
                className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Quantity</label>
              <input
                type="number"
                value={intent.quantity}
                onChange={e => setIntent(p => ({ ...p, quantity: Number(e.target.value) }))}
                className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="am-card p-6 mb-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-1">Simulation Assumptions</h2>
        <p className="text-xs text-slate-400 mb-4">These model parameters drive the Monte Carlo scenario engine. Change them to explore different environments.</p>
        <div className="space-y-4">
          {[
            { key: 'supplierDelayProb', label: 'Supplier Delay Probability', unit: '%', min: 0, max: 50 },
            { key: 'priceVolatility', label: 'Price Volatility Band', unit: '%', min: 0, max: 30 },
            { key: 'logisticsReliability', label: 'Logistics Reliability', unit: '%', min: 50, max: 100 },
            { key: 'negotiationSuccessRate', label: 'Negotiation Acceptance Rate', unit: '%', min: 10, max: 100 }
          ].map(f => (
            <div key={f.key}>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>{f.label}</span>
                <span className="font-medium text-slate-900">{(assumptions as any)[f.key]}{f.unit}</span>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.max}
                value={(assumptions as any)[f.key]}
                onChange={e => setAssumptions(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{f.min}{f.unit}</span><span>{f.max}{f.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Iterations */}
      <div className="am-card p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900">Scenario Iterations</div>
            <div className="text-xs text-slate-400">More iterations = more stable distributions. Uses seeded PRNG (deterministic).</div>
          </div>
          <select
            value={iterations}
            onChange={e => setIterations(Number(e.target.value))}
            className="text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-400"
          >
            <option value={1000}>1,000</option>
            <option value={4000}>4,000</option>
            <option value={10000}>10,000</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
      )}

      {/* Progress */}
      {loading && (
        <div className="mb-4 px-4 py-3 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            {progress}
          </div>
        </div>
      )}

      {/* Run Button */}
      <button
        onClick={runSimulation}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Running Simulation...' : `Run Simulation (${iterations.toLocaleString()} Scenarios)`}
      </button>

      <p className="text-center text-[10px] text-slate-400 mt-3">All results are model-generated simulations, not real-world predictions.</p>
    </div>
  );
};
