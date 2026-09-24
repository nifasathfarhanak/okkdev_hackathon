import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  Sliders, 
  Save, 
  CheckCircle2, 
  DollarSign, 
  Lock, 
  Cpu, 
  Zap,
  Info
} from 'lucide-react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';

export const MyAgentPage: React.FC = () => {
  const [agentName, setAgentName] = useState('DealMesh Autonomous Buyer Agent');
  const [industry, setIndustry] = useState('Biotechnology & Laboratory Equipment');
  const [strategy, setStrategy] = useState<'BALANCED' | 'AGGRESSIVE_PRICE' | 'SPEED_PRIORITY'>('BALANCED');
  const [maxAutoBudget, setMaxAutoBudget] = useState(0); // $0 enforces 100% human-in-the-loop
  const [dailyVolumeLimit, setDailyVolumeLimit] = useState(50000);
  const [minReputationFilter, setMinReputationFilter] = useState(80);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [walletState, setWalletState] = useState<any>(null);

  useEffect(() => {
    api.getWalletState().then(setWalletState).catch(console.error);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    api.updateWalletPolicy({
      maxTransactionWithoutApproval: maxAutoBudget,
      dailyVolumeLimit
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">My Autonomous Buyer Agent Configuration</h1>
        </div>
        <p className="text-xs text-slate-400">
          Customize your agent's negotiation aggressiveness, supplier qualification thresholds, and smart account spending limits.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Agent policies and safety thresholds updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-8">
        
        {/* Section 1: Agent Identity */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            1. Agent Identity & Domain Focus
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Agent Display Name</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Primary Domain Focus</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Negotiation Tactics */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
            2. Autonomous Negotiation Strategy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setStrategy('BALANCED')}
              className={`p-4 rounded-2xl border text-left space-y-1.5 transition-all ${
                strategy === 'BALANCED'
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="font-bold text-xs text-white">Balanced Strategy (Default)</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Optimizes price concessions while prioritizing verified ISO fulfillment track record.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStrategy('AGGRESSIVE_PRICE')}
              className={`p-4 rounded-2xl border text-left space-y-1.5 transition-all ${
                strategy === 'AGGRESSIVE_PRICE'
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="font-bold text-xs text-white">Aggressive Price Target</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Pushes multi-round counters down to bottom 5% supplier margins.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStrategy('SPEED_PRIORITY')}
              className={`p-4 rounded-2xl border text-left space-y-1.5 transition-all ${
                strategy === 'SPEED_PRIORITY'
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="font-bold text-xs text-white">Speed & Priority Freight</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Prioritizes sub-8 day delivery timelines with expedited air routing.
              </p>
            </button>
          </div>
        </div>

        {/* Section 3: Spending Limits & Governance (Human-in-the-Loop) */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Smart Account Spending Policy & Human Gate</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">ERC-4337 SESSION KEYS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-amber-950/15 border border-amber-500/30 space-y-2">
              <label className="text-xs font-bold text-amber-300 block">
                Autonomous Spending Limit Without Approval ($):
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-slate-400 font-mono text-sm">$</span>
                <input
                  type="number"
                  min={0}
                  value={maxAutoBudget}
                  onChange={(e) => setMaxAutoBudget(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2 text-sm text-white font-mono outline-none"
                />
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                <strong>Default $0:</strong> Every single transaction requires explicit human operator sign-off in the Approval Center.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Daily Smart Account Volume Ceiling ($):
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-slate-400 font-mono text-sm">$</span>
                <input
                  type="number"
                  min={1000}
                  value={dailyVolumeLimit}
                  onChange={(e) => setDailyVolumeLimit(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2 text-sm text-white font-mono outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Maximum aggregate 24-hour settlement ceiling across all active deals.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Agent Policies
          </button>
        </div>

      </form>

    </div>
  );
};
