import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Bot, 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  Zap, 
  Layers, 
  ChevronRight, 
  Sparkles,
  FileCode2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { api } from '../api/client';
import { Deal, Quote } from '../types';
import { StatusPill } from '../components/common/StatusPill';
import { Badge } from '../components/common/Badge';

export const DealWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [showTechnicalPayloads, setShowTechnicalPayloads] = useState(false);

  // Approval action states
  const [isApproving, setIsApproving] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('Approved by human operator via DealMesh Dashboard');

  const loadDeal = async () => {
    if (!id) return;
    try {
      const data = await api.getDeal(id);
      setDeal(data);
      if (data.quotes && data.quotes.length > 0) {
        api.getDealAiAnalysis(id).then(setAiAnalysis).catch(() => {});
      }
    } catch (err) {
      console.error('Error fetching deal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeal();
    const interval = setInterval(loadDeal, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const handleStartWorkflow = async () => {
    if (!id) return;
    setIsRunningWorkflow(true);
    try {
      const updated = await api.startDealWorkflow(id);
      setDeal(updated);
      await loadDeal();
    } catch (err) {
      console.error('Workflow error:', err);
    } finally {
      setIsRunningWorkflow(false);
    }
  };

  const handleApprove = async () => {
    if (!id) return;
    setIsApproving(true);
    try {
      const updated = await api.approveDeal(id, { notes: approvalNotes });
      setDeal(updated);
      await loadDeal();
    } catch (err) {
      console.error('Approval error:', err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    setIsApproving(true);
    try {
      const updated = await api.rejectDeal(id, { reason: 'Price or delivery conditions unacceptable to human operator' });
      setDeal(updated);
      await loadDeal();
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleExecuteTransaction = async () => {
    if (!id) return;
    setIsTransacting(true);
    try {
      const updated = await api.executeTransaction(id);
      setDeal(updated);
      await loadDeal();
    } catch (err) {
      console.error('Transaction error:', err);
    } finally {
      setIsTransacting(false);
    }
  };

  if (loading || !deal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Loading Deal Workspace [{id}]...</span>
        </div>
      </div>
    );
  }

  // Lifecycle Steps
  const steps = [
    { key: 'CREATED', label: '1. Requirement' },
    { key: 'DISCOVERING', label: '2. Discovery' },
    { key: 'QUOTING', label: '3. Quotes' },
    { key: 'NEGOTIATING', label: '4. A2A Negotiation' },
    { key: 'AWAITING_APPROVAL', label: '5. Human Approval' },
    { key: 'COMPLETED', label: '6. OKX Settlement' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'CREATED': return 0;
      case 'DISCOVERING':
      case 'QUALIFYING': return 1;
      case 'QUOTING': return 2;
      case 'NEGOTIATING':
      case 'OFFER_SELECTED': return 3;
      case 'AWAITING_APPROVAL': return 4;
      case 'APPROVED':
      case 'TRANSACTION_PENDING':
      case 'COMPLETED': return 5;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(deal.status);
  const pendingApproval = deal.approvals.find(a => a.status === 'PENDING');
  const completedTx = deal.transactions.find(t => t.status === 'COMPLETED');

  return (
    <div className="space-y-8 py-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
              ← Dashboard
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-emerald-400">{deal.id.substring(0, 12)}...</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-extrabold text-white">{deal.title}</h1>
            <StatusPill status={deal.status} />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {deal.status === 'CREATED' && (
            <button
              onClick={handleStartWorkflow}
              disabled={isRunningWorkflow}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              {isRunningWorkflow ? 'Running A2A Engine...' : 'Run Autonomous Negotiation'}
            </button>
          )}

          {deal.status === 'APPROVED' && (
            <button
              onClick={handleExecuteTransaction}
              disabled={isTransacting}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              {isTransacting ? 'Locking Escrow...' : 'Execute OKX Escrow Settlement'}
            </button>
          )}

          <button
            onClick={() => setShowTechnicalPayloads(!showTechnicalPayloads)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
            {showTechnicalPayloads ? 'Hide A2A Protocol JSON' : 'Inspect A2A Protocol JSON'}
          </button>
        </div>
      </div>

      {/* Real-time State Machine Progress Bar */}
      <div className="glass-panel p-4 rounded-2xl border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((step, idx) => {
            const isPassed = currentStepIdx > idx || deal.status === 'COMPLETED';
            const isCurrent = currentStepIdx === idx && deal.status !== 'COMPLETED';

            return (
              <div
                key={step.key}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  isPassed
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-300 animate-pulse'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isPassed ? 'bg-emerald-500 text-slate-950 font-bold' : isCurrent ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isPassed ? '✓' : idx + 1}
                </div>
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3-Column Layout: Left Details, Center Timeline & A2A Messages, Right Quotes & Approval */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (3 cols): Deal Parameters & Buyer Profile */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Deal Specifications
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Target Budget:</span>
                <span className="font-mono font-bold text-white">${deal.budget.toLocaleString()} {deal.currency}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Quantity:</span>
                <span className="font-bold text-white">{deal.quantity} units</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Target Lead Time:</span>
                <span className="font-bold text-white">{deal.deadlineDays} days max</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Category:</span>
                <span className="font-medium text-slate-300">{deal.productCategory}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Quality Spec:</span>
                <span className="font-medium text-emerald-400">ISO-9001, GMP</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Escrow Policy:</span>
                <span className="font-medium text-slate-300">Delivery Lock</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1">Buyer Description:</span>
              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {deal.description}
              </p>
            </div>
          </div>

          {/* Autonomous Buyer Agent Snapshot */}
          <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              <Bot className="w-4 h-4" />
              <span>Assigned Buyer Agent</span>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">DealMesh Autonomous Buyer Agent</div>
              <div className="text-xs text-slate-400">Protocol: <span className="font-mono text-emerald-300">OKX-A2A/1.0</span></div>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <span className="text-slate-400">Autonomous Limit:</span>
              <span className="text-amber-400 font-mono font-bold">$0 (100% Human Gate)</span>
            </div>
          </div>

        </div>

        {/* Center Col (5 cols): Live A2A Activity Timeline & Dialogue */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Autonomous A2A Protocol Stream
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {deal.negotiations.length > 0 ? `${deal.negotiations[0].messages.length} protocol msgs` : 'Ready to start'}
              </span>
            </div>

            {/* If Deal in CREATED state */}
            {deal.status === 'CREATED' && (
              <div className="p-8 text-center space-y-4 bg-slate-900/40 rounded-xl border border-slate-800">
                <Bot className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Buyer Agent Ready</h4>
                  <p className="text-xs text-slate-400">Click below to initiate discovery and autonomous quote negotiations.</p>
                </div>
                <button
                  onClick={handleStartWorkflow}
                  disabled={isRunningWorkflow}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  {isRunningWorkflow ? 'Negotiating with Suppliers...' : 'Start A2A Workflow'}
                </button>
              </div>
            )}

            {/* Negotiation Messages Feed */}
            {deal.negotiations.map((neg) => (
              <div key={neg.id} className="space-y-4">
                {neg.messages.map((msg) => {
                  const isBuyer = msg.senderAgentId.includes('buyer') || msg.messageType === 'NEGOTIATE';
                  const parsedPayload = (() => {
                    try { return JSON.parse(msg.payload); } catch { return null; }
                  })();

                  return (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-2 transition-all ${
                        isBuyer
                          ? 'bg-blue-950/20 border-blue-500/30 ml-4'
                          : 'bg-purple-950/20 border-purple-500/30 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                          isBuyer ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {isBuyer ? 'BUYER AGENT' : 'SUPPLIER AGENT (PrecisionLab)'}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          Round {msg.round} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>

                      <div className="font-semibold text-slate-200">
                        <span className="text-emerald-400 font-mono mr-1">[{msg.messageType}]</span>
                        {msg.summary}
                      </div>

                      {parsedPayload && !showTechnicalPayloads && (
                        <div className="text-[11px] text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 space-y-1">
                          {parsedPayload.target_price && (
                            <div>Proposed Price: <strong className="text-emerald-300 font-mono">${parsedPayload.target_price.toLocaleString()}</strong></div>
                          )}
                          {parsedPayload.price && (
                            <div>Counter Price: <strong className="text-emerald-300 font-mono">${parsedPayload.price.toLocaleString()}</strong></div>
                          )}
                          {parsedPayload.delivery_days && (
                            <div>Delivery Time: <strong className="text-slate-200">{parsedPayload.delivery_days} days</strong></div>
                          )}
                          {parsedPayload.notes && (
                            <div className="text-slate-400 italic pt-1">{parsedPayload.notes}</div>
                          )}
                        </div>
                      )}

                      {/* Expandable Technical Protocol JSON */}
                      {showTechnicalPayloads && (
                        <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-x-auto">
                          {JSON.stringify(parsedPayload || msg.payload, null, 2)}
                        </pre>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* AI Decision Reasoning Box */}
            {deal.savingsAmount > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-blue-950/30 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Negotiation Strategy Summary</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Supplier <strong className="text-white">PrecisionLab Agent</strong> accepted target budget <strong className="text-emerald-300 font-mono">${(deal.budget - deal.savingsAmount).toLocaleString()} {deal.currency}</strong> in Round 2.
                  Achieved <strong className="text-emerald-300">${deal.savingsAmount.toLocaleString()}</strong> savings ({deal.savingsPct}%) with 8-day expedited air freight.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right Col (4 cols): Quotes Comparison & Human Approval Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Human Approval Gate Card (Critical) */}
          {deal.status === 'AWAITING_APPROVAL' && (
            <div className="glass-panel p-6 rounded-3xl border-amber-500/40 bg-gradient-to-b from-amber-950/20 via-slate-900/80 to-transparent space-y-5 shadow-xl shadow-amber-950/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded border border-amber-500/30 animate-pulse">
                  HUMAN APPROVAL REQUIRED
                </span>
                <span className="text-xs text-slate-400 font-mono">Step 5 of 6</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Deal Proposal Ready</h3>
                <p className="text-xs text-slate-300">
                  Buyer Agent concluded negotiations with <strong className="text-white">PrecisionLab Agent</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Original Quote:</span>
                  <span className="line-through text-slate-500 font-mono">$10,500 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Negotiated Price:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">$10,000 USDC</span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>Net Cost Savings:</span>
                  <span className="font-mono font-bold">$500 USDC (4.8%)</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Delivery Timeline:</span>
                  <span className="font-bold text-white">8 Days (Expedited)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Supplier Reputation:</span>
                  <span className="font-bold text-emerald-400">96.5% (Verified)</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400">Operator Signature / Approval Note:</label>
                <input
                  type="text"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {isApproving ? 'Authorizing...' : 'APPROVE DEAL'}
                </button>
                <button
                  onClick={handleReject}
                  disabled={isApproving}
                  className="px-4 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* Settled Transaction Card */}
          {deal.status === 'COMPLETED' && completedTx && (
            <div className="glass-panel p-6 rounded-3xl border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-transparent space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                <CheckCircle2 className="w-5 h-5" />
                <span>SETTLEMENT COMPLETED</span>
              </div>
              <h3 className="text-base font-bold text-white">Funds Locked in OKX Escrow</h3>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Settled Amount:</span>
                  <span className="font-mono font-bold text-emerald-400">${completedTx.amount.toLocaleString()} {completedTx.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Network:</span>
                  <span className="font-mono text-white">{completedTx.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Standard:</span>
                  <span className="font-mono text-purple-300">OKX ERC-4337 Smart Account</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Escrow Contract:</span>
                  <span className="font-mono text-slate-300">0x32A4...1F4B</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Mode:</span>
                  <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono">
                    {completedTx.isDemo ? 'DEMO ESCROW VERIFIED' : 'ON-CHAIN'}
                  </span>
                </div>
              </div>

              <Link
                to="/transactions"
                className="block text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              >
                View in Transaction Center →
              </Link>
            </div>
          )}

          {/* Quotes Comparison Table */}
          <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Supplier Quotes Received ({deal.quotes.length})
            </h3>

            <div className="space-y-2.5">
              {deal.quotes.map((q) => {
                const isSelected = deal.selectedAgentId === q.agentId;

                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{q.agent.name}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                          WINNING OFFER
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span>Price: <strong className="text-emerald-400 font-mono">${q.price.toLocaleString()}</strong></span>
                      <span>Lead Time: <strong className="text-white">{q.deliveryDays}d</strong></span>
                      <span>Reputation: <strong className="text-blue-300">{q.agent.reputation?.overallScore ?? 90}%</strong></span>
                    </div>

                    {q.notes && (
                      <p className="text-[10px] text-slate-400 italic pt-0.5 truncate">{q.notes}</p>
                    )}
                  </div>
                );
              })}

              {deal.quotes.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">Quotes will populate during A2A discovery.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
