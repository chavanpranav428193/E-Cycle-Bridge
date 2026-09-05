import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantStyles = {
    default: 'bg-slate-900/90 border border-slate-800 rounded-2xl shadow-sm backdrop-blur-sm',
    elevated: 'bg-slate-900 border border-slate-700/80 rounded-2xl shadow-lg shadow-black/40',
    subtle: 'bg-slate-900/40 border border-slate-800/60 rounded-xl',
    interactive:
      'bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/50 hover:bg-slate-850 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99]',
  };

  return (
    <div className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlightColor?: 'emerald' | 'cyan' | 'amber' | 'blue';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlightColor = 'emerald',
  className = '',
  onClick,
}) => {
  const colorGradients = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-700 hover:bg-slate-850' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</p>
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl border shrink-0 ${colorGradients[highlightColor]}`}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold flex items-center gap-0.5 ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
