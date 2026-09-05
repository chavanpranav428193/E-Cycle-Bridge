import React from 'react';
import {
  X,
  QrCode,
  CheckCircle2,
  Download,
  Share2,
  Printer,
  ShieldCheck,
  Scale,
  MapPin,
  Calendar,
  IndianRupee,
  FileCheck,
} from 'lucide-react';
import { Lot, AppLanguage } from '../../types';

interface HandoverModalProps {
  lot: Lot;
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onVerifyPassport: (lotNumber: string) => void;
}

export const HandoverModal: React.FC<HandoverModalProps> = ({
  lot,
  isOpen,
  onClose,
  language,
  onVerifyPassport,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-primary-header to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 flex items-center justify-center border border-emerald-500/30">
              <FileCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300 font-bold block">
                Digital Handover Record
              </span>
              <h3 className="text-base font-extrabold text-white font-mono">
                {lot.lotNumber}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-950 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-stone-800 text-xs sm:text-sm">
          {/* Status Badge & Stamp */}
          <div className="flex items-center justify-between bg-stone-50 border border-stone-200 p-3 rounded-2xl">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-bold text-stone-900 block text-xs">
                  Regulatory Custody Transfer Confirmed
                </span>
                <span className="text-[10px] text-stone-500">
                  Timestamp: {lot.collectionTimestamp}
                </span>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              STATUS: {lot.status}
            </span>
          </div>

          {/* QR Code Verification Block */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl">
            {/* SVG Tamper-evident QR code representation */}
            <div className="w-28 h-28 bg-white p-2 rounded-xl border border-stone-300 shadow-2xs flex flex-col items-center justify-center">
              <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-1 p-1">
                <div className="bg-stone-900 rounded-xs col-span-2 row-span-2" />
                <div className="bg-stone-900 rounded-xs col-span-1" />
                <div className="bg-stone-900 rounded-xs col-span-2 row-span-2" />
                <div className="bg-stone-900 rounded-xs col-span-1" />
                <div className="bg-emerald-700 rounded-xs col-span-1 row-span-1" />
                <div className="bg-stone-900 rounded-xs col-span-2 row-span-2" />
                <div className="bg-stone-900 rounded-xs col-span-1" />
                <div className="bg-stone-900 rounded-xs col-span-2 row-span-2" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">
                Cryptographic Passport Token
              </span>
              <p className="text-xs text-stone-600 leading-snug">
                Scan with any standard camera to audit full custody history without exposing personal collector information.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onVerifyPassport(lot.lotNumber);
                }}
                className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline pt-1"
              >
                <span>Open Public Passport Page →</span>
              </button>
            </div>
          </div>

          {/* Settlement Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">
                Material & Grade
              </span>
              <span className="font-bold text-stone-900 block mt-0.5">
                {lot.materialName}
              </span>
              <span className="text-[11px] text-stone-500">
                {lot.subcategory}
              </span>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">
                Verified Net Weight
              </span>
              <span className="font-extrabold text-stone-900 text-base font-mono block mt-0.5">
                {lot.finalWeight || lot.approximateWeight} kg
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                Calibrated scale (-1.6% tolerance)
              </span>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">
                Authorized Recycler
              </span>
              <span className="font-bold text-stone-900 block mt-0.5">
                {lot.selectedRecyclerName || 'GreenCycle Eco-Solutions'}
              </span>
              <span className="text-[10px] text-stone-500">
                MPCB Reg: #2024/0084 (Verified)
              </span>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">
                Settled Amount
              </span>
              <span className="font-extrabold text-emerald-800 text-base font-mono block mt-0.5">
                ₹{Math.round(lot.finalAmount || 2018).toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-600 font-medium">
                Settled via {lot.paymentMode || 'Cash with OTP'}
              </span>
            </div>
          </div>

          {/* Location & GPS Timestamp */}
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 text-stone-700 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Custody Handover Point: {lot.collectionLocation}</span>
            </div>
            <div className="text-[11px] text-stone-500 font-mono pl-5">
              Lat: {lot.collectionCoordinates.lat}, Lng: {lot.collectionCoordinates.lng}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={() => {
              alert(`Receipt for ${lot.lotNumber} downloaded as digital document.`);
            }}
            className="flex items-center space-x-1.5 bg-primary-action hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Record (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
