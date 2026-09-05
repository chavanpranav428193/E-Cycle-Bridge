import React from 'react';
import {
  TrendingUp,
  MapPin,
  CheckCircle2,
  Truck,
  QrCode,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { StatusBadge } from './Badge';
import { Lot, RecyclerOffer, MaterialClassificationResult } from '../../types';

// 1. PriceCard
export interface PriceCardProps {
  materialName: string;
  weightKg: number;
  ratePerKg: number;
  estimatedMin: number;
  estimatedMax: number;
  fairPrice: number;
  confidence?: 'high' | 'medium' | 'low';
  formalAdvantage?: {
    informalScrapDealerPrice: number;
    formalRecyclerPrice: number;
    netGain: number;
  };
  explanationPoints?: string[];
  className?: string;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  materialName,
  weightKg,
  ratePerKg,
  estimatedMin,
  estimatedMax,
  fairPrice,
  confidence = 'high',
  formalAdvantage,
  explanationPoints = [],
  className = '',
}) => {
  return (
    <Card variant="elevated" padding="lg" className={`border-emerald-500/30 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Deterministic Fair Price Estimate
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">{materialName}</h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          Confidence: {confidence.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">Benchmark Rate</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">₹{ratePerKg}<span className="text-xs text-slate-400 font-normal"> / kg</span></p>
          <span className="text-[11px] text-slate-400">Nashik MIDC index</span>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">Total Fair Valuation</span>
          <p className="text-2xl font-bold text-white mt-1">₹{fairPrice.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">For {weightKg} kg scrap</span>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">Verified Bid Range</span>
          <p className="text-lg font-bold text-slate-200 mt-1">₹{estimatedMin} – ₹{estimatedMax}</p>
          <span className="text-[11px] text-slate-400">Range across 4 facilities</span>
        </div>
      </div>

      {formalAdvantage && (
        <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Transparent Formal Route Advantage
            </span>
            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md">
              +₹{formalAdvantage.netGain} Extra
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="text-slate-400">
              Informal scrap dealer offer: <span className="text-slate-300 font-semibold line-through">₹{formalAdvantage.informalScrapDealerPrice}</span>
            </div>
            <div className="text-emerald-300">
              Authorized Recycler net: <span className="font-bold text-white">₹{formalAdvantage.formalRecyclerPrice}</span>
            </div>
          </div>
        </div>
      )}

      {explanationPoints.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
          {explanationPoints.map((point, i) => (
            <p key={i} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {point}
            </p>
          ))}
        </div>
      )}
    </Card>
  );
};

// 2. RecyclerCard (Match offer)
export interface RecyclerCardProps {
  offer: RecyclerOffer;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export const RecyclerCard: React.FC<RecyclerCardProps> = ({
  offer,
  isSelected,
  onSelect,
  className = '',
}) => {
  return (
    <Card
      variant={isSelected ? 'elevated' : 'default'}
      padding="md"
      className={`relative transition-all duration-200 ${
        isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'hover:border-slate-700'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white text-base">{offer.recyclerName}</h4>
            <StatusBadge status={offer.authorizationStatus} size="sm" />
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {offer.distanceKm} km away • Platform score: {offer.reliabilityScore}/100
          </p>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {offer.matchScore}% Match
          </div>
          <p className="text-lg font-bold text-emerald-400 mt-1">₹{offer.ratePerKg}/kg</p>
        </div>
      </div>

      <div className="my-3 py-2 border-y border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-slate-400" />
          {offer.pickupOffered ? 'Doorstep EV pickup included' : 'Self drop-off required'}
        </span>
        <span className="font-semibold text-white">
          Est. total: ₹{offer.totalEstimatedAmount.toLocaleString()}
        </span>
      </div>

      {offer.matchReasons && (
        <ul className="text-xs text-slate-400 space-y-1 mb-4">
          {offer.matchReasons.slice(0, 3).map((r, i) => (
            <li key={i} className="flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> {r.replace(/^✓\s*/, '')}
            </li>
          ))}
        </ul>
      )}

      {onSelect && (
        <Button
          variant={isSelected ? 'primary' : 'outline'}
          size="sm"
          className="w-full"
          onClick={onSelect}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          {isSelected ? 'Selected Recycler' : 'Select Offer'}
        </Button>
      )}
    </Card>
  );
};

// 3. LotCard
export interface LotCardProps {
  lot: Lot;
  onClick?: () => void;
  className?: string;
}

export const LotCard: React.FC<LotCardProps> = ({ lot, onClick, className = '' }) => {
  return (
    <Card
      variant="interactive"
      padding="md"
      onClick={onClick}
      className={`space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {lot.lotNumber}
        </span>
        <StatusBadge status={lot.status} size="sm" />
      </div>

      <div className="flex items-center gap-3">
        {lot.photoUrl ? (
          <img
            src={lot.photoUrl}
            alt={lot.materialName}
            className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-white text-sm truncate">{lot.materialName}</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {lot.approximateWeight} kg • {lot.condition.toUpperCase()}
          </p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            {lot.collectionLocation}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          {lot.selectedRecyclerName ? lot.selectedRecyclerName : 'Matching Recyclers...'}
        </span>
        <span className="font-bold text-white">
          ₹{(lot.finalAmount || Math.round((lot.estimatedValueMin + lot.estimatedValueMax) / 2)).toLocaleString()}
        </span>
      </div>
    </Card>
  );
};

// 4. TransactionCard
export interface TransactionCardProps {
  tx: any;
  onClick?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ tx, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-4"
    >
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-300">{tx.lotNumber || tx.id}</span>
          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            {tx.paymentStatus || 'PAID'}
          </span>
        </div>
        <p className="text-sm font-semibold text-white truncate">{tx.materialName}</p>
        <p className="text-xs text-slate-400">
          {tx.recyclerName} • Method: {tx.paymentMethod}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-base font-bold text-emerald-400">₹{Number(tx.finalAmount).toLocaleString()}</p>
        <p className="text-[11px] text-slate-400">{tx.weightKg} kg</p>
      </div>
    </div>
  );
};

// 5. QRCard
export interface QRCardProps {
  lotNumber: string;
  materialName: string;
  weightKg: number;
  recyclerName?: string;
  qrCodeUrl?: string;
  className?: string;
}

export const QRCard: React.FC<QRCardProps> = ({
  lotNumber,
  materialName,
  weightKg,
  recyclerName = 'EcoCircuits Nashik PVT',
  qrCodeUrl,
  className = '',
}) => {
  const generatedQr =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      `ECYCLE-LOT:${lotNumber}|WEIGHT:${weightKg}|MAT:${materialName}|TIME:${new Date().toISOString()}`
    )}`;

  return (
    <Card variant="elevated" padding="md" className={`text-center space-y-4 max-w-xs mx-auto ${className}`}>
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">
          Custody Handover Passport
        </span>
        <h4 className="text-base font-bold text-white font-mono">{lotNumber}</h4>
      </div>

      <div className="bg-white p-3 rounded-2xl inline-block shadow-inner">
        <img
          src={generatedQr}
          alt={`QR for lot ${lotNumber}`}
          className="w-40 h-40 mx-auto"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-1 text-xs text-slate-300 border-t border-slate-800 pt-3">
        <p className="font-semibold text-white">{materialName} ({weightKg} kg)</p>
        <p className="text-slate-400 text-[11px]">Authorized recipient: {recyclerName}</p>
        <p className="text-emerald-400 text-[10px] font-mono mt-1 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Cryptographically stamped
        </p>
      </div>
    </Card>
  );
};

// 6. AIResultCard
export interface AIResultCardProps {
  result: MaterialClassificationResult;
  onConfirm?: () => void;
  onRetake?: () => void;
  className?: string;
}

export const AIResultCard: React.FC<AIResultCardProps> = ({
  result,
  onConfirm,
  onRetake,
  className = '',
}) => {
  return (
    <Card variant="elevated" padding="lg" className={`border-emerald-500/40 ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            AI Classification Analysis
          </span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {result.confidence}% Match
        </span>
      </div>

      <div className="my-4 space-y-1">
        <h3 className="text-xl font-bold text-white">{result.material}</h3>
        <p className="text-xs text-slate-400 font-medium">Subcategory: {result.subcategory}</p>
      </div>

      <div className="space-y-3 text-xs bg-slate-950/70 p-4 rounded-xl border border-slate-800">
        <div>
          <span className="font-semibold text-slate-300">Reasoning Evidence:</span>
          <p className="text-slate-400 mt-0.5 leading-relaxed">{result.reasoningSummary}</p>
        </div>

        <div className="pt-2 border-t border-slate-800/80">
          <span className="font-semibold text-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Recommended Collector Safety:
          </span>
          <p className="text-amber-200/90 mt-0.5">{result.recommendedAction}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        {onRetake && (
          <Button variant="outline" size="sm" onClick={onRetake} className="flex-1">
            Retake / Change
          </Button>
        )}
        {onConfirm && (
          <Button variant="primary" size="sm" onClick={onConfirm} className="flex-1">
            Confirm & Proceed
          </Button>
        )}
      </div>
    </Card>
  );
};
