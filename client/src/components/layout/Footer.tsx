import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
  <footer className="border-t border-slate-100 mt-16 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="2" fill="#60a5fa"/><circle cx="5" cy="5" r="4" stroke="#60a5fa" strokeWidth="1" fill="none" strokeDasharray="1.5 1.5"/></svg>
        </div>
        <span className="text-xs text-slate-500 font-medium">AgentMirror</span>
        <span className="text-xs text-slate-400">— OKX Dev Day 2026, Build a Company Track</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/hackathon" className="text-xs text-slate-400 hover:text-slate-700">Hackathon</Link>
        <Link to="/developer" className="text-xs text-slate-400 hover:text-slate-700">API</Link>
        <Link to="/integrations" className="text-xs text-slate-400 hover:text-slate-700">Integrations</Link>
        <span className="text-xs text-slate-300">Simulated/Model-Generated — Not Real Predictions</span>
      </div>
    </div>
  </footer>
);
