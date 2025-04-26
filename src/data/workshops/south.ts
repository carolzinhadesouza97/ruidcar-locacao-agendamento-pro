
import { Workshop } from '@/types/workshops';

export const southWorkshops: Workshop[] = [
  {
    id: "s1",
    name: "Bosch Diesel Service - Manivela Bombas Injetoras",
    address: "R. Cel. Pedroso, 155 - Centro",
    city: "Bagé",
    state: "RS",
    zip_code: "96400-240",
    lat: -31.33927471515333,
    lng: -54.10606481367973,
    phone: "05332474094",
    email: "contato@manivela.com.br",
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
  // ... add other south region workshops
];
