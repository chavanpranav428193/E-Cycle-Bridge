/**
 * E-Cycle Bridge Type Definitions
 * SIH 229: Informal E-Waste to Formal Recycling Platform
 */

export type UserRole = 'collector' | 'recycler' | 'admin' | 'public' | 'landing';
export type AppLanguage = 'en' | 'hi' | 'mr';

export type HazardLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface LocalizedString {
  en: string;
  hi: string;
  mr: string;
}

export interface Material {
  id: string;
  category: string;
  subcategory: string;
  displayName: string;
  localizedNames: LocalizedString;
  description: string;
  hazardLevel: HazardLevel;
  acceptedByRecyclerTypes: string[];
  unit: 'kg' | 'unit';
  typicalPriceRange: {
    min: number;
    max: number;
    median: number;
  };
  safetyInstructions: string[];
  criticalMaterialPotential: string[];
  sampleImage: string;
}

export interface PriceRecord {
  id: string;
  materialId: string;
  materialCategory: string;
  subcategory: string;
  city: string;
  area: string;
  date: string;
  buyingPrice: number;
  sellingPrice: number;
  unit: string;
  currency: string;
  recyclerId?: string;
  recyclerName?: string;
  sourceType: 'prototype_market_median' | 'authorized_quote' | 'historical_average';
  confidence: 'high' | 'medium' | 'low';
}

export interface RecyclerContact {
  phone: string;
  email: string;
  contactPerson: string;
}

export interface RecyclerCoordinates {
  lat: number;
  lng: number;
}

export type RecyclerAuthStatus = 'verified' | 'pending_review' | 'in_renewal' | 'suspended';

export interface Recycler {
  id: string;
  name: string;
  companyName?: string;
  logo: string;
  facilityLocation: string;
  city: string;
  district: string;
  state: string;
  coordinates: RecyclerCoordinates;
  materialsAccepted: string[];
  authorizationStatus: RecyclerAuthStatus;
  authorizationNumber: string;
  authorizationType: string;
  authorizationValidUntil: string;
  contact: RecyclerContact;
  serviceArea: string[];
  pickupAvailable: boolean;
  pickupRadius: number; // in km
  offeredRates: Record<string, number>; // materialId -> ₹/unit
  operatingHours: string;
  platformReliabilityScore: number; // 0 - 100
  successfulTransactions: number;
  cancellationRate: number; // percentage
  paymentReliability: number; // percentage
  averageSettlementVariance: number; // percentage (e.g. 1.2%)
  collectorRating: number; // 1-5
  status: 'active' | 'inactive';
  mpcbAuthNumber?: string;
  capacityTonsPerMonth?: number;
}

export interface CollectorProfile {
  id: string;
  displayName: string;
  preferredLanguage: AppLanguage;
  generalOperatingArea: string;
  phoneOptional?: string;
  joinedAt: string;
  totalTransactions: number;
  totalWeight: number; // in kg
  totalEarnings: number; // in INR
  pendingPayments: number;
  formalizationScore: number; // 0 - 100
  safetyTrainingStatus: {
    battery: boolean;
    crt: boolean;
    sorting: boolean;
  };
  digitalCredentialStatus: 'VERIFIED' | 'IN_PROGRESS';
}

export type LotStatus =
  | 'DRAFT'
  | 'CREATED'
  | 'VALUED'
  | 'OFFER_RECEIVED'
  | 'OFFER_ACCEPTED'
  | 'PICKUP_SCHEDULED'
  | 'IN_TRANSIT'
  | 'HANDOVER_PENDING'
  | 'HANDED_OVER'
  | 'RECEIVED'
  | 'WEIGHED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'RECYCLED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED';

