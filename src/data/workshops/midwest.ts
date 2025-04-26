
import { Workshop } from '@/types/workshops';

export const midwestWorkshops: Workshop[] = [
  {
    id: "mw1",
    name: "Dias Soluções Automotivas",
    address: "Rua JM - Av. Brasil Sul, 035 - Qd 29 lt 01 - St. Sul Jamil Miguel",
    city: "Anápolis",
    state: "GO",
    zip_code: "75124-820",
    lat: -16.3521759,
    lng: -48.9599017,
    phone: "+55 62 3313-4359",
    email: "contato@diassolucoes.com.br",
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 13:00",
      sunday: "Fechado"
    }
  },
  {
    id: "mw2",
    name: "Radial Veículos",
    address: "Pr. do Cruzeiro, 163 - St. Sul",
    city: "Goiânia",
    state: "GO",
    zip_code: "74093-320",
    lat: -16.6900702,
    lng: -49.2526266,
    phone: "+55 62 3413-5581",
    email: "contato@radialveiculos.com.br",
    pricePopular: 220,
    priceMedium: 320,
    priceImported: 420,
    rating: 4.8,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  // Add more midwest workshops...
];
