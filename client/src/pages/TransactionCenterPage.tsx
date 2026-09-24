import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Lock, 
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';
import { Transaction } from '../types';
import { Badge } from '../components/common/Badge';

export const TransactionCenterPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTransactions()
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">OKX Web3 Settlement & Transaction Ledger</h1>
        </div>
        <p className="text-xs text-slate-400">
          Verifiable audit trail of all autonomous deals settled through OKX Agentic Smart Accounts and Escrow smart contracts.
        </p>
      </div>

      {/* Escrow Mechanism Info Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-blue-950/30 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-white">OKX Escrow Smart Contract Router:</strong>
            <span className="text-slate-400 block text-[11px] font-mono">0x32A465B15278453488fD76B133A183a241981F4B (OKX X Layer Testnet)</span>
          </div>
        </div>
        <div className="text-right">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded font-mono text-[11px] font-bold">
            SMART ACCOUNT STANDARD: ERC-4337
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Settlement Ledger ({transactions.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">OKX X Layer (Chain 195)</span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-white truncate">
                    {tx.deal?.title || 'Procurement Transaction'}
                  </span>
                  <Badge variant={tx.status === 'COMPLETED' ? 'emerald' : 'purple'}>
                    {tx.status}
                  </Badge>
                  <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-800">
                    {tx.isDemo ? 'DEMO ESCROW' : 'ON-CHAIN'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
                  <span>Tx ID: <code className="text-slate-300 font-mono">{tx.id.substring(0, 16)}...</code></span>
                  <span>Recipient: <code className="text-slate-300 font-mono">{tx.recipientAddress.substring(0, 10)}...</code></span>
                  <span>Method: <strong className="text-slate-200">{tx.paymentMethod}</strong></span>
                </div>
              </div>

              {/* Amount & Explorer Link */}
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <div className="text-base font-extrabold text-emerald-400 font-mono">
                    ${tx.amount.toLocaleString()} {tx.currency}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {tx.txHash && tx.explorerUrl ? (
                  <a
                    href={tx.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-1 rounded font-mono">
                    Sandbox Tx
                  </span>
                )}
              </div>
            </div>
          ))}

          {transactions.length === 0 && !loading && (
            <div className="p-8 text-center text-slate-400">No transactions recorded yet.</div>
          )}
        </div>
      </div>

    </div>
  );
};
