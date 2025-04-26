
export interface MetricData {
  value: number | string;
  trend: number;
  description?: string;
}

export interface AdminDashboardData {
  totalWorkshops: number;
  workshopsTrend: number;
  newWorkshops: number;
  newWorkshopsTrend: number;
  totalUsers: number;
  usersTrend: number;
  totalRevenue: number;
  revenueTrend: number;
  pendingWorkshops: PendingWorkshop[];
  topWorkshops: TopWorkshop[];
  growthOverTime: GrowthData[];
  revenueByRegion: RegionData[];
  workshopsByRegion: RegionMapData[];
  specialtyDistribution: SpecialtyData[];
  activeUsers: TimeSeriesData[];
  deviceDistribution: DeviceData[];
  peakHours: HourData[];
}

export interface PendingWorkshop {
  id: string;
  name: string;
  address: string;
  contact: string;
  registrationDate: string;
  region: string;
}

export interface TopWorkshop {
  id: string;
  name: string;
  region: string;
  totalAppointments: number;
  revenue: number;
  rating: number;
}

export interface GrowthData {
  date: string;
  workshops: number;
  users: number;
}

export interface RegionData {
  region: string;
  revenue: number;
}

export interface RegionMapData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  count: number;
}

export interface SpecialtyData {
  name: string;
  value: number;
  color: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface DeviceData {
  name: string;
  value: number;
  color: string;
}

export interface HourData {
  hour: string;
  count: number;
}

export const getMockDashboardData = (period: string): AdminDashboardData => {
  // This function generates mock data based on the selected period
  // In a real implementation, this would be replaced with API calls
  
  const periodNum = parseInt(period, 10);
  const multiplier = periodNum / 30; // Scale factor based on period
  
  return {
    totalWorkshops: Math.floor(150 + 10 * multiplier),
    workshopsTrend: 5.2 + (multiplier * 0.8),
    newWorkshops: Math.floor(15 * multiplier),
    newWorkshopsTrend: 8.7 - (multiplier * 0.5),
    totalUsers: Math.floor(1200 + 80 * multiplier),
    usersTrend: 12.5 + (multiplier * 0.3),
    totalRevenue: Math.round((85000 + 15000 * multiplier) * 100) / 100,
    revenueTrend: 7.8 + (multiplier * 0.7),
    
    pendingWorkshops: [
      {
        id: "w1",
        name: "Oficina Mecânica Silva",
        address: "Rua das Flores, 123 - São Paulo, SP",
        contact: "contato@mecanicastilva.com.br",
        registrationDate: "2025-04-20",
        region: "sudeste"
      },
      {
        id: "w2",
        name: "Auto Center Oliveira",
        address: "Av. Brasil, 456 - Rio de Janeiro, RJ",
        contact: "contato@autocenter.com.br",
        registrationDate: "2025-04-19",
        region: "sudeste"
      },
      {
        id: "w3",
        name: "Mecânica Expressa",
        address: "Rua Principal, 789 - Fortaleza, CE",
        contact: "contato@mecanicaexpressa.com.br",
        registrationDate: "2025-04-18",
        region: "nordeste"
      },
      {
        id: "w4",
        name: "Oficina do João",
        address: "Av. Santos Dumont, 321 - Manaus, AM",
        contact: "contato@oficinadojoao.com.br",
        registrationDate: "2025-04-17",
        region: "norte"
      },
      {
        id: "w5",
        name: "Auto Tech Services",
        address: "Rua das Palmeiras, 654 - Porto Alegre, RS",
        contact: "contato@autotechservices.com.br",
        registrationDate: "2025-04-16",
        region: "sul"
      }
    ],
    
    topWorkshops: [
      {
        id: "tw1",
        name: "Centro Automotivo Premium",
        region: "Sudeste",
        totalAppointments: 156,
        revenue: 45600,
        rating: 4.9
      },
      {
        id: "tw2",
        name: "Oficina Motor Master",
        region: "Sul",
        totalAppointments: 142,
        revenue: 38500,
        rating: 4.8
      },
      {
        id: "tw3",
        name: "Quality Auto Service",
        region: "Centro-Oeste",
        totalAppointments: 128,
        revenue: 32400,
        rating: 4.7
      },
      {
        id: "tw4",
        name: "Car Doctor",
        region: "Nordeste",
        totalAppointments: 115,
        revenue: 29800,
        rating: 4.6
      },
      {
        id: "tw5",
        name: "Mecânica Rápida e Precisa",
        region: "Sudeste",
        totalAppointments: 108,
        revenue: 27500,
        rating: 4.8
      }
    ],
    
    growthOverTime: Array.from({ length: periodNum }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (periodNum - i));
      return {
        date: date.toISOString().split('T')[0],
        workshops: Math.floor(130 + i * 0.7),
        users: Math.floor(1050 + i * 5)
      };
    }),
    
    revenueByRegion: [
      { region: "Sudeste", revenue: 42000 },
      { region: "Sul", revenue: 18000 },
      { region: "Centro-Oeste", revenue: 12000 },
      { region: "Nordeste", revenue: 9000 },
      { region: "Norte", revenue: 4000 }
    ],
    
    workshopsByRegion: [
      { id: "r1", name: "São Paulo", lat: -23.5505, lng: -46.6333, count: 45 },
      { id: "r2", name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, count: 32 },
      { id: "r3", name: "Belo Horizonte", lat: -19.9167, lng: -43.9345, count: 18 },
      { id: "r4", name: "Porto Alegre", lat: -30.0346, lng: -51.2177, count: 15 },
      { id: "r5", name: "Brasília", lat: -15.7801, lng: -47.9292, count: 12 },
      { id: "r6", name: "Salvador", lat: -12.9714, lng: -38.5014, count: 10 },
      { id: "r7", name: "Recife", lat: -8.0476, lng: -34.8770, count: 8 },
      { id: "r8", name: "Manaus", lat: -3.1190, lng: -60.0217, count: 5 }
    ],
    
    specialtyDistribution: [
      { name: "Mecânica Geral", value: 40, color: "#FF6384" },
      { name: "Elétrica", value: 25, color: "#36A2EB" },
      { name: "Funilaria e Pintura", value: 15, color: "#FFCE56" },
      { name: "Injeção Eletrônica", value: 10, color: "#4BC0C0" },
      { name: "Ar-condicionado", value: 10, color: "#9966FF" }
    ],
    
    activeUsers: Array.from({ length: periodNum }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (periodNum - i));
      return {
        date: date.toISOString().split('T')[0],
        value: Math.floor(700 + Math.random() * 300)
      };
    }),
    
    deviceDistribution: [
      { name: "Smartphone", value: 68, color: "#FF6384" },
      { name: "Desktop", value: 22, color: "#36A2EB" },
      { name: "Tablet", value: 10, color: "#FFCE56" }
    ],
    
    peakHours: [
      { hour: "8-10h", count: 120 },
      { hour: "10-12h", count: 180 },
      { hour: "12-14h", count: 90 },
      { hour: "14-16h", count: 210 },
      { hour: "16-18h", count: 310 },
      { hour: "18-20h", count: 220 },
      { hour: "20-22h", count: 100 }
    ]
  };
};
