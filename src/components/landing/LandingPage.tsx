import React, { useRef } from 'react';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  PackageCheck,
  Building2,
  Scale,
  QrCode,
  Flame,
  AlertTriangle,
  Zap,
  MapPin,
  FileSpreadsheet,
  Tv,
} from 'lucide-react';
import { UserRole } from '../../types';
import { CircularEconomy3DScene } from '../visual/CircularEconomy3DScene';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onOpenJuryTour: () => void;
  onVerifyLot: (lotNumber: string) => void;
  onOpenPresentationMode?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onOpenJuryTour,
  onVerifyLot,
  onOpenPresentationMode,
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);

  const scrollToScene = () => {
    sceneRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner with 3D Circular Economy Scene */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-header via-emerald-950 to-slate-900 text-white pt-10 pb-14 px-4 sm:px-8 rounded-3xl shadow-xl space-y-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/70 border border-emerald-400/40 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SIH 229 Prototype — Nashik Circularity Implementation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            From Collection to <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
              Circularity
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-emerald-100/90 font-normal leading-relaxed">
            An AI-powered digital bridge connecting informal e-waste collectors with the formal recycling ecosystem.
          </p>

          {/* Primary Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSelectRole('collector')}
              className="flex items-center space-x-2 bg-primary-action hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
            >
              <PackageCheck className="w-5 h-5 text-emerald-200" />
              <span>Enter Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToScene}
              className="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold px-5 py-3 rounded-xl transition text-sm sm:text-base cursor-pointer"
            >
              <Recycle className="w-5 h-5 text-emerald-400" />
              <span>Explore Circular Journey</span>
            </button>

            {onOpenPresentationMode && (
              <button
                onClick={onOpenPresentationMode}
                className="flex items-center space-x-2 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-400/50 text-emerald-200 font-semibold px-4 py-3 rounded-xl transition text-sm cursor-pointer shadow-xs"
              >
                <Tv className="w-4 h-4 text-emerald-300" />
                <span>SIH Presentation Mode</span>
              </button>
            )}

            <button
              onClick={onOpenJuryTour}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-4 py-3 rounded-xl transition text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>SIH Jury Tour</span>
            </button>
          </div>
        </div>

        {/* Embedded 3D Circular Economy Ecosystem Scene */}
        <div ref={sceneRef} className="max-w-5xl mx-auto pt-2">
          <CircularEconomy3DScene
            onExploreStage={(stageId) => {
              if (stageId === 'collect' || stageId === 'classify' || stageId === 'value') {
                onSelectRole('collector');
              } else if (stageId === 'match' || stageId === 'handover' || stageId === 'recycle') {
                onSelectRole('recycler');
              } else {
                onSelectRole('public');
              }
            }}
          />
        </div>

        {/* LIVE DEMO STATISTICS SECTION (Strictly marked DEMO DATA) */}
        <div className="max-w-5xl mx-auto pt-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-800/50 pb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-300">
                Live Demo Statistics
              </span>
              <span className="text-[10px] font-mono text-emerald-300/70">
                (Nashik Pilot Hub Cluster)
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded shadow-xs">
              DEMO DATA
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-2xl text-left">
              <span className="text-xs text-slate-300 font-medium block">
                Total E-Waste Collected
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono mt-0.5 block">
                218.4 T
              </span>
              <span className="text-[10px] text-emerald-400/80 mt-1 block">
                Across 3,412 certified lots
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-2xl text-left">
              <span className="text-xs text-slate-300 font-medium block">
                Total Material Recovered
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono mt-0.5 block">
                194.2 T
              </span>
              <span className="text-[10px] text-teal-300/80 mt-1 block">
                88.9% circular recovery yield
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-2xl text-left">
              <span className="text-xs text-slate-300 font-medium block">
                Active Collectors
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-0.5 block">
                1,284
              </span>
              <span className="text-[10px] text-emerald-300/80 mt-1 block">
                Preserving worker livelihoods
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-2xl text-left">
              <span className="text-xs text-slate-300 font-medium block">
                Authorized Recycler Network
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono mt-0.5 block">
                48 Facilities
              </span>
              <span className="text-[10px] text-amber-300/80 mt-1 block">
                CPCB / MPCB authorized units
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Problem vs E-Cycle Bridge Solution */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
            SIH 229 Core Rationale
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Why Formal Recycling Historically Failed & How We Fix It
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Informal Status Quo */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm uppercase tracking-wide">
              <Flame className="w-5 h-5 text-rose-600" />
              <span>The Hazardous Informal Reality (95% Volume)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>
                  <strong>Open Wire Burning:</strong> PVC cords are burned in scrap pits, emitting carcinogenic dioxins and neurotoxic fumes.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>
                  <strong>Informal Margin Deductions:</strong> Middlemen cut prices by 15-20% and use inaccurate uncalibrated manual hanging scales.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>
                  <strong>Zero Traceability:</strong> Toxic leaded glass and lithium acids are dumped into storm drains and landfills.
                </span>
              </li>
            </ul>
          </div>

          {/* E-Cycle Bridge Solution */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm uppercase tracking-wide">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>The E-Cycle Bridge Ecosystem</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Voluntary Economic Incentive:</strong> +₹350 net gain per lot provides a compelling financial motive for collectors.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Vernacular Offline-First App:</strong> Marathi, Hindi, and English voice input allows immediate adoption without technical barriers.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Auditable Digital Passport:</strong> Every lot receives a public tamper-evident QR passport verifying CPCB compliance.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Horizontal 7-Stage Chain of Custody */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                Traceability Workflow
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">
                From Informal Aggregation to Mechanical Circularity
              </h3>
            </div>
            <button
              onClick={() => onVerifyLot('EW-NK-2026-000184')}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Inspect Live Passport (#000184)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { num: '01', title: '1. Scan & AI Detect', role: 'Collector', desc: 'Gemini Vision identifies PCB/battery' },
              { num: '02', title: '2. Price Discovery', role: 'Algorithm', desc: 'Fair Price Score 92/100 benchmark' },
              { num: '03', title: '3. Recycler Match', role: 'Scoring', desc: 'Multi-factor rank & offer bids' },
              { num: '04', title: '4. Offer Accepted', role: 'Collector', desc: 'Accepts ₹171/kg with EV pickup' },
              { num: '05', title: '5. Scale Handover', role: 'Driver / Scale', desc: 'GPS & QR verified; 11.8 kg weighed' },
              { num: '06', title: '6. Direct Disbursal', role: 'Payment', desc: '₹2,018 settled via Cash/UPI' },
              { num: '07', title: '7. Clean Recovery', role: 'Facility', desc: 'Copper, Gold & Cobalt recovered' },
            ].map((st, i) => (
              <div
                key={i}
                className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 transition group"
              >
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {st.num}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 group-hover:text-emerald-300">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {st.desc}
                  </p>
                </div>
                <span className="mt-3 text-[9px] uppercase font-mono tracking-wide bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 self-start">
                  {st.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Jump Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Experience the Platform Through Specific Stakeholder Roles
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Collector Card */}
          <div
            onClick={() => onSelectRole('collector')}
            className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold mb-3 group-hover:bg-[#064E3B] group-hover:text-white transition">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base group-hover:text-emerald-800">
                Informal Collector
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Ramesh Patil (CIDCO, Nashik)
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Vernacular voice assistance, camera AI identification, fair pricing breakdown, and instant digital handover.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Open Collector View</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Recycler Card */}
          <div
            onClick={() => onSelectRole('recycler')}
            className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold mb-3 group-hover:bg-slate-900 group-hover:text-white transition">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base group-hover:text-slate-950">
                Authorized Recycler
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                GreenCycle Eco-Solutions (Ambad MIDC)
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Incoming lots intake, pickup route optimization, scale calibration logs, and recycling status management.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Open Recycler View</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Admin Card */}
          <div
            onClick={() => onSelectRole('admin')}
            className="bg-white border border-slate-200 hover:border-teal-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center font-bold mb-3 group-hover:bg-teal-700 group-hover:text-white transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base group-hover:text-teal-800">
                Platform Admin
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Circularity Command Center
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Regional metrics, Nashik geo hotspots, anomaly detection (-47% price alerts), and dataset CSV exports.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-800">
              <span>Open Admin View</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Public Verification Card */}
          <div
            onClick={() => onSelectRole('public')}
            className="bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center justify-center font-bold mb-3 group-hover:bg-indigo-700 group-hover:text-white transition">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base group-hover:text-indigo-800">
                Lot Passport
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Public Auditable Verification
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Zero-PII digital passport showing full chain of custody from CIDCO pickup to precious metal recovery.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-800">
              <span>Verify Lot #000184</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Critical Minerals & Unit Economics */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase font-mono tracking-wide font-bold text-slate-500">
                Economic Sustainability & Urban Mining
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Urban Mining Yields vs Virgin Ore Extraction
              </h3>
            </div>
            <span className="text-xs font-bold bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
              Validated on Nashik Cluster
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Gold & Precious Metals
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                220 <span className="text-sm font-normal text-slate-500">ppm in PCB</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                1 ton of high-grade populated PCBs yields ~200g gold, compared to only 5g per ton of natural mined gold ore (40x yield).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Electrolytic Copper
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                18 - 55% <span className="text-sm font-normal text-slate-500">recovery</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pure mechanical stripping avoids toxic air emissions while providing recyclers with 99.8% grade copper cathode feed.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Circularity Unit Economics
              </span>
              <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
                3% <span className="text-sm font-normal text-slate-500">convenience fee</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Recyclers pay a 3% platform facilitation fee, yet save 12% compared to buying from unregulated informal scrap aggregators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantage / Why E-Cycle Bridge 3.0 Matrix */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Strategic Competitive Advantage
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Why E-Cycle Bridge 3.0 Leads Circular Transition
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Transforming the informal recycling landscape with inclusive ergonomics, deterministic fairness, and institutional-grade compliance.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-3.5 px-4 font-bold text-slate-700 uppercase">Core Capability</th>
                  <th className="py-3.5 px-4 font-bold text-rose-700 uppercase">Informal Black Market</th>
                  <th className="py-3.5 px-4 font-bold text-amber-700 uppercase">Scrap Aggregators</th>
                  <th className="py-3.5 px-4 font-bold text-emerald-800 uppercase bg-emerald-50/60 border-l border-r border-emerald-200">
                    E-Cycle Bridge 3.0
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Collector Inclusion</td>
                  <td className="py-3 px-4 text-slate-600">Marginalized, criminalized, no identity</td>
                  <td className="py-3 px-4 text-slate-600">Informal day labor, price gouging</td>
                  <td className="py-3 px-4 font-semibold text-emerald-900 bg-emerald-50/30 border-l border-r border-emerald-200">
                    Vernacular audio UI, MPCB green cards, formal credit history
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Pricing Transparency</td>
                  <td className="py-3 px-4 text-slate-600">Arbitrary verbal guesses, 50% underpaid</td>
                  <td className="py-3 px-4 text-slate-600">Hidden tare weights, volatile deduction</td>
                  <td className="py-3 px-4 font-semibold text-emerald-900 bg-emerald-50/30 border-l border-r border-emerald-200">
                    Deterministic Nashik MIDC index, AI grade assist, multi-bid marketplace
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Safety & Hazard Control</td>
                  <td className="py-3 px-4 text-rose-600 font-medium">Acid leaching, cyanide baths, open burning</td>
                  <td className="py-3 px-4 text-slate-600">Unsafe storage, swollen battery fires</td>
                  <td className="py-3 px-4 font-semibold text-emerald-900 bg-emerald-50/30 border-l border-r border-emerald-200">
                    Pre-collection hazard evaluation, lithium battery alerts, zero-burn pledge
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Regulatory & EPR Traceability</td>
                  <td className="py-3 px-4 text-rose-600 font-medium">Zero compliance, illegal dumping</td>
                  <td className="py-3 px-4 text-slate-600">Manual unverified weight slips</td>
                  <td className="py-3 px-4 font-semibold text-emerald-900 bg-emerald-50/30 border-l border-r border-emerald-200">
                    Digital QR Lot Passport, CPCB Form 6 manifests, instant EPR audit export
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Settlement & Liquidity</td>
                  <td className="py-3 px-4 text-slate-600">Delayed payment, credit debt traps</td>
                  <td className="py-3 px-4 text-slate-600">Frequent cash deductions on arrival</td>
                  <td className="py-3 px-4 font-semibold text-emerald-900 bg-emerald-50/30 border-l border-r border-emerald-200">
                    Instant UPI / cash settlement upon calibrated scale scan
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Enterprise Data Security</td>
                  <td className="py-3 px-4 text-rose-600 font-medium">Zero destruction, high data leak danger</td>
                  <td className="py-3 px-4 text-slate-600">No cryptographic wiping capability</td>
                  <td className="py-3 px-4 font-semibold text-emerald-900 bg-emerald-50/30 border-l border-r border-emerald-200">
                    NIST 800-88 purge & certified physical shredding verification
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
