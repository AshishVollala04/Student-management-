import React from 'react';
import { WorkflowStatus } from '../../types/roles';

interface StatusBadgeProps {
  status: WorkflowStatus | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'sm' }) => {
  const norm = (status || '').toUpperCase();

  const getStyle = (s: string) => {
    switch (s) {
      case 'APPROVED':
      case 'COMPLETED':
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'PENDING':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'REJECTED':
      case 'OVERDUE':
      case 'BLOCKED':
        return 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'RETURNED':
        return 'bg-orange-50 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'DRAFT':
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border ${sizeClasses} ${getStyle(norm)} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        ['APPROVED', 'COMPLETED', 'ACTIVE'].includes(norm) ? 'bg-emerald-500' :
        ['PENDING'].includes(norm) ? 'bg-amber-500' :
        ['RETURNED'].includes(norm) ? 'bg-orange-500' :
        ['REJECTED', 'OVERDUE', 'BLOCKED'].includes(norm) ? 'bg-rose-500' : 'bg-slate-400'
      }`} />
      <span>{norm}</span>
    </span>
  );
};
