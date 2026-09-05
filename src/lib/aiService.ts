import { MaterialClassificationResult, HazardLevel } from '../types';
import { offlineStore } from './offlineStore';

export interface VoiceParseResult {
  detectedMaterialId?: string;
  detectedMaterialName?: string;
  approxWeight?: number;
  condition?: 'good' | 'mixed' | 'damaged' | 'unknown';
  intent: 'SELL' | 'CHECK_PRICE' | 'SAFETY_QUERY' | 'GENERAL';
  transcript: string;
  confidence: number;
}

export async function classifyMaterialWithAi(
  imageDataBase64?: string,
  hintText?: string
): Promise<MaterialClassificationResult> {
  // If offline or simulated offline, use deterministic demo model immediately
  if (offlineStore.isOffline()) {
    return getDeterministicClassification(hintText);
  }

  try {
    const res = await fetch('/api/ai/classify-material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageDataBase64, hint: hintText }),
    });

    if (!res.ok) {
      throw new Error(`Server AI response error: ${res.status}`);
    }

    const data = await res.json();
    return {
      material: data.material || 'Printed Circuit Boards (PCB)',
      subcategory: data.subcategory || 'Populated PCB',
      confidence: data.confidence || 91,
      hazardLevel: (data.hazardLevel as HazardLevel) || 'medium',
      reasoningSummary:
        data.reasoningSummary ||
        'Green substrate with surface-mount integrated circuits and tin/lead solder points detected.',
      recommendedAction:
        data.recommendedAction ||
        'Segregate into antistatic crate. Do not apply open flame or attempt manual acid stripping.',
      source: data.source || 'GEMINI_AI',
    };
  } catch (err) {
    console.warn('AI classification falling back to deterministic local engine:', err);
    return getDeterministicClassification(hintText);
  }
}

export async function parseVoiceTranscript(
  transcript: string,
  _lang: string = 'hi'
): Promise<VoiceParseResult> {
  try {
    const res = await fetch('/api/ai/voice-parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  // Deterministic local regex/keyword parser for Marathi/Hindi/English
  const lower = transcript.toLowerCase();
  let detectedMaterialId: string | undefined;
  let detectedMaterialName: string | undefined;
  let approxWeight: number | undefined;
  let condition: 'good' | 'mixed' | 'damaged' | 'unknown' = 'mixed';
  let intent: VoiceParseResult['intent'] = 'CHECK_PRICE';

  if (lower.includes('pcb') || lower.includes('circuit') || lower.includes('मदरबोर्ड') || lower.includes('बोर्ड')) {
    detectedMaterialId = 'mat-pcb';
    detectedMaterialName = 'Printed Circuit Boards (PCB)';
  } else if (lower.includes('battery') || lower.includes('बैटरी') || lower.includes('सेल') || lower.includes('बॅटरी')) {
    detectedMaterialId = 'mat-battery';
    detectedMaterialName = 'Lithium-Ion Batteries';
  } else if (lower.includes('wire') || lower.includes('cable') || lower.includes('तार') || lower.includes('केबल') || lower.includes('तांबा')) {
    detectedMaterialId = 'mat-cables';
    detectedMaterialName = 'Copper Cables & Wires';
  } else if (lower.includes('screen') || lower.includes('lcd') || lower.includes('मॉनिटर') || lower.includes('स्क्रीन')) {
    detectedMaterialId = 'mat-lcd';
    detectedMaterialName = 'LCD & LED Panels';
  }

  // Extract weight numbers (e.g., "10 kg", "10 किलो", "5.5 kg")
  const weightMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilo|किलो|कि.ग्रा|kilos)?/);
  if (weightMatch) {
    approxWeight = parseFloat(weightMatch[1]);
  }

  if (lower.includes('sell') || lower.includes('बेचना') || lower.includes('विकायचं') || lower.includes('विकणे')) {
    intent = 'SELL';
  } else if (lower.includes('safe') || lower.includes('खतरा') || lower.includes('धोका') || lower.includes('जळणे')) {
    intent = 'SAFETY_QUERY';
  }

  return {
    detectedMaterialId,
    detectedMaterialName,
    approxWeight,
    condition,
    intent,
    transcript,
    confidence: 88,
  };
}

function getDeterministicClassification(hint?: string): MaterialClassificationResult {
  const lower = (hint || '').toLowerCase();
  if (lower.includes('battery') || lower.includes('cell')) {
    return {
      material: 'Lithium-Ion Batteries',
      subcategory: 'Lithium-Ion / Li-Po Cells',
      confidence: 94,
      hazardLevel: 'extreme',
      reasoningSummary: 'Pouch or prismatic rechargeable battery cells identified. Extreme thermal runaway hazard if damaged.',
      recommendedAction: 'Tape terminal contacts. Do not puncture or expose to heat. Route to authorized R-04 recycler.',
      source: 'DEMO_AI_MODE',
    };
  }

  if (lower.includes('cable') || lower.includes('wire')) {
    return {
      material: 'Copper Cables & Wires',
      subcategory: 'Insulated Copper Wire',
      confidence: 96,
      hazardLevel: 'low',
      reasoningSummary: 'Multi-strand insulated electrical and appliance wiring. High electrolytic copper recovery fraction.',
      recommendedAction: 'Keep dry and bundled. Do not open burn PVC sheath. Route for mechanical cable granulation.',
      source: 'DEMO_AI_MODE',
    };
  }

  // Default to standard high-grade PCB
  return {
    material: 'Printed Circuit Boards (PCB)',
    subcategory: 'High-Grade Populated PCB',
    confidence: 91,
    hazardLevel: 'medium',
    reasoningSummary: 'FR-4 substrate populated with microchips, SMD resistors, and connectors with gold/palladium contacts.',
    recommendedAction: 'Confirm classification below. Store in dry crates with cut-resistant gloves. Avoid mechanical breakage.',
    source: 'DEMO_AI_MODE',
  };
}
