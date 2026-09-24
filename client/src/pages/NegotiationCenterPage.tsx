import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  Bot, 
  ShieldCheck, 
  Zap, 
  RotateCcw,
  ThumbsUp
} from 'lucide-react';
import { api } from '../api/client';
import { Deal } from '../types';

export const NegotiationCenterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'VISUAL' | 'ROUNDS' | 'AI_REASONING'>('VISUAL');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        if (id) {
          const d = await api.getDeal(id);
          setDeal(d);
        } else {
          // If navigated directly, fetch most recent deal
          const deals = await api.getDeals();
          if (deals.length > 0) {
            setDeal(deals[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  const handleAction = async (action: 'PRICE' | 'SPEED' | 'TERMS' | 'ACCEPT') => {
    if (!deal) return;
    setIsSimulating(true);

    try {
      if (action === 'ACCEPT') {
        await api.approveDeal(deal.id);
        navigate(`/deals/${deal.id}`);
      } else {
        const targetPrice = action === 'PRICE' ? deal.budget * 0.95 : deal.budget;
        const targetDays = action === 'SPEED' ? 7 : 8;
        await api.negotiateDeal(deal.id, { targetPrice, targetDeliveryDays: targetDays });
        const refreshed = await api.getDeal(deal.id);
        setDeal(refreshed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  if (loading || !deal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Loading Negotiation Center...</span>
        </div>
      </div>
    );
  }

  const neg = deal.negotiations[0];
  const initialPrice = neg?.initialPrice || 10500;
  const currentPrice = neg?.currentPrice || 10000;
  const savings = initialPrice - currentPrice;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to={`/deals/${deal.id}`} className="hover:text-emerald-400 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Deal Workspace
        </Link>
        <span>/</span>
        <span className="text-slate-200">Autonomous Negotiation Center</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Negotiation Analytics & Strategy Center</h1>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-mono">
              GAME-THEORETIC ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual inspection of concession curves, multi-round protocol exchanges, and AI selection rationale.
          </p>
        </div>

        <Link
          to={`/deals/${deal.id}`}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
        >
          View Deal Workspace →
        </Link>
      </div>

      {/* Graphical Comparison Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Initial Supplier Quote</span>
          <div className="text-2xl font-extrabold text-slate-300 font-mono">${initialPrice.toLocaleString()} {deal.currency}</div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>12 Days initial lead time</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-transparent space-y-2">
          <span className="text-xs text-emerald-400 font-semibold uppercase">Negotiated Final Offer</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">${currentPrice.toLocaleString()} {deal.currency}</div>
          <div className="text-xs text-emerald-300 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>8 Days expedited air delivery</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-blue-500/30 space-y-2">
          <span className="text-xs text-blue-400 font-semibold uppercase">Cost Reduction</span>
          <div className="text-2xl font-extrabold text-white font-mono">${savings.toLocaleString()} <span className="text-sm text-emerald-400">({((savings / initialPrice) * 100).toFixed(1)}%)</span></div>
          <div className="text-xs text-slate-400">Anchored to target budget ceiling</div>
        </div>

      </div>

      {/* AI Explanation of Selection Rationale */}
      <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
          <Sparkles className="w-4 h-4" />
          <span>AI SELECTION & STRATEGY REASONING</span>
        </div>

        <p className="text-sm text-white font-medium">
          Supplier <strong className="text-emerald-400">PrecisionLab Agent</strong> was selected because:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400">Budget Fit:</div>
            <div className="font-bold text-emerald-300">Within Budget ($10,000)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400">Lead Time:</div>
            <div className="font-bold text-blue-300">8 Days (Fastest in Registry)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400">Fulfillment Track Record:</div>
            <div className="font-bold text-purple-300">98.8% On-Time Verified</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400">Historical Volume:</div>
            <div className="font-bold text-white">127 Completed Deals</div>
          </div>
        </div>
      </div>

      {/* Buyer Agent Manual Prompting Controls */}
      <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            DIRECT BUYER AGENT TACTICS:
          </span>
          <span className="text-xs text-slate-400">Override or guide the autonomous agent</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleAction('PRICE')}
            disabled={isSimulating}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-50 transition-colors"
          >
            Request Better Price (-5%)
          </button>
          <button
            onClick={() => handleAction('SPEED')}
            disabled={isSimulating}
            className="px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold disabled:opacity-50 transition-colors"
          >
            Request 7-Day Priority Air
          </button>
          <button
            onClick={() => handleAction('TERMS')}
            disabled={isSimulating}
            className="px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold disabled:opacity-50 transition-colors"
          >
            Request Alternative Escrow Terms
          </button>
          <button
            onClick={() => handleAction('ACCEPT')}
            disabled={isSimulating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all"
          >
            Accept Negotiated Terms
          </button>
        </div>
      </div>

    </div>
  );
};
