import React, { useState, useEffect } from 'react';
import {
  Building2,
  PackageCheck,
  Scale,
  Truck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  MapPin,
  QrCode,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Clock,
  ArrowRight,
  HardDrive,
  Plus,
  FileText,
  Download,
} from 'lucide-react';
import { Lot, AppLanguage, Recycler, DataDestructionRecord, TransactionDispute } from '../../types';
import { offlineStore } from '../../lib/offlineStore';
import { CollectionMap } from '../map/CollectionMap';

interface RecyclerDashboardProps {
  language: AppLanguage;
  onVerifyLot: (lotNumber: string) => void;
}

export const RecyclerDashboard: React.FC<RecyclerDashboardProps> = ({
  language,
  onVerifyLot,
}) => {
  const recyclers = offlineStore.getRecyclers();
  const currentRecycler = recyclers[0]; // GreenCycle Eco-Solutions Pvt Ltd
  const [lots, setLots] = useState<Lot[]>(offlineStore.getLots());
  const [destructions, setDestructions] = useState<DataDestructionRecord[]>(offlineStore.getDataDestructions());
  const [disputes, setDisputes] = useState<TransactionDispute[]>(offlineStore.getDisputes());
  const [activeTab, setActiveTab] = useState<'intake' | 'inventory' | 'pipeline' | 'routes' | 'destruction' | 'disputes' | 'profile'>('intake');

  // Weighing verification dialog
  const [weighingLot, setWeighingLot] = useState<Lot | null>(null);
  const [manifestLot, setManifestLot] = useState<Lot | null>(null);
  const [calibratedWeight, setCalibratedWeight] = useState<number>(11.8);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI'>('CASH');

  // New Data Destruction Modal
  const [showDestructionModal, setShowDestructionModal] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState<string>('Nashik Tech Park Corp');
  const [newDeviceType, setNewDeviceType] = useState<string>('Enterprise SAS Hard Drives');
  const [newCount, setNewCount] = useState<number>(15);
  const [newStandard, setNewStandard] = useState<DataDestructionRecord['destructionStandard']>('NIST_800_88_PURGE');

  useEffect(() => {
    const handleUpdate = () => {
      setLots(offlineStore.getLots());
      setDestructions(offlineStore.getDataDestructions());
      setDisputes(offlineStore.getDisputes());
    };
    window.addEventListener('ecycle:data-updated', handleUpdate);
    return () => window.removeEventListener('ecycle:data-updated', handleUpdate);
  }, []);

  const handleConfirmWeightAndPay = () => {
    if (!weighingLot) return;

    const rate = weighingLot.offeredRatePerKg || 171;
    const finalAmt = Math.round(rate * calibratedWeight);

    offlineStore.updateLot(weighingLot.id, {
      status: 'PAID',
      finalWeight: calibratedWeight,
      finalAmount: finalAmt,
      paymentMode,
      paymentStatus: 'PAID',
    });

    offlineStore.addTraceabilityEvent({
      id: `ev-${Date.now()}`,
      lotId: weighingLot.id,
      lotNumber: weighingLot.lotNumber,
      eventType: 'handoverVerified',
      title: 'HANDOVER VERIFIED & SCALE WEIGHED',
      actorId: currentRecycler.id,
      actorRole: 'recycler',
      actorName: `${currentRecycler.name} (MIDC Facility)`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      location: currentRecycler.facilityLocation,
      coordinates: currentRecycler.coordinates,
      verificationMethod: 'DIGITAL_SIGNATURE',
      notes: `Scale variance: ${(((calibratedWeight - weighingLot.approximateWeight) / weighingLot.approximateWeight) * 100).toFixed(1)}%. Paid ₹${finalAmt.toLocaleString()} via ${paymentMode}.`,
    });

    setWeighingLot(null);
  };

  const handleUpdateStatus = (lotId: string, nextStatus: Lot['status']) => {
    offlineStore.updateLot(lotId, { status: nextStatus });
    offlineStore.addTraceabilityEvent({
      id: `ev-${Date.now()}`,
      lotId: lotId,
      lotNumber: lots.find((l) => l.id === lotId)?.lotNumber || 'UNKNOWN',
      eventType: nextStatus === 'RECYCLED' ? 'recoveryReported' : 'processingStarted',
      title: nextStatus === 'RECYCLED' ? 'MECHANICAL RECOVERY CERTIFIED' : 'DISMANTLING & LEACHING STARTED',
      actorId: currentRecycler.id,
      actorRole: 'recycler',
      actorName: currentRecycler.name,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      location: currentRecycler.facilityLocation,
      coordinates: currentRecycler.coordinates,
      verificationMethod: 'REGULATORY_LOG',
      notes: `CPCB circularity stage updated to ${nextStatus}`,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Recycler Facility Header */}
      <div className="bg-gradient-to-r from-primary-header to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-emerald-400/40 flex items-center justify-center font-bold text-emerald-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {currentRecycler.name}
                </h2>
                <span className="bg-emerald-800/80 border border-emerald-400/50 text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold text-emerald-200">
                  MPCB Authorized
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentRecycler.facilityLocation}, {currentRecycler.city} • Reg: {currentRecycler.authorizationNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl text-right">
              <span className="text-[10px] text-emerald-200 uppercase font-bold block">
                Platform Reliability
              </span>
              <span className="text-base font-extrabold text-emerald-300 font-mono">
                {currentRecycler.platformReliabilityScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Operational KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-300 uppercase font-bold block">
              Formally Diverted
            </span>
            <span className="text-xl font-extrabold text-white font-mono">
              42.8 Tons
            </span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-300 uppercase font-bold block">
              Pending Pickups
            </span>
            <span className="text-xl font-extrabold text-amber-300 font-mono">
              3 Lots
            </span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-300 uppercase font-bold block">
              In Processing
            </span>
            <span className="text-xl font-extrabold text-teal-300 font-mono">
              12 Lots
            </span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-300 uppercase font-bold block">
              Avg Weight Variance
            </span>
            <span className="text-xl font-extrabold text-emerald-300 font-mono">
              -0.8%
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('intake')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'intake'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Incoming Lots ({lots.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Circularity & Inventory
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'pipeline'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Recycling Pipeline
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'routes'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Nashik EV Fleet Route
        </button>
        <button
          onClick={() => setActiveTab('destruction')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'destruction'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Data Destruction ({destructions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'disputes'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Disputes & Tare ({disputes.filter((d) => d.status !== 'RESOLVED').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Facility Credentials
        </button>
      </div>

      {/* TAB 1: INCOMING LOTS & WEIGHING TRIGGER */}
      {activeTab === 'intake' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Assigned Collector Lots in Nashik
            </h3>
            <span className="text-xs text-slate-500">
              Calibrated field scale verification & settlement
            </span>
          </div>

          <div className="space-y-3">
            {lots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-500 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-slate-900 font-mono">
                        {lot.lotNumber}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                        {lot.status}
                      </span>
                      {lot.anomalyFlag && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                          FLAGGED
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {lot.materialName} ({lot.approximateWeight} kg declared)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Collector: {lot.collectorName} • Location: {lot.collectionLocation}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 font-mono block">
                      Offered: ₹{lot.offeredRatePerKg || 171}/kg
                    </span>
                    <span className="text-xs text-emerald-700 font-bold block">
                      Est. Total: ₹{Math.round(lot.finalAmount || lot.estimatedValueMax).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Condition: <strong className="text-slate-700 uppercase">{lot.condition}</strong>
                  </span>

                  <div className="flex items-center space-x-2">
                    {lot.status === 'OFFER_ACCEPTED' && (
                      <button
                        onClick={() => {
                          setWeighingLot(lot);
                          setCalibratedWeight(lot.approximateWeight);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <Scale className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Confirm Scale & Pay</span>
                      </button>
                    )}

                    <button
                      onClick={() => onVerifyLot(lot.lotNumber)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 inline mr-1" />
                      Passport
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CIRCULARITY & INVENTORY VISUALIZATION */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Top Material Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Incoming E-Waste Intake
              </span>
              <h4 className="text-2xl font-bold font-mono text-slate-900 mt-1">
                34.2 <span className="text-sm font-normal text-slate-500">Tons</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Awaiting batch mechanical processing in Bay 2
              </p>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full w-[45%]" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Processed Materials
              </span>
              <h4 className="text-2xl font-bold font-mono text-emerald-800 mt-1">
                128.5 <span className="text-sm font-normal text-slate-500">Tons</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Hydrometallurgical & shredded output this quarter
              </p>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-600 h-full w-[82%]" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Circularity Efficiency Rate
              </span>
              <h4 className="text-2xl font-bold font-mono text-teal-700 mt-1">
                94.8<span className="text-sm font-normal opacity-60">%</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Exceeding CPCB 2026 mandates by +6.8%
              </p>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-teal-600 h-full w-[95%]" />
              </div>
            </div>
          </div>

          {/* Recovered Fractions Detail Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Critical Mineral & Strategic Secondary Commodity Yields
                </h3>
                <p className="text-xs text-slate-500">
                  Purified fractions ready for industrial smelters and manufacturing supply chains
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                Audit Verified
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Copper Cathode (Cu)</span>
                  <span className="font-mono font-bold text-amber-700">4,820 kg</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full w-[68%]" />
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Grade: 99.85% pure electrolytic
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Gold Bullion Eq. (Au)</span>
                  <span className="font-mono font-bold text-amber-600">1,240 g</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[54%]" />
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Recovered from PCB pin connectors
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Aluminum Ingots (Al)</span>
                  <span className="font-mono font-bold text-slate-700">8,650 kg</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-500 h-full w-[78%]" />
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Heatsinks & extruded framing
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">ABS & Flame Retardant</span>
                  <span className="font-mono font-bold text-teal-700">14,100 kg</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full w-[85%]" />
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Pelletized for injection molding
                </span>
              </div>
            </div>
          </div>

          {/* Hazardous Materials Contained & Neutralized */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 shadow-md">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300 font-mono">
                Hazardous Materials Contained & Safe Sealed (Zero-Landfill Guarantee)
              </h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                <span className="text-slate-300 block">Lead-Acid & Li-Ion Cells</span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">2,100 kg</span>
                <span className="text-[10px] text-emerald-300 block mt-1">100% neutralized in dry vault</span>
              </div>

              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                <span className="text-slate-300 block">Mercury Switches & Phosphor</span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">140 Units</span>
                <span className="text-[10px] text-emerald-300 block mt-1">Vacuum thermal distillation</span>
              </div>

              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                <span className="text-slate-300 block">CRT Leaded Funnel Glass</span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">1,450 kg</span>
                <span className="text-[10px] text-emerald-300 block mt-1">Routed to vitrification kiln</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECYCLING PIPELINE (KANBAN) */}
      {activeTab === 'pipeline' && (
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Stage 1: Received & Intake */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                1. Received at MIDC (Bay 4)
              </span>
              <span className="text-xs font-mono font-bold bg-slate-200 px-1.5 py-0.5 rounded">
                2 Lots
              </span>
            </div>
            {lots.slice(0, 2).map((l) => (
              <div key={l.id} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 shadow-2xs">
                <span className="font-mono font-bold text-slate-900 block">{l.lotNumber}</span>
                <span className="text-slate-600 block">{l.materialName} ({l.approximateWeight} kg)</span>
                <button
                  onClick={() => handleUpdateStatus(l.id, 'PROCESSING')}
                  className="w-full bg-[#064E3B] hover:bg-emerald-900 text-white font-bold py-1.5 rounded-lg text-[11px] transition cursor-pointer"
                >
                  Advance to Dismantling →
                </button>
              </div>
            ))}
          </div>

          {/* Stage 2: Mechanical Processing & Leaching */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                2. Processing & Recovery
              </span>
              <span className="text-xs font-mono font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 shadow-2xs">
              <span className="font-mono font-bold text-slate-900 block">EW-NK-2026-000184</span>
              <span className="text-slate-600 block">High-Grade Populated PCB (11.8 kg)</span>
              <p className="text-[11px] text-teal-700 font-medium">
                Surface mount IC chips depopulated; chemical gold leaching line active.
              </p>
              <button
                onClick={() => handleUpdateStatus('lot-hero-001', 'RECYCLED')}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-1.5 rounded-lg text-[11px] transition cursor-pointer"
              >
                Mark Circularity Complete ✓
              </button>
            </div>
          </div>

          {/* Stage 3: Closed Loop Completed */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                3. Recycled & Recovered
              </span>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                Verified
              </span>
            </div>
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1">
              <span className="font-mono font-bold text-emerald-900 block">EW-NK-2026-000078</span>
              <span className="text-slate-700 block">Insulated Copper Wire (18.9 kg)</span>
              <span className="text-[10px] text-emerald-800 font-bold block">
                Recovered: 11.2 kg 99.9% Electrolytic Copper
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NASHIK PICKUP ROUTE */}
      {activeTab === 'routes' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nashik Daily Electric Fleet Route #EV-409
              </h3>
              <p className="text-xs text-slate-500">
                Optimized cluster collection route to reduce transit emissions
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
              Est. Distance: 34.2 km
            </span>
          </div>

          {/* Interactive Geographic Route & Intake Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Live Logistics & Scheduled Intake Map</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                Nashik MIDC Circuit
              </span>
            </div>
            <CollectionMap
              viewMode="recycler"
              className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-xs"
            />
          </div>

          {/* Visual Route Timeline Map */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-6">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-4 ring-emerald-900" />
                <span className="text-[10px] font-mono text-emerald-400 font-bold">09:30 AM — START DEPARTURE</span>
                <h5 className="font-bold text-sm">Plot W-42, MIDC Ambad (GreenCycle HQ)</h5>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-teal-400 ring-4 ring-teal-900" />
                <span className="text-[10px] font-mono text-teal-400 font-bold">10:45 AM — STOP 1</span>
                <h5 className="font-bold text-sm">CIDCO Trimurti Chowk (Ramesh Patil - 12 kg PCB)</h5>
                <p className="text-xs text-slate-400">Handover verified via digital QR scan</p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-amber-900" />
                <span className="text-[10px] font-mono text-amber-400 font-bold">12:15 PM — STOP 2</span>
                <h5 className="font-bold text-sm">MIDC Satpur Sector F (Workshop Aggregation)</h5>
                <p className="text-xs text-slate-400">Scheduled pickup for 24 kg cables</p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-4 ring-emerald-900" />
                <span className="text-[10px] font-mono text-emerald-400 font-bold">02:30 PM — RETURN INTAKE</span>
                <h5 className="font-bold text-sm">Return to Ambad MIDC Processing Facility</h5>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FACILITY PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Facility & Statutory Credentials
              </h3>
              <p className="text-xs text-slate-500">
                Maharashtra Pollution Control Board (MPCB) authorization record
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl">
              Verified Dismantler
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                License Number
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {currentRecycler.authorizationNumber}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                Authorization Type
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {currentRecycler.authorizationType}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                Valid Through
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {currentRecycler.authorizationValidUntil}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                Operating Hours
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {currentRecycler.operatingHours}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Statutory Form 6 E-Waste Manifest (CPCB/MPCB compliant):</span>
            <button
              onClick={() => setManifestLot(lots[0])}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Generate Form 6 Manifest
            </button>
          </div>
        </div>
      )}

      {/* TAB: DATA DESTRUCTION CERTIFICATES */}
      {activeTab === 'destruction' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-indigo-600" />
                  <span>Certified Enterprise Data Destruction</span>
                </h3>
                <p className="text-xs text-slate-500">
                  NIST 800-88 & DoD 5220.22-M sanitization logs with cryptographic verification hashes
                </p>
              </div>

              <button
                onClick={() => setShowDestructionModal(true)}
                className="flex items-center gap-1.5 bg-primary-action hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Issue Destruction Certificate</span>
              </button>
            </div>

            {/* Certificates List */}
            <div className="space-y-3 pt-2">
              {destructions.map((record) => (
                <div
                  key={record.id}
                  className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg">
                        {record.certificateNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {record.clientEnterpriseName}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase font-mono">
                      {record.destructionStandard.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Devices Sanitized</span>
                      <span className="font-semibold text-slate-900">
                        {record.deviceCount} x {record.deviceType}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Method</span>
                      <span className="font-semibold text-slate-900">
                        {record.destructionMethod}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Supervised By</span>
                      <span className="font-semibold text-slate-900">
                        {record.supervisedByOfficer}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Date & Time</span>
                      <span className="font-semibold text-slate-900">
                        {record.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="font-mono text-[10px] text-slate-500 truncate max-w-lg">
                      Cryptographic Hash: <strong className="text-slate-800">{record.verificationHash}</strong>
                    </div>

                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Data_Destruction_Cert_${record.certificateNumber}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Certificate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: DISPUTES & SCALE TARE VERIFICATION */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <span>Field Scale Tare & Collector Dispute Center</span>
              </h3>
              <p className="text-xs text-slate-500">
                Manage weight variance flags, tare deduction disputes, and direct collector settlements
              </p>
            </div>

            <div className="space-y-3">
              {disputes.map((d) => (
                <div
                  key={d.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:bg-white transition space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800">{d.id}</span>
                      <span className="font-mono text-emerald-800 font-bold">Lot: {d.lotNumber}</span>
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                        {d.disputeType.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-slate-400">{d.createdAt}</span>
                  </div>

                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong>Claim Details:</strong> {d.reason}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">
                      Status: <strong className="text-emerald-700">{d.status}</strong>
                    </span>
                    <span className="text-slate-500 font-mono">
                      Collector Est: {d.collectorClaimedWeight}kg vs Weighed: {d.recyclerWeighedWeight}kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATUTORY FORM 6 MANIFEST MODAL */}
      {manifestLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 my-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  FORM 6 [See rule 19 (1)]
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  E-WASTE MANIFEST (TRANSPORTATION TRACKER)
                </h3>
                <p className="text-xs text-slate-500">
                  Maharashtra Pollution Control Board • E-Waste (Management) Rules, 2022
                </p>
              </div>
              <button
                onClick={() => setManifestLot(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">1. Sender / Aggregator</span>
                <p className="font-bold text-slate-900">{manifestLot.collectorName || 'Ramesh Patil'}</p>
                <p className="text-slate-600">{manifestLot.collectionLocation}</p>
                <p className="font-mono text-slate-500">Collector ID: {manifestLot.collectorId}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">2. Authorized Recycler / Receiver</span>
                <p className="font-bold text-slate-900">{currentRecycler.name}</p>
                <p className="text-slate-600">{currentRecycler.facilityLocation}, {currentRecycler.city}</p>
                <p className="font-mono text-slate-500">MPCB Reg: {currentRecycler.authorizationNumber}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-400 uppercase text-[10px]">3. E-Waste Consignment Details</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-400 block">Manifest / Lot No:</span>
                  <strong className="font-mono text-slate-900">{manifestLot.lotNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Material Category:</span>
                  <strong className="text-slate-900">{manifestLot.materialName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Net Weight:</span>
                  <strong className="text-emerald-700">{manifestLot.finalWeight || manifestLot.approximateWeight} KG</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Vehicle No:</span>
                  <strong className="font-mono text-slate-900">MH-15-EV-409</strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Statutory Compliance Declaration</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                I hereby declare that the contents of this consignment are fully and accurately described above by proper shipping name and are categorized, packed, marked, and labeled for environmentally sound recycling as per CPCB norms.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-400">
                Digital Hash: SHA256-ECYCLE-{manifestLot.lotNumber.replace(/[^0-9]/g, '')}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    alert('Form 6 Manifest downloaded as PDF / JSON statutory record.');
                    setManifestLot(null);
                  }}
                  className="px-4 py-2 bg-primary-action hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Download / Print Manifest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WEIGHING & SETTLEMENT MODAL */}
      {weighingLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Scale className="w-5 h-5 text-emerald-700" />
                <span>Calibrated Field Scale Entry</span>
              </h3>
              <button
                onClick={() => setWeighingLot(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div>Lot Number: <strong className="font-mono">{weighingLot.lotNumber}</strong></div>
              <div>Collector Declared: <strong>{weighingLot.approximateWeight} kg</strong></div>
              <div>Agreed Rate: <strong>₹{weighingLot.offeredRatePerKg || 171} / kg</strong></div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Verified Scale Weight (KG):
              </label>
              <input
                type="number"
                step="0.1"
                value={calibratedWeight}
                onChange={(e) => setCalibratedWeight(parseFloat(e.target.value) || 0)}
                className="w-full text-2xl font-extrabold text-slate-900 p-3 border border-slate-300 rounded-2xl font-mono focus:outline-emerald-600"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Variance: {(((calibratedWeight - weighingLot.approximateWeight) / weighingLot.approximateWeight) * 100).toFixed(1)}%
              </span>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Instant Settlement Disbursal:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('CASH')}
                  className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    paymentMode === 'CASH'
                      ? 'bg-primary-header text-white border-primary-header'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Cash on Handover
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('UPI')}
                  className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    paymentMode === 'UPI'
                      ? 'bg-primary-header text-white border-primary-header'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Direct UPI Transfer
                </button>
              </div>
            </div>

            <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs">
              <span className="text-slate-500 block">Total Disbursal Amount:</span>
              <span className="text-2xl font-extrabold text-emerald-900 font-mono">
                ₹{Math.round((weighingLot.offeredRatePerKg || 171) * calibratedWeight).toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleConfirmWeightAndPay}
              className="w-full bg-primary-action hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              Confirm Verified Weight & Disburse Payment
            </button>
          </div>
        </div>
      )}

      {/* NEW DATA DESTRUCTION CERTIFICATE MODAL */}
      {showDestructionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-600" />
                <span>Issue Sanitization & Destruction Certificate</span>
              </h4>
              <button
                onClick={() => setShowDestructionModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Client Enterprise Name</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Device Type</label>
                  <input
                    type="text"
                    value={newDeviceType}
                    onChange={(e) => setNewDeviceType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newCount}
                    onChange={(e) => setNewCount(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sanitization Standard</label>
                <select
                  value={newStandard}
                  onChange={(e) => setNewStandard(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white"
                >
                  <option value="NIST_800_88_PURGE">NIST 800-88 Rev 1 (Cryptographic Purge)</option>
                  <option value="PHYSICAL_SHREDDING">Physical 2mm Cross-Cut Shredding</option>
                  <option value="DEGAUSSING">High-Field Degaussing (5000+ Gauss)</option>
                  <option value="DOD_5220_22_M">DoD 5220.22-M (7-Pass Overwrite)</option>
                </select>
              </div>

              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-indigo-900 text-[11px] leading-relaxed">
                A cryptographic SHA-256 validation proof will be generated and signed with GreenCycle Eco-Solutions MIDC authorized key.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDestructionModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newCert: DataDestructionRecord = {
                    id: `dest-${Date.now()}`,
                    certificateNumber: `DDC-NK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    clientEnterpriseName: newClientName,
                    deviceType: newDeviceType,
                    deviceCount: newCount,
                    serialNumbers: Array.from({ length: Math.min(newCount, 3) }, (_, i) => `WD-ENT-8840-${i + 1}`),
                    destructionMethod: newStandard === 'PHYSICAL_SHREDDING' ? 'Dual-Shaft Industrial 2mm Shredder' : 'NIST 800-88 Purge Firmware Secure Erase',
                    destructionStandard: newStandard,
                    facilityId: currentRecycler.id,
                    facilityName: currentRecycler.name,
                    facilityLocation: currentRecycler.facilityLocation,
                    supervisedByOfficer: 'Dr. Vivek Deshmukh (Certified Data Sanitizer)',
                    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                    verificationHash: `SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}-VERIFIED`,
                    status: 'ISSUED',
                  };
                  offlineStore.addDataDestruction(newCert);
                  setDestructions(offlineStore.getDataDestructions());
                  setShowDestructionModal(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer"
              >
                Generate & Sign Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
