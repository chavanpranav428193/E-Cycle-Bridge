import { Material, Recycler, RecyclerOffer } from '../types';

export interface MatchingWeights {
  authorization: number; // default 0.30
  price: number; // default 0.25
  materialCompatibility: number; // default 0.15
  distance: number; // default 0.10
  pickup: number; // default 0.10
  reliability: number; // default 0.10
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  authorization: 0.3,
  price: 0.25,
  materialCompatibility: 0.15,
  distance: 0.1,
  pickup: 0.1,
  reliability: 0.1,
};

// Calculate approximate straight-line distance in km between coordinates
export function calculateDistanceKm(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function matchRecyclersForLot(
  lotId: string,
  material: Material,
  approxWeightKg: number,
  collectorCoords: { lat: number; lng: number } = { lat: 19.9821, lng: 73.7645 },
  recyclers: Recycler[],
  weights: MatchingWeights = DEFAULT_WEIGHTS
): RecyclerOffer[] {
  const offers: RecyclerOffer[] = [];

  for (const r of recyclers) {
    // Check material acceptance
    const acceptsMaterial = r.materialsAccepted.includes(material.id);
    if (!acceptsMaterial) continue;

    const distance = calculateDistanceKm(collectorCoords, r.coordinates);
    const rate = r.offeredRates[material.id] || material.typicalPriceRange.median;
    const totalAmount = Math.round(rate * approxWeightKg);

    // Calculate sub-scores (0-100)
    const authScore = r.authorizationStatus === 'verified' ? 100 : 60;
    // Price normalized against median
    const priceRatio = rate / material.typicalPriceRange.median;
    const priceScore = Math.min(100, Math.max(50, priceRatio * 85));
    const matScore = 100;
    // Distance score: closer is better
    const distScore = Math.max(20, 100 - distance * 2);
    const pickupScore = r.pickupAvailable && distance <= r.pickupRadius ? 100 : 40;
    const relScore = r.platformReliabilityScore;

    const weightedScore = Math.round(
      authScore * weights.authorization +
        priceScore * weights.price +
        matScore * weights.materialCompatibility +
        distScore * weights.distance +
        pickupScore * weights.pickup +
        relScore * weights.reliability
    );

    const matchReasons: string[] = [
      `✓ Accepts ${material.displayName}`,
      `✓ Regulatory status marked verified*`,
      `✓ ${distance} km away in ${r.city}`,
      r.pickupAvailable ? `✓ Door-step electric pickup available` : `✓ Facility drop-off available`,
      `✓ ₹${rate}/kg offered rate`,
      `✓ Platform reliability: ${r.platformReliabilityScore}/100`,
    ];

    offers.push({
      id: `off-${r.id}-${Date.now().toString().slice(-4)}`,
      lotId,
      recyclerId: r.id,
      recyclerName: r.name,
      ratePerKg: rate,
      totalEstimatedAmount: totalAmount,
      pickupOffered: r.pickupAvailable && distance <= r.pickupRadius,
      distanceKm: distance,
      reliabilityScore: r.platformReliabilityScore,
      authorizationStatus: r.authorizationStatus,
      status: 'PENDING',
      matchScore: weightedScore,
      matchReasons,
      createdAt: new Date().toISOString(),
    });
  }

  // Sort descending by matchScore
  return offers.sort((a, b) => b.matchScore - a.matchScore);
}
