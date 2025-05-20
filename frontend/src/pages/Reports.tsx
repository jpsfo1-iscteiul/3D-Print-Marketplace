
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the sales chart
const salesData = [
  { name: 'Jan', vendas: 10 },
  { name: 'Fev', vendas: 15 },
  { name: 'Mar', vendas: 8 },
  { name: 'Abr', vendas: 12 },
  { name: 'Mai', vendas: 45 },
];

const Reports = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Relatórios de Vendas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Resumo do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Vendas Totais:</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Receita Total:</span>
                <span className="font-medium">€450.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Licenças Vendidas:</span>
                <span className="font-medium">120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avaliação Média:</span>
                <span className="font-medium">4.7/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Vendas por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vendas" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;