import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  PackageCheck,
  Building2,
  Cpu,
  BarChart3,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { UserRole } from '../../types';

interface JuryDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRole?: (role: UserRole) => void;
  onJumpToRole?: (role: UserRole) => void;
}

interface TourStep {
  stepNumber: number;
  title: string;
  category: string;
  roleTarget: UserRole;
  description: string;
  technicalHighlights: string[];
  juryTakeaway: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    stepNumber: 1,
    category: 'The Problem Statement (SIH 229)',
    title: 'From Toxic Informal Scrap to Traceable Circularity',
    roleTarget: 'public',
    description:
      'Over 95% of India’s e-waste is channeled through informal kabadi dealers where hazardous practices (open cable burning, acid bathing) cause irreversible environmental contamination. Informal collectors accept 10-20% discounts because they lack market transparency and formal access.',
    technicalHighlights: [
      'Addresses SIH 229 informal-to-formal supply chain bottlenecks',
      'Preserves collector livelihoods through direct authorized market access',
      'Presents clear economic incentive (+₹350 net gain per lot) rather than bureaucratic mandates',
    ],
    juryTakeaway:
      'We do not eliminate informal workers; we empower them with fair pricing and formal recycler linkages.',
  },
  {
    stepNumber: 2,
    category: 'Collector UX & Vernacular AI',
    title: 'Offline-First Scan & Gemini Multimodal Identification',
    roleTarget: 'collector',
    description:
      'Informal collectors in Nashik need frictionless tools in Marathi & Hindi. The app operates offline via Service Workers and local sync queues. The camera tool uses server-side Gemini 2.5 Flash to identify circuit boards, cables, and batteries with human confirmation.',
    technicalHighlights: [
      'PWA with offline sync queue and instant offline simulation toggle',
      'Multimodal image classification with confidence score and safety warnings',
      'Human-in-the-loop verification ("Is this identified correctly? Yes / Choose other")',
      'Vernacular voice input with browser speech recognition for Marathi & Hindi',
    ],
    juryTakeaway:
      'AI assists without dictating — collectors retain control and confirm material categories.',
  },
  {
    stepNumber: 3,
    category: 'Economic Incentive Engine',
    title: 'Fair Price Engine & Formal Route Advantage (+₹350)',
    roleTarget: 'collector',
    description:
      'A deterministic price discovery algorithm evaluates recent authorized bids across Nashik industrial clusters (Ambad, Satpur, Sinnar). A transparent calculator directly contrasts the informal dealer cut against the formal recycler offer.',
    technicalHighlights: [
      'Fair Price Score (e.g. 92/100) calculated from condition and local market depth',
      'Live Formal Advantage breakdown showing net gain after subsidized logistics',
      'Protects collectors from opaque middleman deductions',
    ],
    juryTakeaway:
      'Real financial transparency drives voluntary formalization faster than policy enforcement.',
  },
  {
    stepNumber: 4,
    category: 'Matching Algorithm',
    title: 'Transparent Multi-Factor Recycler Matching',
    roleTarget: 'collector',
    description:
      'Rather than an opaque black box, our engine ranks authorized recyclers by weighted criteria: Regulatory Status (30%), Price (25%), Material Compatibility (15%), Distance (10%), Pickup Availability (10%), and Platform Reliability (10%).',
    technicalHighlights: [
      'Verifies MPCB / CPCB hazardous authorization status',
      'Calculates real straight-line geospatial distance to Nashik recycling centers',
      'Generates human-readable match justifications for each offer',
    ],
    juryTakeaway:
      'Collectors see why each recycler was recommended, building systemic trust.',
  },
  {
    stepNumber: 5,
    category: 'Traceability & Custody',
    title: 'Verified Digital Handover & Scale Calibration',
    roleTarget: 'collector',
    description:
      'At collection, the driver scans the lot QR code and weighs the material on a calibrated scale. Weight discrepancies are recorded (-1.6% tolerance). An instant digital receipt with cryptographic lot passport is issued with cash/UPI confirmation.',
    technicalHighlights: [
      'Cryptographic lot passport with verifiable lifecycle events',
      'GPS coordinates and timestamp recorded at physical custody transfer',
      'Instant settlement disbursal tracking with OTP confirmation',
    ],
    juryTakeaway:
      'Solves the historical ghost-weight and payment default issues in informal scrap trade.',
  },
  {
    stepNumber: 6,
    category: 'Recycler Portal',
    title: 'Authorized Recycler Operations & Nashik Fleet Logistics',
    roleTarget: 'recycler',
    description:
      'Authorized recyclers (like GreenCycle in MIDC Ambad) manage intake queues, view pickup routes across Nashik, verify scales, and update dismantling/recovery milestones for EPR compliance.',
    technicalHighlights: [
      'Operational kanban tracking: Received -> Weighed -> Dismantling -> Precious Metals Recovered',
      'Pickup route planning across Nashik industrial and residential clusters',
      'Automated weight reconciliation audit trail',
    ],
    juryTakeaway:
      'Provides recyclers with a steady, verified supply of segregated e-waste feedstock.',
  },
  {
    stepNumber: 7,
    category: 'Governance & Anomaly Center',
    title: 'Admin Command Center & AI Training Lineage',
    roleTarget: 'admin',
    description:
      'Regulators and platform admins monitor regional diversion rates, track material volume distributions via Recharts, inspect price deviations (-47% flag), and audit the human-confirmed AI training lineage.',
    technicalHighlights: [
      'Anomaly detection engine flags atypical quotes and high weight deviations',
      'Interactive Nashik geospatial activity map highlighting collection hubs',
      'Full dataset management with live CSV export capabilities',
      'AI lineage tracking human confirmations for continuous model tuning',
    ],
    juryTakeaway:
      'Gives municipal and state pollution control boards complete visibility without policing collectors.',
  },
  {
    stepNumber: 8,
    category: 'Circular Economics',
    title: 'Critical Mineral Recovery & Unit Economics',
    roleTarget: 'admin',
    description:
      'E-waste is urban mining: 1 ton of PCBs contains 40x more gold than 1 ton of mined ore. The platform monetizes via a 3% formal transaction convenience fee charged to recyclers, saving them 12% in informal broker markups.',
    technicalHighlights: [
      'Quantifies copper, gold, cobalt, and neodymium recovery potential per lot',
      'Unit economics model validated for self-sustaining circular operation',
      'Built with production-grade TypeScript, Express, Vite, and offline resilience',
    ],
    juryTakeaway:
      'A self-sustaining, commercially viable climate-tech solution ready for field deployment in Nashik and beyond.',
  },
];

