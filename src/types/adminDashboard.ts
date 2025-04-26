
export interface GrowthData {
  date: string;
  workshops: number;
  users: number;
  agendamentos?: number;
}

export interface RegionData {
  region: string;
  revenue: number;
}

export interface MappedGrowthData {
  date: string;
  oficinas: number;
  usuarios: number;
  agendamentos: number;
}

export interface MappedRegionData {
  name: string;
  valor: number;
}
