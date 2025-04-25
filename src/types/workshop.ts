
import { Json } from '@/integrations/supabase/types';

// Base types for data handling
export type OpenHours = Record<string, string>;

export interface WorkshopDTO {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  open_hours: Json;
  price_popular: number;
  price_medium: number;
  price_imported: number;
  approved: boolean | null;
  created_at: string | null;
  website?: string | null;
}

export interface Workshop extends Omit<WorkshopDTO, 'open_hours' | 'website'> {
  open_hours: OpenHours;
  website: string;
}
