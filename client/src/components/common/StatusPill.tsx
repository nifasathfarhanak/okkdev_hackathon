import React from 'react';
import { DealStatus } from '../../types';

interface StatusPillProps {
  status: DealStatus | string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const getStatusConfig = (s: string) => {
    switch (s) {
      case 'COMPLETED':
        return { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400' };
      case 'AWAITING_APPROVAL':
        return { label: 'Awaiting Approval', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse', dot: 'bg-amber-400' };
      case 'NEGOTIATING':
        return { label: 'A2A Negotiating', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', dot: 'bg-indigo-400' };
      case 'DISCOVERING':
      case 'QUALIFYING':
        return { label: 'Discovering Agents', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', dot: 'bg-blue-400' };
      case 'APPROVED':
        return { label: 'Approved', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', dot: 'bg-teal-400' };
      case 'TRANSACTION_PENDING':
        return { label: 'Settling Escrow', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse', dot: 'bg-purple-400' };
      case 'REJECTED':
      case 'FAILED':
        return { label: 'Rejected / Failed', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', dot: 'bg-rose-400' };
      default:
        return { label: s, color: 'bg-slate-800 text-slate-300 border-slate-700', dot: 'bg-slate-400' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
