import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  DollarSign
} from 'lucide-react';
import { api } from '../api/client';
import { Approval } from '../types';
import { Badge } from '../components/common/Badge';

export const ApprovalCenterPage: React.FC = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const data = await api.getApprovals();
      setApprovals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await api.approveProposal(id, 'Approved by human operator via Approval Center');
      await loadApprovals();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await api.rejectProposal(id, 'Rejected by operator');
      await loadApprovals();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingList = approvals.filter(a => a.status === 'PENDING');
  const pastList = approvals.filter(a => a.status !== 'PENDING');

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Executive Approval Center</h1>
        </div>
        <p className="text-xs text-slate-400">
          Enforcing strict human-in-the-loop governance. Autonomous buyer agents negotiate proposals, but zero funds move without operator sign-off.
        </p>
      </div>

      {/* Pending Approvals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Pending Deal Proposals ({pendingList.length})</span>
          </h2>
        </div>

        {pendingList.map((approval) => {
          const isProcessing = processingId === approval.id;
          const orig = approval.originalPrice || 10500;
          const prop = approval.proposedPrice || 10000;
          const sav = approval.savingsAmount || (orig - prop);

          return (
            <div
              key={approval.id}
              className="glass-panel p-6 rounded-3xl border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-transparent space-y-5 shadow-xl shadow-amber-950/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                      ACTION REQUIRED
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Requested {new Date(approval.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">
                    {approval.deal?.title || 'Laboratory Glass Reactor (100 units)'}
                  </h3>
                </div>

                <Link
                  to={`/deals/${approval.dealId}`}
                  className="text-xs text-emerald-400 hover:underline font-semibold"
                >
                  Inspect Deal Workspace →
                </Link>
              </div>

              {/* Proposal Metrics Card */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Original Price</span>
                  <span className="line-through text-slate-500 font-mono">${orig.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Negotiated Price</span>
                  <strong className="text-emerald-400 font-mono text-sm">${prop.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Net Savings</span>
                  <strong className="text-emerald-300 font-mono text-sm">${sav.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Delivery Lead Time</span>
                  <strong className="text-white">{approval.deliveryDays || 8} Days</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Supplier Reputation</span>
                  <strong className="text-blue-300">96.5% Verified</strong>
                </div>
              </div>

              {/* Approval Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => handleApprove(approval.id)}
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {isProcessing ? 'Authorizing Settlement...' : 'APPROVE DEAL PROPOSAL'}
                </button>
                <button
                  onClick={() => handleReject(approval.id)}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          );
        })}

        {pendingList.length === 0 && !loading && (
          <div className="p-8 text-center glass-panel rounded-2xl border-slate-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">All caught up!</h3>
            <p className="text-xs text-slate-400">No deals are currently awaiting human approval.</p>
          </div>
        )}
      </div>

      {/* Historical Approvals Section */}
      <div className="space-y-4 pt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
          Past Decisions ({pastList.length})
        </h2>

        <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden divide-y divide-slate-800/60 text-xs">
          {pastList.slice(0, 10).map((a) => (
            <div key={a.id} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="font-bold text-white">{a.deal?.title || 'Historical Procurement Deal'}</div>
                <div className="text-slate-400 text-[11px]">
                  Decided: {a.decidedAt ? new Date(a.decidedAt).toLocaleString() : 'N/A'} • Note: {a.decisionNotes || 'Approved'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-emerald-400 font-bold">${a.proposedPrice.toLocaleString()} {a.currency}</span>
                <Badge variant={a.status === 'APPROVED' ? 'emerald' : 'rose'}>
                  {a.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
