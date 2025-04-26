
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
  pricePopular: number;
  priceMedium: number;
  priceImported: number;
  rating: number;
  openHours: OpenHours;
  distance?: number;
}

export interface Region {
  name: string;
  workshops: Workshop[];
}
