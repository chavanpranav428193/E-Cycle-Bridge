import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const configs = {
    info: {
      bg: 'bg-cyan-950/40 border-cyan-800/60 text-cyan-200',
      icon: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-amber-950/40 border-amber-800/60 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    },
    error: {
      bg: 'bg-rose-950/40 border-rose-800/60 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    },
  };

  const config = configs[variant];

  return (
    <div className={`border rounded-xl p-4 flex items-start gap-3 relative ${config.bg} ${className}`}>
      {config.icon}
      <div className="flex-1 text-xs sm:text-sm">
        {title && <h4 className="font-semibold text-white mb-0.5">{title}</h4>}
        <p className="leading-relaxed opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export interface ToastProps {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type = 'success', onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200">
      <Alert variant={type} message={message} onClose={() => onDismiss(id)} className="shadow-2xl max-w-md" />
    </div>
  );
};