export const JuryDemoModal: React.FC<JuryDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRole,
  onJumpToRole,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleJumpToRole = () => {
    const fn = onNavigateToRole || onJumpToRole;
    if (fn) {
      fn(currentStep.roleTarget);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-header to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-300 font-bold">
                  SIH 229 Jury Guided Tour
                </span>
                <span className="text-[10px] bg-emerald-800/90 border border-emerald-400/40 px-2 py-0.5 rounded font-mono text-white font-bold">
                  {currentStepIndex + 1} / {TOUR_STEPS.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                {currentStep.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-200">
            {currentStep.category}
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {currentStep.description}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Technical & Architecture Highlights
            </h4>
            <ul className="space-y-1.5">
              {currentStep.technicalHighlights.map((th, i) => (
                <li key={i} className="flex items-start space-x-2 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{th}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-900 block uppercase tracking-wide">
                Key Jury Takeaway
              </span>
              <p className="text-xs text-emerald-800 font-medium mt-0.5 leading-relaxed">
                {currentStep.juryTakeaway}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex items-center justify-between gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center space-x-1 px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleJumpToRole}
              className="hidden sm:flex items-center space-x-1.5 text-xs font-bold bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 px-3.5 py-2 rounded-xl shadow-2xs transition cursor-pointer"
            >
              <span>Explore This View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {currentStepIndex < TOUR_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-1 bg-primary-action hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="bg-primary-action hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
              >
                Finish Tour
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
