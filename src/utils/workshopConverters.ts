
import { LegacyWorkshopData, ConvertedWorkshop } from '@/types/workshopTypes';
import { Workshop } from '@/types/workshop';

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

// Add the missing convertDTOToWorkshop function
export function convertDTOToWorkshop(dto: any): Workshop {
  return {
    id: dto.id || '',
    name: dto.name || '',
    address: dto.address || '',
    city: dto.city || '',
    state: dto.state || '',
    zip_code: dto.zip_code || '',
    lat: dto.lat || 0,
    lng: dto.lng || 0,
    phone: dto.phone || '',
    email: dto.email || '',
    website: dto.website || '',
    price_popular: dto.price_popular || 0,
    price_medium: dto.price_medium || 0,
    price_imported: dto.price_imported || 0,
    rating: dto.rating || 0,
    open_hours: dto.open_hours || {},
    openHours: {
      weekdays: dto.open_hours?.weekdays || '8:00 - 18:00',
      saturday: dto.open_hours?.saturday || '8:00 - 12:00',
      sunday: dto.open_hours?.sunday || 'Fechado'
    },
    distance: dto.distance,
    permite_agendamento: dto.permite_agendamento || false,
    valor_diagnostico: dto.valor_diagnostico,
    created_at: dto.created_at || new Date().toISOString(),
    approved: dto.approved || false
  };
}
