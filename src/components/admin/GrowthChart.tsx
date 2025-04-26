
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GrowthData {
  date: string;
  oficinas: number;
  usuarios: number;
  agendamentos: number;
}

interface GrowthChartProps {
  data: GrowthData[];
}

export const GrowthChart = ({ data }: GrowthChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crescimento ao Longo do Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="oficinas" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Oficinas"
              />
              <Area 
                type="monotone" 
                dataKey="usuarios" 
                stackId="2" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Usuários"
              />
              <Area 
                type="monotone" 
                dataKey="agendamentos" 
                stackId="3" 
                stroke="#ffc658" 
                fill="#ffc658" 
                name="Agendamentos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
