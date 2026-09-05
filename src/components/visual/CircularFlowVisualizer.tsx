import React, { useState, useEffect } from 'react';
import {
  Users,
  Package,
  Layers,
  Building2,
  Recycle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface CircularFlowVisualizerProps {
  interactive?: boolean;
  className?: string;
}

interface FlowStageNode {
  id: string;
  label: string;
  volume: string;
  subtext: string;
  icon: React.ElementType;
  color: string;
}

const FLOW_STAGES: FlowStageNode[] = [
  {
    id: 'collectors',
    label: 'Collectors',
    volume: '1,284 Active',
    subtext: 'Nashik Slums & Peths',
    icon: Users,
    color: 'emerald',
  },
  {
    id: 'lots',
    label: 'Digital Lots',
    volume: '3,412 Registered',
    subtext: 'AI Identified & Verified',
    icon: Package,
    color: 'teal',
  },
  {
    id: 'aggregators',
    label: 'Collection Hubs',
    volume: '8 Regional Hubs',
    subtext: 'Satpur & Ambad MIDC',
    icon: Layers,
    color: 'cyan',
  },
  {
    id: 'recyclers',
    label: 'Auth Recyclers',
    volume: '48 Facilities',
    subtext: 'MPCB & CPCB Permitted',
    icon: Building2,
    color: 'blue',
  },
  {
    id: 'recovered',
    label: 'Recovered Pure Metals',
    volume: '218.4 T Materials',
    subtext: 'Gold, Copper, Palladium',
    icon: Recycle,
    color: 'amber',
  },
];

export const CircularFlowVisualizer: React.FC<CircularFlowVisualizerProps> = ({
  interactive = true,
  className = '',
}) => {
  const [activeStageId, setActiveStageId] = useState<string>('collectors');
  const [pulsePosition, setPulsePosition] = useState<number>(0);

  // Animated pulse traversing the flow line
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePosition((prev) => (prev >= 100 ? 0 : prev + 1.25));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const activeStage = FLOW_STAGES.find((s) => s.id === activeStageId) || FLOW_STAGES[0];

  return (
    <div className={`bg-gradient-to-br from-slate-950 via-slate-900 to-primary-header text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-300">
              Real-time Supply Chain Lineage
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
            Circular Economy Material Flow Stream
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            NASHIK CLUSTER FEED
          </span>
          <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
            DEMO DATA
          </span>
        </div>
      </div>

      {/* Main Flow Stage Rail */}
      <div className="relative pt-3 pb-2">
        {/* Animated Background Flow Line */}
        <div className="hidden md:block absolute top-[46px] left-8 right-8 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full w-24 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399]"
            style={{
              transform: `translateX(${pulsePosition * 6.5}px)`,
              transition: 'transform 0.04s linear',
            }}
          />
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
          {FLOW_STAGES.map((st, idx) => {
            const Icon = st.icon;
            const isSelected = activeStageId === st.id;

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => interactive && setActiveStageId(st.id)}
                className={`text-left p-3.5 sm:p-4 rounded-2xl border transition duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-400 shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-400/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    0{idx + 1}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  {st.label}
                </h4>
                <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                  {st.volume}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block truncate">
                  {st.subtext}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-emerald-300 block">
            Focus Stage: {activeStage.label}
          </span>
          <p className="text-slate-300 max-w-xl">
            {activeStage.id === 'collectors' &&
              'Informal collectors in Nashik register e-waste lots with offline-first vernacular support, receiving transparent market pricing.'}
            {activeStage.id === 'lots' &&
              'Multimodal Gemini AI vision scans e-waste and verifies critical mineral recovery potential.'}
            {activeStage.id === 'aggregators' &&
              'Certified aggregation points consolidate small batches into bulk transport lots in MIDC Ambad & Satpur.'}
            {activeStage.id === 'recyclers' &&
              'MPCB authorized facilities process lots with verified scales, issue digital custody tokens, and pay directly via instant settlement.'}
            {activeStage.id === 'recovered' &&
              'Electrolytic copper, bullion-grade gold, and rare earth elements are returned to electronics manufacturers, closing the circular loop.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl font-mono text-[11px] shrink-0 font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Vol: {activeStage.volume}</span>
        </div>
      </div>
    </div>
  );
};
