import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  sseConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ sseConnected }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="3" fill="#60a5fa"/>
                <circle cx="7" cy="7" r="6" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeDasharray="2 2"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-900 tracking-tight">AgentMirror</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Dashboard</Link>
            <Link to="/simulate" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Simulate</Link>
            <Link to="/history" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">History</Link>
            <Link to="/agents" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Agents</Link>
            <Link to="/integrations" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Integrations</Link>
            <Link to="/developer" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Developer</Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${sseConnected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span className="text-xs text-slate-500 hidden sm:inline">{sseConnected ? 'Live' : 'Offline'}</span>
            </div>
            <Link
              to="/simulate"
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-700 transition-colors"
            >
              Run Simulation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
