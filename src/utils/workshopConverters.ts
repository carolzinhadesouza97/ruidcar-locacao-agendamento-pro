
import { LegacyWorkshopData, ConvertedWorkshop } from '@/types/workshopTypes';

export function convertToStandardWorkshop(data: LegacyWorkshopData): ConvertedWorkshop {
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
    website: data.website || '',
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
    permite_agendamento: false,
    valor_diagnostico: null,
    created_at: new Date().toISOString(),
    approved: true
  };
}
