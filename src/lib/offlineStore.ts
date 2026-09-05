import {
  Lot,
  Recycler,
  Material,
  OfflineAction,
  TraceabilityEvent,
  AnomalyRecord,
  TransactionDispute,
  DataDestructionRecord,
  PredictiveZone,
  DocumentAIExtraction,
} from '../types';
import {
  INITIAL_LOTS,
  INITIAL_RECYCLERS,
  INITIAL_MATERIALS,
  HERO_TRACEABILITY_EVENTS,
  INITIAL_ANOMALIES,
  INITIAL_DISPUTES,
  INITIAL_DESTRUCTION_RECORDS,
  PREDICTIVE_ZONES,
  SAMPLE_DOCUMENT_EXTRACTIONS,
  DEMO_COLLECTOR,
} from '../data/seedData';

const LOTS_KEY = 'ecycle_lots_v1';
const RECYCLERS_KEY = 'ecycle_recyclers_v1';
const MATERIALS_KEY = 'ecycle_materials_v1';
const TRACEABILITY_KEY = 'ecycle_traceability_v1';
const ANOMALIES_KEY = 'ecycle_anomalies_v1';
const DISPUTES_KEY = 'ecycle_disputes_v1';
const DESTRUCTIONS_KEY = 'ecycle_destructions_v1';
const DOCS_KEY = 'ecycle_docs_v1';
const QUEUE_KEY = 'ecycle_offline_queue_v1';
const SIMULATED_OFFLINE_KEY = 'ecycle_simulated_offline';

