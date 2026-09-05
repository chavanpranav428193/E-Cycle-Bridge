import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  MapPin,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  XCircle,
  Database,
  Cpu,
  Layers,
  ArrowUpRight,
  Sparkles,
  DollarSign,
  TrendingUp,
  FileText,
  Truck,
  Scale,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Lot, AnomalyRecord, Material, Recycler, TransactionDispute, PredictiveZone } from '../../types';
import { offlineStore } from '../../lib/offlineStore';
import { useAnimatedCounter } from '../../lib/useAnimatedCounter';
import { CircularFlowVisualizer } from '../visual/CircularFlowVisualizer';
import { CollectionMap } from '../map/CollectionMap';
import { CircularImpactDashboard } from '../common/CircularImpactDashboard';

interface AdminDashboardProps {
  onVerifyLot: (lotNumber: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onVerifyLot }) => {
  const [lots, setLots] = useState<Lot[]>(offlineStore.getLots());
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>(offlineStore.getAnomalies());
  const [disputes, setDisputes] = useState<TransactionDispute[]>(offlineStore.getDisputes());
  const predictiveZones: PredictiveZone[] = offlineStore.getPredictiveZones();
  const recyclers = offlineStore.getRecyclers();
  const materials = offlineStore.getMaterials();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'analytics' | 'anomalies' | 'disputes' | 'predictive' | 'epr' | 'geomap' | 'datasets' | 'lineage'
  >('analytics');

  const [selectedDisputeFilter, setSelectedDisputeFilter] = useState<'ALL' | 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED'>('ALL');
  const [resolvingDisputeId, setResolvingDisputeId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState<string>('');

  useEffect(() => {
    const handleUpdate = () => {
      setLots(offlineStore.getLots());
      setAnomalies(offlineStore.getAnomalies());
      setDisputes(offlineStore.getDisputes());
    };
    window.addEventListener('ecycle:data-updated', handleUpdate);
    return () => window.removeEventListener('ecycle:data-updated', handleUpdate);
  }, []);

  // 30-Day Price Trends Data
  const priceTrendData = [
    { day: '01 Aug', pcb: 158, cable: 148, battery: 220 },
    { day: '08 Aug', pcb: 160, cable: 150, battery: 225 },
    { day: '15 Aug', pcb: 164, cable: 152, battery: 230 },
    { day: '22 Aug', pcb: 162, cable: 154, battery: 232 },
    { day: '29 Aug', pcb: 165, cable: 155, battery: 235 },
    { day: '05 Sep', pcb: 171, cable: 160, battery: 242 },
  ];

  // Material Volume Distribution Data
  const volumeData = [
    { name: 'Populated PCB', value: 42, color: '#047857' },
    { name: 'Copper Cables', value: 28, color: '#0d9488' },
    { name: 'Li-Ion Batteries', value: 16, color: '#f59e0b' },
    { name: 'Displays / LCD', value: 9, color: '#64748b' },
    { name: 'Motors & Magnets', value: 5, color: '#8b5cf6' },
  ];

  // Traceability Lifecycle Funnel Data
  const funnelData = [
    { stage: '1. Scanned', count: 4921 },
    { stage: '2. AI Valued', count: 4680 },
    { stage: '3. Matched', count: 4210 },
    { stage: '4. Handed Over', count: 3840 },
    { stage: '5. Settled / Paid', count: 3812 },
    { stage: '6. Recycled', count: 3250 },
  ];

  // Animated KPI statistics
  const animatedCollectors = useAnimatedCounter(1284, 900, 0);
  const animatedRecyclers = useAnimatedCounter(48, 800, 0);
  const animatedDiverted = useAnimatedCounter(218.4, 950, 1);
  const animatedEarnings = useAnimatedCounter(32.8, 900, 1);

  // Export Lots to CSV
  const handleExportLotsCSV = () => {
    const headers = ['Lot Number', 'Material', 'Category', 'Weight (kg)', 'Estimated Value', 'Recycler', 'Status', 'Timestamp'];
    const rows = lots.map((l) => [
      l.lotNumber,
      `"${l.materialName}"`,
      `"${l.materialCategory}"`,
      l.approximateWeight,
      l.finalAmount || l.estimatedValueMax,
      `"${l.selectedRecyclerName || 'None'}"`,
      l.status,
      `"${l.collectionTimestamp}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecycle_bridge_lots_nashik_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResolveAnomaly = (id: string, status: 'reviewed_valid' | 'escalated') => {
    offlineStore.resolveAnomaly(id, status);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-primary-header text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-800/80 border border-teal-400/30 flex items-center justify-center font-bold text-teal-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Circularity Command & Governance
                </h2>
                <span className="bg-teal-950/80 border border-teal-600/50 text-teal-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  NASHIK REGION
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time CPCB compliance monitoring, transparent market benchmarks & custody audit
              </p>
            </div>
          </div>

          <button
            onClick={handleExportLotsCSV}
            className="flex items-center space-x-1.5 bg-primary-action hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Regional CSV</span>
          </button>
        </div>

        {/* Global Statistics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Active Collectors
            </span>
            <span className="text-xl font-extrabold text-white font-mono">
              {animatedCollectors.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Verified Recyclers
            </span>
            <span className="text-xl font-extrabold text-teal-300 font-mono">
              {animatedRecyclers} Units
            </span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              E-Waste Diverted
            </span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              {animatedDiverted} T
            </span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Collector Earnings
            </span>
            <span className="text-xl font-extrabold text-amber-300 font-mono">
              ₹{animatedEarnings} Lakh
            </span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Review Signals
            </span>
            <span className="text-xl font-extrabold text-rose-400 font-mono">
              {anomalies.filter((a) => a.status === 'pending_review').length} Flagged
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'analytics' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Analytics & Trends
        </button>
        <button
          onClick={() => setActiveAdminTab('anomalies')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
            activeAdminTab === 'anomalies' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Anomaly Center</span>
          <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {anomalies.filter((a) => a.status === 'pending_review').length}
          </span>
        </button>
        <button
          onClick={() => setActiveAdminTab('disputes')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
            activeAdminTab === 'disputes' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Disputes & Mediation</span>
          <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {disputes.filter((d) => d.status === 'OPEN' || d.status === 'UNDER_REVIEW').length}
          </span>
        </button>
        <button
          onClick={() => setActiveAdminTab('predictive')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
            activeAdminTab === 'predictive' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Predictive Fleet & Zones</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('epr')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
            activeAdminTab === 'epr' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>EPR Audit & CPCB Export</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('geomap')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'geomap' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Nashik Geospatial Map
        </button>
        <button
          onClick={() => setActiveAdminTab('datasets')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'datasets' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dataset Manager
        </button>
        <button
          onClick={() => setActiveAdminTab('lineage')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'lineage' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          AI Lineage & Validation
        </button>
      </div>

      {/* TAB 1: ANALYTICS & RECHARTS */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6">
          {/* Circular Material Flow Summary */}
          <CircularFlowVisualizer />

          <div className="grid md:grid-cols-2 gap-6">
            {/* 30-Day Price Trends Chart */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Nashik 30-Day Benchmark Price Trends (₹ / KG)
                  </h4>
                  <p className="text-xs text-slate-500">Aggregated from authorized MIDC buyer bids</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[120, 260]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="pcb" name="PCB Motherboard" stroke="#047857" strokeWidth={3} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="cable" name="Copper Wire" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="battery" name="Li-Ion Battery" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Material Volume Breakdown */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Material Volume Share (Nashik Diversion)
                  </h4>
                  <p className="text-xs text-slate-500">218.4 Tons aggregated across 4,921 lots</p>
                </div>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={volumeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {volumeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Traceability Funnel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Traceability Conversion Funnel
              </h4>
              <p className="text-xs text-slate-500">Drop-off rates from informal registration to circular processing</p>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                  <XAxis dataKey="stage" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#047857" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Circular Impact Dashboard: KPI, Sankey & Price Trends */}
          <div className="pt-2">
            <CircularImpactDashboard />
          </div>
        </div>
      )}

      {/* TAB 2: ANOMALY CENTER */}
      {activeAdminTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Automated Governance & Review Signals
              </h3>
              <p className="text-xs text-slate-500">
                Flags price deviations &gt;25% and calibrated scale variances &gt;20%
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {anomalies.map((anom) => (
              <div
                key={anom.id}
                className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                      SEVERITY: {anom.severity.toUpperCase()}
                    </span>
                    <span className="font-mono font-bold text-sm text-slate-900">
                      Lot {anom.lotNumber}
                    </span>
                    <span className="text-xs text-slate-400">• {anom.createdAt}</span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      anom.status === 'pending_review'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {anom.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 font-medium">
                  {anom.message}
                </p>

                <div className="grid sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Declared / Offered:
                    </span>
                    <span className="font-bold text-slate-900">{anom.declaredValue}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Benchmark Baseline:
                    </span>
                    <span className="font-bold text-emerald-800">{anom.benchmarkValue}</span>
                  </div>
                </div>

                {anom.status === 'pending_review' && (
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleResolveAnomaly(anom.id, 'reviewed_valid')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      Approve (Special Grade Valid)
                    </button>
                    <button
                      onClick={() => handleResolveAnomaly(anom.id, 'escalated')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      Escalate to MPCB Officer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NASHIK GEOSPATIAL MAP */}
      {activeAdminTab === 'geomap' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nashik Circularity Activity Map & Cluster Hotspots
              </h3>
              <p className="text-xs text-slate-500">
                Active aggregation hubs, MIDC facilities, fleet routing, and density clustering across Nashik district
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              District Live Grid (Real-time GPS)
            </span>
          </div>

          {/* Interactive Geographic Map with Live Density, Routes & Verified Facilities */}
          <CollectionMap
            viewMode="admin"
            className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs"
          />
        </div>
      )}

      {/* TAB 4: DATASET MANAGER */}
      {activeAdminTab === 'datasets' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Registered Materials & Pricing Datasets
              </h3>
              <p className="text-xs text-slate-500">
                {materials.length} material categories catalogued in Maharashtra
              </p>
            </div>
            <button
              onClick={handleExportLotsCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Material Category</th>
                  <th className="p-3">Subcategory</th>
                  <th className="p-3">Hazard</th>
                  <th className="p-3">Nashik Range (₹/kg)</th>
                  <th className="p-3">Recovery Potential</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{m.displayName}</td>
                    <td className="p-3 text-slate-600">{m.subcategory}</td>
                    <td className="p-3">
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          m.hazardLevel === 'extreme'
                            ? 'bg-rose-100 text-rose-800'
                            : m.hazardLevel === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {m.hazardLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">
                      ₹{m.typicalPriceRange.min} – ₹{m.typicalPriceRange.max}
                    </td>
                    <td className="p-3 text-slate-600 truncate max-w-xs">
                      {m.criticalMaterialPotential.slice(0, 2).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AI LINEAGE */}
      {activeAdminTab === 'lineage' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Human-in-the-Loop AI Training Lineage
              </h3>
              <p className="text-xs text-slate-500">
                Every collector confirmation feeds into supervised validation for fine-tuning
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-lg">
              91.4% Accuracy Verified
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'log-01',
                image: 'Populated PCB Motherboard',
                geminiPrediction: 'High-Grade Populated PCB (91% confidence)',
                collectorAction: 'Confirmed Correct by Ramesh Patil',
                status: 'Verified Ground Truth',
                timestamp: '05 Sep 2026, 10:36 AM',
              },
              {
                id: 'log-02',
                image: 'Lithium Battery Pack',
                geminiPrediction: 'Lithium-Ion / Li-Po Cells (94% confidence)',
                collectorAction: 'Confirmed Correct + Swollen Alert Checked',
                status: 'Verified Ground Truth',
                timestamp: '05 Sep 2026, 08:22 AM',
              },
              {
                id: 'log-03',
                image: 'Insulated Copper Wire',
                geminiPrediction: 'Insulated Copper Wire (96% confidence)',
                collectorAction: 'Confirmed Correct',
                status: 'Verified Ground Truth',
                timestamp: '04 Sep 2026, 03:16 PM',
              },
            ].map((entry, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">{entry.image}</span>
                    <span className="text-slate-400">• {entry.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Prediction: <strong className="text-slate-800">{entry.geminiPrediction}</strong>
                  </p>
                  <p className="text-emerald-800 font-medium mt-0.5">
                    Action: {entry.collectorAction}
                  </p>
                </div>

                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg shrink-0">
                  {entry.status} ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: DISPUTES & ARBITRATION CENTER */}
      {activeAdminTab === 'disputes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-600" />
                  <span>Fairness & Dispute Mediation Center</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Automated tare discrepancy detection, scale calibration logs, and independent arbitration
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {(['ALL', 'OPEN', 'UNDER_REVIEW', 'RESOLVED'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedDisputeFilter(filter)}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      selectedDisputeFilter === filter
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Dispute List */}
            <div className="space-y-3 pt-2">
              {disputes
                .filter((d) => selectedDisputeFilter === 'ALL' || d.status === selectedDisputeFilter)
                .map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                          {d.id}
                        </span>
                        <span className="font-mono text-xs text-emerald-800 font-bold">
                          Lot: {d.lotNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            d.status === 'OPEN'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : d.status === 'UNDER_REVIEW'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {d.status.replace('_', ' ')}
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        Raised on {d.createdAt}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Dispute Type</span>
                        <span className="font-semibold text-slate-800">{d.disputeType.replace('_', ' ')}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Collector vs Recycler Value</span>
                        <span className="font-semibold text-slate-800">
                          {d.collectorClaimedWeight ? `${d.collectorClaimedWeight} kg (est)` : `₹${d.collectorClaimedAmount}`} vs{' '}
                          {d.recyclerWeighedWeight ? `${d.recyclerWeighedWeight} kg (tare)` : `₹${d.recyclerOfferedAmount}`}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Resolution Status</span>
                        <span className="font-semibold text-emerald-700">
                          {d.resolutionNotes || 'Awaiting platform arbitrator review'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                      <strong className="text-slate-800">Reason:</strong> {d.reason}
                    </p>

                    {/* Action button if open */}
                    {d.status !== 'RESOLVED' && (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            setResolvingDisputeId(d.id);
                            setResolutionText(`Approved 50% variance compensation of ₹140 after calibrated tare recheck.`);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          Resolve & Compensate
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Resolution Modal */}
          {resolvingDisputeId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
                <h4 className="font-bold text-base text-slate-900">Resolve Dispute #{resolvingDisputeId}</h4>
                <p className="text-xs text-slate-500">
                  Enter arbitrator notes and compensation settlement for this lot.
                </p>
                <textarea
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-emerald-500 h-24"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setResolvingDisputeId(null)}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      offlineStore.resolveDispute(resolvingDisputeId, 'RESOLVED', resolutionText);
                      setDisputes(offlineStore.getDisputes());
                      setResolvingDisputeId(null);
                    }}
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
                  >
                    Confirm Settlement
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: PREDICTIVE FLEET & ZONES */}
      {activeAdminTab === 'predictive' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-700" />
                  <span>Nashik Predictive E-Waste Collection Intelligence</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregated urban collection probability models, critical mineral density, and optimal EV routing
                </p>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Active Model: Nashik v3.2</span>
              </div>
            </div>

            {/* Predictive Zones Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictiveZones.map((zone) => (
                <div
                  key={zone.id}
                  className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-emerald-500 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{zone.zoneName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {zone.coordinates.lat.toFixed(4)}° N, {zone.coordinates.lng.toFixed(4)}° E (Privacy Aggregated)
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        zone.urgencyLevel === 'high'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : zone.urgencyLevel === 'medium'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {zone.urgencyLevel} Priority
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Est Volume</span>
                      <span className="text-sm font-extrabold text-slate-800 font-mono">
                        {zone.estimatedAvailableKg} kg
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Confidence</span>
                      <span className="text-sm font-extrabold text-emerald-700 font-mono">
                        {zone.confidenceScore ? (zone.confidenceScore * 100).toFixed(0) : '94'}%
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Hazard Level</span>
                      <span className="text-sm font-extrabold text-amber-700 font-mono">
                        {zone.hazardLevel || 'Medium'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      Primary Material Expected
                    </span>
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{zone.predictedMaterialCategories?.join(', ') || zone.primaryMaterialExpected || 'Mixed PCBs'}</span>
                      <span className="text-emerald-700 font-mono">
                        {zone.recommendedVehicleType ? zone.recommendedVehicleType.replace('_', ' ') : 'Electric 3W Cargo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* EV Routing Strategy */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Optimized 3-Van Dispatch Circuit (Satpur → CIDCO → Panchavati → Ambad MIDC):</span>
                </span>
                <span className="font-mono bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-950">
                  -22.4 km Fleet Mileage (-38% fuel)
                </span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                By grouping collectors by scheduled availability and material density, EV transit times are reduced from 3.8 hours to 1.4 hours per pickup cycle, saving an estimated 16.8 kg CO₂ per circuit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: EPR AUDIT & REGULATORY EXPORT */}
      {activeAdminTab === 'epr' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <span>CPCB & MPCB Extended Producer Responsibility (EPR) Audit Center</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Official verifiable regulatory compliance reports for E-Waste (Management) Rules 2022 Schedule I & II
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const eprData = {
                      filingPeriod: 'FY 2025-26 Q2',
                      regulatoryBody: 'CPCB / Maharashtra Pollution Control Board (MPCB)',
                      region: 'Nashik Industrial Cluster',
                      targetFulfillmentPercentage: 91.8,
                      totalLotsHandled: lots.length,
                      totalWeightKg: lots.reduce((acc, l) => acc + (l.finalWeight || l.approximateWeight), 0),
                      hazardousSubstancesDiverted: {
                        leadKg: 4.8,
                        mercuryGrams: 320,
                        cadmiumGrams: 890,
                      },
                      authorizedRecyclerUnits: recyclers.map((r) => ({
                        id: r.id,
                        name: r.name,
                        mpcbLicense: r.mpcbAuthNumber || r.authorizationNumber,
                        capacity: r.capacityTonsPerMonth || 120,
                      })),
                      generatedTimestamp: new Date().toISOString(),
                    };

                    const blob = new Blob([JSON.stringify(eprData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `CPCB_EPR_Report_Nashik_${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CPCB Audit JSON</span>
                </button>
              </div>
            </div>

            {/* Regulatory Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Mandatory EPR Target
                </span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">
                  91.8%
                </span>
                <span className="text-[10px] text-emerald-600 block mt-1">
                  On track for FY26
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Non-Formal Leakage
                </span>
                <span className="text-xl font-extrabold text-emerald-700 font-mono">
                  0.0% Verified
                </span>
                <span className="text-[10px] text-emerald-600 block mt-1">
                  All lots GPS/QR audited
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Form 6 Manifests
                </span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">
                  {lots.length} Generated
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Immutable cryptographic chain
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Heavy Metals Safely Isolated
                </span>
                <span className="text-xl font-extrabold text-emerald-700 font-mono">
                  6.01 kg
                </span>
                <span className="text-[10px] text-emerald-600 block mt-1">
                  Lead, Cd, Hg zero emissions
                </span>
              </div>
            </div>

            {/* Producer Take-Back Compliance Manifest Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                <span>Recent Regulatory Manifests (CPCB Form 6)</span>
                <span className="text-[11px] font-mono text-slate-500">Auto-Indexed to MPCB Portal</span>
              </div>
              <div className="divide-y divide-slate-100">
                {lots.slice(0, 5).map((l) => (
                  <div key={l.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{l.lotNumber}</span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">{l.materialName}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Collector: {l.collectorName} → Recycler: {l.selectedRecyclerName || 'GreenCycle'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-800 block">
                        {l.finalWeight || l.approximateWeight} kg
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">CPCB COMPLIANT ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
