
import { Workshop } from '@/types/workshops';

export const northWorkshops: Workshop[] = [
  {
    id: "n1",
    name: "Nacional Auto Peças e Serviços",
    address: "PA-125 - Centro, Paragominas - PA, 68625-590",
    city: "Paragominas",
    state: "PA",
    zip_code: "68625-590",
    lat: -2.9899244,
    lng: -47.35377760000001,
    phone: "+55 91 3729-1344",
    email: "contato@nacionalautopecas.com.br",
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
  // ... add other north region workshops
];
