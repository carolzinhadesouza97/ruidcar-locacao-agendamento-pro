import { useState, useEffect } from 'react';
import { Building, Sparkles, Users, DollarSign } from 'lucide-react';
import { getMockDashboardData } from '@/data/adminDashboard';
import AdminDashboardHeader from '@/components/admin/AdminDashboardHeader';
import MetricCard from '@/components/admin/MetricCard';
import GrowthChart from '@/components/admin/GrowthChart';
import RegionRevenueChart from '@/components/admin/RegionRevenueChart';
import SpecialtyDistributionChart from '@/components/admin/SpecialtyDistributionChart';
import PendingWorkshopsTable from '@/components/admin/PendingWorkshopsTable';
import WorkshopRankingTable from '@/components/admin/WorkshopRankingTable';
import UserAnalytics from '@/components/admin/UserAnalytics';
import WorkshopDensityMap from '@/components/admin/WorkshopDensityMap';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [period, setPeriod] = useState('30');
  const [filter, setFilter] = useState({ region: 'all', date: '' });
  const [sortBy, setSortBy] = useState('appointments');
  const [dashboardData, setDashboardData] = useState(getMockDashboardData('30'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now, we're using mock data
        const data = getMockDashboardData(period);
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const handleExportData = () => {
    toast.success('Dados exportados com sucesso!');
    // In a real implementation, this would trigger a file download
  };

  const approveWorkshop = async (id: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state
      const updatedWorkshops = dashboardData.pendingWorkshops.filter(
        workshop => workshop.id !== id
      );
      
      setDashboardData({
        ...dashboardData,
        pendingWorkshops: updatedWorkshops,
        totalWorkshops: dashboardData.totalWorkshops + 1
      });
      
      toast.success('Oficina aprovada com sucesso!');
    } catch (error) {
      console.error('Error approving workshop:', error);
      toast.error('Erro ao aprovar oficina');
    }
  };

  const rejectWorkshop = async (id: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state
      const updatedWorkshops = dashboardData.pendingWorkshops.filter(
        workshop => workshop.id !== id
      );
      
      setDashboardData({
        ...dashboardData,
        pendingWorkshops: updatedWorkshops
      });
      
      toast.success('Oficina rejeitada com sucesso!');
    } catch (error) {
      console.error('Error rejecting workshop:', error);
      toast.error('Erro ao rejeitar oficina');
    }
  };

  // Filter pending workshops
  const filteredPendingWorkshops = dashboardData.pendingWorkshops.filter(workshop => {
    const regionMatch = filter.region === 'all' || workshop.region === filter.region;
    const dateMatch = !filter.date || new Date(workshop.registrationDate) >= new Date(filter.date);
    return regionMatch && dateMatch;
  });

  // Sort top workshops
  const sortedTopWorkshops = [...dashboardData.topWorkshops].sort((a, b) => {
    if (sortBy === 'appointments') return b.totalAppointments - a.totalAppointments;
    if (sortBy === 'revenue') return b.revenue - a.revenue;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminDashboardHeader 
        period={period}
        setPeriod={setPeriod}
        exportData={handleExportData}
      />
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Total de Oficinas"
          value={dashboardData.totalWorkshops}
          icon={<Building />}
          trend={dashboardData.workshopsTrend}
          description={`${dashboardData.pendingWorkshops.length} pendentes de aprovação`}
        />
        <MetricCard 
          title="Novos Cadastros"
          value={dashboardData.newWorkshops}
          icon={<Sparkles />}
          trend={dashboardData.newWorkshopsTrend}
          description={`no período de ${period} dias`}
        />
        <MetricCard 
          title="Total de Usuários"
          value={dashboardData.totalUsers}
          icon={<Users />}
          trend={dashboardData.usersTrend}
        />
        <MetricCard 
          title="Faturamento Global"
          value={`R$ ${dashboardData.totalRevenue.toLocaleString('pt-BR')}`}
          icon={<DollarSign />}
          trend={dashboardData.revenueTrend}
          description={`média de R$ ${(dashboardData.totalRevenue / dashboardData.totalWorkshops).toFixed(2)} por oficina`}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GrowthChart 
          data={dashboardData.growthOverTime}
          period={period}
        />
        <RegionRevenueChart 
          data={dashboardData.revenueByRegion}
        />
      </div>
      
      {/* Workshop Map and Specialty Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <WorkshopDensityMap 
          data={dashboardData.workshopsByRegion}
        />
        <SpecialtyDistributionChart 
          data={dashboardData.specialtyDistribution}
        />
      </div>
      
      {/* Pending Workshops Table */}
      <div className="mb-6">
        <PendingWorkshopsTable 
          workshops={filteredPendingWorkshops}
          approveWorkshop={approveWorkshop}
          rejectWorkshop={rejectWorkshop}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
      
      {/* Workshop Ranking Table */}
      <div className="mb-6">
        <WorkshopRankingTable 
          workshops={sortedTopWorkshops}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
      
      {/* User Analytics */}
      <div className="mb-6">
        <UserAnalytics 
          activeUsers={dashboardData.activeUsers}
          deviceDistribution={dashboardData.deviceDistribution}
          peakHours={dashboardData.peakHours}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
