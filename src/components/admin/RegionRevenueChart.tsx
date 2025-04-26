
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegionData } from '@/types/adminDashboard';

interface RegionRevenueChartProps {
  data: RegionData[];
}

export const RegionRevenueChart = ({ data }: RegionRevenueChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Faturamento por Região</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} 
              />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Faturamento" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionRevenueChart;
