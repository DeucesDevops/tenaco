import React from 'react';
import { IssueStatus } from '@/lib/types';

const statusConfig: Record<IssueStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-red-100 text-red-700 border-red-200' },
  in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  resolved: { label: 'Resolved', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  closed: { label: 'Closed', className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export function StatusBadge({ status }: { status: IssueStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'open' ? 'bg-red-500' : status === 'in_progress' ? 'bg-amber-500' : status === 'resolved' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {config.label}
    </span>
  );
}
