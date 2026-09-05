import React, { useState, useEffect } from 'react';
import {
  Camera,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  X,
  Truck,
  ShieldCheck,
  Zap,
  QrCode,
  Volume2,
  Check,
  Info,
} from 'lucide-react';
import {
  Material,
  Lot,
  RecyclerOffer,
  AppLanguage,
  MaterialClassificationResult,
} from '../../types';
import { apiClient } from '../../lib/apiClient';
import { offlineStore } from '../../lib/offlineStore';
import {
  Button,
  Card,
  Badge,
  StatusBadge,
  Input,
  Select,
  ProgressIndicator,
  ProgressStep,
  PriceCard,
  RecyclerCard,
  QRCard,
  OfflineIndicator,
  ImageUploader,
} from '../ui';
import { AIScanningAnimation } from '../visual/AIScanningAnimation';

interface CreateLotWizardProps {
  language: AppLanguage;
  onCancel: () => void;
  onLotCreated: (lot: Lot) => void;
  initialMaterialId?: string;
  initialWeight?: number;
}

export const CreateLotWizard: React.FC<CreateLotWizardProps> = ({
  language,
  onCancel,
  onLotCreated,
  initialMaterialId,
  initialWeight,
}) => {
  const materials = offlineStore.getMaterials();

  // 9-Step Wizard State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<MaterialClassificationResult | null>(null);

  // Material & Weight
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(() => {
    if (initialMaterialId) {
      const found = materials.find((m) => m.id === initialMaterialId);
      if (found) return found;
    }
    return materials[0];
  });
  const [weightKg, setWeightKg] = useState<number>(initialWeight || 12.0);
  const [condition, setCondition] = useState<'good' | 'mixed' | 'damaged'>('mixed');

  // Pricing & Recyclers
  const [priceData, setPriceData] = useState<any>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [matchedOffers, setMatchedOffers] = useState<RecyclerOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<RecyclerOffer | null>(null);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  // Handover & Payment
  const [pickupMode, setPickupMode] = useState<'PICKUP' | 'DROP_OFF'>('PICKUP');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'BANK_TRANSFER' | 'CASH'>('UPI');
  const [createdLot, setCreatedLot] = useState<Lot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice narration helper (Web Speech API)
  const speakPrompt = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        if (language === 'hi') utterance.lang = 'hi-IN';
        else if (language === 'mr') utterance.lang = 'mr-IN';
        else utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('SpeechSynthesis error:', e);
      }
    }
  };

  const stepsConfig: ProgressStep[] = [
    { id: 1, title: 'Capture Scrap', shortTitle: 'Capture', isCompleted: currentStep > 1, isCurrent: currentStep === 1 },
    { id: 2, title: 'AI Classify', shortTitle: 'AI Classify', isCompleted: currentStep > 2, isCurrent: currentStep === 2 },
    { id: 3, title: 'Confirm Material', shortTitle: 'Confirm', isCompleted: currentStep > 3, isCurrent: currentStep === 3 },
    { id: 4, title: 'Enter Weight', shortTitle: 'Weight', isCompleted: currentStep > 4, isCurrent: currentStep === 4 },
    { id: 5, title: 'Fair Price', shortTitle: 'Fair Price', isCompleted: currentStep > 5, isCurrent: currentStep === 5 },
    { id: 6, title: 'Match Recyclers', shortTitle: 'Match', isCompleted: currentStep > 6, isCurrent: currentStep === 6 },
    { id: 7, title: 'Select Recycler', shortTitle: 'Select', isCompleted: currentStep > 7, isCurrent: currentStep === 7 },
    { id: 8, title: 'Accept Offer', shortTitle: 'Schedule', isCompleted: currentStep > 8, isCurrent: currentStep === 8 },
    { id: 9, title: 'Handover & Pay', shortTitle: 'Payment', isCompleted: currentStep > 9, isCurrent: currentStep === 9 },
  ];

  // Step 1 -> 2: Run AI
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentStep(2);
    try {
      const res = await apiClient.classifyMaterial(photoUrl, selectedMaterial.displayName);
      setAiResult(res);
      // Find matching material
      const matched = materials.find(
        (m) =>
          m.displayName.toLowerCase().includes(res.material.toLowerCase()) ||
          res.material.toLowerCase().includes(m.displayName.toLowerCase())
      );
      if (matched) setSelectedMaterial(matched);
    } catch {
      // Fallback already provided in apiClient
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 4 -> 5: Calculate Price
  const handleCalculatePrice = async () => {
    setIsPricingLoading(true);
    setCurrentStep(5);
    try {
      const p = await apiClient.estimatePrice(selectedMaterial.id, weightKg, condition);
      setPriceData(p);
    } finally {
      setIsPricingLoading(false);
    }
  };

  // Step 5 -> 6 & 7: Match Recyclers
  const handleMatchRecyclers = async () => {
    setIsMatchingLoading(true);
    setCurrentStep(6);
    try {
      const offers = await apiClient.matchRecyclers(selectedMaterial.id, weightKg);
      setMatchedOffers(offers);
      if (offers.length > 0) {
        setSelectedOffer(offers[0]);
      }
      setTimeout(() => {
        setCurrentStep(7);
        setIsMatchingLoading(false);
      }, 700);
    } catch {
      setIsMatchingLoading(false);
      setCurrentStep(7);
    }
  };

  // Step 8: Create Lot & Accept Offer
  const handleConfirmAndSchedule = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        collectorId: 'col-001',
        collectorName: 'Ramesh Patil',
        materialId: selectedMaterial.id,
        materialName: selectedMaterial.displayName,
        materialCategory: selectedMaterial.category,
        subcategory: selectedMaterial.subcategory,
        approximateWeight: weightKg,
        condition,
        photoUrl,
        collectionLocation: 'Nashik Urban Cluster (Panchavati)',
        selectedRecyclerId: selectedOffer?.recyclerId || 'R-01',
        selectedRecyclerName: selectedOffer?.recyclerName || 'EcoCircuits Nashik PVT',
        offeredRatePerKg: selectedOffer?.ratePerKg || priceData?.ratePerKg || 165,
        paymentMode,
      };

      const newLot = await apiClient.createLot(payload);
      setCreatedLot(newLot);

      if (selectedOffer) {
        await apiClient.acceptOffer(selectedOffer.id, {
          lotId: newLot.id,
          recyclerId: selectedOffer.recyclerId,
          ratePerKg: selectedOffer.ratePerKg,
        });
      }

      setCurrentStep(9);
    } catch (err) {
      console.error('Failed to create lot:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 9: Final Handover & Instant Payment
  const handleCompleteHandover = async () => {
    if (!createdLot) return;
    setIsSubmitting(true);
    try {
      await apiClient.confirmHandover({
        lotId: createdLot.id,
        collectorId: createdLot.collectorId,
        recyclerId: createdLot.selectedRecyclerId || 'R-01',
        verifiedWeight: weightKg,
      });

      const finalVal = Math.round((selectedOffer?.ratePerKg || 165) * weightKg);
      await apiClient.recordPayment({
        lotId: createdLot.id,
        amount: finalVal,
        paymentMethod: paymentMode,
        collectorId: createdLot.collectorId,
        recyclerId: createdLot.selectedRecyclerId || 'R-01',
      });

      onLotCreated({
        ...createdLot,
        status: 'PAID',
        paymentStatus: 'PAID',
        finalAmount: finalVal,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <Card variant="elevated" padding="md" className="space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              {currentStep}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Sell E-Waste <span className="text-emerald-400">9-Step Guided Wizard</span>
              </h2>
              <p className="text-xs text-slate-400">
                Informal-to-formal custody verification & transparent fair pricing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <OfflineIndicator />
            <Button variant="ghost" size="sm" onClick={onCancel} leftIcon={<X className="w-4 h-4" />}>
              Exit
            </Button>
          </div>
        </div>

        {/* 9-Step Progress Stepper */}
        <ProgressIndicator
          steps={stepsConfig}
          currentStep={currentStep}
          onStepClick={(s) => s < currentStep && setCurrentStep(s)}
        />
      </Card>

      {/* Step Content Card */}
      <Card variant="elevated" padding="lg" className="min-h-[420px] flex flex-col justify-between">
        {/* ================= STEP 1: CAPTURE SCRAP ================= */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Step 1 of 9: Visual Evidence Capture
              </span>
              <h3 className="text-xl font-bold text-white">Snap or Upload E-Waste Photo</h3>
              <p className="text-xs text-slate-400">
                Our vision AI model identifies electronic scrap grade, PCB population, and hazardous materials.
              </p>
            </div>

            <ImageUploader
              value={photoUrl}
              onChange={(url) => setPhotoUrl(url)}
              label="Scrap Photo (Camera or File)"
            />

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400">Need voice guidance?</span>
              <button
                type="button"
                onClick={() => speakPrompt('कृपया ई कचऱ्याचा फोटो काढा किंवा गॅलरी मधून अपलोड करा')}
                className="text-emerald-400 font-semibold flex items-center gap-1.5 hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen in Marathi / Hindi
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: AI CLASSIFICATION ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Step 2 of 9: Computer Vision Model
              </span>
              <h3 className="text-xl font-bold text-white">AI Material Identification</h3>
            </div>

            {isAnalyzing ? (
              <div className="py-8 text-center space-y-4">
                <AIScanningAnimation className="w-48 h-48 mx-auto" />
                <p className="text-sm font-semibold text-emerald-400 animate-pulse">
                  Analyzing PCB layers, gold finger contacts, and hazard profile...
                </p>
              </div>
            ) : aiResult ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img src={photoUrl} alt="Scrap" className="w-full h-56 object-cover" referrerPolicy="no-referrer" />
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Identified Material:</span>
                      <Badge variant="success">{aiResult.confidence}% AI Confidence</Badge>
                    </div>
                    <h4 className="text-lg font-bold text-white">{aiResult.material}</h4>
                    <p className="text-xs text-slate-400">Subgrade: {aiResult.subcategory}</p>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1 text-xs">
                    <span className="font-bold text-slate-300">Visual Evidence Detected:</span>
                    <p className="text-slate-400 leading-relaxed">{aiResult.reasoningSummary}</p>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 text-xs text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    <span><strong>Safety Guideline:</strong> {aiResult.recommendedAction}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ================= STEP 3: COLLECTOR CONFIRMATION ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Step 3 of 9: Verification
              </span>
              <h3 className="text-xl font-bold text-white">Confirm Material & Condition</h3>
              <p className="text-xs text-slate-400">
                Verify that the AI selected the correct scrap category or select an alternative from the list.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Material Category"
                value={selectedMaterial.id}
                options={materials.map((m) => ({ value: m.id, label: `${m.displayName} (₹${m.typicalPriceRange.median}/kg)` }))}
                onChange={(e) => {
                  const m = materials.find((mat) => mat.id === e.target.value);
                  if (m) setSelectedMaterial(m);
                }}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Physical Condition
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['good', 'mixed', 'damaged'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCondition(c)}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                        condition === c
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-emerald-400">Selected Specification:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Category:</span>
                  <span className="text-white font-medium">{selectedMaterial.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Baseline Rate:</span>
                  <span className="text-white font-medium">₹{selectedMaterial.typicalPriceRange.median} / kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Condition Multiplier:</span>
                  <span className="text-white font-medium">{condition === 'good' ? '+5% (Prime)' : condition === 'mixed' ? 'Standard' : '-15%'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: ENTER WEIGHT ================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Step 4 of 9: Quantity Estimation
              </span>
              <h3 className="text-xl font-bold text-white">Enter or Weigh Scrap Quantity</h3>
              <p className="text-xs text-slate-400">
                Declared weight is verified digitally during custody handover via digital scale.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
                <Scale className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    className="w-32 text-center text-4xl font-extrabold bg-slate-900 border border-slate-700 text-white rounded-xl py-2 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xl font-bold text-slate-400">KG</span>
                </div>
                <p className="text-xs text-slate-400">Tap quick buttons to adjust weight:</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 5, 10, 25, 50].map((kg) => (
                    <button
                      key={kg}
                      type="button"
                      onClick={() => setWeightKg(kg)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        weightKg === kg
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {kg} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 5: FAIR PRICE CALCULATION ================= */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Step 5 of 9: Valuation Engine
              </span>
              <h3 className="text-xl font-bold text-white">Deterministic Fair Market Valuation</h3>
              <p className="text-xs text-slate-400">
                Aggregated from verified Nashik MIDC recycler quotes. No middleman deductions.
              </p>
            </div>

            {priceData ? (
              <PriceCard
                materialName={selectedMaterial.displayName}
                weightKg={weightKg}
                ratePerKg={priceData.ratePerKg}
                estimatedMin={priceData.estimatedMin}
                estimatedMax={priceData.estimatedMax}
                fairPrice={priceData.fairPrice}
                confidence={priceData.confidence}
                formalAdvantage={priceData.formalRouteAdvantage}
                explanationPoints={[
                  `Current Nashik MIDC index: ₹${selectedMaterial.typicalPriceRange.min} – ₹${selectedMaterial.typicalPriceRange.max}/kg`,
                  `Condition applied: ${condition.toUpperCase()}`,
                  `Total transparent valuation: ₹${priceData.fairPrice.toLocaleString()}`,
                ]}
              />
            ) : (
              <div className="py-12 text-center text-slate-400">Calculating fair price...</div>
            )}
          </div>
        )}

        {/* ================= STEP 6: MATCH RECYCLERS ANIMATION ================= */}
        {currentStep === 6 && (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
            <h3 className="text-xl font-bold text-white">Running Weighted Matching Engine</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Evaluating material compatibility (30%), distance (20%), rate (20%), pickup (10%), and regulatory compliance (15%)...
            </p>
          </div>
        )}

        {/* ================= STEP 7: SELECT RECYCLER ================= */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Step 7 of 9: Authorized Recycler Marketplace
              </span>
              <h3 className="text-xl font-bold text-white">Compare & Select Best Recycler</h3>
              <p className="text-xs text-slate-400">
                Ranked by our multi-factor match score. All facilities are CPCB/MPCB certified.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedOffers.map((offer) => (
                <RecyclerCard
                  key={offer.id || offer.recyclerId}
                  offer={offer}
                  isSelected={selectedOffer?.recyclerId === offer.recyclerId}
                  onSelect={() => setSelectedOffer(offer)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 8: ACCEPT OFFER & SCHEDULE ================= */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Step 8 of 9: Finalize Terms
              </span>
              <h3 className="text-xl font-bold text-white">Accept Offer & Schedule Handover</h3>
              <p className="text-xs text-slate-400">
                Lock in this verified quote and select doorstep pickup or drop-off.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase">Accepted Recycler Terms</span>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white">{selectedOffer?.recyclerName}</h4>
                  <p className="text-xs text-slate-400">Distance: {selectedOffer?.distanceKm} km away</p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Agreed Rate:</span>
                    <span className="text-sm font-bold text-emerald-400">₹{selectedOffer?.ratePerKg} / kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Estimated Total:</span>
                    <span className="text-lg font-extrabold text-white">
                      ₹{Math.round((selectedOffer?.ratePerKg || 165) * weightKg).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Handover Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPickupMode('PICKUP')}
                      className={`p-3.5 rounded-xl border text-left space-y-1 transition-all ${
                        pickupMode === 'PICKUP'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Truck className="w-4 h-4 mb-1" />
                      <div className="text-xs font-bold">Doorstep Pickup</div>
                      <div className="text-[11px] opacity-80">Free electric vehicle van</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPickupMode('DROP_OFF')}
                      className={`p-3.5 rounded-xl border text-left space-y-1 transition-all ${
                        pickupMode === 'DROP_OFF'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 mb-1" />
                      <div className="text-xs font-bold">Facility Drop-off</div>
                      <div className="text-[11px] opacity-80">Nashik MIDC center</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Payout Preference</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI', 'BANK_TRANSFER', 'CASH'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMode(m)}
                        className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors ${
                          paymentMode === m
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 9: HANDOVER & INSTANT PAYMENT ================= */}
        {currentStep === 9 && createdLot && (
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Step 9 of 9: Digital Handover & Settlement
              </span>
              <h3 className="text-xl font-bold text-white">Custody Passport & Instant Payment</h3>
              <p className="text-xs text-slate-400">
                Present this QR code to the driver/facility representative during pickup for instant verified settlement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <QRCard
                lotNumber={createdLot.lotNumber}
                materialName={createdLot.materialName}
                weightKg={createdLot.approximateWeight}
                recyclerName={createdLot.selectedRecyclerName}
              />

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-400">Settlement Amount:</span>
                  <span className="text-2xl font-black text-emerald-400">
                    ₹{(createdLot.finalAmount || Math.round((createdLot.offeredRatePerKg || 165) * weightKg)).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Digital scale calibration verified (Nashik Cluster)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>CPCB/MPCB Form 6 manifest auto-generated</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Instant {paymentMode} disbursement ready</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                  onClick={handleCompleteHandover}
                  leftIcon={<ShieldCheck className="w-5 h-5" />}
                >
                  Verify Handover & Receive Payment
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP NAVIGATION BUTTONS ================= */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
          {currentStep > 1 && currentStep < 9 ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep((s) => s - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep === 1 && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartAnalysis}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Analyze Scrap with AI
            </Button>
          )}

          {currentStep === 2 && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(3)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Confirmation
            </Button>
          )}

          {currentStep === 3 && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(4)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Confirm & Enter Weight
            </Button>
          )}

          {currentStep === 4 && (
            <Button
              variant="primary"
              size="md"
              onClick={handleCalculatePrice}
              isLoading={isPricingLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Calculate Fair Price
            </Button>
          )}

          {currentStep === 5 && (
            <Button
              variant="primary"
              size="md"
              onClick={handleMatchRecyclers}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Match Authorized Recyclers
            </Button>
          )}

          {currentStep === 7 && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(8)}
              disabled={!selectedOffer}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue with Selected Recycler
            </Button>
          )}

          {currentStep === 8 && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirmAndSchedule}
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lock Price & Schedule Handover
            </Button>
          )}

          {currentStep === 9 && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => onLotCreated(createdLot!)}
            >
              View in Dashboard
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
