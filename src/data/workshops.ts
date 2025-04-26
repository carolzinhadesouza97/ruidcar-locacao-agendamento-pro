import { Workshop } from '@/types/workshop';

export const workshopsData: Workshop[] = [
  {
    id: "1",
    name: "Auto Center São Paulo",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
    lat: -23.56503,
    lng: -46.65127,
    phone: "(11) 95555-1234",
    email: "contato@autocentersp.com.br",
    pricePopular: 250,
    priceMedium: 350,
    priceImported: 450,
    rating: 4.7,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "9:00 - 15:00",
      sunday: "Fechado",
    },
  },
  {
    id: "2",
    name: "Mecânica Express Rio",
    address: "Av. Atlântica, 500",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22010-000",
    lat: -22.96995,
    lng: -43.18341,
    phone: "(21) 95555-2345",
    email: "contato@mecanicaexpressrj.com.br",
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 16:00",
      sunday: "Fechado",
    },
  },
  {
    id: "3",
    name: "Total Car Belo Horizonte",
    address: "Av. Afonso Pena, 1500",
    city: "Belo Horizonte",
    state: "MG",
    zipCode: "30130-005",
    lat: -19.92462,
    lng: -43.93886,
    phone: "(31) 95555-3456",
    email: "contato@totalcarbh.com.br",
    pricePopular: 220,
    priceMedium: 320,
    priceImported: 420,
    rating: 4.8,
    openHours: {
      weekdays: "7:30 - 19:00",
      saturday: "8:00 - 14:00",
      sunday: "Fechado",
    },
  },
  {
    id: "4",
    name: "Oficina Central Salvador",
    address: "Av. Oceânica, 700",
    city: "Salvador",
    state: "BA",
    zipCode: "40140-130",
    lat: -12.99118,
    lng: -38.52384,
    phone: "(71) 95555-4567",
    email: "contato@oficinacentralssa.com.br",
    pricePopular: 180,
    priceMedium: 280,
    priceImported: 380,
    rating: 4.6,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 15:00",
      sunday: "Fechado",
    },
  },
  {
    id: "5",
    name: "Auto Service Brasília",
    address: "SIA Trecho 3, Lote 625",
    city: "Brasília",
    state: "DF",
    zipCode: "71200-037",
    lat: -15.80286,
    lng: -47.92256,
    phone: "(61) 95555-5678",
    email: "contato@autoservicebsb.com.br",
    pricePopular: 230,
    priceMedium: 330,
    priceImported: 430,
    rating: 4.9,
    openHours: {
      weekdays: "8:00 - 19:00",
      saturday: "8:00 - 17:00",
      sunday: "9:00 - 13:00",
    },
  },
  {
    id: "6",
    name: "Oficina Rápida Fortaleza",
    address: "Av. Beira Mar, 300",
    city: "Fortaleza",
    state: "CE",
    zipCode: "60165-121",
    lat: -3.71839,
    lng: -38.51323,
    phone: "(85) 95555-6789",
    email: "contato@oficinarapidafor.com.br",
    pricePopular: 190,
    priceMedium: 290,
    priceImported: 390,
    rating: 4.4,
    openHours: {
      weekdays: "7:00 - 19:00",
      saturday: "8:00 - 17:00",
      sunday: "Fechado",
    },
  },
  {
    id: "7",
    name: "Car Center Recife",
    address: "Av. Boa Viagem, 1200",
    city: "Recife",
    state: "PE",
    zipCode: "51011-000",
    lat: -8.05428,
    lng: -34.87761,
    phone: "(81) 95555-7890",
    email: "contato@carcenterrecife.com.br",
    pricePopular: 210,
    priceMedium: 310,
    priceImported: 410,
    rating: 4.7,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 16:00",
      sunday: "Fechado",
    },
  },
  {
    id: "8",
    name: "Mecânica Porto Alegre",
    address: "Av. Ipiranga, 1500",
    city: "Porto Alegre",
    state: "RS",
    zipCode: "90160-093",
    lat: -30.03306,
    lng: -51.22019,
    phone: "(51) 95555-8901",
    email: "contato@mecanicapoa.com.br",
    pricePopular: 240,
    priceMedium: 340,
    priceImported: 440,
    rating: 4.6,
    openHours: {
      weekdays: "8:00 - 18:30",
      saturday: "9:00 - 15:00",
      sunday: "Fechado",
    },
  },
];

const additionalWorkshops: Workshop[] = [
  {
    id: "w1",
    name: "Bosch Diesel Service - Manivela Bombas Injetoras",
    address: "R. Cel. Pedroso, 155 - Centro",
    city: "Bagé",
    state: "RS",
    zipCode: "96400-240",
    lat: -31.33927471515333,
    lng: -54.10606481367973,
    phone: "05332474094",
    email: "contato@manivela.com.br",
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado",
    },
  },
];

export const allWorkshops: Workshop[] = [...workshopsData, ...additionalWorkshops];

export const getWorkshopById = (id: string): Workshop | undefined => {
  return allWorkshops.find((workshop) => workshop.id === id);
};

export const calculateDistances = (
  userLat: number,
  userLng: number,
  workshops: Workshop[]
): Workshop[] => {
  return workshops
    .map((workshop) => {
      const distance = getDistanceFromLatLonInKm(
        userLat,
        userLng,
        workshop.lat,
        workshop.lng
      );
      return { ...workshop, distance };
    })
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
