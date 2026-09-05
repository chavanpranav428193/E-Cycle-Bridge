import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  MapPin,
  Truck,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Crosshair,
  Filter,
  Eye,
  EyeOff,
  WifiOff,
  Navigation,
} from 'lucide-react';
import { Lot, Recycler } from '../../types';
import { offlineStore } from '../../lib/offlineStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';

export type MapRoleView = 'collector' | 'recycler' | 'admin' | 'traceability';

export interface CollectionMapProps {
  viewMode?: MapRoleView;
  selectedLotId?: string;
  onSelectLot?: (lot: Lot) => void;
  onSelectRecycler?: (recycler: Recycler) => void;
  showTraceabilityRoute?: boolean;
  isPublicView?: boolean;
  className?: string;
}

export const CollectionMap: React.FC<CollectionMapProps> = ({
  viewMode = 'collector',
  selectedLotId,
  onSelectLot,
  onSelectRecycler,
  showTraceabilityRoute = false,
  isPublicView = false,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const [lots, setLots] = useState<Lot[]>(offlineStore.getLots());
  const [recyclers, setRecyclers] = useState<Recycler[]>(offlineStore.getRecyclers());
  const [activeMaterialFilter, setActiveMaterialFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [privacyMaskActive, setPrivacyMaskActive] = useState<boolean>(isPublicView);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLocating, setGeoLocating] = useState<boolean>(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [selectedLotDetails, setSelectedLotDetails] = useState<Lot | null>(null);
  const isOffline = offlineStore.isOffline();

  // Selected lot object if passed or internal
  const focusedLot = lots.find((l) => l.id === selectedLotId || l.lotNumber === selectedLotId) || selectedLotDetails;

  useEffect(() => {
    const handleUpdate = () => {
      setLots(offlineStore.getLots());
      setRecyclers(offlineStore.getRecyclers());
    };
    window.addEventListener('ecycle:data-updated', handleUpdate);
    return () => window.removeEventListener('ecycle:data-updated', handleUpdate);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Nashik Regional E-Waste Cluster (MIDC Ambad / CIDCO)
    const initialCenter: [number, number] = [19.985, 73.765];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12.5,
      zoomControl: false,
      attributionControl: false,
    });

    // Add minimal, high-contrast CartoDB / OSM tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Create custom marker DOM element
  const createMarkerIcon = (
    type: 'collection' | 'pending' | 'handed_over' | 'recycled' | 'recycler' | 'alert',
    label?: string,
    isHighlighted: boolean = false
  ) => {
    let bg = 'bg-emerald-600';
    let ring = 'ring-emerald-400';
    let icon = '📦';

    switch (type) {
      case 'collection':
        bg = 'bg-emerald-600 text-white';
        ring = 'ring-emerald-400';
        icon = '📍';
        break;
      case 'pending':
        bg = 'bg-amber-500 text-white';
        ring = 'ring-amber-300';
        icon = '⏳';
        break;
      case 'handed_over':
        bg = 'bg-teal-600 text-white';
        ring = 'ring-teal-300';
        icon = '🤝';
        break;
      case 'recycled':
        bg = 'bg-emerald-800 text-white';
        ring = 'ring-emerald-300';
        icon = '♻';
        break;
      case 'recycler':
        bg = 'bg-slate-900 text-emerald-300 border-2 border-emerald-400';
        ring = 'ring-slate-900';
        icon = '🏭';
        break;
      case 'alert':
        bg = 'bg-rose-600 text-white';
        ring = 'ring-rose-300';
        icon = '⚠';
        break;
    }

    const size = isHighlighted ? 'w-9 h-9 text-base' : 'w-7 h-7 text-xs';
    const highlightRing = isHighlighted ? 'ring-4 scale-110 shadow-lg' : 'ring-2 shadow-md';

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer transition-transform group">
        <div class="${size} ${bg} ${ring} ${highlightRing} rounded-full flex items-center justify-center font-bold select-none">
          <span>${icon}</span>
        </div>
        ${label ? `<span class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-white border border-slate-700 shadow-sm pointer-events-none">${label}</span>` : ''}
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-map-marker',
      iconSize: isHighlighted ? [36, 36] : [28, 28],
      iconAnchor: isHighlighted ? [18, 18] : [14, 14],
    });
  };

  // Render markers and route whenever data, filters, or selected lot changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    // Filter lots
    const filteredLots = lots.filter((lot) => {
      if (activeMaterialFilter !== 'all' && lot.materialId !== activeMaterialFilter) return false;
      if (activeStatusFilter !== 'all' && lot.status !== activeStatusFilter) return false;
      return true;
    });

    const bounds = L.latLngBounds([]);

    // 1. Draw Recycler facilities
    recyclers.forEach((rec) => {
      const coords: [number, number] = [rec.coordinates.lat, rec.coordinates.lng];
      bounds.extend(coords);

      const marker = L.marker(coords, {
        icon: createMarkerIcon('recycler', rec.name.split(' ')[0]),
        title: rec.name,
      });

      marker.on('click', () => {
        onSelectRecycler?.(rec);
      });

      marker.bindPopup(`
        <div class="p-1 space-y-1 font-sans">
          <div class="font-bold text-xs text-slate-900 flex items-center gap-1">
            <span>🏭</span> ${rec.name}
          </div>
          <p class="text-[11px] text-slate-600">${rec.facilityLocation}, ${rec.city}</p>
          <div class="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            ${rec.authorizationNumber}
          </div>
          <div class="pt-1 text-[11px] text-slate-700">
            Accepts: ${rec.materialsAccepted.length} streams • Reliability: ${rec.platformReliabilityScore}/100
          </div>
        </div>
      `);

      layerGroup.addLayer(marker);
    });

    // 2. Draw Collection Lots
    filteredLots.forEach((lot) => {
      let lat = lot.collectionCoordinates?.lat || 19.982;
      let lng = lot.collectionCoordinates?.lng || 73.764;

      // Privacy offset if public view or toggle active
      if (privacyMaskActive) {
        // Obfuscate ~600-900m to ward centroid
        lat += 0.005;
        lng -= 0.004;
      }

      bounds.extend([lat, lng]);

      let markerType: 'collection' | 'pending' | 'handed_over' | 'recycled' | 'alert' = 'collection';
      if (lot.anomalyFlag) markerType = 'alert';
      else if (lot.status === 'RECYCLED') markerType = 'recycled';
      else if (lot.status === 'PAID' || lot.status === 'PROCESSING') markerType = 'handed_over';
      else if (lot.status === 'OFFER_ACCEPTED') markerType = 'pending';

      const isCurrentSelected = focusedLot?.id === lot.id || focusedLot?.lotNumber === lot.lotNumber;

      const marker = L.marker([lat, lng], {
        icon: createMarkerIcon(
          markerType,
          lot.lotNumber.replace('EW-NK-2026-', 'EC-').replace('EC-2026-', '#'),
          isCurrentSelected
        ),
        title: `${lot.lotNumber} (${lot.materialName})`,
      });

      marker.on('click', () => {
        setSelectedLotDetails(lot);
        onSelectLot?.(lot);
      });

      marker.bindPopup(`
        <div class="p-1 space-y-1.5 font-sans min-w-[180px]">
          <div class="flex items-center justify-between gap-1 border-b pb-1">
            <span class="font-mono font-bold text-xs text-emerald-700">${lot.lotNumber}</span>
            <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100">${lot.status}</span>
          </div>
          <div>
            <p class="font-bold text-xs text-slate-900">${lot.materialName}</p>
            <p class="text-[11px] text-slate-600">${lot.approximateWeight} kg • ₹${(lot.finalAmount || (lot.estimatedValueMin + lot.estimatedValueMax) / 2).toLocaleString()}</p>
          </div>
          <div class="text-[10px] text-slate-500 flex items-center gap-1">
            <span>📍</span> ${privacyMaskActive ? 'Ward Area (Protected)' : lot.collectionLocation}
          </div>
        </div>
      `);

      layerGroup.addLayer(marker);
    });

    // 3. Traceability Route for Focused/Selected Lot
    if (focusedLot) {
      const startLat = focusedLot.collectionCoordinates?.lat || 19.982;
      const startLng = focusedLot.collectionCoordinates?.lng || 73.764;

      // Find matching recycler
      const targetRecycler =
        recyclers.find((r) => r.id === focusedLot.selectedRecyclerId) || recyclers[0];
      const endLat = targetRecycler.coordinates.lat;
      const endLng = targetRecycler.coordinates.lng;

      // Waypoint for electric vehicle collection van transit
      const midLat = (startLat + endLat) / 2 + 0.008;
      const midLng = (startLng + endLng) / 2 - 0.005;

      const routePoints: [number, number][] = [
        [startLat, startLng],
        [midLat, midLng],
        [endLat, endLng],
      ];

      // Draw polyline
      const polyline = L.polyline(routePoints, {
        color: '#059669', // emerald
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.85,
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Add transit waypoint icon (EV vehicle)
      const transitMarker = L.marker([midLat, midLng], {
        icon: L.divIcon({
          html: `<div class="w-8 h-8 rounded-full bg-emerald-700 text-white ring-2 ring-emerald-300 flex items-center justify-center text-sm shadow-md animate-pulse">🚚</div>`,
          className: 'transit-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      });
      transitMarker.bindTooltip('Fleet EV Transit #MH-15-EV-409', { permanent: false, direction: 'top' });
      layerGroup.addLayer(transitMarker);

      // Fit bounds to route
      bounds.extend([startLat, startLng]);
      bounds.extend([endLat, endLng]);
      bounds.extend([midLat, midLng]);
    }

    // 4. Heatmap circles if toggle active
    if (showHeatmap) {
      const heatClusters = [
        { lat: 19.982, lng: 73.764, count: 42, label: 'High Density (CIDCO)' },
        { lat: 19.954, lng: 73.742, count: 35, label: 'High Density (MIDC Ambad)' },
        { lat: 19.998, lng: 73.731, count: 24, label: 'Medium Density (Satpur)' },
        { lat: 20.012, lng: 73.795, count: 18, label: 'Medium Density (Panchavati)' },
      ];

      heatClusters.forEach((c) => {
        const circle = L.circle([c.lat, c.lng], {
          radius: 1200,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.2,
          weight: 1.5,
        });
        circle.bindTooltip(`[DEMO] ${c.label}: ${c.count} Lots Diverted`, { permanent: false });
        layerGroup.addLayer(circle);
      });
    }

    // Fit map view if valid bounds
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [
    lots,
    recyclers,
    activeMaterialFilter,
    activeStatusFilter,
    showHeatmap,
    privacyMaskActive,
    focusedLot,
  ]);

  // Geolocation trigger
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation not supported in your browser.');
      return;
    }
    setGeoLocating(true);
    setGeoMessage('Detecting current coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setGeoLocating(false);
        setGeoMessage('Location identified.');
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([coords.lat, coords.lng], 14);
          L.marker([coords.lat, coords.lng], {
            icon: L.divIcon({
              html: `<div class="w-8 h-8 rounded-full bg-blue-600 text-white ring-4 ring-blue-300 flex items-center justify-center shadow-lg font-bold">📍</div>`,
              className: 'user-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            }),
          })
            .bindTooltip('Your Current Location', { permanent: true, direction: 'top' })
            .addTo(mapInstanceRef.current);
        }
        setTimeout(() => setGeoMessage(null), 3000);
      },
      (err) => {
        setGeoLocating(false);
        setGeoMessage('Permission not granted. Defaulting to Nashik Central Cluster.');
        setTimeout(() => setGeoMessage(null), 4000);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className={`relative flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 shadow-lg ${className}`}>
      {/* Top Map Control Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-white z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>E-Waste Collection & Circularity Map</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                DEMO DATA
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Nashik Urban E-Waste Cluster • CPCB/MPCB Authorized Corridor
            </p>
          </div>
        </div>

        {/* Controls & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {isOffline && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline: Showing saved locations</span>
            </div>
          )}

          {/* Privacy Toggle */}
          <button
            type="button"
            onClick={() => setPrivacyMaskActive(!privacyMaskActive)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
              privacyMaskActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Masks exact collector coordinates to protect informal collectors"
          >
            {privacyMaskActive ? <EyeOff className="w-3.5 h-3.5 text-emerald-400" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Privacy Mask: {privacyMaskActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Heatmap Toggle (Admin / Analytical) */}
          {viewMode === 'admin' && (
            <button
              type="button"
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                showHeatmap
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Density Heatmap</span>
            </button>
          )}

          {/* Use My Location button */}
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={geoLocating}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 text-xs font-semibold transition-all"
          >
            <Crosshair className={`w-3.5 h-3.5 text-emerald-400 ${geoLocating ? 'animate-spin' : ''}`} />
            <span>{geoLocating ? 'Locating...' : 'My Location'}</span>
          </button>
        </div>
      </div>

      {geoMessage && (
        <div className="bg-emerald-950/80 border-b border-emerald-800 px-4 py-1.5 text-xs text-emerald-300 flex items-center gap-2">
          <span>ℹ</span>
          <span>{geoMessage}</span>
        </div>
      )}

      {/* Main Interactive Map Canvas */}
      <div className="relative w-full h-[460px] sm:h-[520px] bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 text-xs text-white space-y-1.5 shadow-xl max-w-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            E-Waste Corridor Legend
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
              <span>Collected Lot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span>Pending Handover</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-600 shrink-0" />
              <span>Handed Over (Paid)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-900 border-2 border-emerald-400 shrink-0" />
              <span>Recycler Facility</span>
            </div>
          </div>
          {focusedLot && (
            <div className="pt-1.5 border-t border-slate-800 flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
              <Truck className="w-3 h-3" />
              <span>Route for {focusedLot.lotNumber} active</span>
            </div>
          )}
        </div>

        {/* Selected Lot Side Card / Bottom Sheet Overlay */}
        {selectedLotDetails && (
          <div className="absolute top-4 right-4 z-20 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-white shadow-2xl space-y-3 animate-fadeIn">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {selectedLotDetails.lotNumber}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedLotDetails.materialName}</h4>
              </div>
              <button
                onClick={() => setSelectedLotDetails(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Weight:</span>
                <strong className="text-white">{selectedLotDetails.approximateWeight} kg</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Fair Valuation:</span>
                <strong className="text-emerald-400">
                  ₹{(selectedLotDetails.finalAmount || (selectedLotDetails.estimatedValueMin + selectedLotDetails.estimatedValueMax) / 2).toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-300">
              <p>
                <strong>Location:</strong> {privacyMaskActive ? 'Ward Area (Protected)' : selectedLotDetails.collectionLocation}
              </p>
              <p>
                <strong>Assigned Recycler:</strong> {selectedLotDetails.selectedRecyclerName || 'Matching...'}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => onSelectLot?.(selectedLotDetails)}
              >
                View Full Passport
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
