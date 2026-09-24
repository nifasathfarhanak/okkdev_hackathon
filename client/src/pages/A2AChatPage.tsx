import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Bot, 
  ArrowLeft, 
  Send, 
  FileCode2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Code2
} from 'lucide-react';
import { api } from '../api/client';
import { Agent } from '../types';

interface ChatMessage {
  id: string;
  sender: 'BUYER_AGENT' | 'SUPPLIER_AGENT';
  messageType: string;
  round: number;
  summary: string;
  payload: any;
  timestamp: string;
}

export const A2AChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTechnicalJson, setShowTechnicalJson] = useState(true);
  const [customCounterPrice, setCustomCounterPrice] = useState('10000');
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial simulated protocol message sequence
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'BUYER_AGENT',
      messageType: 'REQUEST_QUOTE',
      round: 1,
      summary: 'RFQ for 100 units of Laboratory Glass Reactor',
      payload: {
        protocol: 'OKX-A2A/1.0',
        action: 'REQUEST_QUOTE',
        product: 'Laboratory Glass Reactor',
        quantity: 100,
        budget: 10000,
        currency: 'USDC',
        delivery_days: 14,
        specs: { material: '3.3 Borosilicate', certification: 'ISO9001' }
      },
      timestamp: new Date(Date.now() - 60000).toISOString()
    },
    {
      id: 'msg-02',
      sender: 'SUPPLIER_AGENT',
      messageType: 'QUOTE',
      round: 1,
      summary: 'Initial Quote: $10,500 USDC with 8-day expedited delivery',
      payload: {
        protocol: 'OKX-A2A/1.0',
        action: 'QUOTE',
        price: 10500,
        unit_price: 105,
        currency: 'USDC',
        delivery_days: 8,
        quality_grade: 'Grade A+ Certified',
        terms: 'OKX_ESCROW_DELIVERY_RELEASE'
      },
      timestamp: new Date(Date.now() - 45000).toISOString()
    },
    {
      id: 'msg-03',
      sender: 'BUYER_AGENT',
      messageType: 'NEGOTIATE',
      round: 1,
      summary: 'Buyer Agent Counter-Offers: $9,800 USDC target',
      payload: {
        protocol: 'OKX-A2A/1.0',
        action: 'NEGOTIATE',
        round: 1,
        target_price: 9800,
        currency: 'USDC',
        strategy: 'ANCHOR_BUDGET_DISCOUNT'
      },
      timestamp: new Date(Date.now() - 30000).toISOString()
    },
    {
      id: 'msg-04',
      sender: 'SUPPLIER_AGENT',
      messageType: 'COUNTER_OFFER',
      round: 2,
      summary: 'Supplier Counter-Offers: $10,000 USDC (Target Budget Accepted)',
      payload: {
        protocol: 'OKX-A2A/1.0',
        action: 'COUNTER_OFFER',
        round: 2,
        price: 10000,
        currency: 'USDC',
        delivery_days: 8,
        concessions: ['Accepted target budget at $10,000', 'Expedited air freight included']
      },
      timestamp: new Date(Date.now() - 15000).toISOString()
    },
    {
      id: 'msg-05',
      sender: 'BUYER_AGENT',
      messageType: 'ACCEPT_PENDING_HUMAN_APPROVAL',
      round: 2,
      summary: 'Buyer Agent accepts offer subject to human operator authorization',
      payload: {
        protocol: 'OKX-A2A/1.0',
        action: 'ACCEPT_PENDING_HUMAN_APPROVAL',
        final_price: 10000,
        savings: 500,
        gate: 'HUMAN_IN_THE_LOOP_MANDATORY'
      },
      timestamp: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    if (id) {
      api.getAgent(id)
        .then(setAgent)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSendCustomPrompt = (actionType: 'COUNTER' | 'SPEED' | 'ACCEPT') => {
    setIsProcessing(true);

    const price = Number(customCounterPrice) || 10000;
    const newBuyerMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'BUYER_AGENT',
      messageType: actionType === 'ACCEPT' ? 'ACCEPT_PENDING_HUMAN_APPROVAL' : 'NEGOTIATE',
      round: messages.length + 1,
      summary: actionType === 'ACCEPT'
        ? 'Accepted proposal pending operator confirmation'
        : `Autonomous Counter: $${price.toLocaleString()} USDC`,
      payload: {
        protocol: 'OKX-A2A/1.0',
        action: actionType === 'ACCEPT' ? 'ACCEPT' : 'NEGOTIATE',
        target_price: price,
        delivery_days: actionType === 'SPEED' ? 7 : 8,
        terms: 'OKX_ESCROW'
      },
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newBuyerMsg]);

    setTimeout(() => {
      const newSupplierMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'SUPPLIER_AGENT',
        messageType: actionType === 'ACCEPT' ? 'TRANSACTION_COORDINATION' : 'COUNTER_OFFER',
        round: messages.length + 2,
        summary: `${agent?.name || 'Supplier'} responded: Agreement reached at $${price.toLocaleString()} USDC`,
        payload: {
          protocol: 'OKX-A2A/1.0',
          action: 'ACCEPTED',
          price,
          delivery_days: 8,
          status: 'READY_FOR_SETTLEMENT'
        },
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, newSupplierMsg]);
      setIsProcessing(false);
    }, 1200);
  };

  if (loading || !agent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Initializing A2A Protocol Channel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/agents" className="hover:text-emerald-400 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Marketplace
            </Link>
            <span>/</span>
            <Link to={`/agents/${agent.id}`} className="text-slate-300 hover:text-emerald-400">
              {agent.name}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white">A2A Protocol Communication Inspector</h1>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-mono">
              OKX-A2A/1.0 ACTIVE
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowTechnicalJson(!showTechnicalJson)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono hover:border-emerald-500/40 transition-colors"
        >
          <Code2 className="w-4 h-4 text-emerald-400" />
          {showTechnicalJson ? 'Hide Protocol Payloads' : 'Show Full Protocol Payloads'}
        </button>
      </div>

      {/* Protocol Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900/60 to-purple-950/30 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-white">DealMesh Buyer Agent</strong>
            <span className="text-slate-400 block text-[11px]">Initiator Node</span>
          </div>
        </div>

        <span className="text-emerald-400 font-mono text-center font-bold">
          ↕ A2A ENCRYPTED CHANNEL (240ms latency) ↕
        </span>

        <div className="flex items-center gap-3 justify-end">
          <div className="text-right">
            <strong className="text-white">{agent.name}</strong>
            <span className="text-slate-400 block text-[11px]">Supplier Node ({agent.verificationStatus})</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4 max-h-[600px] overflow-y-auto">
        {messages.map((msg) => {
          const isBuyer = msg.sender === 'BUYER_AGENT';

          return (
            <div
              key={msg.id}
              className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                isBuyer
                  ? 'bg-blue-950/20 border-blue-500/30 ml-8'
                  : 'bg-purple-950/20 border-purple-500/30 mr-8'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                  isBuyer ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {isBuyer ? 'BUYER AGENT' : `SUPPLIER AGENT (${agent.name})`}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              <div className="font-semibold text-sm text-slate-100">
                <span className="text-emerald-400 font-mono mr-1.5">[{msg.messageType}]</span>
                {msg.summary}
              </div>

              {showTechnicalJson && (
                <pre className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                  {JSON.stringify(msg.payload, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Agent Direct Dispatch Console */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-400" />
            TRIGGER BUYER AGENT A2A ACTIONS:
          </span>
          <span className="text-[11px] text-slate-400">Interactive live protocol tester</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-mono">$</span>
            <input
              type="number"
              value={customCounterPrice}
              onChange={(e) => setCustomCounterPrice(e.target.value)}
              className="w-24 bg-transparent text-white font-mono outline-none"
            />
          </div>

          <button
            onClick={() => handleSendCustomPrompt('COUNTER')}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 disabled:opacity-50"
          >
            Dispatch Price Counter
          </button>

          <button
            onClick={() => handleSendCustomPrompt('SPEED')}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold disabled:opacity-50"
          >
            Request 7-Day Priority Air
          </button>

          <button
            onClick={() => handleSendCustomPrompt('ACCEPT')}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            Accept Offer (Pending Approval)
          </button>
        </div>
      </div>

    </div>
  );
};
