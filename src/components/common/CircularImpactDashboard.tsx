import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Scale,
  DollarSign,
  ShieldCheck,
  Recycle,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  Database,
  BarChart3,
  Layers,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface CircularImpactDashboardProps {
  className?: string;
  onExploreMore?: () => void;
}

export const CircularImpactDashboard: React.FC<CircularImpactDashboardProps> = ({
  className = '',
  onExploreMore,
}) => {
  const [activeTrendRange, setActiveTrendRange] = useState<'7d' | '30d'>('7d');
  const [showPriceExplainModal, setShowPriceExplainModal] = useState<boolean>(false);

  // 7-day vs 30-day realistic demo price trend data
  const trendData7d = [
    { day: '30 Aug', marketMin: 155, marketMax: 180, fairPrice: 168, recyclerOffer: 171 },
    { day: '31 Aug', marketMin: 158, marketMax: 182, fairPrice: 170, recyclerOffer: 172 },
    { day: '01 Sep', marketMin: 156, marketMax: 180, fairPrice: 169, recyclerOffer: 171 },
    { day: '02 Sep', marketMin: 160, marketMax: 185, fairPrice: 172, recyclerOffer: 174 },
    { day: '03 Sep', marketMin: 162, marketMax: 186, fairPrice: 173, recyclerOffer: 174 },
    { day: '04 Sep', marketMin: 164, marketMax: 188, fairPrice: 175, recyclerOffer: 178 },
    { day: '05 Sep', marketMin: 165, marketMax: 190, fairPrice: 176, recyclerOffer: 180 },
  ];

  const trendData30d = [
    { day: '07 Aug', marketMin: 148, marketMax: 172, fairPrice: 160, recyclerOffer: 163 },
    { day: '14 Aug', marketMin: 150, marketMax: 175, fairPrice: 162, recyclerOffer: 165 },
    { day: '21 Aug', marketMin: 154, marketMax: 178, fairPrice: 166, recyclerOffer: 169 },
    { day: '28 Aug', marketMin: 158, marketMax: 182, fairPrice: 170, recyclerOffer: 172 },
    { day: '05 Sep', marketMin: 165, marketMax: 190, fairPrice: 176, recyclerOffer: 180 },
  ];

  const chartData = activeTrendRange === '7d' ? trendData7d : trendData30d;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Circular Impact Metric Cards */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Recycle className="w-3 h-3" />
              <span>COMMUNITY RECOVERY STATS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Your Circular Impact
            </h3>
            <p className="text-xs text-slate-300">
              Verified environmental and livelihood metrics recorded in the Nashik e-waste cluster.
            </p>
          </div>

          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 self-start sm:self-auto">
            DEMO DATASET
          </span>
        </div>

        {/* Circular Progress & KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Circular SVG Progress Ring */}
          <div className="col-span-2 lg:col-span-1 bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800 stroke-current"
                  strokeWidth="3.2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 stroke-current transition-all duration-1000 ease-out"
                  strokeDasharray="86, 100"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-white font-mono">86%</span>
                <span className="text-[9px] text-emerald-400 font-bold">CIRCULAR</span>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-300 mt-2">Circularity Rate</span>
            <span className="text-[10px] text-slate-500">Zero open burning</span>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Collected Weight</span>
            <div className="text-2xl font-black text-white font-mono">42.5 kg</div>
            <p className="text-[10px] text-emerald-400 font-medium">18 lots registered</p>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Value</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">₹7,420</div>
            <p className="text-[10px] text-slate-400 font-medium">+₹940 above scrap rate</p>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Digital Handovers</span>
            <div className="text-2xl font-black text-white font-mono">14 / 18</div>
            <p className="text-[10px] text-teal-400 font-medium">100% verified scales</p>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Recycler Ties</span>
            <div className="text-2xl font-black text-white font-mono">6 Facilities</div>
            <p className="text-[10px] text-purple-400 font-medium">Form-IV authorized</p>
          </div>
        </div>
      </div>

      {/* 2. Material Flow Visualization (Sankey-style stage progression) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Material Recovery Flow (Sankey Breakdown)</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Physical material progression from discarded devices to recovered secondary raw materials.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold self-start sm:self-auto">
            DEMO DATA
          </span>
        </div>

        {/* Visual Multi-Stage Flow Track */}
        <div className="space-y-4">
          {/* Stream 1: Mobile Devices */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Stream A: Discarded Handsets & Tablets (48.5 kg)</span>
              <span className="text-emerald-700">92% Yield</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 text-xs">
              <div className="w-full md:w-1/4 bg-white p-2.5 rounded-xl border border-slate-200 text-center font-bold text-slate-800">
                📱 Handsets (48.5 kg)
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 md:rotate-0" />
              <div className="w-full md:w-1/4 bg-white p-2.5 rounded-xl border border-slate-200 text-center font-bold text-emerald-800">
                🧩 High-Grade PCB (18.2 kg)
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 md:rotate-0" />
              <div className="w-full md:w-1/4 bg-white p-2.5 rounded-xl border border-slate-200 text-center font-bold text-teal-800">
                ⚡ Copper & PGM (4.1 kg)
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 md:rotate-0" />
              <div className="w-full md:w-1/4 bg-emerald-700 text-white p-2.5 rounded-xl text-center font-bold shadow-xs">
                ♻ Secondary Copper/Gold
              </div>
            </div>
          </div>

          {/* Stream 2: Laptops & Power Supplies */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Stream B: Laptops & Power Units (86.0 kg)</span>
              <span className="text-emerald-700">89% Yield</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 text-xs">
              <div className="w-full md:w-1/4 bg-white p-2.5 rounded-xl border border-slate-200 text-center font-bold text-slate-800">
                💻 Laptops & PC (86.0 kg)
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 md:rotate-0" />
              <div className="w-full md:w-1/4 bg-white p-2.5 rounded-xl border border-slate-200 text-center font-bold text-emerald-800">
                🔌 Motors & Cables (24.0 kg)
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 md:rotate-0" />
              <div className="w-full md:w-1/4 bg-white p-2.5 rounded-xl border border-slate-200 text-center font-bold text-teal-800">
                ⚙ Aluminum & Steel (36.5 kg)
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 md:rotate-0" />
              <div className="w-full md:w-1/4 bg-emerald-700 text-white p-2.5 rounded-xl text-center font-bold shadow-xs">
                ♻ Recycled Ingots
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Price Discovery & Explainable Pricing + History Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Historical Price Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Regional Price Trends: Populated PCB (₹/kg)</span>
              </div>
              <p className="text-xs text-slate-500">
                Market range vs. Fair Price vs. Recycler Offers in Nashik MIDC
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTrendRange('7d')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  activeTrendRange === '7d'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setActiveTrendRange('30d')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  activeTrendRange === '30d'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                  formatter={(val: any, name: any) => [
                    `₹${val}/kg`,
                    name === 'recyclerOffer'
                      ? 'Recycler Offer'
                      : name === 'fairPrice'
                      ? 'Fair Price'
                      : name === 'marketMax'
                      ? 'Market High'
                      : 'Market Low',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="recyclerOffer"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#10b981' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="fairPrice"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="marketMax"
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Recycler Offer</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Fair Price Benchmark</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>Market Range</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowPriceExplainModal(true)}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why this price?</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Transaction Data Quality Indicator */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Transaction Data Quality
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                HIGH (98%)
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assesses record completeness to guarantee CPCB statutory compliance and prevent unauthorized leakage.
            </p>

            {/* Checklist */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Image Evidence Captured (Multimodal CV)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Calibrated Digital Scale Verification</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Geo-Stamped Handover Location</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cryptographic Timestamp Logged</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dual-Signature Recycler Confirmation</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            * This is a platform data completeness indicator, not a government certification.
          </div>
        </div>
      </div>

      {/* "Why this price?" Explainability Modal */}
      {showPriceExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  ₹
                </div>
                <h4 className="text-base font-bold text-slate-900">Why this price?</h4>
              </div>
              <button
                onClick={() => setShowPriceExplainModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Our deterministic price discovery model aggregates industrial bids across certified MPCB dismantlers in Nashik rather than leaving pricing to informal intermediaries.
            </p>

            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Material Category:</span>
                <strong className="text-slate-800">Populated PCB (Circuit Boards)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Market Range:</span>
                <strong className="text-slate-800">₹165 – ₹190 / kg</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Benchmark Fair Price:</span>
                <strong className="text-blue-700">₹176 / kg</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Active Recycler Offer:</span>
                <strong className="text-emerald-700">₹180 / kg</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Dataset Lineage:</span>
                <strong className="text-slate-800">Based on 24 recent demo observations</strong>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl text-xs font-medium">
              ✓ You are getting <strong>₹4/kg above</strong> the estimated fair benchmark due to high industrial demand for copper recovery.
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => setShowPriceExplainModal(false)}
            >
              Understood
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
