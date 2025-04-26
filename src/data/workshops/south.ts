
import { Workshop } from '@/types/workshops';
import { LegacyWorkshopData, convertToStandardWorkshop } from '@/utils/workshopDataConverter';

// Define the data using the legacy format
const southWorkshopsData: LegacyWorkshopData[] = [
  {
    id: "s1",
    name: "Bosch Diesel Service - Manivela Bombas Injetoras",
    address: "R. Cel. Pedroso, 155 - Centro, Bagé - RS, 96400-240",
    city: "Bage",
    state: "RS",
    zip_code: "",
    phone: "05332474094",
    email: "",
    lat: -31.33927471515333,
    lng: -54.10606481367973,
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
    id: "s2",
    name: "Renault do Brasil",
    address: "Av. Renault, 1300 - Roseira de São Sebastião, São José dos Pinhais - PR, 83070-900",
    city: "Sao Jose dos Pinhais",
    state: "PR",
    zip_code: "",
    phone: "558000555615",
    email: "",
    lat: -25.5295209,
    lng: -49.11691159999999,
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
    id: "s3",
    name: "Leandro Serviços Automotivos",
    address: "R. Iapó, 1630 - Prado Velho, Curitiba - PR, 80215-223",
    city: "Curitiba",
    state: "PR",
    zip_code: "",
    phone: "554133336112",
    email: "",
    lat: -25.4553515,
    lng: -49.2537797,
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
    id: "s4",
    name: "Rowal Centro Automotivo",
    address: "R. Atílio Bório, 1531 - Hugo Lange, Curitiba - PR, 80040-132",
    city: "Curitiba",
    state: "PR",
    zip_code: "",
    phone: "554132626463",
    email: "",
    lat: -25.4217555,
    lng: -49.2521699,
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
    id: "s5",
    name: "Primon Centro Automotivo",
    address: "R. Cuiabá, 4660 - Centro, Cascavel - PR, 85805-260",
    city: "Cascavel",
    state: "PR",
    zip_code: "",
    phone: "554530393012",
    email: "",
    lat: -24.9643015,
    lng: -53.4822135,
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
    id: "s6",
    name: "Bosch Car Service - Centro Automotivo Osnir",
    address: "R. Guanabara, 940 - Vila Nova, Francisco Beltrão - PR, 85605-300",
    city: "Francisco Beltrao",
    state: "PR",
    zip_code: "",
    phone: "554630554230",
    email: "",
    lat: -26.0779018,
    lng: -53.0425415,
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
    id: "s7",
    name: "Auto Serviço Ltda",
    address: "Av. Elías Cirne Lima, 455 - Partenon, Porto Alegre - RS, 91530-310",
    city: "Porto Alegre",
    state: "RS",
    zip_code: "",
    phone: "555133221155",
    email: "",
    lat: -30.0591675,
    lng: -51.1568072,
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
    id: "s8",
    name: "Unidos VW",
    address: "Av. Ipiranga, 6400 - Jardim Botânico, Porto Alegre - RS, 90610-000",
    city: "Porto Alegre",
    state: "RS",
    zip_code: "",
    phone: "555130286400",
    email: "",
    lat: -30.0582026,
    lng: -51.17888259999999,
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
    id: "s9",
    name: "Eurotech Oficina Premium Especializada",
    address: "Av. Ceará, 1857 - São Geraldo, Porto Alegre - RS, 90240-512",
    city: "Porto Alegre",
    state: "RS",
    zip_code: "",
    phone: "555133612122",
    email: "",
    lat: -30.01207549999999,
    lng: -51.1957617,
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
    id: "s10",
    name: "StopCar Pneus",
    address: "R. Primeiro de Março, 2795 - Ideal, Novo Hamburgo - RS, 93320-020",
    city: "Novo Hamburgo",
    state: "RS",
    zip_code: "",
    phone: "555135953334",
    email: "",
    lat: -29.7093073,
    lng: -51.13462499999999,
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
    id: "s11",
    name: "Bosch Car Service - Multiauto",
    address: "R. Cel. Pontes Filho, 506 - Florestal, Lajeado - RS, 95900-720",
    city: "Lajeado",
    state: "RS",
    zip_code: "",
    phone: "555137102370",
    email: "",
    lat: -29.4550619,
    lng: -51.978656,
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
    id: "s12",
    name: "Bosch Car Service - Center Car",
    address: "R. Visc. do Rio Branco, 120 - Centro, Arroio do Meio - RS, 95940-000",
    city: "Arroio do Meio",
    state: "RS",
    zip_code: "",
    phone: "555137163845",
    email: "",
    lat: -29.40563819999999,
    lng: -51.9414466,
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
    id: "s13",
    name: "Bosch Diesel Service - Manivela Bombas Injetoras",
    address: "R. Cel. Pedroso, 155 - Centro, Bagé - RS, 96400-240",
    city: "Bage",
    state: "RS",
    zip_code: "",
    phone: "555332474094",
    email: "",
    lat: -31.3408584,
    lng: -54.1059479,
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
    id: "s14",
    name: "Futura Radiadores E Baterias",
    address: "R. Dr. Maia, 4450 - Centro, Uruguaiana - RS, 97510-161",
    city: "Uruguaiana",
    state: "RS",
    zip_code: "",
    phone: "555534020853",
    email: "",
    lat: -29.7597834,
    lng: -57.0689991,
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
    id: "s15",
    name: "Auto Mais Peças e Serviços Automotivos",
    address: "R. Guaporé, 1356 - Centro, Santa Rosa - RS, 98780-824",
    city: "Santa Rosa",
    state: "RS",
    zip_code: "",
    phone: "555535114737",
    email: "",
    lat: -27.8615111,
    lng: -54.4814419,
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
    id: "s16",
    name: "Red7 Pneus",
    address: "BR-470, KM 141, 6811 - Canta Galo, Rio do Sul - SC, 89163-020",
    city: "Rio do Sul",
    state: "SC",
    zip_code: "",
    phone: "554735255050",
    email: "",
    lat: -27.201761,
    lng: -49.6329496,
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
    id: "s17",
    name: "Lotusul Auto Center - #FériasTranquilas",
    address: "R. Carlos Thiesen, 455 - Centro, Ituporanga - SC, 88400-000",
    city: "Rio do Sul",
    state: "SC",
    zip_code: "",
    phone: "554735337000",
    email: "",
    lat: -27.4196957,
    lng: -49.595795,
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
    id: "s18",
    name: "Faust Imports/ Mecanica Ellite",
    address: "R. 5 de Outubro, 345 - Salto Norte, Blumenau - SC, 89065-030",
    city: "Blumenau",
    state: "SC",
    zip_code: "",
    phone: "554733784291",
    email: "",
    lat: -26.869873,
    lng: -49.09060400000001,
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
    id: "s19",
    name: "Régis Mecânica",
    address: "R. José Víctor da Rosa, 993 - Barreiros, São José - SC, 88117-405",
    city: "Campinas",
    state: "SC",
    zip_code: "",
    phone: "554833751115",
    email: "",
    lat: -27.5790702,
    lng: -48.61225309999999,
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
    id: "s20",
    name: "Auto Elétrica e Mecânica Possenti",
    address: "R. Renato P. Gomes, 20 - Dois Pinheiros, Videira - SC, 89562-182",
    city: "Videira",
    state: "SC",
    zip_code: "",
    phone: "554935662733",
    email: "",
    lat: -27.0060787,
    lng: -51.1413421,
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
    id: "s21",
    name: "Eletromecânica Farenzena.",
    address: "R. Videira, 154 - Centro, Treze Tílias - SC, 89650-000",
    city: "Joacaba",
    state: "SC",
    zip_code: "",
    phone: "554935371186",
    email: "",
    lat: -26.9986051,
    lng: -51.40620010000001,
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
    id: "s22",
    name: "Auto Center Guaramirim",
    address: "BR-280, 12940 - Km 56 - Centro, Guaramirim - SC, 89270-000",
    city: "Guaramirim",
    state: "SC",
    zip_code: "",
    phone: "5547996770588",
    email: "",
    lat: -26.4779764,
    lng: -48.99993529999999,
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
    id: "s23",
    name: "AS Suspensōes",
    address: "R. 2950, 906 - Centro, Balneário Camboriú - SC, 88330-348",
    city: "Balneario Camboriu",
    state: "SC",
    zip_code: "",
    phone: "554733668191",
    email: "",
    lat: -27.0020085,
    lng: -48.63470520000001,
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
    id: "s24",
    name: "Santos Centro Automotivo",
    address: "",
    city: "Balneario Camboriu",
    state: "SC",
    zip_code: "",
    phone: "",
    email: "",
    lat: -26.9883153,
    lng: -48.6411052,
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
    id: "s25",
    name: "Sanone Sistemas Hidraulicos Ltda.",
    address: "",
    city: "Mafra",
    state: "SC",
    zip_code: "",
    phone: "",
    email: "",
    lat: -26.15398080000001,
    lng: -49.83473539999999,
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
    id: "s26",
    name: "Mecânica Telefor",
    address: "",
    city: "Erechim",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -27.6304236,
    lng: -52.28040549999999,
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
    id: "s27",
    name: "Bosch Car Service - Eletro Werlang",
    address: "",
    city: "Chapeco",
    state: "SC",
    zip_code: "",
    phone: "",
    email: "",
    lat: -27.082201,
    lng: -53.005478,
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
    id: "s28",
    name: "STOPCAR MECÂNICA",
    address: "",
    city: "Sapucaia",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -29.8191512,
    lng: -51.14935080000001,
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
    id: "s29",
    name: "Auto Mecânica CD",
    address: "",
    city: "Campos Novos",
    state: "SC",
    zip_code: "",
    phone: "",
    email: "",
    lat: -27.3933944,
    lng: -51.2222518,
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
    id: "s30",
    name: "Bosch Car Service - Mecânica Turatto",
    address: "",
    city: "Dois Vizinhos",
    state: "PR",
    zip_code: "",
    phone: "",
    email: "",
    lat: -25.7541199,
    lng: -53.06009239999999,
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
    id: "s31",
    name: "Susin Auto Center Lagoa",
    address: "",
    city: "Lagoa Vermelha",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -28.2166733,
    lng: -51.5188064,
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
    id: "s32",
    name: "Bosch Car Service - Mecânica Turatto",
    address: "",
    city: "Dois Vizinhos",
    state: "PR",
    zip_code: "",
    phone: "",
    email: "",
    lat: -25.7541199,
    lng: -53.06009239999999,
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
    id: "s33",
    name: "Auto Mecânica Carlinhos",
    address: "",
    city: "Palmeira",
    state: "PR",
    zip_code: "",
    phone: "",
    email: "",
    lat: -25.4294387,
    lng: -50.0007825,
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
    id: "s34",
    name: "Centro Automotivo Conzatti",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -30.01500690000001,
    lng: -51.1618869,
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
    id: "s35",
    name: "Pampeiro S.A Comércio de Automóveis",
    address: "",
    city: "Santa Maria",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -29.69011,
    lng: -53.81044,
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
    id: "s36",
    name: "Lucena Auto Peças",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -30.0011547,
    lng: -51.20359699999999,
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
    id: "s37",
    name: "Mecânica Autocar",
    address: "",
    city: "Sao Lourenco dOeste",
    state: "SC",
    zip_code: "",
    phone: "",
    email: "",
    lat: -26.6444492,
    lng: -52.7929687,
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
    id: "s38",
    name: "Tornearia e Mecânica KRUG",
    address: "",
    city: "Itaqui",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -29.1409301,
    lng: -56.5397834,
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
    id: "s39",
    name: "Mecânica Rotta",
    address: "",
    city: "Caxias do Sul",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -29.1643656,
    lng: -51.16841339999999,
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
    id: "s40",
    name: "Auto Mecânica Berlin",
    address: "",
    city: "Frederico Westphalen",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -26.9678545,
    lng: -53.6368316,
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
    id: "s41",
    name: "Auto elétrica Campinas",
    address: "",
    city: "Erechim",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -27.718403,
    lng: -52.62451249999999,
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
    id: "s42",
    name: "Via Parts Car Service",
    address: "",
    city: "Paranavai",
    state: "PR",
    zip_code: "",
    phone: "",
    email: "",
    lat: -23.0721063,
    lng: -52.433252,
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
    id: "s43",
    name: "Auto elétrica Campinas",
    address: "",
    city: "Erechim",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -27.718403,
    lng: -52.62451249999999,
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
    id: "s44",
    name: "Centro Automotivo Porto - Porto Alegre Nonoai",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -30.0900395,
    lng: -51.2186272,
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
    id: "s45",
    name: "kustoms Auto Center",
    address: "",
    city: "Cascavel",
    state: "PR",
    zip_code: "",
    phone: "",
    email: "",
    lat: -24.9465928,
    lng: -53.4382514,
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
    id: "s46",
    name: "Alemão Auto Elétrica",
    address: "",
    city: "Viamao",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -30.0722216,
    lng: -51.1076889,
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
    id: "s47",
    name: "Mecânica Noremberg",
    address: "",
    city: "Santo Angelo",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -28.2960791,
    lng: -54.2435209,
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
    id: "s48",
    name: "Bravo Auto Center",
    address: "",
    city: "Cachoeira do Sul",
    state: "RS",
    zip_code: "",
    phone: "",
    email: "",
    lat: -30.0292459,
    lng: -52.90586829999999,
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
    id: "s49",
    name: "Bottura Pneus",
    address: "",
    city: "Mandaguari",
    state: "PR",
    zip_code: "",
    phone: "",
    email: "",
    lat: -23.5271372,
    lng: -51.67653560000001,
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
export const southWorkshops: Workshop[] = southWorkshopsData.map(convertToStandardWorkshop);
