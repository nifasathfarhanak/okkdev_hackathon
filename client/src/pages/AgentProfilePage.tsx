import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  ShieldCheck, 
  Star, 
  Zap, 
  MessageSquare, 
  Layers, 
  ArrowLeft, 
  ExternalLink,
  Code2,
  Clock,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { api } from '../api/client';
import { Agent } from '../types';
import { Badge } from '../components/common/Badge';

export const AgentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getAgent(id)
        .then(setAgent)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !agent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Loading Agent Profile...</span>
        </div>
      </div>
    );
  }

  const rep = agent.reputation;
  const breakdown = agent.reputationBreakdown;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/agents" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </Link>
        <span>/</span>
        <span className="text-slate-200">{agent.name}</span>
      </div>

      {/* Header Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Bot className="w-8 h-8 text-slate-950 font-bold" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-white">{agent.name}</h1>
                <Badge variant="emerald">{agent.type}</Badge>
                <span className="text-xs bg-slate-900 border border-slate-800 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  ★ {rep?.overallScore ?? 90}/100
                </span>
              </div>
              <p className="text-xs text-slate-400">{agent.industry} • Protocol: <code className="text-emerald-400 font-mono">{agent.protocol}</code></p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/agents/${agent.id}/chat`}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              Start A2A Chat
            </Link>
            <Link
              to="/deals/new"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
            >
              Request Direct Quote
            </Link>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
          {agent.description}
        </p>

        {/* Technical A2A Endpoint */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">A2A_ENDPOINT:</span>
            <span className="text-emerald-400">{agent.endpoint}</span>
          </div>
          <span className="text-slate-500 text-[10px] hidden sm:inline">Method: JSON-RPC / POST</span>
        </div>
      </div>

      {/* 2-Column Grid: Left Capabilities & Specs, Right Reputation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Capabilities */}
        <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Exposed A2A Capabilities ({agent.capabilities.length})
            </h3>
          </div>

          <div className="space-y-3">
            {agent.capabilities.map((cap) => (
              <div key={cap.id} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">{cap.name}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">{cap.category}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reputation Analytics */}
        <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Reputation & Reliability Model
            </h3>
            <Link to="/reputation" className="text-xs text-emerald-400 hover:underline">
              Formula Specs →
            </Link>
          </div>

          {rep && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Fulfillment Rate</span>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono">{rep.fulfillmentRate}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Average Latency</span>
                  <div className="text-xl font-extrabold text-blue-400 font-mono">{rep.avgResponseMs} ms</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Total Completed Deals</span>
                  <div className="text-xl font-extrabold text-white font-mono">{rep.totalCompletedDeals}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Dispute Rate</span>
                  <div className="text-xl font-extrabold text-teal-400 font-mono">{rep.disputeRate}%</div>
                </div>
              </div>

              {breakdown && breakdown.components && (
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-1 font-semibold">Component Score Breakdown:</span>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Fulfillment (40 pts max):</span>
                    <span className="font-mono text-emerald-400 font-bold">{breakdown.components.fulfillmentScore} pts</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Response Reliability (25 pts max):</span>
                    <span className="font-mono text-blue-400 font-bold">{breakdown.components.reliabilityScore} pts</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">History & Volume (25 pts max):</span>
                    <span className="font-mono text-purple-400 font-bold">{breakdown.components.historyScore} pts</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Dispute Penalty:</span>
                    <span className="font-mono text-rose-400 font-bold">-{breakdown.components.disputePenalty} pts</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
