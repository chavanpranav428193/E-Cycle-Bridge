import { z } from 'zod';

export const MaterialClassificationSchema = z.object({
  materialCategory: z.string().min(1, 'Material category is required'),
  subcategory: z.string().optional().default('Standard Grade'),
  confidence: z.number().min(0).max(100),
  hazardLevel: z.enum(['low', 'medium', 'high', 'extreme']),
  visualEvidence: z.array(z.string()).default([]),
  alternativeCategories: z.array(z.string()).default([]),
  reasoningSummary: z.string().optional().default(''),
  recommendedAction: z.string().optional().default(''),
});

export type ValidatedClassification = z.infer<typeof MaterialClassificationSchema>;

export const VoiceParseSchema = z.object({
  intent: z.enum(['SELL', 'CHECK_PRICE', 'SAFETY_QUERY', 'CREATE_LOT', 'GENERAL']),
  detectedMaterialId: z.string().nullable().optional(),
  detectedMaterialName: z.string().nullable().optional(),
  approxWeight: z.number().positive().nullable().optional(),
  unit: z.enum(['kg', 'grams']).default('kg'),
  condition: z.enum(['good', 'mixed', 'damaged', 'unknown']).default('mixed'),
  language: z.enum(['en', 'hi', 'mr']).default('en'),
  confidence: z.number().min(0).max(100).default(85),
  transcript: z.string().default(''),
});

export type ValidatedVoiceParse = z.infer<typeof VoiceParseSchema>;

export const PriceEstimateRequestSchema = z.object({
  materialId: z.string().min(1, 'Material ID is required'),
  weightKg: z.number().positive('Weight must be greater than zero'),
  condition: z.enum(['good', 'mixed', 'damaged', 'unknown']).default('mixed'),
  location: z.string().default('Nashik'),
});

export const CreateLotRequestSchema = z.object({
  collectorId: z.string().default('col-001'),
  collectorName: z.string().default('Ramesh Patil'),
  materialId: z.string().min(1, 'Material is required'),
  materialName: z.string().min(1),
  materialCategory: z.string().min(1),
  subcategory: z.string().default('Standard'),
  approximateWeight: z.number().positive('Weight must be positive'),
  condition: z.enum(['good', 'mixed', 'damaged', 'unknown']).default('mixed'),
  collectionLocation: z.string().default('Nashik Urban Cluster'),
  collectionCoordinates: z.object({
    lat: z.number().default(19.9821),
    lng: z.number().default(73.7645),
  }).default({ lat: 19.9821, lng: 73.7645 }),
  photoUrl: z.string().url().or(z.string().startsWith('data:image')).default('https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'),
  selectedRecyclerId: z.string().optional(),
  selectedRecyclerName: z.string().optional(),
  offeredRatePerKg: z.number().optional(),
  paymentMode: z.enum(['CASH', 'UPI', 'BANK_TRANSFER']).default('UPI'),
});

export const AcceptOfferSchema = z.object({
  lotId: z.string().min(1),
  recyclerId: z.string().min(1),
  ratePerKg: z.number().positive(),
  pickupOffered: z.boolean().default(true),
  pickupDate: z.string().optional(),
});

export const HandoverSchema = z.object({
  lotId: z.string().min(1),
  collectorId: z.string().min(1),
  recyclerId: z.string().min(1),
  verifiedWeight: z.number().positive(),
  photoCaptured: z.boolean().default(true),
  locationRecorded: z.boolean().default(true),
  timestampRecorded: z.boolean().default(true),
  collectorConfirmation: z.boolean().default(true),
  recyclerConfirmation: z.boolean().default(true),
  notes: z.string().optional(),
});

export const PaymentRecordSchema = z.object({
  lotId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER']),
  collectorId: z.string().min(1),
  recyclerId: z.string().min(1),
  referenceNumber: z.string().optional(),
});