export interface Lot {
  id: string;
  lotNumber: string;
  collectorId: string;
  collectorName: string;
  materialId: string;
  materialName: string;
  materialCategory: string;
  subcategory: string;
  description: string;
  photoUrl: string;
  approximateWeight: number; // kg
  condition: 'good' | 'mixed' | 'damaged' | 'unknown';
  sourceType: string;
  collectionLocation: string;
  collectionCoordinates: {
    lat: number;
    lng: number;
  };
  collectionTimestamp: string;
  estimatedValueMin: number;
  estimatedValueMax: number;
  priceConfidence: 'high' | 'medium' | 'low';
  fairPriceScore: number;
  status: LotStatus;
  selectedRecyclerId?: string;
  selectedRecyclerName?: string;
  offeredRatePerKg?: number;
  finalWeight?: number;
  finalAmount?: number;
  paymentMode?: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  paymentStatus?: 'PENDING' | 'PAID' | 'PARTIAL' | 'DISPUTED';
  pickupScheduledDate?: string;
  createdAt: string;
  updatedAt: string;
  anomalyFlag?: boolean;
  batteryPassport?: {
    batteryId?: string;
    chemistry?: string;
    stateOfHealthPercentage?: number;
    recommendedCircularityPath?: string;
    cellChemistry?: 'LCO' | 'NMC' | 'LFP' | 'LMO' | 'Unknown';
    healthStatus?: 'functional' | 'degraded' | 'swollen_hazard';
    nominalVoltage?: string;
    criticalMinerals?: { name: string; percentage: number; estimatedGrams: number }[];
    safeHandlingStep?: string;
    storageRequirement?: string;
  };
}

export interface TraceabilityEvent {
  id: string;
  lotId: string;
  lotNumber: string;
  eventType:
    | 'lotCreated'
    | 'materialIdentified'
    | 'priceEstimated'
    | 'offerReceived'
    | 'offerAccepted'
    | 'pickupScheduled'
    | 'pickupStarted'
    | 'handoverInitiated'
    | 'handoverVerified'
    | 'recyclerReceived'
    | 'finalWeightRecorded'
    | 'paymentConfirmed'
    | 'processingStarted'
    | 'recoveryReported'
    | 'recyclingCompleted';
  title: string;
  actorId: string;
  actorRole: 'collector' | 'recycler' | 'admin' | 'system';
  actorName: string;
  timestamp: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  verificationMethod: 'QR' | 'GPS_TIMESTAMP' | 'DIGITAL_SIGN' | 'DIGITAL_SIGNATURE' | 'REGULATORY_LOG' | 'SYSTEM_AUDIT';
  notes?: string;
}

export interface RecyclerOffer {
  id: string;
  lotId: string;
  recyclerId: string;
  recyclerName: string;
  ratePerKg: number;
  totalEstimatedAmount: number;
  pickupOffered: boolean;
  distanceKm: number;
  reliabilityScore: number;
  authorizationStatus: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  matchScore: number;
  matchReasons: string[];
  createdAt: string;
}

export interface SafetyGuide {
  id: string;
  category: string;
  title: LocalizedString;
  dangerLevel: HazardLevel;
  doList: LocalizedString[];
  dontList: LocalizedString[];
  ifDamagedWarning: LocalizedString;
  iconName: string;
}

export interface AnomalyRecord {
  id: string;
  lotId: string;
  lotNumber: string;
  type: 'price_deviation' | 'weight_variance' | 'rapid_cancellation' | 'location_discrepancy';
  severity: 'high' | 'medium' | 'low';
  message: string;
  deviationPercentage: number;
  declaredValue: string;
  benchmarkValue: string;
  status: 'pending_review' | 'reviewed_valid' | 'escalated';
  createdAt: string;
}

export interface OfflineAction {
  clientActionId: string;
  createdAt: string;
  actionType: 'CREATE_LOT' | 'ACCEPT_OFFER' | 'CONFIRM_HANDOVER' | 'RECORD_PAYMENT';
  entityId: string;
  payload: any;
  syncStatus: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'CONFLICT';
}

export interface MaterialClassificationResult {
  material: string;
  subcategory: string;
  confidence: number;
  hazardLevel: HazardLevel;
  reasoningSummary: string;
  recommendedAction: string;
  source: 'GEMINI_AI' | 'DEMO_AI_MODE';
}

