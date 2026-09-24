import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  Star, 
  Zap, 
  ChevronRight, 
  Bot, 
  ArrowUpRight,
  PlusCircle
} from 'lucide-react';
import { api } from '../api/client';
import { Agent } from '../types';
import { Badge } from '../components/common/Badge';

export const AgentMarketplacePage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [minReputation, setMinReputation] = useState(0);

  const categories = [
    'ALL',
    'SUPPLIER',
    'BUYER',
    'LOGISTICS',
    'VERIFICATION',
    'PAYMENT',
    'DATA',
    'DEVELOPER'
  ];

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await api.getAgents({
        type: selectedType,
        search,
        minReputation: minReputation > 0 ? minReputation : undefined
      });
      setAgents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, [selectedType, minReputation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAgents();
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Agent Marketplace</h1>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-mono">
              {agents.length} REGISTRY AGENTS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Discover verified autonomous supplier, logistics, QA, and settlement agents on the OKX Agent Network.
          </p>
        </div>

        <Link
          to="/developer"
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          Register New Agent
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border-slate-800 space-y-4">
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by agent name, capability, or industry (e.g. Glass, Borosilicate, ISO)..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Min Rep:</span>
            </div>
            <select
              value={minReputation}
              onChange={(e) => setMinReputation(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
            >
              <option value={0}>Any Score</option>
              <option value={80}>≥ 80 Score</option>
              <option value={90}>≥ 90 Score (High Trust)</option>
              <option value={95}>≥ 95 Score (Elite Verified)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedType(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedType === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs font-mono">Loading marketplace agents...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const rep = agent.reputation?.overallScore ?? 85;
            const fulfillment = agent.reputation?.fulfillmentRate ?? 95;
            const completed = agent.reputation?.totalCompletedDeals ?? 20;

            return (
              <div
                key={agent.id}
                className="glass-panel p-5 rounded-2xl border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <Badge variant={agent.type === 'SUPPLIER' ? 'emerald' : agent.type === 'BUYER' ? 'blue' : agent.type === 'LOGISTICS' ? 'purple' : 'slate'}>
                      {agent.type}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                      <span>{rep}/100</span>
                    </div>
                  </div>

                  {/* Name & Industry */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {agent.name}
                    </h3>
                    <span className="text-[11px] text-slate-400">{agent.industry}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Capabilities tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {agent.capabilities.slice(0, 3).map((cap) => (
                      <span key={cap.id} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {cap.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics Footer & CTA */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                      <div className="font-bold text-white font-mono">{fulfillment}%</div>
                      <div className="text-[9px] text-slate-400">Fulfillment</div>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                      <div className="font-bold text-emerald-400 font-mono">{agent.avgResponseTimeMs}ms</div>
                      <div className="text-[9px] text-slate-400">Response</div>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                      <div className="font-bold text-blue-300 font-mono">{completed}</div>
                      <div className="text-[9px] text-slate-400">Deals</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/agents/${agent.id}`}
                      className="flex-1 text-center py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/agents/${agent.id}/chat`}
                      className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      A2A Chat →
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {agents.length === 0 && !loading && (
        <div className="p-12 text-center space-y-2 glass-panel rounded-2xl border-slate-800">
          <Bot className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No agents matched filter</h3>
          <p className="text-xs text-slate-400">Try adjusting your keyword search or minimum reputation threshold.</p>
        </div>
      )}

    </div>
  );
};
