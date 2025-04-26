
export interface OpenHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface Workshop {
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
  price_popular: number;
  price_medium: number;
  price_imported: number;
  rating: number;
  open_hours: Record<string, string>;
  openHours: OpenHours;
  distance?: number;
  permite_agendamento?: boolean | null;
  valor_diagnostico?: number | null;
  created_at?: string | null; // Add created_at property
  approved?: boolean | null; // Add approved property
}

export interface Region {
  name: string;
  workshops: Workshop[];
}
