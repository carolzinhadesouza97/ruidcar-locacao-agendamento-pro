
import { Workshop, OpenHours } from '@/types/workshops';

export interface LegacyWorkshopData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website?: string;
  pricePopular: number;
  priceMedium: number;
  priceImported: number;
  rating: number;
  openHours: OpenHours;
  distance?: number;
}

/**
 * Converts legacy workshop data format to the standardized Workshop type
 */
export function convertToStandardWorkshop(data: LegacyWorkshopData): Workshop {
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    city: data.city,
    state: data.state,
    zip_code: data.zip_code,
    lat: data.lat,
    lng: data.lng,
    phone: data.phone,
    email: data.email,
    website: data.website,
    price_popular: data.pricePopular,
    price_medium: data.priceMedium,
    price_imported: data.priceImported,
    rating: data.rating,
    open_hours: {
      weekdays: data.openHours.weekdays,
      saturday: data.openHours.saturday,
      sunday: data.openHours.sunday
    },
    openHours: data.openHours,
    distance: data.distance,
    permite_agendamento: false, // Default
    valor_diagnostico: null // Default
  };
}
