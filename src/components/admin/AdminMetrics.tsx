
import { Card, CardContent } from "@/components/ui/card";
import { BarChart2, Calendar, DollarSign, Users } from "lucide-react";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
}

const MetricCard = ({ icon, title, value, bgColor, iconColor }: MetricCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`${bgColor} p-3 rounded-full`}>
          {React.cloneElement(icon as React.ReactElement, { className: `h-6 w-6 ${iconColor}` })}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface AdminMetricsProps {
  totalWorkshops: number;
  newRegistrations: number;
  totalUsers: number;
  totalRevenue: number;
}

export const AdminMetrics = ({
  totalWorkshops,
  newRegistrations,
  totalUsers,
  totalRevenue,
}: AdminMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <MetricCard
        icon={<BarChart2 />}
        title="Total de Oficinas"
        value={totalWorkshops}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <MetricCard
        icon={<Calendar />}
        title="Novos Cadastros"
        value={newRegistrations}
        bgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <MetricCard
        icon={<Users />}
        title="Total de Usuários"
        value={totalUsers}
        bgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
      <MetricCard
        icon={<DollarSign />}
        title="Faturamento Total"
        value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`}
        bgColor="bg-orange-100"
        iconColor="text-orange-600"
      />
    </div>
  );
};

export default AdminMetrics;
