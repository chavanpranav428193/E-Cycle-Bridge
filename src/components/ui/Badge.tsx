import React from 'react';
import { LotStatus, RecyclerAuthStatus } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium rounded-md whitespace-nowrap',
    md: 'text-xs px-3 py-1 font-semibold rounded-lg whitespace-nowrap',
  };

  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    info: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    purple: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    neutral: 'bg-slate-800/60 text-slate-400 border border-slate-700/60',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export interface StatusBadgeProps {
  status: LotStatus | RecyclerAuthStatus | string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  showDot = true,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'CREATED':
        return { label: 'Created', variant: 'info' as const, dotColor: 'bg-cyan-400' };
      case 'ASSIGNED':
      case 'OFFER_ACCEPTED':
        return { label: 'Matched & Scheduled', variant: 'warning' as const, dotColor: 'bg-amber-400' };
      case 'HANDED_OVER':
        return { label: 'Custody Handover', variant: 'purple' as const, dotColor: 'bg-indigo-400' };
      case 'PAID':
        return { label: 'Settled & Paid', variant: 'success' as const, dotColor: 'bg-emerald-400' };
      case 'RECYCLED':
      case 'COMPLETED':
        return { label: 'Recycled to Raw', variant: 'success' as const, dotColor: 'bg-emerald-400' };
      case 'verified':
        return { label: 'Authorized Recycler', variant: 'success' as const, dotColor: 'bg-emerald-400' };
      case 'pending':
        return { label: 'Audit Pending', variant: 'warning' as const, dotColor: 'bg-amber-400' };
      case 'suspended':
        return { label: 'Suspended', variant: 'danger' as const, dotColor: 'bg-rose-400' };
      default:
        return { label: status, variant: 'neutral' as const, dotColor: 'bg-slate-400' };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} size={size}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} shrink-0 animate-pulse`} />}
      <span>{config.label}</span>
    </Badge>
  );
};
