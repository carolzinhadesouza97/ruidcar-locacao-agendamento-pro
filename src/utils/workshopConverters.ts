
import { Workshop, WorkshopDTO } from '@/types/workshop';
import { Workshop as UIWorkshop, OpenHours } from '@/types/workshops';

export const convertDTOToWorkshop = (dto: WorkshopDTO): Workshop => ({
  ...dto,
  open_hours: typeof dto.open_hours === 'string'
    ? JSON.parse(dto.open_hours)
    : dto.open_hours,
  website: dto.website ?? '',
});

export const convertToUIWorkshop = (workshop: Workshop): UIWorkshop => {
  // Extract hours from open_hours object
  const openHoursObj = workshop.open_hours || {};
  const openHours: OpenHours = {
    weekdays: openHoursObj.weekdays || '08:00 - 18:00',
    saturday: openHoursObj.saturday || '08:00 - 12:00',
    sunday: openHoursObj.sunday || 'Fechado'
  };

  return {
    id: workshop.id,
    name: workshop.name,
    address: workshop.address,
    city: workshop.city,
    state: workshop.state,
    zip_code: workshop.zip_code,
    lat: workshop.lat,
    lng: workshop.lng,
    phone: workshop.phone,
    email: workshop.email,
    website: workshop.website || '',
    price_popular: workshop.price_popular,
    price_medium: workshop.price_medium,
    price_imported: workshop.price_imported,
    rating: workshop.approved ? 4.5 : 3.0, // Default rating if not set
    open_hours: workshop.open_hours,
    openHours: openHours,
    permite_agendamento: workshop.permite_agendamento,
    valor_diagnostico: workshop.valor_diagnostico,
    created_at: workshop.created_at,  // Make sure to include this
    approved: workshop.approved      // Make sure to include this
  };
};
