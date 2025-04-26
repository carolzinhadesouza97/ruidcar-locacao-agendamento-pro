export interface AdminDashboardData {
  growthOverTime: {
    date: string;
    oficinas: number;
    usuarios: number;
    agendamentos: number;
  }[];
  revenueByRegion: {
    name: string;
    valor: number;
  }[];
  workshopsBySpecialty: {
    name: string;
    valor: number;
  }[];
  pendingWorkshops: {
    id: number;
    nome: string;
    proprietario: string;
    email: string;
    telefone: string;
    cidade: string;
    estado: string;
    dataCadastro: string;
  }[];
  workshopRanking: {
    id: number;
    nome: string;
    agendamentos: number;
    avaliacao: string;
    faturamento: number;
    cidade: string;
    estado: string;
  }[];
  userAnalytics: {
    deviceDistribution: {
      name: string;
      valor: number;
    }[];
    peakHours: {
      hora: string;
      usuarios: number;
    }[];
    userRetention: {
      semana: string;
      retencao: number;
    }[];
  };
  totalWorkshops: number;
  newRegistrations: number;
  totalUsers: number;
  totalRevenue: number;
}

export const generateMockAdminData = (period: number): AdminDashboardData => {
  // Dados de crescimento ao longo do tempo
  const growthOverTime = Array.from({ length: period }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (period - i - 1));
    return {
      date: date.toLocaleDateString('pt-BR'),
      oficinas: Math.floor(Math.random() * 5) + (i / 5) + 50,
      usuarios: Math.floor(Math.random() * 10) + (i / 3) + 100,
      agendamentos: Math.floor(Math.random() * 15) + (i / 2) + 150,
    };
  });

  // Dados de faturamento por região
  const revenueByRegion = [
    { name: 'Sudeste', valor: Math.floor(Math.random() * 50000) + 30000 },
    { name: 'Sul', valor: Math.floor(Math.random() * 30000) + 20000 },
    { name: 'Nordeste', valor: Math.floor(Math.random() * 25000) + 15000 },
    { name: 'Centro-Oeste', valor: Math.floor(Math.random() * 20000) + 10000 },
    { name: 'Norte', valor: Math.floor(Math.random() * 15000) + 5000 },
  ];

  // Dados de distribuição de oficinas por especialidade
  const workshopsBySpecialty = [
    { name: 'Mecânica Geral', valor: 35 },
    { name: 'Elétrica', valor: 25 },
    { name: 'Funilaria', valor: 15 },
    { name: 'Pneus e Rodas', valor: 15 },
    { name: 'Outros', valor: 10 },
  ];

  // Dados de oficinas pendentes de aprovação
  const pendingWorkshops = Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    return {
      id: i + 1,
      nome: `Oficina ${i + 1}`,
      proprietario: `Proprietário ${i + 1}`,
      email: `oficina${i + 1}@exemplo.com`,
      telefone: `(${Math.floor(Math.random() * 90) + 10}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      cidade: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador', 'Curitiba', 'Fortaleza', 'Recife'][Math.floor(Math.random() * 8)],
      estado: ['SP', 'RJ', 'MG', 'DF', 'BA', 'PR', 'CE', 'PE'][Math.floor(Math.random() * 8)],
      dataCadastro: date.toLocaleDateString('pt-BR'),
    };
  });

  // Dados de ranking de oficinas
  const workshopRanking = Array.from({ length: 10 }, (_, i) => {
    return {
      id: i + 1,
      nome: `Oficina ${String.fromCharCode(65 + i)}`,
      agendamentos: Math.floor(Math.random() * 100) + 50,
      avaliacao: (Math.random() * 2 + 3).toFixed(1),
      faturamento: Math.floor(Math.random() * 50000) + 10000,
      cidade: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador', 'Curitiba', 'Fortaleza', 'Recife'][Math.floor(Math.random() * 8)],
      estado: ['SP', 'RJ', 'MG', 'DF', 'BA', 'PR', 'CE', 'PE'][Math.floor(Math.random() * 8)],
    };
  }).sort((a, b) => b.agendamentos - a.agendamentos);

  // Dados de análise de usuários
  const userAnalytics = {
    deviceDistribution: [
      { name: 'Mobile', valor: 65 },
      { name: 'Desktop', valor: 30 },
      { name: 'Tablet', valor: 5 },
    ],
    peakHours: [
      { hora: '6-9h', usuarios: Math.floor(Math.random() * 50) + 10 },
      { hora: '9-12h', usuarios: Math.floor(Math.random() * 100) + 50 },
      { hora: '12-15h', usuarios: Math.floor(Math.random() * 80) + 40 },
      { hora: '15-18h', usuarios: Math.floor(Math.random() * 120) + 60 },
      { hora: '18-21h', usuarios: Math.floor(Math.random() * 150) + 80 },
      { hora: '21-24h', usuarios: Math.floor(Math.random() * 70) + 30 },
    ],
    userRetention: Array.from({ length: 10 }, (_, i) => {
      return {
        semana: `Semana ${i + 1}`,
        retencao: Math.floor(Math.random() * 20) + 60 - (i * 3),
      };
    }),
  };

  // Métricas principais
  const totalWorkshops = 125 + Math.floor(Math.random() * 20);
  const newRegistrations = 12 + Math.floor(Math.random() * 8);
  const totalUsers = 1500 + Math.floor(Math.random() * 300);
  const totalRevenue = revenueByRegion.reduce((sum, item) => sum + item.valor, 0);

  return {
    growthOverTime,
    revenueByRegion,
    workshopsBySpecialty,
    pendingWorkshops,
    workshopRanking,
    userAnalytics,
    totalWorkshops,
    newRegistrations,
    totalUsers,
    totalRevenue,
  };
};
