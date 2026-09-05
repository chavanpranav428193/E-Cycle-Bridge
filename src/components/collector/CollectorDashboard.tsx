import React, { useState, useEffect } from 'react';
import {
  PackageCheck,
  Mic,
  Camera,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  QrCode,
  FileCheck,
  ChevronRight,
  Sparkles,
  Zap,
  Flame,
  AlertCircle,
  ArrowRight,
  FileText,
  Scale,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { Lot, AppLanguage, Material, TransactionDispute, DocumentAIExtraction } from '../../types';
import { offlineStore } from '../../lib/offlineStore';
import { getTranslation } from '../../i18n/translations';
import { CreateLotWizard } from './CreateLotWizard';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import { SafetyGuideView } from './SafetyGuideView';
import { HandoverModal } from './HandoverModal';
import { VoiceParseResult } from '../../lib/aiService';
import { useAnimatedCounter } from '../../lib/useAnimatedCounter';
import { CollectionMap } from '../map/CollectionMap';
import { WhereDidMyWasteGo } from '../traceability/WhereDidMyWasteGo';

interface CollectorDashboardProps {
  language: AppLanguage;
  onVerifyLot: (lotNumber: string) => void;
}

export const CollectorDashboard: React.FC<CollectorDashboardProps> = ({
  language,
  onVerifyLot,
}) => {
  const collector = offlineStore.getCollectorProfile();
  const [lots, setLots] = useState<Lot[]>(offlineStore.getLots());
  const materials = offlineStore.getMaterials();

  // Modal / View States
  const [showWizard, setShowWizard] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showSafetyView, setShowSafetyView] = useState(false);
  const [selectedReceiptLot, setSelectedReceiptLot] = useState<Lot | null>(null);

  // Document AI Modal State
  const [showDocAIModal, setShowDocAIModal] = useState(false);
  const [docAiSimulating, setDocAiSimulating] = useState(false);
  const [docAiResult, setDocAiResult] = useState<DocumentAIExtraction | null>(null);

  // Dispute Modal State
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeLot, setDisputeLot] = useState<Lot | null>(null);
  const [disputeType, setDisputeType] = useState<TransactionDispute['disputeType']>('WEIGHT_DISCREPANCY');
  const [disputeReason, setDisputeReason] = useState<string>('Field scale showed 2.4kg tare discrepancy compared to digital scale');
  const [disputeClaimedWeight, setDisputeClaimedWeight] = useState<number>(14.5);
  const [disputeSubmitted, setDisputeSubmitted] = useState<boolean>(false);

  // Wizard pre-fills from voice
  const [wizardPreFill, setWizardPreFill] = useState<{
    materialId?: string;
    weight?: number;
  }>({});

  // Tab filter for lots
  const [lotFilter, setLotFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    const handleUpdate = () => {
      setLots(offlineStore.getLots());
    };
    window.addEventListener('ecycle:data-updated', handleUpdate);
    return () => window.removeEventListener('ecycle:data-updated', handleUpdate);
  }, []);

  const filteredLots = lots.filter((l) => {
    if (lotFilter === 'in_progress') {
      return !['PAID', 'RECYCLED', 'COMPLETED', 'CANCELLED'].includes(l.status);
    }
    if (lotFilter === 'completed') {
      return ['PAID', 'RECYCLED', 'COMPLETED'].includes(l.status);
    }
    return true;
  });

  // Animated counters for KPI cards
  const animatedEarnings = useAnimatedCounter(14280, 950, 0);
  const animatedKg = useAnimatedCounter(86.4, 900, 1);
  const animatedScore = useAnimatedCounter(92, 800, 0);
  const animatedPending = useAnimatedCounter(1240, 850, 0);
  const animatedFormalizationProgress = useAnimatedCounter(78, 1100, 0);

  const activeLot = lots.find((l) => l.status === 'OFFER_ACCEPTED') || lots[0];

  const handleVoiceAction = (result: VoiceParseResult) => {
    if (result.intent === 'SAFETY_QUERY') {
      setShowSafetyView(true);
    } else {
      setWizardPreFill({
        materialId: result.detectedMaterialId,
        weight: result.approxWeight,
      });
      setShowWizard(true);
    }
  };

  if (showSafetyView) {
    return (
      <SafetyGuideView
        language={language}
        onBack={() => setShowSafetyView(false)}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Human-Centered Action Header */}
      <div className="bg-gradient-to-br from-[#064E3B] via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/50 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-extrabold text-emerald-300 text-xl shadow-inner">
              RP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-300">
                  {language === 'mr' ? 'शुभ संध्या' : language === 'hi' ? 'शुभ संध्या' : 'Good evening'}, {collector.displayName.split(' ')[0]}
                </span>
                <span className="text-[10px] font-mono bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full uppercase border border-emerald-700">
                  MPCB Tier-1
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {language === 'mr' ? 'आज आपण काय गोळा करत आहात?' : language === 'hi' ? 'आज आप क्या एकत्र कर रहे हैं?' : 'What are you collecting today?'}
              </h2>
              <p className="text-xs text-slate-300">
                CIDCO & Untwadi Sector • Nashik Cluster Live
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowVoiceModal(true)}
            className="self-start sm:self-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-bold border border-white/15 transition cursor-pointer backdrop-blur-xs"
          >
            <Mic className="w-4 h-4 text-emerald-400" />
            <span>{getTranslation(language, 'voiceHelp')}</span>
          </button>
        </div>

        {/* Large Visual Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            id="btn-scan-ewaste-primary"
            onClick={() => {
              setWizardPreFill({});
              setShowWizard(true);
            }}
            className="flex items-center justify-between p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-950/50 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-black tracking-wide uppercase">SCAN E-WASTE</span>
                <span className="block text-[11px] text-emerald-100 font-normal">AI camera or upload</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => {
              setDocAiResult(null);
              setShowDocAIModal(true);
            }}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold border border-teal-500/40 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold tracking-wide">SLIP AI OCR</span>
                <span className="block text-[11px] text-teal-300 font-normal">Weigh slip auto-extract</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('market-price-spotlight');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold border border-slate-700 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold tracking-wide">CHECK PRICE</span>
                <span className="block text-[11px] text-slate-400 font-normal">PCB: ₹176/kg benchmark</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('collector-earnings-card');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold border border-slate-700 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold tracking-wide">MY EARNINGS</span>
                <span className="block text-[11px] text-emerald-400 font-mono font-bold">₹14,280 (+18% formal)</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* 4-Column Metric Cards (Professional Polish Style with Animated Counters) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {getTranslation(language, 'earnedThisMonth')}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-emerald-900 font-mono">
            ₹{animatedEarnings.toLocaleString('en-IN')}
          </h3>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">
            +12% from August (Demo)
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {getTranslation(language, 'divertedKg')}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 font-mono">
            {animatedKg} <span className="text-sm font-normal text-slate-500">kg</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            12 Completed Lots
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Fair Price Score
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono">
            {animatedScore}<span className="text-sm font-normal opacity-50">/100</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            Based on 14 items
          </p>
        </div>

        <div className="bg-[#064E3B] p-5 rounded-2xl border border-emerald-800 shadow-sm text-white">
          <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-1">
            {getTranslation(language, 'pendingPayment')}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white">
            ₹{animatedPending.toLocaleString('en-IN')}
          </h3>
          <p className="text-[10px] text-emerald-300/80 font-medium mt-1">
            1 Lot in Transition
          </p>
        </div>
      </section>

      {/* Formalization Pathway & Mini Circular Material Flow Strip */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-primary-header text-white p-4 sm:p-5 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-300">
              MPCB Collector Formalization Pathway
            </span>
            <span className="text-[9px] font-mono bg-emerald-900/80 text-emerald-300 px-1.5 py-0.2 rounded">
              Tier-1 Verified
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {collector.displayName} is <strong>{animatedFormalizationProgress}%</strong> toward full Maharashtra State Pollution Control Board certified collector credentials.
          </p>
        </div>

        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-400">Formalization Progress</span>
            <span className="text-emerald-300 font-bold">{animatedFormalizationProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_#10b981]"
              style={{ width: `${animatedFormalizationProgress}%` }}
            />
          </div>
        </div>
      </section>

      {/* 32. MY COLLECTION MAP: Interactive Leaflet Map for Collector */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900">
                My Collection Points & Nearby Facilities
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Live GPS trace of collections and MPCB authorized recyclers in Ambad and Satpur MIDC
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full self-start sm:self-auto">
            Nashik Cluster • 3 Facilities Nearby
          </span>
        </div>

        <CollectionMap
          viewMode="collector"
          selectedLotId={activeLot?.id}
          className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-xs"
        />
      </section>

      {/* Main Grid: Left 2 Cols (Active Transaction + Stepper) & Right 1 Col (Market Price & Safety) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Transaction Spotlight Card */}
          {activeLot && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
                <h2 className="text-xs sm:text-sm font-bold flex items-center gap-2 text-slate-900 font-mono">
                  <span className="w-2 h-4 bg-emerald-500 rounded-xs" />
                  <span>ACTIVE TRANSACTION: {activeLot.lotNumber}</span>
                </h2>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase font-mono">
                  {activeLot.status}
                </span>
              </div>

              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
                {/* AI Image Preview Box */}
                <div className="w-44 h-44 sm:w-48 sm:h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-3 text-center shrink-0">
                  <img
                    src={activeLot.photoUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80'}
                    alt="Scanned AI Item"
                    className="w-full h-28 object-cover rounded-xl mb-2"
                  />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                    {activeLot.materialName} — 91% Conf.
                  </p>
                </div>

                {/* Details Grid */}
                <div className="flex-1 w-full flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Material Category
                      </p>
                      <p className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
                        {activeLot.materialName}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Est. Weight
                      </p>
                      <p className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
                        {activeLot.approximateWeight} kg
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Estimated Value
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-emerald-700 font-mono mt-0.5">
                        ₹{activeLot.estimatedValueMin.toLocaleString()} – ₹{activeLot.estimatedValueMax.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Target Recycler
                      </p>
                      <p className="text-base sm:text-lg font-bold text-slate-800 underline underline-offset-4 decoration-emerald-400 mt-0.5">
                        {activeLot.selectedRecyclerName || 'GreenCycle'}
                      </p>
                    </div>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="w-4/5 bg-emerald-500 rounded-full transition-all duration-500" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">
                      Stage: Handover Pending
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Digital Lot Passport Lifecycle Stepper */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Digital Lot Passport Lifecycle
              </h2>
              <p className="text-[10px] font-mono text-slate-500">
                Ver: 000184_NASHIK
              </p>
            </div>

            <div className="flex justify-between items-center px-2 sm:px-4 overflow-x-auto">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border-2 border-emerald-500 text-xs sm:text-sm">
                  ✓
                </div>
                <span className="text-[10px] font-bold text-emerald-700">Collect</span>
              </div>

              <div className="w-8 sm:w-12 h-px bg-emerald-300 mb-5 shrink-0" />

              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border-2 border-emerald-500 text-xs sm:text-sm">
                  ✓
                </div>
                <span className="text-[10px] font-bold text-emerald-700">Identify</span>
              </div>

              <div className="w-8 sm:w-12 h-px bg-emerald-300 mb-5 shrink-0" />

              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border-2 border-emerald-500 text-xs sm:text-sm">
                  ✓
                </div>
                <span className="text-[10px] font-bold text-emerald-700">Match</span>
              </div>

              <div className="w-8 sm:w-12 h-px bg-slate-200 mb-5 shrink-0" />

              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-slate-300 text-slate-500 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <span className="text-[10px] font-bold text-slate-500">Handover</span>
              </div>

              <div className="w-8 sm:w-12 h-px bg-slate-100 mb-5 shrink-0" />

              <div className="flex flex-col items-center gap-1.5 opacity-40">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs">
                  5
                </div>
                <span className="text-[10px] font-bold text-slate-400">Payment</span>
              </div>
            </div>
          </div>

          {/* My Lots List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {getTranslation(language, 'myLots')} ({lots.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Track registered e-waste custody from collection to recycling
                </p>
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setLotFilter('all')}
                  className={`px-3 py-1 rounded-lg transition ${
                    lotFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setLotFilter('in_progress')}
                  className={`px-3 py-1 rounded-lg transition ${
                    lotFilter === 'in_progress' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setLotFilter('completed')}
                  className={`px-3 py-1 rounded-lg transition ${
                    lotFilter === 'completed' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredLots.map((lot) => (
                <div
                  key={lot.id}
                  className="bg-slate-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-slate-900 font-mono">
                          {lot.lotNumber}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            lot.status === 'PAID' || lot.status === 'RECYCLED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lot.status === 'DISPUTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {lot.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 mt-1">
                        {lot.materialName} ({lot.approximateWeight} kg)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {lot.collectionLocation} • Recycler:{' '}
                        {lot.selectedRecyclerName || 'Matching'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-800 font-mono block">
                        ₹{Math.round(lot.finalAmount || lot.estimatedValueMax).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {lot.paymentStatus || 'PENDING'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-slate-400 text-[10px]">
                      {lot.collectionTimestamp}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedReceiptLot(lot)}
                        className="flex items-center space-x-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>

                      <button
                        onClick={() => {
                          setDisputeLot(lot);
                          setDisputeClaimedWeight(lot.approximateWeight);
                          setDisputeSubmitted(false);
                          setShowDisputeModal(true);
                        }}
                        className="flex items-center space-x-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 transition"
                        title="Report weight variance or payment dispute"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Dispute</span>
                      </button>

                      <button
                        onClick={() => onVerifyLot(lot.lotNumber)}
                        className="flex items-center space-x-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg transition"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Passport</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Market Price & Safety Guide */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
            <h2 className="text-sm font-bold mb-4 flex items-center justify-between text-slate-900">
              <span>Today's Market Price</span>
              <span className="text-[10px] font-normal text-slate-400">Nashik Area</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">PCB - Mix</p>
                  <p className="text-[10px] text-slate-400">Grade A/B</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-700 font-mono">₹171/kg</p>
                  <p className="text-[9px] text-emerald-600 font-bold">↑ 5.4%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">Copper Cable</p>
                  <p className="text-[10px] text-slate-400">Insulated</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-700 font-mono">₹148/kg</p>
                  <p className="text-[9px] text-slate-400 font-bold">Steady</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">Lithium Ion</p>
                  <p className="text-[10px] text-slate-400">Mobile Packs</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-700 font-mono">₹215/kg</p>
                  <p className="text-[9px] text-rose-500 font-bold">↓ 1.2%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 opacity-70">
                <div>
                  <p className="text-xs font-bold text-slate-900">CRT Panel</p>
                  <p className="text-[10px] text-slate-400">Standard</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-700 font-mono">₹42/kg</p>
                  <p className="text-[9px] text-slate-400 font-bold">Steady</p>
                </div>
              </div>
            </div>

            {/* Formal Advantage Strip */}
            <div className="mt-4 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs">
              <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Formal Route Advantage:</span>
                </span>
                <span className="text-emerald-700 font-mono">+₹350 Net</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Calibrated scale & direct recyclers pay up to 18% higher than unregulated scrap dealers.
              </p>
            </div>

            {/* Safety Guide Callout Box */}
            <div className="mt-auto pt-6">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-800 uppercase mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Safety Guide: Batteries</span>
                </p>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Do not puncture or burn. Store in cool area. Use dry sand bucket for swollen cells.
                </p>
                <button
                  onClick={() => setShowSafetyView(true)}
                  className="mt-3 text-[10px] font-bold text-emerald-900 underline cursor-pointer hover:text-emerald-950"
                >
                  View All Safety Guides →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-xs">
          <CreateLotWizard
            language={language}
            initialMaterialId={wizardPreFill.materialId}
            initialWeight={wizardPreFill.weight}
            onCancel={() => setShowWizard(false)}
            onLotCreated={(lot) => {
              setShowWizard(false);
              setSelectedReceiptLot(lot);
            }}
          />
        </div>
      )}

      {showVoiceModal && (
        <VoiceAssistantModal
          isOpen={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          language={language}
          onActionFromVoice={handleVoiceAction}
        />
      )}

      {selectedReceiptLot && (
        <HandoverModal
          lot={selectedReceiptLot}
          isOpen={Boolean(selectedReceiptLot)}
          onClose={() => setSelectedReceiptLot(null)}
          language={language}
          onVerifyPassport={onVerifyLot}
        />
      )}

      {/* DOCUMENT AI / WEIGHBRIDGE SLIP SCANNER MODAL */}
      {showDocAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Document AI Slip OCR</h4>
                  <p className="text-[11px] text-slate-500">Auto-extract weight & price from printed weighbridge receipts</p>
                </div>
              </div>
              <button
                onClick={() => setShowDocAIModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {!docAiResult ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-teal-300 rounded-2xl p-6 bg-teal-50/50 text-center space-y-3">
                  <Upload className="w-8 h-8 text-teal-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Upload photo or camera scan of weighbridge slip</p>
                  <p className="text-[11px] text-slate-500">Supported formats: JPG, PNG, PDF receipts</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                    <button
                      disabled={docAiSimulating}
                      onClick={() => {
                        setDocAiSimulating(true);
                        setTimeout(() => {
                          setDocAiSimulating(false);
                          setDocAiResult({
                            id: `doc-${Date.now()}`,
                            documentType: 'WEIGHBRIDGE_SLIP',
                            fileName: 'Nashik_Dharamkanta_Slip_8942.jpg',
                            extractedWeightKg: 13.6,
                            extractedPricePerKg: 176,
                            extractedMaterialCategory: 'Circuit Boards (PCBs)',
                            extractedSlipNumber: 'WB-NSK-2026-8942',
                            confidenceScore: 0.942,
                            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                            status: 'CONFIRMED',
                          });
                        }, 1200);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {docAiSimulating ? (
                        <span>Analyzing Slip with Document AI...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Scan Demo Dharamkanta Slip</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <strong>AI Assurance:</strong> Detects tare deduction, gross weight, and material rate automatically to eliminate manual scale fraud.
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                      MATCH CONFIDENCE: {(docAiResult.confidenceScore * 100).toFixed(1)}%
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      Slip: {docAiResult.extractedSlipNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Weight Extracted</span>
                      <span className="text-lg font-black text-emerald-900 font-mono">
                        {docAiResult.extractedWeightKg} KG
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Rate per KG</span>
                      <span className="text-lg font-black text-emerald-900 font-mono">
                        ₹{docAiResult.extractedPricePerKg}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Detected Material</span>
                    <span className="font-bold text-slate-800">{docAiResult.extractedMaterialCategory}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDocAiResult(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={() => {
                      setShowDocAIModal(false);
                      setWizardPreFill({
                        materialId: 'mat-1',
                        weight: docAiResult.extractedWeightKg,
                      });
                      setShowWizard(true);
                    }}
                    className="flex-1 py-2.5 bg-primary-action hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                  >
                    Create Lot with Slip Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DISPUTE REPORTING MODAL */}
      {showDisputeModal && disputeLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Report Transaction Dispute</h4>
                  <p className="text-[11px] text-slate-500">Fair mediation backed by MPCB audit logs</p>
                </div>
              </div>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {disputeSubmitted ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-sm text-emerald-950">Dispute Registered Successfully</h5>
                <p className="text-xs text-emerald-800">
                  Reference: <strong>DISP-2026-912</strong>. Both recycler scale calibration records and your claim have been sent to the Admin Mediation Center.
                </p>
                <button
                  onClick={() => setShowDisputeModal(false)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div>Lot: <strong className="font-mono">{disputeLot.lotNumber}</strong> ({disputeLot.materialName})</div>
                  <div>Recipient Recycler: <strong>{disputeLot.recyclerName}</strong></div>
                  <div>Declared Weight: <strong>{disputeLot.approximateWeight} kg</strong></div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dispute Reason Type</label>
                  <select
                    value={disputeType}
                    onChange={(e) => setDisputeType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white"
                  >
                    <option value="WEIGHT_DISCREPANCY">Scale Tare / Weight Discrepancy</option>
                    <option value="PRICE_DISPUTE">Agreed Rate Not Honored</option>
                    <option value="PAYMENT_DELAY">Payment Not Disbursed on Handover</option>
                    <option value="MATERIAL_MISCLASSIFICATION">Material Downgraded Unfairly</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Measured Weight (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={disputeClaimedWeight}
                    onChange={(e) => setDisputeClaimedWeight(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-sm focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Explanation / Remarks</label>
                  <textarea
                    rows={2}
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowDisputeModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const newDispute: TransactionDispute = {
                        id: `disp-${Date.now()}`,
                        lotNumber: disputeLot.lotNumber,
                        collectorId: collector.id,
                        collectorName: collector.displayName,
                        recyclerId: disputeLot.recyclerId || 'rec-1',
                        recyclerName: disputeLot.recyclerName || 'GreenCycle Eco-Solutions',
                        disputeType,
                        collectorClaimedWeight: disputeClaimedWeight,
                        recyclerWeighedWeight: disputeLot.finalWeight || disputeLot.approximateWeight,
                        reason: disputeReason,
                        status: 'OPEN',
                        createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                      };
                      offlineStore.addDispute(newDispute);
                      setDisputeSubmitted(true);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition cursor-pointer shadow-sm"
                  >
                    File Formal Dispute
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
