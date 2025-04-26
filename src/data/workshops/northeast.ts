
import { Workshop } from '@/types/workshops';

export const northeastWorkshops: Workshop[] = [
  {
    id: "ne1",
    name: "Bosch Car Service - SóAutos Sobral",
    address: "Av. Sen. José Ermírio de Moraes, 1371 - Dom Jose",
    city: "Sobral",
    state: "CE",
    zip_code: "62015-505",
    lat: -3.5539926303742124,
    lng: -40.40526375273637,
    phone: "",
    email: "contato@soautos.com.br",
    pricePopular: 210,
    priceMedium: 310,
    priceImported: 410,
    rating: 4.6,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 13:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne2",
    name: "ACB Auto Service e Engenharia Mecânica",
    address: "Av. José Bastos, 2577 - Damas",
    city: "Fortaleza",
    state: "CE",
    zip_code: "60426-095",
    phone: "+55 85 3283-1244",
    email: "contato@acbautoservice.com.br",
    lat: -3.7443216,
    lng: -38.54420539999999,
    pricePopular: 220,
    priceMedium: 320,
    priceImported: 420,
    rating: 4.7,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  // Add more northeast workshops...
];
