
import { Workshop } from '@/types/workshops';

export const southeastWorkshops: Workshop[] = [
  {
    id: "se1",
    name: "Auto Center Xapolin Pneus & Rodas",
    address: "Av. Cel. Venâncio Flores, 2890 - Guaxindiba",
    city: "Aracruz",
    state: "ES",
    zip_code: "29194-728",
    phone: "+55 27 3256-6293",
    email: "contato@xapolinpneus.com.br",
    lat: -19.8070163,
    lng: -40.2755664,
    pricePopular: 230,
    priceMedium: 330,
    priceImported: 430,
    rating: 4.7,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 13:00",
      sunday: "Fechado"
    }
  },
  // ... add other southeast region workshops
];
