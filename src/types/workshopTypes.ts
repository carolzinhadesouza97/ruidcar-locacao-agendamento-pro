
export interface OpenHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

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
  website: string;
  pricePopular: number;
  priceMedium: number;
  priceImported: number;
  rating: number;
  openHours: OpenHours;
  distance?: number;
}

export interface ConvertedWorkshop {
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
  website: string;
  price_popular: number;
  price_medium: number;
  price_imported: number;
  rating: number;
  open_hours: Record<string, string>; // Changed from OpenHours to Record<string, string>
  openHours: OpenHours;
  distance?: number;
  permite_agendamento: boolean;
  valor_diagnostico: number | null;
  created_at: string;
  approved: boolean;
}
