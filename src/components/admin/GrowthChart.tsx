
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GrowthData {
  date: string;
  workshops: number;
  users: number;
}

interface GrowthChartProps {
  data: GrowthData[];
  period: string;
}

export const GrowthChart = ({ data, period }: GrowthChartProps) => {
  // Format data for display - limit display points based on period
  const displayData = data.filter((_, index) => {
    const periodNum = parseInt(period, 10);
    if (periodNum <= 30) return true; // Show all data points for shorter periods
    if (periodNum <= 60) return index % 2 === 0; // Show every other data point
    return index % 4 === 0; // Show every 4th data point for 90 days
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Crescimento ao Longo do Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [value, name === 'workshops' ? 'Oficinas' : 'Usuários']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
              />
              <Legend 
                formatter={(value) => value === 'workshops' ? 'Oficinas' : 'Usuários'} 
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="workshops"
                name="workshops"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="users" 
                name="users" 
                stroke="#82ca9d" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
