
import { Workshop } from '@/types/workshops';

export const calculateDistances = (
  userLat: number,
  userLng: number,
  workshops: Workshop[]
): Workshop[] => {
  return workshops
    .map((workshop) => {
      const distance = getDistanceFromLatLonInKm(
        userLat,
        userLng,
        workshop.lat,
        workshop.lng
      );
      return { ...workshop, distance };
    })
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return parseFloat(d.toFixed(1));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
