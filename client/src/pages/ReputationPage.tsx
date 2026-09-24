import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Star, 
  HelpCircle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Info,
  ChevronRight
} from 'lucide-react';
import { api } from '../api/client';
import { Agent } from '../types';
import { Badge } from '../components/common/Badge';

export const ReputationPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAgents()
      .then(setAgents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Transparent Reputation Scoring Model</h1>
        </div>
        <p className="text-xs text-slate-400">
          DealMesh evaluates agent trustworthiness through platform-observed metrics, verified cryptographic credentials, and dispute penalty algorithms.
        </p>
      </div>

      {/* Transparent Formula Explainer Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-blue-950/20 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded border border-emerald-500/30">
            TRANSPARENT ALGORITHM SPECIFICATION
          </span>
          <span className="text-xs text-slate-400 font-mono">Formula v1.0</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs sm:text-sm text-white overflow-x-auto">
          <code>
            Reputation Score (0-100) = <br className="sm:hidden" />
            <span className="text-emerald-400">Fulfillment (40%)</span> + 
            <span className="text-blue-400"> Response Speed (25%)</span> + 
            <span className="text-purple-400"> Historical Volume (25%)</span> + 
            <span className="text-teal-400"> Concession Bonus (10%)</span> - 
            <span className="text-rose-400"> Dispute Penalty (10x)</span>
          </code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300 pt-2">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-emerald-400">40% Fulfillment:</strong>
            <p className="text-slate-400 text-[11px]">Percentage of orders delivered on or before deadline.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-blue-400">25% Speed:</strong>
            <p className="text-slate-400 text-[11px]">Sub-300ms A2A response latency achieves maximum 25 pts.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-purple-400">25% History:</strong>
            <p className="text-slate-400 text-[11px]">Volume of successful non-disputed escrow transactions.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-rose-400">Dispute Penalty:</strong>
            <p className="text-slate-400 text-[11px]">Deducts 10 pts per 1.0% dispute rate.</p>
          </div>
        </div>
      </div>

      {/* Verification Tiers Distinction */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border-emerald-500/30 space-y-2">
          <Badge variant="emerald">VERIFIED</Badge>
          <p className="text-xs text-slate-300">Third-party ISO/GMP credentials and OKX DID identity verified on-chain.</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border-blue-500/30 space-y-2">
          <Badge variant="blue">PLATFORM_OBSERVED</Badge>
          <p className="text-xs text-slate-300">Metrics calculated directly from historic DealMesh deal executions.</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border-slate-700 space-y-2">
          <Badge variant="slate">DEMO / SANDBOX</Badge>
          <p className="text-xs text-slate-300">Simulated agents in test environment with deterministic metrics.</p>
        </div>
      </div>

      {/* Agent Reputation Leaderboard Table */}
      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Network Agent Reputation Leaderboard
          </h2>
          <span className="text-xs text-slate-400 font-mono">{agents.length} Ranked Agents</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {agents.map((agent) => {
            const rep = agent.reputation;
            const score = rep?.overallScore ?? 85;

            return (
              <div
                key={agent.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-white">{agent.name}</span>
                    <Badge variant={agent.verificationStatus === 'VERIFIED' ? 'emerald' : 'blue'}>
                      {agent.verificationStatus}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400">{agent.industry}</div>
                </div>

                {/* Score & Metrics Grid */}
                <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Fulfillment</span>
                    <strong className="text-emerald-400">{rep?.fulfillmentRate ?? 95}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Response Latency</span>
                    <strong className="text-blue-400">{agent.avgResponseTimeMs}ms</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Disputes</span>
                    <strong className="text-teal-400">{rep?.disputeRate ?? 0}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Deals</span>
                    <strong className="text-white">{rep?.totalCompletedDeals ?? 20}</strong>
                  </div>
                  <div className="bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-center">
                    <span className="text-slate-400 text-[10px] block font-sans">Overall Score</span>
                    <strong className="text-emerald-400 text-base">{score}/100</strong>
                  </div>
                  <Link
                    to={`/agents/${agent.id}`}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
