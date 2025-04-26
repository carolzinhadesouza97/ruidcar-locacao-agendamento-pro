
import { Workshop } from '@/types/workshops';
import { LegacyWorkshopData, convertToStandardWorkshop } from '@/utils/workshopDataConverter';

// Define the data using the legacy format
const northeastWorkshopsData: LegacyWorkshopData[] = [
  {
    id: "ne1",
    name: "Bosch Car Service - SóAutos Sobral",
    address: "Retifica Nossa Senhora de Fátima - Av. Sen. José Ermírio de Moraes, 1371 - Dom Jose, Sobral - CE, 62015-505",
    city: "Sobral",
    state: "CE",
    zip_code: "",
    phone: "",
    email: "",
    lat: -3.5539926303742124,
    lng: -40.40526375273637,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne2",
    name: "ACB Auto Service e Engenharia Mecânica",
    address: "Av. José Bastos, 2577 - Damas, Fortaleza - CE, 60426-095",
    city: "Fortaleza",
    state: "CE",
    zip_code: "",
    phone: "558532831244",
    email: "",
    lat: -3.7443216,
    lng: -38.54420539999999,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne3",
    name: "Giros Car Auto Center",
    address: "R. Cônego Ribamar Carvalho, 366 - Jardim São Cristovão, São Luís - MA, 65000-000",
    city: "Sao Luis",
    state: "MA",
    zip_code: "",
    phone: "559831813922",
    email: "",
    lat: -2.5717884,
    lng: -44.22556489999999,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne4",
    name: "Master Serviços Automotivos (Oficina do Luiz)",
    address: "Av. Pres. Roselvelt, 9601 - Serraria, Maceió - AL, 57046-480",
    city: "Maceio",
    state: "AL",
    zip_code: "",
    phone: "5582999969154",
    email: "",
    lat: -9.6172969,
    lng: -35.721379,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne5",
    name: "STOP CAR POMBAL CENTRO AUTOMOTIVO LTDA",
    address: "Rod BR230, KM405 - perimetro urbano, Pombal - PB, 58840-000",
    city: "Pombal",
    state: "PB",
    zip_code: "",
    phone: "558334312001",
    email: "",
    lat: -6.7913327,
    lng: -37.7901808,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne6",
    name: "Auto Serv - Revenda Michelin",
    address: "R. João Suassuna, 380 - Centro, Campina Grande - PB, 58101-550",
    city: "Campina Grande",
    state: "PB",
    zip_code: "",
    phone: "558333212605",
    email: "",
    lat: -7.215764300000001,
    lng: -35.8886276,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne7",
    name: "JR Centro Automotivo",
    address: "Av. Rui Barbosa, 529 - Primavera, Guarabira - PB, 58200-000",
    city: "Guarabira",
    state: "PB",
    zip_code: "",
    phone: "558332714599",
    email: "",
    lat: -6.8545664,
    lng: -35.496425,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne8",
    name: "Casa do Escapamento - Tancredo Neves",
    address: "Av. Presidente Tancredo Neves, 259 - Bairro dos Ipês, João Pessoa - PB, 58028-840",
    city: "Joao Pessoa",
    state: "PB",
    zip_code: "",
    phone: "558332446647",
    email: "",
    lat: -7.0981984,
    lng: -34.8594644,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne9",
    name: "MANUTEC manutenção técnica automotiva",
    address: "Rodovia PE 75, km 26, 170 Centro - Itambé, PE, 55920-000",
    city: "Pedras de Fogo",
    state: "PB",
    zip_code: "",
    phone: "5581992686824",
    email: "",
    lat: -7.403989900000001,
    lng: -35.1235294,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne10",
    name: "O Trocão Auto Center",
    address: "R. Dantas Barreto, 292 - Santo Antônio, Garanhuns - PE, 55293-080",
    city: "Garanhuns",
    state: "PE",
    zip_code: "",
    phone: "558737622597",
    email: "",
    lat: -8.889187499999998,
    lng: -36.4964521,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne11",
    name: "Fator Premium",
    address: "Av. Professor Joaquim Cavalcanti, 250 - 262 e 270 - Caxangá, Recife - PE, 50800-010",
    city: "Recife",
    state: "PE",
    zip_code: "",
    phone: "5581997912653",
    email: "",
    lat: -8.035438899999997,
    lng: -34.9412102,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne12",
    name: "Multcar Centro Automotivo Porto Seguro",
    address: "R. Jaguarari, 1888 - Lagoa Nova, Natal - RN, 59062-500",
    city: "Natal",
    state: "RN",
    zip_code: "",
    phone: "5584991352325",
    email: "",
    lat: -5.8136014,
    lng: -35.2167701,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne13",
    name: "Santana Auto Peças e Serviços",
    address: "19 - Av. Maria Lacerda Montenegro, 2874 - Parque dos Eucaliptos, Parnamirim - RN, 59152-600",
    city: "Parnamirim",
    state: "RN",
    zip_code: "",
    phone: "558432082402",
    email: "",
    lat: -5.895146800000001,
    lng: -35.20337669999999,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne14",
    name: "Topgear Aracaju Auto Center",
    address: "",
    city: "Aracaju",
    state: "SE",
    zip_code: "",
    phone: "",
    email: "",
    lat: -10.9895529,
    lng: -37.0604397,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne15",
    name: "ZETECH CENTRO AUTOMOTIVO",
    address: "",
    city: "Vitoria da Conquista",
    state: "BA",
    zip_code: "",
    phone: "",
    email: "",
    lat: -14.8586158,
    lng: -40.8498382,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne16",
    name: "MIGUELCAR CENTRO AUTOMOTIVO",
    address: "",
    city: "Sao Luis",
    state: "MA",
    zip_code: "",
    phone: "",
    email: "",
    lat: -2.5299599,
    lng: -44.24340429999999,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne17",
    name: "Mais Controll Centro Automotivo",
    address: "",
    city: "Vitoria da Conquista",
    state: "BA",
    zip_code: "",
    phone: "",
    email: "",
    lat: -14.8790637,
    lng: -40.8525512,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne18",
    name: "OESTE PICK-UP (PEÇAS E SERVIÇOS) BARREIRAS BA.",
    address: "",
    city: "Barreiras",
    state: "BA",
    zip_code: "",
    phone: "",
    email: "",
    lat: -12.141989,
    lng: -44.974005,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne19",
    name: "Lobo Suspensão",
    address: "",
    city: "Parnamirim",
    state: "RN",
    zip_code: "",
    phone: "",
    email: "",
    lat: -5.8767099,
    lng: -35.2155359,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne20",
    name: "Mecanica Moriá",
    address: "WhastApp 73 99132 4832",
    city: "Jequie",
    state: "BA",
    zip_code: "",
    phone: "",
    email: "",
    lat: -13.8544362,
    lng: -40.0757148,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne21",
    name: "D-CAR PREMIUM",
    address: "",
    city: "Caruaru",
    state: "PE",
    zip_code: "",
    phone: "",
    email: "",
    lat: -8.288186999999997,
    lng: -35.986961,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne22",
    name: "AutoForte",
    address: "",
    city: "Recife",
    state: "PE",
    zip_code: "",
    phone: "",
    email: "",
    lat: -8.0397753,
    lng: -34.91504219999999,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne23",
    name: "EliCarros Centro Automotivo",
    address: "",
    city: "Sao Luis",
    state: "MA",
    zip_code: "",
    phone: "",
    email: "",
    lat: -2.4912149,
    lng: -44.2312269,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne24",
    name: "Auto Trevo - Autopeças e Serviços",
    address: "",
    city: "Santa Cruz do Capibaribe",
    state: "PE",
    zip_code: "",
    phone: "",
    email: "",
    lat: -7.955165,
    lng: -36.1968103,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne25",
    name: "Wellington Car - Caixa de direção e suspensão",
    address: "",
    city: "Caucaia",
    state: "CE",
    zip_code: "",
    phone: "",
    email: "",
    lat: -3.7906568,
    lng: -38.5886039,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne26",
    name: "Laércio Alinhamento - Melhor loja de pneus em cajazeiras",
    address: "",
    city: "Cajazeiras",
    state: "PB",
    zip_code: "",
    phone: "",
    email: "",
    lat: -6.8946177,
    lng: -38.53805119999999,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne27",
    name: "Marinho Auto Center",
    address: "",
    city: "Maceio",
    state: "AL",
    zip_code: "",
    phone: "",
    email: "",
    lat: -9.6583515,
    lng: -35.7224525,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne28",
    name: "Assis Autopeças",
    address: "",
    city: "Cajazeiras",
    state: "PB",
    zip_code: "",
    phone: "",
    email: "",
    lat: -6.894546399999999,
    lng: -38.5383692,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  },
  {
    id: "ne29",
    name: "Giros Car ITZ",
    address: "",
    city: "Imperatriz",
    state: "MA",
    zip_code: "",
    phone: "",
    email: "",
    lat: -5.5015602,
    lng: -47.45063100000001,
    pricePopular: 200,
    priceMedium: 300,
    priceImported: 400,
    rating: 4.5,
    openHours: {
      weekdays: "8:00 - 18:00",
      saturday: "8:00 - 12:00",
      sunday: "Fechado"
    }
  }
];

// Convert the data to the standardized Workshop format
export const northeastWorkshops: Workshop[] = northeastWorkshopsData.map(convertToStandardWorkshop);
