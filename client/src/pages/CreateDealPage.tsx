import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  Info,
  Clock,
  DollarSign
} from 'lucide-react';
import { api } from '../api/client';

export const CreateDealPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('Laboratory Glass Reactor');
  const [productCategory, setProductCategory] = useState('Laboratory Equipment & Glassware');
  const [description, setDescription] = useState(
    'Double-jacketed 50L borosilicate chemical reactors with PTFE bottom drain valve, mechanical stirrer, and ISO-9001 quality certificates.'
  );
  const [quantity, setQuantity] = useState(100);
  const [budget, setBudget] = useState(10000);
  const [currency, setCurrency] = useState('USDC');
  const [deadlineDays, setDeadlineDays] = useState(14);
  const [preferredLocation, setPreferredLocation] = useState('Global / North America & Europe');
  const [qualitySpecs, setQualitySpecs] = useState('ISO-9001 Certified, GMP Standard, 3.3 Borosilicate');
  const [paymentTerms, setPaymentTerms] = useState('ESCROW_RELEASE_ON_VERIFICATION');

  // Quick Presets
  const applyPreset = (preset: 'REACTOR' | 'SOLVENT' | 'CHILLER') => {
    if (preset === 'REACTOR') {
      setTitle('Laboratory Glass Reactor');
      setProductCategory('Laboratory Equipment & Glassware');
      setDescription('100 units of double-jacketed 50L borosilicate chemical reactors with PTFE bottom drain valve and ISO-9001 certs.');
      setQuantity(100);
      setBudget(10000);
      setDeadlineDays(14);
    } else if (preset === 'SOLVENT') {
      setTitle('HPLC Grade Acetonitrile (50 Drums)');
      setProductCategory('Chemical Reagents');
      setDescription('High-purity spectrometry grade chromatography solvents in 200L stainless steel sealed drums.');
      setQuantity(50);
      setBudget(8500);
      setDeadlineDays(10);
    } else if (preset === 'CHILLER') {
      setTitle('Explosion-Proof Chiller Recirculator');
      setProductCategory('Thermal Processing');
      setDescription('Cryogenic circulating cooling chillers (-40C to +200C) with digital PID touch controller.');
      setQuantity(2);
      setBudget(26000);
      setDeadlineDays(21);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || quantity <= 0 || budget <= 0) {
      setError('Please provide a valid product title, quantity, and budget.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const deal = await api.createDeal({
        title,
        description,
        productCategory,
        quantity: Number(quantity),
        budget: Number(budget),
        currency,
        deadlineDays: Number(deadlineDays),
        preferredLocation,
        qualitySpecs,
        paymentTerms
      });

      // Redirect immediately to Deal Workspace
      navigate(`/deals/${deal.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create deal requirement');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Procurement Requirement</h1>
        </div>
        <p className="text-xs text-slate-400">
          Define your purchase parameters. Your autonomous Buyer Agent will immediately query the OKX agent registry, filter qualified suppliers, and initiate multi-round negotiations.
        </p>
      </div>

      {/* Quick Demo Presets */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            POPULAR DEMO SCENARIOS:
          </span>
          <span className="text-[11px] text-slate-400">1-Click autofill for instant evaluation</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('REACTOR')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
          >
            🔬 Lab Glass Reactor (100 units · $10,000 USDC · 14d)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('SOLVENT')}
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-colors"
          >
            🧪 HPLC Acetonitrile (50 units · $8,500 USDC · 10d)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('CHILLER')}
            className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-colors"
          >
            ❄️ Recirculating Chiller (2 units · $26,000 USDC · 21d)
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        
        {/* Row 1: Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Product or Service Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Laboratory Glass Reactor"
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Product Category</label>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
            >
              <option value="Laboratory Equipment & Glassware">Laboratory Equipment & Glassware</option>
              <option value="Chemical Reagents">Chemical Reagents & Solvents</option>
              <option value="Thermal Processing">Thermal Processing & Chillers</option>
              <option value="Bioprocess Hardware">Bioprocess Hardware & Vessels</option>
              <option value="Logistics & Cold-Chain">Logistics & Cold-Chain Services</option>
              <option value="Quality Assurance & Audits">Quality Assurance & Audits</option>
            </select>
          </div>
        </div>

        {/* Row 2: Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Detailed Technical Requirements</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe technical specs, certifications required, packaging requirements..."
            className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Row 3: Quantity, Budget, Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Quantity (Units) <span className="text-emerald-400">*</span>
            </label>
            <input
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Target Budget Ceiling <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">$</span>
              <input
                type="number"
                min={100}
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Settlement Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all font-mono"
            >
              <option value="USDC">USDC (OKX X Layer)</option>
              <option value="USDT">USDT</option>
              <option value="OKB">OKB</option>
            </select>
          </div>
        </div>

        {/* Row 4: Deadline, Quality, Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Required Delivery (Days)
            </label>
            <input
              type="number"
              min={1}
              max={180}
              value={deadlineDays}
              onChange={(e) => setDeadlineDays(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Quality & Certifications</label>
            <input
              type="text"
              value={qualitySpecs}
              onChange={(e) => setQualitySpecs(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Payment Conditions</label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all text-xs"
            >
              <option value="ESCROW_RELEASE_ON_VERIFICATION">OKX Smart Escrow (Delivery Release)</option>
              <option value="NET_30_MILESTONE">Net 30 Milestone Escrow</option>
              <option value="IMMEDIATE_SETTLEMENT">Immediate Verified Release</option>
            </select>
          </div>
        </div>

        {/* Safety Note */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">Human-In-The-Loop Safety Policy:</strong> Launching this task authorizes your Buyer Agent to discover suppliers and negotiate terms. Funds will NEVER be disbursed without your explicit cryptographic approval.
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-2 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Bot className="w-4 h-4" />
            {submitting ? 'Initializing Buyer Agent...' : 'Launch Buyer Agent'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
