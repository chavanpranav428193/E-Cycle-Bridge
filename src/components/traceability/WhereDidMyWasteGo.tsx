import React from 'react';
import {
  MapPin,
  Truck,
  Building2,
  Cpu,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Lot, Recycler } from '../../types';
import { offlineStore } from '../../lib/offlineStore';
import { Card } from '../ui/Card';
import { CollectionMap } from '../map/CollectionMap';

interface WhereDidMyWasteGoProps {
  lot: Lot;
  className?: string;
}

export const WhereDidMyWasteGo: React.FC<WhereDidMyWasteGoProps> = ({ lot, className = '' }) => {
  const recyclers = offlineStore.getRecyclers();
  const recycler =
    recyclers.find((r) => r.id === lot.selectedRecyclerId) || recyclers[0];

  const isRecycled = lot.status === 'RECYCLED';
  const isPaidOrProcessing =
    lot.status === 'PAID' || lot.status === 'PROCESSING' || isRecycled;

  const journeySteps = [
    {
      step: 1,
      title: '1. Collection Point',
      actor: lot.collectorName || 'Ramesh Patil (Collector)',
      location: lot.collectionLocation || 'Untwadi, CIDCO, Nashik',
      status: 'Completed',
      time: lot.collectionTimestamp || '05 Sep 2026, 10:34 AM',
      icon: MapPin,
      iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      description: 'Scrap gathered, AI photographed, and registered with GPS verification.',
    },
    {
      step: 2,
      title: '2. Low-Emission Transit',
      actor: 'GreenCycle EV Fleet #MH-15-EV-409',
      location: 'Transit corridor via Mumbai-Agra Highway',
      status: isPaidOrProcessing ? 'Completed' : 'Scheduled',
      time: '05 Sep 2026, 01:30 PM',
      icon: Truck,
      iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
      description: 'Electric collection van scheduled with digital scale verification at doorstep.',
    },
    {
      step: 3,
      title: '3. Authorized Facility',
      actor: recycler?.name || 'GreenCycle Eco-Solutions Pvt Ltd',
      location: recycler?.facilityLocation || 'Plot W-42, MIDC Ambad, Nashik',
      status: isPaidOrProcessing ? 'Completed' : 'Pending',
      time: '05 Sep 2026, 02:15 PM',
      icon: Building2,
      iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
      description: `Form-IV licensed facility (${recycler?.authorizationNumber}). Safe non-thermal segregation.`,
    },
    {
      step: 4,
      title: '4. Urban Mineral Recovery',
      actor: 'Hydrometallurgical Refining Unit',
      location: 'Secondary Raw Material Loop',
      status: isRecycled ? 'Completed' : 'Awaiting recycling confirmation',
      time: isRecycled ? '05 Sep 2026, 04:30 PM' : 'Estimated 24-48 hrs',
      icon: Cpu,
      iconColor: isRecycled
        ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
        : 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      description: isRecycled
        ? '99.8% electrolytic copper and 220 ppm gold traces recovered and returned to electronics manufacturing.'
        : 'Lot staged for mechanical dismantling and toxic substance isolation.',
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Humanized Microcopy */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800">
              CIRCULAR LIFECYCLE TRACKER
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Where did this e-waste go?
            </h3>
            <p className="text-xs text-slate-300">
              Follow the physical journey of Lot <span className="font-mono text-emerald-400 font-bold">{lot.lotNumber}</span> from informal collection to recovered secondary raw materials.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isRecycled ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recycling Completed</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Awaiting recycling confirmation</span>
              </span>
            )}
          </div>
        </div>

        {/* 4-Step Animated Milestone Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3">
          {journeySteps.map((s, idx) => {
            const Icon = s.icon;
            const isDone = s.status === 'Completed';
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-slate-800/80 border-slate-700'
                    : 'bg-slate-900/60 border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${s.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{s.title}</h4>
                <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">{s.actor}</p>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{s.description}</p>
                <div className="text-[10px] font-mono text-slate-400 pt-2 mt-2 border-t border-slate-800/80">
                  {s.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Traceability Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Physical Transit & Handover Corridor</span>
          </span>
          <span className="text-[11px] text-slate-500">
            CIDCO Collection Point ➔ Ambad MIDC Recycling Plant
          </span>
        </div>
        <CollectionMap
          viewMode="traceability"
          selectedLotId={lot.lotNumber}
          showTraceabilityRoute={true}
          className="h-[360px]"
        />
      </div>
    </div>
  );
};
