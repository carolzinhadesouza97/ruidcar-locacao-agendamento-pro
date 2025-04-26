import React, { useState, useEffect } from 'react';
import { getMockDashboardData } from '@/data/adminDashboard';
import { GrowthChart } from '@/components/admin/GrowthChart';
import { RegionRevenueChart } from '@/components/admin/RegionRevenueChart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MappedGrowthData, MappedRegionData } from '@/types/adminDashboard';

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    totalWorkshops: 0,
    totalUsers: 0,
    growthOverTime: [],
    revenueByRegion: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dashboardData = getMockDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map data for GrowthChart component with proper type
  const mappedGrowthData: MappedGrowthData[] = data.growthOverTime.map(item => ({
    date: item.date,
    oficinas: item.workshops,
    usuarios: item.users,
    agendamentos: item.agendamentos ?? (item.workshops + Math.floor(Math.random() * 20))
  }));

  // Map data for RegionRevenueChart component with proper type
  const mappedRegionData: MappedRegionData[] = data.revenueByRegion.map(item => ({
    name: item.region,
    valor: item.revenue
  }));

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Painel de Administração</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Faturamento Total</CardTitle>
          </CardHeader>
          <CardContent>
            R$ {data.totalRevenue.toLocaleString('pt-BR')}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento do Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            {data.revenueGrowth}%
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total de Oficinas</CardTitle>
          </CardHeader>
          <CardContent>
            {data.totalWorkshops}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {data.totalUsers}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        <GrowthChart data={mappedGrowthData} />
        <RegionRevenueChart data={mappedRegionData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
