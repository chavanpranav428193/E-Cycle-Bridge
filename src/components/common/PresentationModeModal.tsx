import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  PackageCheck,
  Building2,
  Recycle,
  Scale,
  QrCode,
  Zap,
} from 'lucide-react';
import { UserRole } from '../../types';
import { CircularEconomy3DScene } from '../visual/CircularEconomy3DScene';
import { CircularFlowVisualizer } from '../visual/CircularFlowVisualizer';

interface PresentationModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRole: (role: UserRole) => void;
}

export const PresentationModeModal: React.FC<PresentationModeModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRole,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Problem & Solution Architecture',
      subtitle: 'From 95% Toxic Informal Scrap to Verified Formal Circularity',
      highlight: '+₹350 Net Economic Advantage for Waste Pickers',
      component: '3d_scene',
      summary: [
        'Over 95% of e-waste in India passes through informal scrap dealers who use open acid burning.',
        'E-Cycle Bridge bridges the trust and economic gap with vernacular AI vision, fair price discovery, and transparent recycler matching.',
        'Voluntary formalization succeeds because collectors earn more than selling to local middleman scrap yards.',
      ],
    },
    {
      title: 'Real-Time Material Flow & Custody Chain',
      subtitle: 'Collectors → Lots → Regional Hubs → Authorized Recyclers → Recovered Metals',
      highlight: '218.4 T Formally Diverted in Nashik Region',
      component: 'flow_visualizer',
      summary: [
        'End-to-end verifiable custody chain backed by calibrated scale receipts and tamper-evident QR codes.',
        'Deterministic weighted ranking pairs collectors with certified MPCB/CPCB facilities.',
        'Zero toxic open burning: high-purity gold, electrolytic copper, and lithium are recovered for circular manufacturing.',
      ],
    },
    {
      title: 'Live 15-Step Jury Verification Workflow',
      subtitle: 'Seamless Single-Click Navigation across All Stakeholder Portals',
      highlight: 'Collector App • Recycler Portal • Regulatory Admin • Public Passport',
      component: 'workflow_nav',
      summary: [
        '1. Collector uploads e-waste photo → Gemini Multimodal classifies with 91.4% accuracy.',
        '2. Fair price score calculated → Best recycler offer matched and accepted.',
        '3. Digital handover certificate generated → Weight calibrated → Instant UPI disbursement.',
        '4. Public passport updated → CPCB compliance logged on regional governance dashboard.',
      ],
    },
  ];

  const currentSlide = slides[activeSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md overflow-y-auto flex flex-col p-3 sm:p-6 text-white animate-fadeIn">
      {/* Top Presentation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH DEMO MODE</span>
          </div>
          <span className="text-[11px] font-mono text-amber-300 font-bold bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/40">
            ALL SEEDED DATA MARKED AS DEMO DATA
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Slide {activeSlide + 1} of {slides.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto py-6 space-y-6 flex flex-col justify-center">
        {/* Title and Subtitle */}
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            SIH 229 Executive Presentation
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentSlide.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Visual Showcase based on slide */}
        {currentSlide.component === '3d_scene' && (
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30">
            <CircularEconomy3DScene compact />
          </div>
        )}

        {currentSlide.component === 'flow_visualizer' && (
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <CircularFlowVisualizer />
          </div>
        )}

        {currentSlide.component === 'workflow_nav' && (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => {
                onNavigateToRole('collector');
                onClose();
              }}
              className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-left space-y-2 group transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-emerald-300">
                1. Collector App
              </h4>
              <p className="text-xs text-slate-400">
                Test vernacular camera AI scan, offline storage, and fair price calculator.
              </p>
            </button>

            <button
              onClick={() => {
                onNavigateToRole('recycler');
                onClose();
              }}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-400 text-left space-y-2 group transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-300">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-teal-300">
                2. Recycler Portal
              </h4>
              <p className="text-xs text-slate-400">
                Inspect intake queue, Nashik pickup routes, and scale calibration.
              </p>
            </button>

            <button
              onClick={() => {
                onNavigateToRole('admin');
                onClose();
              }}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-400 text-left space-y-2 group transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-blue-300">
                3. Admin Center
              </h4>
              <p className="text-xs text-slate-400">
                CPCB compliance metrics, anomaly alerts (-47% price deviation), and CSV exports.
              </p>
            </button>

            <button
              onClick={() => {
                onNavigateToRole('public');
                onClose();
              }}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400 text-left space-y-2 group transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-amber-300">
                4. Public Passport
              </h4>
              <p className="text-xs text-slate-400">
                Cryptographic audit trail with verified gold, copper, and emission savings.
              </p>
            </button>
          </div>
        )}

        {/* Key Presentation Bullets */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
          <span className="text-xs uppercase font-mono font-bold text-emerald-400 block">
            Jury Discussion Takeaways
          </span>
          <div className="grid sm:grid-cols-3 gap-3 pt-1">
            {currentSlide.summary.map((point, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4 max-w-7xl w-full mx-auto">
        <button
          onClick={() => setActiveSlide((prev) => Math.max(prev - 1, 0))}
          disabled={activeSlide === 0}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                activeSlide === idx ? 'bg-emerald-400 w-8' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {activeSlide < slides.length - 1 ? (
          <button
            onClick={() => setActiveSlide((prev) => Math.min(prev + 1, slides.length - 1))}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary-action hover:bg-emerald-800 text-xs font-bold text-white transition cursor-pointer shadow-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              onNavigateToRole('collector');
              onClose();
            }}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-primary-action hover:bg-emerald-800 text-xs font-bold text-white transition cursor-pointer shadow-xs"
          >
            <span>Launch Live Prototype</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
