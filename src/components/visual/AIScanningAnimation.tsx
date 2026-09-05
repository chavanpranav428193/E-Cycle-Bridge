import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Scan,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Flame,
  Layers,
  Search,
} from 'lucide-react';
import { Material } from '../../types';

interface AIScanningAnimationProps {
  imageSrc: string;
  selectedMaterial: Material;
  weightKg: number;
  isScanning: boolean;
  onScanComplete?: () => void;
  confidence?: number;
}

export const AIScanningAnimation: React.FC<AIScanningAnimationProps> = ({
  imageSrc,
  selectedMaterial,
  weightKg,
  isScanning,
  onScanComplete,
  confidence = 94,
}) => {
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStep, setScanStep] = useState<number>(1);
  const [animatedConfidence, setAnimatedConfidence] = useState<number>(0);

  useEffect(() => {
    if (!isScanning) {
      setScanProgress(100);
      setScanStep(7);
      setAnimatedConfidence(confidence);
      return;
    }

    setScanProgress(0);
    setScanStep(1);
    setAnimatedConfidence(0);

    const startTime = performance.now();
    const duration = 2400; // 2.4 seconds total sequence

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setScanProgress(progress);

      // Sequence steps
      if (progress < 25) {
        setScanStep(2); // Scanning line active
      } else if (progress < 50) {
        setScanStep(3); // Detection boxes appear
      } else if (progress < 70) {
        setScanStep(4); // Material category appears
      } else if (progress < 85) {
        setScanStep(5); // Confidence indicator animates
        setAnimatedConfidence(Math.round((progress / 85) * confidence));
      } else if (progress < 98) {
        setScanStep(6); // Estimated value card appears
        setAnimatedConfidence(confidence);
      } else {
        setScanStep(7); // Complete
        setAnimatedConfidence(confidence);
        clearInterval(interval);
        if (onScanComplete) onScanComplete();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isScanning, confidence, onScanComplete]);

  // Demo value calculation for transparent UI
  const lowVal = Math.round(selectedMaterial.baselinePricePerKg * weightKg * 0.95);
  const highVal = Math.round(selectedMaterial.baselinePricePerKg * weightKg * 1.15);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl">
      {/* Image Container with Scan HUD Overlay */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <img
          src={imageSrc}
          alt="E-Waste Analysis Target"
          className="w-full h-full object-cover opacity-85 transition duration-500"
        />

        {/* Dark Vignette and Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#059669_1px,transparent_1px),linear-gradient(to_bottom,#059669_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/80" />

        {/* 1. Laser Scanning Beam (moves vertically) */}
        {isScanning && (
          <div
            className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] transition-all pointer-events-none"
            style={{
              top: `${scanProgress}%`,
              transition: 'top 0.05s linear',
            }}
          >
            <div className="w-full h-12 bg-gradient-to-b from-emerald-500/20 to-transparent -translate-y-12" />
          </div>
        )}

        {/* 2. Detected Component Bounding Boxes (Step 3+) */}
        {scanStep >= 3 && (
          <>
            {/* Box 1: Microcontroller / IC */}
            <div className="absolute top-[28%] left-[24%] w-[26%] h-[32%] border-2 border-emerald-400/90 rounded-xs bg-emerald-500/10 pointer-events-none animate-fadeIn">
              <div className="absolute -top-5 left-0 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-mono text-[9px] px-1.5 py-0.5 rounded-xs flex items-center space-x-1">
                <Cpu className="w-2.5 h-2.5" />
                <span>IC_CHIP_01 • 98%</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r-2 border-b-2 border-emerald-300" />
            </div>

            {/* Box 2: Gold-plated edge connector / trace */}
            <div className="absolute bottom-[18%] right-[20%] w-[34%] h-[24%] border-2 border-amber-400/90 rounded-xs bg-amber-500/10 pointer-events-none animate-fadeIn">
              <div className="absolute -top-5 left-0 bg-amber-950/90 border border-amber-500/50 text-amber-300 font-mono text-[9px] px-1.5 py-0.5 rounded-xs">
                AU_EDGE_PINS • 94%
              </div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r-2 border-b-2 border-amber-300" />
            </div>
          </>
        )}

        {/* Top Scan Status Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono pointer-events-none">
          <div className="bg-slate-950/85 backdrop-blur border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
            <Scan className="w-3.5 h-3.5 animate-spin" />
            <span>
              {isScanning ? 'GEMINI MULTIMODAL SCAN ACTIVE' : 'AI SCAN COMPLETE'}
            </span>
          </div>
          <div className="bg-slate-950/85 backdrop-blur border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg">
            FRAME: 1920x1080 • NASHIK_EWASTE
          </div>
        </div>
      </div>

      {/* Structured Analysis Results Panel */}
      <div className="p-4 sm:p-5 bg-slate-950 text-white space-y-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">
                AI Vision Output
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {scanStep >= 4 ? selectedMaterial.displayName : 'Analyzing features...'}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
              Confidence
            </span>
            <span className="text-lg font-mono font-extrabold text-emerald-400">
              {animatedConfidence}%
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Category
            </span>
            <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate">
              {selectedMaterial.category}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Estimated Weight
            </span>
            <span className="text-xs font-bold text-teal-300 font-mono mt-0.5 block">
              {weightKg > 0 ? `${weightKg} kg` : 'Input weight'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Estimated Value
            </span>
            <span className="text-xs font-bold text-amber-300 font-mono mt-0.5 block">
              ₹{lowVal.toLocaleString('en-IN')} – ₹{highVal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Recommended Route & Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-950/60 border border-emerald-500/30 p-3 rounded-xl">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-200 font-medium">
              Recommended Route: <strong>Authorized Recycler</strong> (EPR Registered)
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 w-fit">
            DEMO ESTIMATE
          </span>
        </div>
      </div>
    </div>
  );
};