class OfflineStore {
  private simulatedOffline: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const storedSim = localStorage.getItem(SIMULATED_OFFLINE_KEY);
      this.simulatedOffline = storedSim === 'true';
    }
  }

  public isOffline(): boolean {
    if (typeof window === 'undefined') return false;
    if (this.simulatedOffline) return true;
    return !navigator.onLine;
  }

  public isSimulatedOffline(): boolean {
    return this.simulatedOffline;
  }

  public getIsOfflineSimulated(): boolean {
    return this.simulatedOffline;
  }

  public setSimulatedOffline(simulated: boolean): void {
    this.simulatedOffline = simulated;
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIMULATED_OFFLINE_KEY, String(simulated));
      window.dispatchEvent(new CustomEvent('ecycle:offline-change', { detail: { offline: this.isOffline() } }));
    }
  }

  public setIsOfflineSimulated(simulated: boolean): void {
    this.setSimulatedOffline(simulated);
  }

  public getLots(): Lot[] {
    if (typeof window === 'undefined') return INITIAL_LOTS;
    const stored = localStorage.getItem(LOTS_KEY);
    if (!stored) {
      this.saveLots(INITIAL_LOTS);
      return INITIAL_LOTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_LOTS;
    }
  }

  public saveLots(lots: Lot[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOTS_KEY, JSON.stringify(lots));
      window.dispatchEvent(new CustomEvent('ecycle:data-updated'));
    }
  }

  public addLot(newLot: Lot): void {
    const lots = this.getLots();
    const updated = [newLot, ...lots];
    this.saveLots(updated);

    // If offline, add to pending sync queue
    if (this.isOffline()) {
      this.enqueueAction({
        clientActionId: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        actionType: 'CREATE_LOT',
        entityId: newLot.id,
        payload: newLot,
        syncStatus: 'PENDING',
      });
    }

    // Add initial traceability event
    this.addTraceabilityEvent({
      id: `ev-${Date.now()}`,
      lotId: newLot.id,
      lotNumber: newLot.lotNumber,
      eventType: 'lotCreated',
      title: 'COLLECTED & DIGITIZED',
      actorId: newLot.collectorId,
      actorRole: 'collector',
      actorName: `${newLot.collectorName} (Collector)`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      location: newLot.collectionLocation,
      coordinates: newLot.collectionCoordinates,
      verificationMethod: 'GPS_TIMESTAMP',
      notes: `Lot declared weight ${newLot.approximateWeight} kg`,
    });
  }

  public updateLot(lotId: string, updates: Partial<Lot>): Lot | null {
    const lots = this.getLots();
    const index = lots.findIndex((l) => l.id === lotId);
    if (index === -1) return null;

    const updatedLot = { ...lots[index], ...updates, updatedAt: new Date().toISOString() };
    lots[index] = updatedLot;
    this.saveLots(lots);

    if (this.isOffline()) {
      this.enqueueAction({
        clientActionId: `act-${Date.now()}`,
        createdAt: new Date().toISOString(),
        actionType: 'ACCEPT_OFFER',
        entityId: lotId,
        payload: updates,
        syncStatus: 'PENDING',
      });
    }

    return updatedLot;
  }

  public getTraceabilityEvents(lotId?: string): TraceabilityEvent[] {
    if (typeof window === 'undefined') return HERO_TRACEABILITY_EVENTS;
    const stored = localStorage.getItem(TRACEABILITY_KEY);
    let events = HERO_TRACEABILITY_EVENTS;
    if (stored) {
      try {
        events = JSON.parse(stored);
      } catch {
        events = HERO_TRACEABILITY_EVENTS;
      }
    } else {
      localStorage.setItem(TRACEABILITY_KEY, JSON.stringify(HERO_TRACEABILITY_EVENTS));
    }

    if (lotId) {
      return events.filter((e) => e.lotId === lotId || e.lotNumber === lotId);
    }
    return events;
  }

  public getEventsForLot(lotId?: string): TraceabilityEvent[] {
    return this.getTraceabilityEvents(lotId);
  }

  public addTraceabilityEvent(event: TraceabilityEvent): void {
    const all = this.getTraceabilityEvents();
    const updated = [...all, event];
    if (typeof window !== 'undefined') {
      localStorage.setItem(TRACEABILITY_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ecycle:data-updated'));
    }
  }

  public getRecyclers(): Recycler[] {
    if (typeof window === 'undefined') return INITIAL_RECYCLERS;
    const stored = localStorage.getItem(RECYCLERS_KEY);
    if (!stored) {
      localStorage.setItem(RECYCLERS_KEY, JSON.stringify(INITIAL_RECYCLERS));
      return INITIAL_RECYCLERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_RECYCLERS;
    }
  }

  public getMaterials(): Material[] {
    if (typeof window === 'undefined') return INITIAL_MATERIALS;
    const stored = localStorage.getItem(MATERIALS_KEY);
    if (!stored) {
      localStorage.setItem(MATERIALS_KEY, JSON.stringify(INITIAL_MATERIALS));
      return INITIAL_MATERIALS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_MATERIALS;
    }
  }

  public getAnomalies(): AnomalyRecord[] {
    if (typeof window === 'undefined') return INITIAL_ANOMALIES;
    const stored = localStorage.getItem(ANOMALIES_KEY);
    if (!stored) {
      localStorage.setItem(ANOMALIES_KEY, JSON.stringify(INITIAL_ANOMALIES));
      return INITIAL_ANOMALIES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ANOMALIES;
    }
  }

  public updateAnomaly(id: string, status: AnomalyRecord['status']): void {
    const list = this.getAnomalies();
    const updated = list.map((a) => (a.id === id ? { ...a, status } : a));
    if (typeof window !== 'undefined') {
      localStorage.setItem(ANOMALIES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ecycle:data-updated'));
    }
  }

  public resolveAnomaly(id: string, status: AnomalyRecord['status']): void {
    this.updateAnomaly(id, status);
  }

  public getDisputes(): TransactionDispute[] {
    if (typeof window === 'undefined') return INITIAL_DISPUTES;
    const stored = localStorage.getItem(DISPUTES_KEY);
    if (!stored) {
      localStorage.setItem(DISPUTES_KEY, JSON.stringify(INITIAL_DISPUTES));
      return INITIAL_DISPUTES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_DISPUTES;
    }
  }

  public saveDisputes(disputes: TransactionDispute[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISPUTES_KEY, JSON.stringify(disputes));
      window.dispatchEvent(new CustomEvent('ecycle:data-updated'));
    }
  }

  public addDispute(dispute: TransactionDispute): void {
    const disputes = this.getDisputes();
    this.saveDisputes([dispute, ...disputes]);
  }

  public resolveDispute(id: string, status: TransactionDispute['status'], resolutionNotes?: string): void {
    const list = this.getDisputes();
    const updated = list.map((d) => (d.id === id ? { ...d, status, resolutionNotes, updatedAt: new Date().toISOString() } : d));
    this.saveDisputes(updated);
  }

  public getDataDestructions(): DataDestructionRecord[] {
    if (typeof window === 'undefined') return INITIAL_DESTRUCTION_RECORDS;
    const stored = localStorage.getItem(DESTRUCTIONS_KEY);
    if (!stored) {
      localStorage.setItem(DESTRUCTIONS_KEY, JSON.stringify(INITIAL_DESTRUCTION_RECORDS));
      return INITIAL_DESTRUCTION_RECORDS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_DESTRUCTION_RECORDS;
    }
  }

  public addDataDestruction(record: DataDestructionRecord): void {
    const list = this.getDataDestructions();
    const updated = [record, ...list];
    if (typeof window !== 'undefined') {
      localStorage.setItem(DESTRUCTIONS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ecycle:data-updated'));
    }
  }

  public getPredictiveZones(): PredictiveZone[] {
    return PREDICTIVE_ZONES;
  }

  public getDocumentExtractions(): DocumentAIExtraction[] {
    if (typeof window === 'undefined') return SAMPLE_DOCUMENT_EXTRACTIONS;
    const stored = localStorage.getItem(DOCS_KEY);
    if (!stored) {
      localStorage.setItem(DOCS_KEY, JSON.stringify(SAMPLE_DOCUMENT_EXTRACTIONS));
      return SAMPLE_DOCUMENT_EXTRACTIONS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SAMPLE_DOCUMENT_EXTRACTIONS;
    }
  }

  public addDocumentExtraction(doc: DocumentAIExtraction): void {
    const list = this.getDocumentExtractions();
    const updated = [doc, ...list];
    if (typeof window !== 'undefined') {
      localStorage.setItem(DOCS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ecycle:data-updated'));
    }
  }

  public getOfflineQueue(): OfflineAction[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(QUEUE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public enqueueAction(action: OfflineAction): void {
    const queue = this.getOfflineQueue();
    const updated = [...queue, action];
    if (typeof window !== 'undefined') {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ecycle:queue-changed', { detail: { count: updated.length } }));
    }
  }

  public async syncQueue(): Promise<number> {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return 0;

    // Simulate syncing actions to server
    await new Promise((res) => setTimeout(res, 800));

    if (typeof window !== 'undefined') {
      localStorage.removeItem(QUEUE_KEY);
      window.dispatchEvent(new CustomEvent('ecycle:queue-changed', { detail: { count: 0 } }));
      window.dispatchEvent(new CustomEvent('ecycle:data-updated'));
    }
    return queue.length;
  }

  public resetDemoData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOTS_KEY, JSON.stringify(INITIAL_LOTS));
      localStorage.setItem(RECYCLERS_KEY, JSON.stringify(INITIAL_RECYCLERS));
      localStorage.setItem(MATERIALS_KEY, JSON.stringify(INITIAL_MATERIALS));
      localStorage.setItem(TRACEABILITY_KEY, JSON.stringify(HERO_TRACEABILITY_EVENTS));
      localStorage.setItem(ANOMALIES_KEY, JSON.stringify(INITIAL_ANOMALIES));
      localStorage.setItem(DISPUTES_KEY, JSON.stringify(INITIAL_DISPUTES));
      localStorage.setItem(DESTRUCTIONS_KEY, JSON.stringify(INITIAL_DESTRUCTION_RECORDS));
      localStorage.setItem(DOCS_KEY, JSON.stringify(SAMPLE_DOCUMENT_EXTRACTIONS));
      localStorage.removeItem(QUEUE_KEY);
      this.setSimulatedOffline(false);
      window.dispatchEvent(new CustomEvent('ecycle:data-updated'));
    }
  }

  public getQueueCount(): number {
    return this.getOfflineQueue().length;
  }

  public subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener('ecycle:offline-change', handler);
    window.addEventListener('ecycle:queue-changed', handler);
    window.addEventListener('ecycle:data-updated', handler);
    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);
    return () => {
      window.removeEventListener('ecycle:offline-change', handler);
      window.removeEventListener('ecycle:queue-changed', handler);
      window.removeEventListener('ecycle:data-updated', handler);
      window.removeEventListener('online', handler);
      window.removeEventListener('offline', handler);
    };
  }

  public getCollectorProfile(): typeof DEMO_COLLECTOR {
    return DEMO_COLLECTOR;
  }
}

export const offlineStore = new OfflineStore();
