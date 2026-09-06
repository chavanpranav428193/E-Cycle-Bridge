import React, { useRef } from 'react';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Building2,
  Scale,
  QrCode,
  Flame,
  AlertTriangle,
  Zap,
  MapPin,
  Tv,
  Coins,
  FileCheck,
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
    <div className="space-y-16 pb-20">
      {/* Hero Section — Human-designed, clean, and authentic */}
      <section className="bg-[#FAF9F5] border border-stone-200 rounded-2xl p-6 sm:p-12 lg:p-16 text-stone-900 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Subtle Context Indicator */}
          <div className="inline-flex items-center space-x-2 bg-white border border-stone-200 text-stone-700 px-3.5 py-1.5 rounded-full text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Nashik District Pilot • Smart India Hackathon Problem Statement 229</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-[1.12]">
            Connecting informal e-waste collectors with certified recyclers.
          </h1>

          {/* Authentic Grounded Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 leading-relaxed">
            Helping collectors find verified recycling partners, obtain calibrated scale weights, and track every handover from street pickup to certified material recovery.
          </p>

          {/* Action Hierarchy: One Dominant Primary CTA, Calm Secondary Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => onSelectRole('collector')}
              className="flex items-center space-x-2 bg-[#064e3b] hover:bg-[#043c2d] text-white font-semibold px-6 py-3.5 rounded-lg shadow-sm transition cursor-pointer text-sm sm:text-base"
            >
              <PackageCheck className="w-5 h-5 text-emerald-300" />
              <span>Enter Collector Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onVerifyLot('EW-NK-2026-000184')}
              className="flex items-center space-x-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-medium px-4 py-3 rounded-lg transition text-sm cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-stone-500" />
              <span>Inspect Live Lot Passport (#000184)</span>
            </button>

            <button
              onClick={onOpenJuryTour}
              className="flex items-center space-x-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-medium px-4 py-3 rounded-lg transition text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>SIH Jury Tour</span>
            </button>

            {onOpenPresentationMode && (
              <button
                onClick={onOpenPresentationMode}
                className="flex items-center space-x-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-medium px-4 py-3 rounded-lg transition text-sm cursor-pointer"
              >
                <Tv className="w-4 h-4 text-stone-500" />
                <span>Presentation Mode</span>
              </button>
            )}
          </div>
        </div>

        {/* Operational Metrics Strip — Open data presentation */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-mono tracking-wider font-semibold text-stone-500">
              Pilot Operational Data • Nashik Cluster
            </span>
            <span className="text-[10px] font-mono font-medium text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
              Live Verified Records
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tracking-tight">
                1,284
              </div>
              <div className="text-xs font-semibold text-stone-800 mt-1">
                Active Collectors
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Registered aggregators across CIDCO & Nashik
              </p>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tracking-tight">
                218.4 T
              </div>
              <div className="text-xs font-semibold text-stone-800 mt-1">
                E-Waste Collected
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Across 3,412 certified drop-off lots
              </p>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tracking-tight">
                194.2 T
              </div>
              <div className="text-xs font-semibold text-stone-800 mt-1">
                Material Recovered
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                88.9% circular recovery yield
              </p>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tracking-tight">
                48
              </div>
              <div className="text-xs font-semibold text-stone-800 mt-1">
                Authorized Facilities
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                CPCB / MPCB authorized recyclers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Circular Journey — Understandable in 5 Seconds */}
      <section ref={sceneRef} className="space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-emerald-800">
            The Circular Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            From informal street collection to certified industrial recovery
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Every lot moves through six transparent stages, ensuring fair collector pay and preventing toxic scrap burning.
          </p>
        </div>

        {/* 6 Stage Sequential Journey Map */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              step: '01',
              title: 'COLLECT',
              sub: 'Informal Gathering',
              desc: 'Door-to-door and scrap collectors aggregate e-waste with verified identity.',
            },
            {
              step: '02',
              title: 'CLASSIFY',
              sub: 'Material Recognition',
              desc: 'Assisted categorization of circuit boards, batteries, and appliances.',
            },
            {
              step: '03',
              title: 'VALUE',
              sub: 'Fair Price Engine',
              desc: 'Deterministic Nashik MIDC index provides fair pricing without middlemen cuts.',
            },
            {
              step: '04',
              title: 'MATCH',
              sub: 'Authorized Partner',
              desc: 'Paired with licensed MPCB recyclers based on proximity and material bids.',
            },
            {
              step: '05',
              title: 'HANDOVER',
              sub: 'Calibrated Scale',
              desc: 'Digital scale verification with GPS coordinates and instant UPI payment.',
            },
            {
              step: '06',
              title: 'RECYCLE',
              sub: 'Clean Recovery',
              desc: 'Mechanical shredding, electrolytic copper extraction, and digital passport issuance.',
            },
          ].map((s) => (
            <div
              key={s.step}
              className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-stone-900 mt-1">
                  {s.title}
                </h3>
                <div className="text-[11px] font-medium text-stone-500">
                  {s.sub}
                </div>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive 3D Ecosystem Visualization (Restrained framing) */}
        <div className="pt-2">
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
      </section>

      {/* Editorial Problem Breakdown: "Why Formal Recycling Failed in India" */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div className="max-w-3xl">
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-rose-800">
            Root Problem & Field Evidence
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Why formal recycling historically failed in India
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Over 95% of India’s e-waste is channeled through the informal scrap ecosystem. Formal recycling initiatives failed because they attempted to bypass informal collectors rather than providing them with fair, practical access to authorized facilities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Problem 01 */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center space-x-2 text-rose-800 font-semibold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>01 — Unsafe Informal Processing</span>
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Open wire burning & toxic acid leaching
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Without formal access, informal aggregators burn PVC cables in open pits to extract copper, releasing neurotoxic dioxins. Circuit boards undergo cyanide acid baths that poison urban storm drains and drinking water.
            </p>
            <div className="pt-2 border-t border-stone-100 text-xs text-emerald-800 font-medium">
              <strong>E-Cycle Bridge fix:</strong> Direct formal drop-off with +₹350 net margin eliminates the incentive to burn scrap locally.
            </div>
          </div>

          {/* Problem 02 */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center space-x-2 text-amber-800 font-semibold text-xs uppercase tracking-wider">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>02 — Unfair Middleman Pricing</span>
            </div>
            <h3 className="text-base font-bold text-stone-900">
              15–20% deductions on uncalibrated scales
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Scrap aggregators exploit collectors through arbitrary verbal pricing guesses, uncalibrated manual hanging spring scales, and steep delayed payment cuts.
            </p>
            <div className="pt-2 border-t border-stone-100 text-xs text-emerald-800 font-medium">
              <strong>E-Cycle Bridge fix:</strong> Transparent Nashik MIDC price benchmarks and certified digital scale verification with instant UPI payout.
            </div>
          </div>

          {/* Problem 03 */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center space-x-2 text-stone-800 font-semibold text-xs uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-stone-600" />
              <span>03 — Broken Traceability & Access</span>
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Zero regulatory chain of custody
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Recyclers operate at under 30% capacity because they cannot trace informal feedstock. Corporations generate fraudulent paper EPR certificates while real waste ends up in municipal landfills.
            </p>
            <div className="pt-2 border-t border-stone-100 text-xs text-emerald-800 font-medium">
              <strong>E-Cycle Bridge fix:</strong> Public digital QR lot passports with cryptographic timestamps, photo verification, and mass-balance auditing.
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Workflows — Real Operational Portals */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-stone-500">
            Operational Workflows
          </span>
          <h2 className="text-2xl font-bold text-stone-900 mt-1">
            Designed for every participant in the circular chain
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Collector Portal */}
          <div
            onClick={() => onSelectRole('collector')}
            className="bg-white border border-stone-200 hover:border-emerald-700 rounded-xl p-5 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold mb-3">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-800 transition">
                Informal Collector
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Ramesh Patil • CIDCO Cluster
              </p>
              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                Audio voice guidance, camera assisted identification, MIDC price index check, and instant digital handover receipt.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Open Collector View</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Recycler Facility */}
          <div
            onClick={() => onSelectRole('recycler')}
            className="bg-white border border-stone-200 hover:border-stone-800 rounded-xl p-5 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center font-bold mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base group-hover:text-stone-950 transition">
                Authorized Recycler
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                GreenCycle Eco-Solutions • Ambad MIDC
              </p>
              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                Incoming lots intake, pickup route optimization, scale calibration logs, and certified shredding records.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-800">
              <span>Open Recycler View</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Admin Oversight */}
          <div
            onClick={() => onSelectRole('admin')}
            className="bg-white border border-stone-200 hover:border-stone-800 rounded-xl p-5 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center font-bold mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base group-hover:text-stone-950 transition">
                Regulatory Oversight
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                MPCB Circularity Command Center
              </p>
              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                Regional mass-balance metrics, Nashik geo hotspots, price anomaly detection, and CPCB Form 6 exports.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-800">
              <span>Open Admin View</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Public Passport */}
          <div
            onClick={() => onSelectRole('public')}
            className="bg-white border border-stone-200 hover:border-emerald-700 rounded-xl p-5 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold mb-3">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-800 transition">
                Digital Lot Passport
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Zero-PII Public Verifier
              </p>
              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                Publicly auditable chain of custody with timestamped scale records, photo proofs, and recovery metrics.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Verify Lot #000184</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Urban Mining Economics & Practical Recovery Data */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider font-semibold text-stone-500">
              Resource Economics
            </span>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">
              Urban mining vs natural ore extraction
            </h2>
          </div>
          <span className="text-xs text-stone-600 bg-stone-100 px-3 py-1 rounded border border-stone-200 font-medium">
            Nashik Industrial Baseline Data
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Gold in Circuit Boards
            </span>
            <div className="text-3xl font-bold text-stone-900 font-mono mt-1">
              220 <span className="text-sm font-normal text-stone-500">ppm</span>
            </div>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              1 ton of high-grade populated PCBs yields ~200g gold, compared to only 5g per ton of mined rock ore (40x yield).
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Electrolytic Copper
            </span>
            <div className="text-3xl font-bold text-stone-900 font-mono mt-1">
              18 - 55% <span className="text-sm font-normal text-stone-500">yield</span>
            </div>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Pure mechanical stripping avoids toxic air emissions while supplying recyclers with 99.8% grade copper cathode feed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Platform Economics
            </span>
            <div className="text-3xl font-bold text-emerald-800 font-mono mt-1">
              3% <span className="text-sm font-normal text-stone-500">service fee</span>
            </div>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Recyclers pay a 3% platform fee, yet save 12% compared to buying from unregulated informal scrap dealers.
            </p>
          </div>
        </div>
      </section>

      {/* Strategic Comparison Matrix */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-stone-500">
            Operating Standards
          </span>
          <h2 className="text-2xl font-bold text-stone-900 mt-1">
            How E-Cycle Bridge compares with current market practices
          </h2>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="py-3.5 px-4 font-semibold text-stone-700">Capability</th>
                  <th className="py-3.5 px-4 font-semibold text-rose-800">Informal Scrap Dealers</th>
                  <th className="py-3.5 px-4 font-semibold text-stone-700">Traditional Scrap Aggregators</th>
                  <th className="py-3.5 px-4 font-semibold text-emerald-900 bg-emerald-50/60 border-l border-r border-emerald-200">
                    E-Cycle Bridge (Pilot)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-stone-900">Collector Inclusion</td>
                  <td className="py-3 px-4 text-stone-600">Marginalized, unbanked, no formal identity</td>
                  <td className="py-3 px-4 text-stone-600">Day labor with delayed payments</td>
                  <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30 border-l border-r border-emerald-200">
                    MPCB recognized identity, direct bank/UPI payout
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-stone-900">Pricing Transparency</td>
                  <td className="py-3 px-4 text-stone-600">Arbitrary verbal rates, 30–50% underpaid</td>
                  <td className="py-3 px-4 text-stone-600">Hidden tare weights, arbitrary deductions</td>
                  <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30 border-l border-r border-emerald-200">
                    Nashik MIDC index, calibrated scale weigh-in
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-stone-900">Safety & Environmental Protection</td>
                  <td className="py-3 px-4 text-rose-700 font-medium">Acid leaching, cyanide baths, open wire burning</td>
                  <td className="py-3 px-4 text-stone-600">Unsafe storage, swollen battery fire risks</td>
                  <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30 border-l border-r border-emerald-200">
                    Zero-burn pledge, hazard detection before pickup
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-stone-900">Regulatory Traceability</td>
                  <td className="py-3 px-4 text-rose-700 font-medium">Zero compliance, illegal dumping in nullahs</td>
                  <td className="py-3 px-4 text-stone-600">Manual unverified handwritten slips</td>
                  <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30 border-l border-r border-emerald-200">
                    Digital QR Lot Passport, Form 6 CPCB manifests
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-stone-900">Settlement & Liquidity</td>
                  <td className="py-3 px-4 text-stone-600">Frequent debt traps and delayed payments</td>
                  <td className="py-3 px-4 text-stone-600">Cash deductions upon delivery</td>
                  <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30 border-l border-r border-emerald-200">
                    Instant UPI settlement upon digital scale confirmation
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
