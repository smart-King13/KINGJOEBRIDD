import React from 'react';

type StatusType = 'pending' | 'in_discussion' | 'quote_sent' | 'rejected' | 'completed';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = 'bg-[var(--color-black)]/5';
  let textColor = 'text-[var(--color-black)]';
  let label = status.replace('_', ' ').toUpperCase();

  switch (status as StatusType) {
    case 'pending':
      bgColor = 'bg-[var(--color-ash)]/20';
      textColor = 'text-[var(--color-black)]';
      break;
    case 'in_discussion':
      bgColor = 'bg-[var(--color-black)]/10';
      textColor = 'text-[var(--color-black)]';
      break;
    case 'quote_sent':
      bgColor = 'bg-[var(--color-black)]';
      textColor = 'text-[var(--color-white)]';
      break;
    case 'rejected':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-700';
      break;
    case 'completed':
      bgColor = 'bg-[var(--color-black)]';
      textColor = 'text-[var(--color-white)]';
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
}
