import React from 'react';
import { Check, ShieldCheck, MapPin, Clock, QrCode } from 'lucide-react';
import { TraceabilityEvent } from '../../types';

export interface ProgressStep {
  id: number;
  title: string;
  shortTitle?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Desktop / Tablet Bar */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 -z-0" />
        {steps.map((step) => {
          const isDone = step.isCompleted;
          const isCurr = step.isCurrent;

          return (
            <div
              key={step.id}
              onClick={() => isDone && onStepClick?.(step.id)}
              className={`relative z-10 flex flex-col items-center group ${
                isDone ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-slate-950'
                    : isCurr
                    ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 ring-4 ring-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 ring-4 ring-slate-950'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
              </div>
              <span
                className={`text-[11px] font-semibold mt-2 text-center max-w-[80px] leading-tight transition-colors ${
                  isCurr ? 'text-emerald-400 font-bold' : isDone ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {step.shortTitle || step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile step pill banner */}
      <div className="flex md:hidden items-center justify-between bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
            {currentStep}
          </span>
          <span className="text-xs font-bold text-white">
            {steps.find((s) => s.id === currentStep)?.title || `Step ${currentStep}`}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          Step {currentStep} of {steps.length}
        </span>
      </div>
    </div>
  );
};

export interface TimelineProps {
  events: TraceabilityEvent[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, className = '' }) => {
  return (
    <div className={`space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800 ${className}`}>
      {events.map((event, idx) => {
        const isLatest = idx === events.length - 1;
        return (
          <div key={event.id || idx} className="relative flex items-start gap-4 group">
            {/* Timeline node icon */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                isLatest
                  ? 'bg-emerald-600 text-white ring-4 ring-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 ring-4 ring-slate-950'
              }`}
            >
              {event.verificationMethod === 'QR' ? (
                <QrCode className="w-3.5 h-3.5" />
              ) : event.verificationMethod === 'REGULATORY_LOG' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Event body card */}
            <div className="flex-1 bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-white tracking-wide uppercase">
                  {event.title || event.eventType}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {event.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium">{event.actorName}</p>

              {event.notes && (
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  {event.notes}
                </p>
              )}

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {event.location}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  Verified: {event.verificationMethod}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
