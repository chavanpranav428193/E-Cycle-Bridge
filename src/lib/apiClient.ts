import { offlineStore } from './offlineStore';
import { calculateLotPrice } from './priceEngine';
import { matchRecyclersForLot } from './matchingEngine';
import {
  Lot,
  Recycler,
  Material,
  TraceabilityEvent,
  AnomalyRecord,
  MaterialClassificationResult,
  RecyclerOffer,
  TransactionDispute,
  DataDestructionRecord,
  DocumentAIExtraction,
  PredictiveZone,
} from '../types';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (offlineStore.isOffline()) {
      throw new Error('OFFLINE_MODE');
    }

    try {
      const res = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
        ...options,
      });

      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.error?.message || `Request failed with status ${res.status}`);
      }
      return json.data as T;
    } catch (err: any) {
      if (err.message === 'OFFLINE_MODE' || err.name === 'TypeError' || !navigator.onLine) {
        throw new Error('OFFLINE_MODE');
      }
      throw err;
    }
  }

  // 1. AI Material Classification
  public async classifyMaterial(image?: string, hint?: string): Promise<MaterialClassificationResult> {
    if (offlineStore.isOffline()) {
      // Return deterministic fallback
      return {
        material: 'Printed Circuit Boards (PCB)',
        subcategory: 'High-Grade Populated PCB',
        confidence: 93,
        hazardLevel: 'medium',
        reasoningSummary: 'Offline identification mode: high-grade electronic circuit substrate detected.',
        recommendedAction: 'Store in dry antistatic container. Do not heat or crush manually.',
        source: 'DEMO_AI_MODE',
      };
    }

    try {
      const data = await this.request<any>('/api/ai/classify-material', {
        method: 'POST',
        body: JSON.stringify({ image, hint }),
      });
      return {
        material: data.displayName || data.materialCategory || 'Printed Circuit Boards (PCB)',
        subcategory: data.subcategory || 'Standard Grade',
        confidence: data.confidence || 92,
        hazardLevel: data.hazardLevel || 'medium',
        reasoningSummary: data.reasoningSummary || 'Scanned e-waste component identified with high recovery value.',
        recommendedAction: data.recommendedAction || 'Keep dry and handle with protective cut-resistant gloves.',
        source: data.source || 'GEMINI_AI',
      };
    } catch {
      return {
        material: 'Printed Circuit Boards (PCB)',
        subcategory: 'High-Grade Populated PCB',
        confidence: 91,
        hazardLevel: 'medium',
        reasoningSummary: 'Offline prototype classification applied.',
        recommendedAction: 'Store safely in dry container.',
        source: 'DEMO_AI_MODE',
      };
    }
  }

  // 2. AI Voice Parsing
  public async parseVoice(transcript: string) {
    if (offlineStore.isOffline()) {
      let detectedMat = 'mat-pcb';
      let detectedName = 'Printed Circuit Boards (PCB)';
      let intent: 'SELL' | 'CHECK_PRICE' | 'SAFETY_QUERY' = 'SELL';
      const lower = transcript.toLowerCase();
      if (lower.includes('battery') || lower.includes('cell') || lower.includes('बैटरी')) {
        detectedMat = 'mat-battery';
        detectedName = 'Lithium-Ion Batteries';
      } else if (lower.includes('wire') || lower.includes('cable') || lower.includes('तार')) {
        detectedMat = 'mat-cables';
        detectedName = 'Copper Cables & Wires';
      }
      if (lower.includes('rate') || lower.includes('price') || lower.includes('भाव')) {
        intent = 'CHECK_PRICE';
      } else if (lower.includes('safe') || lower.includes('hazard') || lower.includes('सुरक्षा')) {
        intent = 'SAFETY_QUERY';
      }
      return {
        intent,
        detectedMaterialId: detectedMat,
        detectedMaterialName: detectedName,
        approxWeight: 10,
        unit: 'kg',
        condition: 'mixed',
        language: 'hi',
        confidence: 90,
        transcript,
      };
    }

    try {
      return await this.request<any>('/api/ai/voice-parse', {
        method: 'POST',
        body: JSON.stringify({ transcript }),
      });
    } catch {
      return {
        intent: 'SELL',
        detectedMaterialId: 'mat-pcb',
        detectedMaterialName: 'Printed Circuit Boards (PCB)',
        approxWeight: 12,
        unit: 'kg',
        condition: 'good',
        language: 'en',
        confidence: 88,
        transcript,
      };
    }
  }

  // 3. Price Estimation
  public async estimatePrice(materialId: string, weightKg: number, condition: string = 'mixed', location: string = 'Nashik') {
    try {
      return await this.request<any>('/api/price/estimate', {
        method: 'POST',
        body: JSON.stringify({ materialId, weightKg, condition, location }),
      });
    } catch {
      // Offline fallback using priceEngine.ts
      const material = offlineStore.getMaterials().find((m) => m.id === materialId) || offlineStore.getMaterials()[0];
      const res = calculateLotPrice(material, weightKg, condition as any, location);
      return {
        materialId: material.id,
        materialName: material.displayName,
        weightKg,
        ratePerKg: res.ratePerKg,
        estimatedMin: res.estimatedMin,
        estimatedMax: res.estimatedMax,
        fairPrice: res.expectedMedian,
        confidence: res.confidence,
        dataFreshness: 'Offline cached benchmark',
        observationCount: 24,
        location,
        formalRouteAdvantage: {
          informalScrapDealerPrice: res.formalRoute.informalSale,
          formalRecyclerPrice: res.formalRoute.formalOffer,
          netGain: res.formalRoute.netAdvantage,
        },
      };
    }
  }

  // 4. Recycler Matching
  public async matchRecyclers(materialId: string, weightKg: number, coords?: { lat: number; lng: number }): Promise<RecyclerOffer[]> {
    try {
      return await this.request<RecyclerOffer[]>('/api/recyclers/match', {
        method: 'POST',
        body: JSON.stringify({
          materialId,
          weightKg,
          collectorLat: coords?.lat,
          collectorLng: coords?.lng,
        }),
      });
    } catch {
      const material = offlineStore.getMaterials().find((m) => m.id === materialId) || offlineStore.getMaterials()[0];
      const recyclers = offlineStore.getRecyclers();
      return matchRecyclersForLot(`temp-${Date.now()}`, material, weightKg, coords, recyclers);
    }
  }

  // 5. Create Lot
  public async createLot(lotPayload: any): Promise<Lot> {
    try {
      const created = await this.request<Lot>('/api/lots', {
        method: 'POST',
        body: JSON.stringify(lotPayload),
      });
      // Synchronize with offlineStore so other tabs/components update
      offlineStore.addLot(created);
      return created;
    } catch {
      // Offline fallback
      const lots = offlineStore.getLots();
      const nextSeq = String(lots.length + 185).padStart(6, '0');
      const referenceId = `EC-2026-${nextSeq}`;
      const fallbackLot: Lot = {
        id: `lot-${Date.now()}`,
        lotNumber: referenceId,
        collectorId: lotPayload.collectorId || 'col-001',
        collectorName: lotPayload.collectorName || 'Ramesh Patil',
        materialId: lotPayload.materialId,
        materialName: lotPayload.materialName,
        materialCategory: lotPayload.materialCategory || 'Electronics',
        subcategory: lotPayload.subcategory || 'Standard Grade',
        description: `${lotPayload.approximateWeight} kg of ${lotPayload.materialName}`,
        photoUrl: lotPayload.photoUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        approximateWeight: lotPayload.approximateWeight,
        condition: lotPayload.condition || 'mixed',
        sourceType: 'Informal Urban Collection',
        collectionLocation: lotPayload.collectionLocation || 'Nashik Urban Cluster',
        collectionCoordinates: lotPayload.collectionCoordinates || { lat: 19.9821, lng: 73.7645 },
        collectionTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        estimatedValueMin: Math.round(lotPayload.approximateWeight * (lotPayload.offeredRatePerKg ? lotPayload.offeredRatePerKg * 0.95 : 150)),
        estimatedValueMax: Math.round(lotPayload.approximateWeight * (lotPayload.offeredRatePerKg ? lotPayload.offeredRatePerKg * 1.05 : 185)),
        priceConfidence: 'high',
        fairPriceScore: 92,
        status: 'CREATED',
        selectedRecyclerId: lotPayload.selectedRecyclerId,
        selectedRecyclerName: lotPayload.selectedRecyclerName,
        offeredRatePerKg: lotPayload.offeredRatePerKg,
        finalWeight: lotPayload.approximateWeight,
        finalAmount: lotPayload.offeredRatePerKg ? Math.round(lotPayload.offeredRatePerKg * lotPayload.approximateWeight) : undefined,
        paymentMode: lotPayload.paymentMode || 'UPI',
        paymentStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      offlineStore.addLot(fallbackLot);
      return fallbackLot;
    }
  }

  // 6. Get Lots
  public async getLots(filters?: { collectorId?: string; recyclerId?: string; status?: string }): Promise<Lot[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.collectorId) params.append('collectorId', filters.collectorId);
      if (filters?.recyclerId) params.append('recyclerId', filters.recyclerId);
      if (filters?.status) params.append('status', filters.status);
      const url = `/api/lots${params.toString() ? '?' + params.toString() : ''}`;
      return await this.request<Lot[]>(url);
    } catch {
      let list = offlineStore.getLots();
      if (filters?.collectorId) list = list.filter((l) => l.collectorId === filters.collectorId);
      if (filters?.recyclerId) list = list.filter((l) => l.selectedRecyclerId === filters.recyclerId);
      if (filters?.status) list = list.filter((l) => l.status === filters.status);
      return list;
    }
  }

  // 7. Accept Offer
  public async acceptOffer(offerId: string, payload: { lotId: string; recyclerId: string; ratePerKg: number }) {
    try {
      const res = await this.request<any>(`/api/offers/${offerId}/accept`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.lot) {
        offlineStore.updateLot(res.lot.id, res.lot);
      }
      return res;
    } catch {
      // Offline fallback
      offlineStore.updateLot(payload.lotId, {
        status: 'OFFER_ACCEPTED',
        selectedRecyclerId: payload.recyclerId,
        offeredRatePerKg: payload.ratePerKg,
      });
      return { message: 'Offer accepted offline. Will sync when reconnected.' };
    }
  }

  // 8. Confirm Handover
  public async confirmHandover(handoverData: {
    lotId: string;
    collectorId: string;
    recyclerId: string;
    verifiedWeight: number;
    notes?: string;
  }) {
    try {
      const res = await this.request<any>('/api/handover', {
        method: 'POST',
        body: JSON.stringify({
          ...handoverData,
          photoCaptured: true,
          locationRecorded: true,
          timestampRecorded: true,
          collectorConfirmation: true,
          recyclerConfirmation: true,
        }),
      });
      if (res.lot) {
        offlineStore.updateLot(res.lot.id, res.lot);
      }
      return res;
    } catch {
      offlineStore.updateLot(handoverData.lotId, {
        status: 'HANDED_OVER',
        finalWeight: handoverData.verifiedWeight,
      });
      return { verificationCode: `VERIFY-${handoverData.lotId.slice(-6)}` };
    }
  }

  // 9. Complete Payment
  public async recordPayment(paymentData: {
    lotId: string;
    amount: number;
    paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER';
    collectorId: string;
    recyclerId: string;
  }) {
    try {
      const res = await this.request<any>('/api/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
      if (res.lot) {
        offlineStore.updateLot(res.lot.id, res.lot);
      }
      return res;
    } catch {
      offlineStore.updateLot(paymentData.lotId, {
        status: 'PAID',
        paymentStatus: 'PAID',
        finalAmount: paymentData.amount,
        paymentMode: paymentData.paymentMethod,
      });
      return { message: 'Payment recorded offline.' };
    }
  }

  // 10. Traceability Events
  public async getTraceability(lotId: string): Promise<TraceabilityEvent[]> {
    try {
      return await this.request<TraceabilityEvent[]>(`/api/traceability/${lotId}`);
    } catch {
      return offlineStore.getTraceabilityEvents(lotId);
    }
  }

  // 11. Earnings Summary
  public async getEarnings() {
    try {
      return await this.request<any>('/api/earnings');
    } catch {
      const lots = offlineStore.getLots();
      const paid = lots.filter((l) => l.paymentStatus === 'PAID');
      const pending = lots.filter((l) => l.paymentStatus === 'PENDING' && l.status !== 'CANCELLED');
      const totalPaid = paid.reduce((acc, l) => acc + (l.finalAmount || (l.estimatedValueMin + l.estimatedValueMax) / 2), 0);
      const totalPending = pending.reduce((acc, l) => acc + (l.finalAmount || (l.estimatedValueMin + l.estimatedValueMax) / 2), 0);
      return {
        totalEarnings: Math.round(totalPaid + 14280),
        pendingPayments: Math.round(totalPending),
        paidAmount: Math.round(totalPaid),
        thisMonthEarnings: Math.round(totalPaid * 0.45 + 5600),
        totalWeightKg: 86.4,
        totalTransactions: paid.length + 8,
        currency: 'INR',
      };
    }
  }

  // 12. Admin Analytics
  public async getAdminAnalytics() {
    try {
      return await this.request<any>('/api/admin/analytics');
    } catch {
      return {
        totalLots: offlineStore.getLots().length,
        totalWeightTonnes: 218.4,
        totalTransactions: 104,
        totalValueLakh: 32.8,
        activeCollectors: 1284,
        verifiedRecyclers: offlineStore.getRecyclers().length,
        recyclingCompletionRate: 89,
        materialsDistribution: [
          { name: 'Printed Circuit Boards', weight: 82.4, share: '38%' },
          { name: 'Copper Cables', weight: 54.2, share: '25%' },
          { name: 'Li-Ion Batteries', weight: 43.6, share: '20%' },
          { name: 'Display Panels', weight: 26.1, share: '12%' },
          { name: 'Others', weight: 12.1, share: '5%' },
        ],
        circularYield: {
          electrolyticCopperKg: 4230,
          goldBullionEquivalentGrams: 284,
          aluminumAlloyKg: 7850,
          hazardousContainmentKg: 1420,
        },
      };
    }
  }

  // 13. Anomalies
  public async getAnomalies(): Promise<AnomalyRecord[]> {
    try {
      return await this.request<AnomalyRecord[]>('/api/admin/anomalies');
    } catch {
      return offlineStore.getAnomalies();
    }
  }

  // 14. Disputes
  public async getDisputes(): Promise<TransactionDispute[]> {
    try {
      return await this.request<TransactionDispute[]>('/api/disputes');
    } catch {
      return offlineStore.getDisputes();
    }
  }

  public async createDispute(payload: Omit<TransactionDispute, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<TransactionDispute> {
    try {
      const created = await this.request<TransactionDispute>('/api/disputes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      offlineStore.addDispute(created);
      return created;
    } catch {
      const fallback: TransactionDispute = {
        id: `disp-${Date.now()}`,
        ...payload,
        status: 'OPEN',
        createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        updatedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
      offlineStore.addDispute(fallback);
      return fallback;
    }
  }

  public async resolveDispute(id: string, status: TransactionDispute['status'], resolutionNotes?: string) {
    try {
      await this.request(`/api/disputes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, resolutionNotes }),
      });
    } catch {
      // offline
    }
    offlineStore.resolveDispute(id, status, resolutionNotes);
  }

  // 15. Data Destruction Records
  public async getDataDestructions(): Promise<DataDestructionRecord[]> {
    try {
      return await this.request<DataDestructionRecord[]>('/api/data-destruction');
    } catch {
      return offlineStore.getDataDestructions();
    }
  }

  public async createDataDestruction(payload: Omit<DataDestructionRecord, 'id' | 'certificateNumber' | 'timestamp'>): Promise<DataDestructionRecord> {
    try {
      const created = await this.request<DataDestructionRecord>('/api/data-destruction', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      offlineStore.addDataDestruction(created);
      return created;
    } catch {
      const fallback: DataDestructionRecord = {
        id: `dest-${Date.now()}`,
        certificateNumber: `CERT-DESTRUCT-NK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        ...payload,
      };
      offlineStore.addDataDestruction(fallback);
      return fallback;
    }
  }

  // 16. Predictive High Availability Zones
  public async getPredictiveZones(): Promise<PredictiveZone[]> {
    try {
      return await this.request<PredictiveZone[]>('/api/predictive/zones');
    } catch {
      return offlineStore.getPredictiveZones();
    }
  }

  // 17. Document AI Extraction
  public async extractDocument(docType: DocumentAIExtraction['docType'], fileName: string, fileContent?: string): Promise<DocumentAIExtraction> {
    try {
      const data = await this.request<DocumentAIExtraction>('/api/ai/document-extract', {
        method: 'POST',
        body: JSON.stringify({ docType, fileName, fileContent }),
      });
      offlineStore.addDocumentExtraction(data);
      return data;
    } catch {
      const fallback: DocumentAIExtraction = {
        id: `doc-${Date.now()}`,
        docType,
        fileName,
        extractedData: {
          weightKg: 12.4,
          amount: 2150,
          partyName: 'Local Authorized Collection Yard',
          confidence: 94,
        },
        status: 'AI_EXTRACTED_REQUIRES_VERIFICATION',
        uploadedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      offlineStore.addDocumentExtraction(fallback);
      return fallback;
    }
  }

  // 18. Reset Demo
  public async resetDemo() {
    try {
      await this.request('/api/demo/reset', { method: 'POST' });
    } catch {
      // offline reset
    }
    offlineStore.resetDemoData();
  }
}

export const apiClient = new ApiClient();
