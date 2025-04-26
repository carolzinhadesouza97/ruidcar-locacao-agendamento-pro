export const toRad = (value: number): number => (value * Math.PI) / 180;

export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  const distance = R * c;
  
  // Return distance with 2 decimal places
  return Number(distance.toFixed(2));
};

export const findNearestWorkshops = (workshops: Workshop[], userLat: number, userLng: number, limit?: number): Workshop[] => {
  const workshopsWithDistance = workshops.map(workshop => ({
    ...workshop,
    distance: calculateHaversineDistance(userLat, userLng, workshop.lat, workshop.lng)
  }));
  
  return workshopsWithDistance
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, limit || workshopsWithDistance.length);
};
