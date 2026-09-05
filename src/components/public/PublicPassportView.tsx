import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Scale,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Printer,
  Share2,
  AlertCircle,
  Clock,
  Layers,
  Map,
} from 'lucide-react';
import { Lot, TraceabilityEvent } from '../../types';
import { offlineStore } from '../../lib/offlineStore';
import { WhereDidMyWasteGo } from '../traceability/WhereDidMyWasteGo';
import { CollectionMap } from '../map/CollectionMap';

interface PublicPassportViewProps {
  initialLotNumber?: string;
  onSelectLot: (lotNumber: string) => void;
}

export const PublicPassportView: React.FC<PublicPassportViewProps> = ({
  initialLotNumber,
  onSelectLot,
}) => {
  const lots = offlineStore.getLots();
  const [searchQuery, setSearchQuery] = useState(
    initialLotNumber || 'EC-2026-000123'
  );

  // Find lot by number
  const selectedLot =
    lots.find((l) => l.lotNumber.toLowerCase() === searchQuery.toLowerCase()) ||
    lots[0];

  const events = offlineStore.getEventsForLot(selectedLot.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Search Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-primary-header text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full mb-1">
              <ShieldCheck className="w-3 h-3" />
              <span>CPCB CIRCULAR AUDIT TRAIL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Public Digital Lot Passport
            </h2>
            <p className="text-xs text-slate-300">
              Zero-PII verifiable chain of custody for formal e-waste lots
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Lot # (e.g. EW-NK-2026-000184)"
              className="bg-slate-800 border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-emerald-500 font-mono w-full sm:w-64"
            />
          </div>
        </div>

        {/* Quick Sample Lot Pills */}
        <div className="flex items-center space-x-2 text-xs pt-1 overflow-x-auto">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">
            Or inspect sample lot:
          </span>
          {lots.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setSearchQuery(l.lotNumber);
                onSelectLot(l.lotNumber);
              }}
              className={`font-mono text-[11px] px-3 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                selectedLot.lotNumber === l.lotNumber
                  ? 'bg-primary-action text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {l.lotNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Passport Certificate Container: Digital Material Passport ID Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-8 relative overflow-hidden">
        {/* Subtle Watermark Background */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Passport Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block">
                Digital Material Passport • Cryptographic ID Card
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {selectedLot.lotNumber}
            </h3>
            <p className="text-xs text-slate-500">
              Registered in Nashik, Maharashtra • Status:{' '}
              <strong className="text-emerald-800 uppercase font-mono">
                {selectedLot.status}
              </strong>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <div className="bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-xl text-right">
              <span className="text-[9px] uppercase font-bold text-emerald-800 block">
                Verification Hash
              </span>
              <span className="text-xs font-mono font-bold text-emerald-950">
                0x7f9a...3c2e
              </span>
            </div>
          </div>
        </div>

        {/* DIGITAL IDENTITY CARD: Comprehensive Lot Spec & Parties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
          {/* Item Photo and Quick ID */}
          <div className="flex flex-col items-center justify-center space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4">
            <img
              src={selectedLot.photoUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80'}
              alt={selectedLot.materialName}
              className="w-36 h-36 object-cover rounded-2xl border border-slate-300 shadow-sm"
            />
            <div className="text-center">
              <span className="text-xs font-bold text-slate-900 block">
                {selectedLot.materialName}
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                CPCB Category: High Grade
              </span>
            </div>
          </div>

          {/* Core Specifications & Values */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase text-slate-400 font-bold block">
                Gross Weight
              </span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">
                {selectedLot.finalWeight || selectedLot.approximateWeight} kg
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase text-slate-400 font-bold block">
                Estimated Value
              </span>
              <span className="text-sm font-extrabold text-slate-800 font-mono">
                ₹{selectedLot.estimatedValueMin} – ₹{selectedLot.estimatedValueMax}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase text-slate-400 font-bold block">
                Quoted Value
              </span>
              <span className="text-sm font-extrabold text-teal-700 font-mono">
                ₹{selectedLot.offeredRatePerKg ? Math.round(selectedLot.offeredRatePerKg * selectedLot.approximateWeight) : selectedLot.estimatedValueMin}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase text-slate-400 font-bold block">
                Final Settlement
              </span>
              <span className="text-sm font-extrabold text-emerald-700 font-mono">
                ₹{selectedLot.finalAmount || 2150}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2">
              <span className="text-[9px] uppercase text-slate-400 font-bold block">
                Transaction Status
              </span>
              <span className="text-xs font-bold text-emerald-800 uppercase font-mono mt-0.5 block">
                ● {selectedLot.status} (Verified Custody)
              </span>
            </div>
          </div>

          {/* Parties & Timestamp */}
          <div className="space-y-2 text-xs border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-4">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase text-slate-400 font-bold block">
                Collector Details
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {selectedLot.collectorName || 'Ramesh Patil'} (ID: {selectedLot.collectorId || 'COL-9021'})
              </span>
              <span className="text-[10px] text-slate-500 block">
                Panchavati, Nashik • 14 Sep 2026, 10:15 AM
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase text-slate-400 font-bold block">
                Authorized Recycler
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {selectedLot.selectedRecyclerName || 'GreenCycle Solutions'}
              </span>
              <span className="text-[10px] text-slate-500 block">
                MIDC Ambad Facility • MPCB Auth #MH-EWASTE-2024-88
              </span>
            </div>
          </div>
        </div>

        {/* ANIMATED CIRCULAR PROGRESS INDICATOR: 5 STAGES */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Lot Circular Lifecycle Progress:
            </span>
            <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
              COLLECTED → VERIFIED → MATCHED → HANDED OVER → RECYCLED
            </span>
          </div>

          {/* 5-Node Rail */}
          <div className="grid grid-cols-5 gap-2 pt-2">
            {[
              { id: 'collected', label: 'COLLECTED', step: 1, completed: true, active: false },
              { id: 'verified', label: 'VERIFIED', step: 2, completed: true, active: false },
              { id: 'matched', label: 'MATCHED', step: 3, completed: true, active: false },
              { id: 'handover', label: 'HANDED OVER', step: 4, completed: true, active: selectedLot.status === 'OFFER_ACCEPTED' },
              { id: 'recycled', label: 'RECYCLED', step: 5, completed: selectedLot.status === 'RECYCLED' || selectedLot.status === 'PAID', active: selectedLot.status === 'PAID' },
            ].map((node) => (
              <div
                key={node.id}
                className={`p-3 rounded-2xl border text-center transition ${
                  node.completed
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                } ${node.active ? 'ring-2 ring-emerald-500 animate-pulse' : ''}`}
              >
                <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center font-mono text-xs font-bold">
                  {node.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <span className="text-slate-400">0{node.step}</span>
                  )}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-tight block">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Diversion & Critical Mineral Impact */}
        <div className="bg-gradient-to-br from-primary-header to-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-300">
              Urban Mining Recovery & Ecological Diversion
            </span>
            <span className="text-[10px] font-mono bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-200">
              Verified Scale: {selectedLot.finalWeight || selectedLot.approximateWeight} kg
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur p-3.5 rounded-xl">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">
                Gold Recovered
              </span>
              <span className="text-xl font-extrabold text-amber-300 font-mono">
                2.4 g
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                40x yield vs mined ore
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur p-3.5 rounded-xl">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">
                Electrolytic Copper
              </span>
              <span className="text-xl font-extrabold text-teal-300 font-mono">
                2.1 kg
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                99.8% grade cathode
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur p-3.5 rounded-xl">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">
                Toxic Heavy Metals
              </span>
              <span className="text-xl font-extrabold text-emerald-300 font-mono">
                0.8 kg
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                Lead/Cadmium safe isolated
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur p-3.5 rounded-xl">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">
                Emissions Prevented
              </span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                14.2 kg
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                CO2e avoided vs virgin mining
              </span>
            </div>
          </div>
        </div>

        {/* Digital Battery Passport & Critical Mineral Intelligence (EU DPP & CPCB BWMR 2022 Ready) */}
        <div className="bg-slate-950 text-white rounded-2xl p-5 sm:p-6 space-y-4 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Digital Battery Passport (EU DPP & CPCB BWMR Ready)
              </h4>
            </div>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-bold">
              ID: {selectedLot.batteryPassport?.batteryId || 'BAT-NSK-NMC-2026-091'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Cell Chemistry</span>
              <span className="text-sm font-bold text-cyan-300">
                {selectedLot.batteryPassport?.chemistry || 'NMC-811 (Nickel-Manganese-Cobalt)'}
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">State of Health (SoH)</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {selectedLot.batteryPassport?.stateOfHealthPercentage || 76}% (Tier-2 Reusable)
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Circularity Pathway</span>
              <span className="text-sm font-bold text-amber-300">
                {selectedLot.batteryPassport?.recommendedCircularityPath || 'SECOND_LIFE_ENERGY_STORAGE'}
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Critical Recovery</span>
              <span className="text-sm font-bold text-white font-mono">
                Co: 95% • Li: 88% • Ni: 96%
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              <strong>Regulatory Compliance:</strong> Meets Battery Waste Management Rules (BWMR 2022) mandatory recovery thresholds.
            </span>
            <span className="font-mono text-[10px] text-cyan-400 shrink-0">
              DPP Protocol v3.0 Verified
            </span>
          </div>
        </div>

        {/* End-to-End Chain of Custody Timeline (8 Sequential Traceability Stages) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">
              End-to-End Custody Traceability Timeline
            </h4>
            <span className="text-xs text-slate-500">
              8 Cryptographic Stages Logged
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {[
              { title: 'Collection', status: 'Completed', detail: 'Informal gathering in Nashik by verified collector Ramesh Patil', active: false, time: '14 Sep, 10:15 AM' },
              { title: 'AI Classification', status: 'Completed', detail: 'Gemini Multimodal Computer Vision identified Populated Printed Circuit Board (94% confidence)', active: false, time: '14 Sep, 10:17 AM' },
              { title: 'Price Estimation', status: 'Completed', detail: 'Deterministic pricing calculated baseline ₹420/kg with formal +₹350 economic advantage', active: false, time: '14 Sep, 10:18 AM' },
              { title: 'Recycler Match', status: 'Completed', detail: 'Weighted matching paired with GreenCycle Solutions in MIDC Ambad (91% match score)', active: false, time: '14 Sep, 10:20 AM' },
              { title: 'Offer Accepted', status: 'Completed', detail: 'Collector accepted verified rate of ₹435/kg with scheduled collection pickup', active: false, time: '14 Sep, 10:22 AM' },
              { title: 'Handover Verified', status: 'Active', detail: 'Driver arrived with calibrated scale. Weight recorded at 2.4 kg (-1.6% variance tolerance)', active: true, time: '15 Sep, 11:30 AM' },
              { title: 'Payment Completed', status: 'Scheduled', detail: 'Instant UPI disbursement issued with zero middleman deductions', active: false, time: 'Pending' },
              { title: 'Recycling Confirmed', status: 'Scheduled', detail: 'Mechanical separation and acid-free hydrometallurgical recovery certificate logged to CPCB', active: false, time: 'Pending' },
            ].map((node, idx) => (
              <div key={idx} className="relative group">
                <div
                  className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ring-4 transition ${
                    node.active
                      ? 'bg-amber-500 ring-amber-200 scale-125 animate-pulse'
                      : node.status === 'Completed'
                      ? 'bg-emerald-600 ring-emerald-100'
                      : 'bg-slate-300 ring-slate-100'
                  }`}
                />
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-extrabold text-xs text-slate-900 uppercase font-mono tracking-wide flex items-center space-x-2">
                      <span>● {node.title}</span>
                      {node.active && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-bold">
                          ACTIVE STAGE
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                      {node.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {node.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Where Did My Waste Go? Visualizer Component */}
        <WhereDidMyWasteGo lot={selectedLot} />

        {/* Real Dynamic Transit Route Map */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Map className="w-4 h-4 text-emerald-600" />
              <span>Geospatial Custody Route (Collection to Facility)</span>
            </h4>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
              GPS Trace Verified
            </span>
          </div>
          <CollectionMap
            viewMode="traceability"
            selectedLotId={selectedLot.id}
            className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-xs"
          />
        </div>

        {/* CPCB Regulatory Guarantee Stamp */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">
                Statutory Compliance Guarantee
              </span>
              <p className="text-xs text-slate-500">
                Processed in accordance with E-Waste (Management) Rules, 2022 and MPCB guidelines.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-3 py-1 rounded-lg shrink-0">
            AUDIT SIGNED ✓
          </span>
        </div>
      </div>
    </div>
  );
};