export interface TransactionDispute {
  id: string;
  lotId?: string;
  lotNumber: string;
  collectorId?: string;
  collectorName?: string;
  recyclerId?: string;
  recyclerName?: string;
  raisedBy?: 'collector' | 'recycler';
  raisedByName?: string;
  counterpartyName?: string;
  disputeType?: 'WEIGHT_DISCREPANCY' | 'PRICE_DISPUTE' | 'PAYMENT_DELAY' | 'MATERIAL_MISCLASSIFICATION' | string;
  category?:
    | 'weight_mismatch'
    | 'price_mismatch'
    | 'payment_pending'
    | 'pickup_failure'
    | 'material_classification'
    | 'recycler_rejection'
    | 'damaged_material';
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED';
  description?: string;
  reason?: string;
  collectorClaimedWeight?: number;
  recyclerWeighedWeight?: number;
  claimedAmount?: number;
  disputedWeightVariance?: number;
  createdAt: string;
  updatedAt?: string;
  resolutionNotes?: string;
}

export interface DataDestructionRecord {
  id: string;
  lotId?: string;
  lotNumber?: string;
  deviceType: string;
  deviceCount?: number;
  serialOrImei?: string;
  serialNumbers?: string[];
  clientEnterpriseName?: string;
  destructionMethod: 'NIST_800_88_PURGE' | 'Degaussing' | 'Physical_Shredding' | string;
  destructionStandard?: 'NIST_800_88_PURGE' | 'PHYSICAL_SHREDDING' | 'DEGAUSSING' | 'DOD_5220_22_M' | string;
  facilityId?: string;
  facilityName?: string;
  facilityLocation?: string;
  supervisedByOfficer?: string;
  verificationHash?: string;
  verifiedByRecyclerId?: string;
  recyclerName?: string;
  certificateNumber: string;
  timestamp: string;
  status?: 'ISSUED' | 'IN_PROGRESS' | 'CERTIFIED';
  destructionStatus?: 'IN_PROGRESS' | 'CERTIFIED';
  notes?: string;
}

export interface DocumentAIExtraction {
  id: string;
  docType?: 'weighbridge_slip' | 'invoice' | 'authorization_certificate' | 'handover_receipt' | string;
  documentType?: string;
  fileName: string;
  extractedData?: {
    weightKg?: number;
    amount?: number;
    partyName?: string;
    certificateNumber?: string;
    validUntil?: string;
    confidence: number;
  };
  extractedWeightKg?: number;
  extractedPricePerKg?: number;
  extractedMaterialCategory?: string;
  extractedSlipNumber?: string;
  confidenceScore?: number;
  status: 'AI_EXTRACTED_REQUIRES_VERIFICATION' | 'VERIFIED' | 'CONFIRMED' | string;
  uploadedAt?: string;
  timestamp?: string;
}

export interface PredictiveZone {
  id: string;
  zoneName: string;
  cluster: string;
  coordinates: { lat: number; lng: number };
  estimatedAvailableKg: number;
  estimatedKgAvailable?: number;
  predictedMaterialCategories?: string[];
  primaryMaterialExpected?: string;
  urgencyLevel: 'high' | 'medium' | 'low';
  confidenceScore?: number;
  hazardLevel?: string;
  recommendedVehicleType?: string;
  recommendedFleetRoute?: string;
  isDemoPrediction: true;
}

export interface BatteryPassportInfo {
  cellChemistry: 'LCO' | 'NMC' | 'LFP' | 'LMO' | 'Unknown';
  healthStatus: 'functional' | 'degraded' | 'swollen_hazard';
  nominalVoltage: string;
  criticalMinerals: { name: string; percentage: number; estimatedGrams: number }[];
  safeHandlingStep: string;
  storageRequirement: string;
}

export type StakeholderAccessRole =
  | 'collector'
  | 'recycler'
  | 'enterprise_generator'
  | 'admin_auditor'
  | 'sih_evaluator';

export interface AccessRequest {
  id: string;
  applicantName: string;
  emailOrPhone: string;
  organization?: string;
  roleRequested: StakeholderAccessRole;
  jurisdictionOrCluster: string;
  authorizationNumber?: string;
  requestedPurpose: string;
  estimatedVolumePerMonth?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  generatedPassCode?: string;
  createdAt: string;
  approvedAt?: string;
  reviewNotes?: string;
}

