import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Search, 
  Filter, 
  Bot, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText,
  Radio
} from 'lucide-react';
import { api } from '../api/client';
import { ActivityLog } from '../types';

export const ActivityLogPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actorFilter, setActorFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getActivityLogs({
        actorType: actorFilter,
        action: actionFilter,
        limit: 100
      });
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [actorFilter, actionFilter]);

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Immutable System Activity & Audit Trail</h1>
        </div>
        <p className="text-xs text-slate-400">
          Cryptographically stamped, chronological log of all autonomous agent discoveries, RFQs, negotiations, human approvals, and OKX escrow settlements.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Actor Type:</span>
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white outline-none"
            >
              <option value="ALL">All Actors</option>
              <option value="BUYER_AGENT">Buyer Agent</option>
              <option value="SUPPLIER_AGENT">Supplier Agent</option>
              <option value="USER">Human Operator (User)</option>
              <option value="OKX_SERVICE">OKX Service / Escrow</option>
              <option value="SYSTEM">System Gate</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white outline-none font-mono"
            >
              <option value="ALL">All Actions</option>
              <option value="DISCOVER">DISCOVER</option>
              <option value="QUALIFY">QUALIFY</option>
              <option value="QUOTE">QUOTE</option>
              <option value="NEGOTIATE">NEGOTIATE</option>
              <option value="COUNTER">COUNTER</option>
              <option value="APPROVE">APPROVE</option>
              <option value="TRANSACTION">TRANSACTION</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Real-time SSE Stream Enabled</span>
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Audit Ledger ({logs.length} Entries)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Append-Only Immutability</span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {logs.map((log) => {
            const isBuyer = log.actorType === 'BUYER_AGENT';
            const isSupplier = log.actorType === 'SUPPLIER_AGENT';
            const isUser = log.actorType === 'USER';
            const isOkx = log.actorType === 'OKX_SERVICE';

            return (
              <div
                key={log.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      isBuyer ? 'bg-blue-500/20 text-blue-300' :
                      isSupplier ? 'bg-purple-500/20 text-purple-300' :
                      isUser ? 'bg-amber-500/20 text-amber-300' :
                      isOkx ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {log.actorName}
                    </span>

                    <span className="text-emerald-400 font-mono font-bold">
                      [{log.action}]
                    </span>

                    <span className="text-slate-400 font-mono text-[11px]">
                      {log.requestId}
                    </span>
                  </div>

                  <p className="text-slate-200 text-xs font-medium leading-relaxed">
                    {log.result}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div className="font-mono text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>

                  {log.dealId && (
                    <Link
                      to={`/deals/${log.dealId}`}
                      className="text-xs text-blue-400 hover:underline font-medium"
                    >
                      Deal Workspace →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {logs.length === 0 && !loading && (
            <div className="p-8 text-center text-slate-400">No activity logs found for selected filters.</div>
          )}
        </div>
      </div>

    </div>
  );
};
