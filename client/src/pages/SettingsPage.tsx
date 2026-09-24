import React from 'react';
import { Link } from 'react-router-dom';

export const SettingsPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-10">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="text-sm text-slate-500 mt-1">AgentMirror configuration and environment</p>
    </div>

    <div className="space-y-5">
      {/* Simulation Defaults */}
      <div className="am-card p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Simulation Defaults</h2>
        <div className="space-y-3">
          {[
            { label: 'Default Iterations', desc: 'Scenario runs per simulation', value: '4,000' },
            { label: 'Default Seed', desc: 'Deterministic PRNG seed for reproducibility', value: '4289' },
            { label: 'Plans Generated', desc: 'Fixed: Plan A, B, C, D', value: '4' },
            { label: 'Scenario Types', desc: 'Baseline, Delay, Price Spike, Capacity Shortage, Combined Stress', value: '5' }
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div>
                <div className="text-xs font-medium text-slate-800">{s.label}</div>
                <div className="text-[11px] text-slate-400">{s.desc}</div>
              </div>
              <div className="text-xs font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Environment */}
      <div className="am-card p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Environment Variables</h2>
        <p className="text-xs text-slate-500 mb-3">Configure in <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">.env</code> (server) and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">.env</code> (client).</p>
        <div className="space-y-2">
          {[
            { key: 'DATABASE_URL', required: true, desc: 'PostgreSQL or SQLite connection string' },
            { key: 'PORT', required: false, desc: 'Server port (default: 4000)' },
            { key: 'OKX_API_KEY', required: false, desc: 'OKX API key for live integrations' },
            { key: 'OKX_API_SECRET', required: false, desc: 'OKX API secret (never exposed to frontend)' },
            { key: 'OKX_PASSPHRASE', required: false, desc: 'OKX API passphrase' },
            { key: 'OKX_PROJECT_ID', required: false, desc: 'OKX project identifier' },
            { key: 'AI_API_KEY', required: false, desc: 'AI provider key for LLM decision generation' },
            { key: 'VITE_API_URL', required: false, desc: 'Frontend: backend API base URL' }
          ].map(v => (
            <div key={v.key} className="flex items-start gap-3 text-xs">
              <code className="font-mono bg-slate-900 text-emerald-400 px-2 py-0.5 rounded flex-shrink-0">{v.key}</code>
              {v.required && <span className="badge-red flex-shrink-0 mt-0.5">Required</span>}
              <span className="text-slate-500">{v.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="am-card p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Quick Links</h2>
        <div className="flex flex-wrap gap-2">
          <Link to="/hackathon" className="badge-blue">Hackathon Compliance</Link>
          <Link to="/developer" className="badge-indigo">API Docs</Link>
          <Link to="/integrations" className="badge-amber">Integration Status</Link>
          <Link to="/simulate" className="badge-green">New Simulation</Link>
        </div>
      </div>
    </div>
  </div>
);
