import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaleData {
  name: string;
  vendas: number;
}

interface MonthlyStats {
  totalSales: number;
  totalRevenue: number;
  licenseSales: number;
  averageRating: number;
}

const Reports = () => {
  const { isMetaMaskConnected } = useUser();
  const { t } = useLanguage();
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    totalSales: 0,
    totalRevenue: 0,
    licenseSales: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = async () => {
    if (!isMetaMaskConnected) {
      setError("Please connect your MetaMask wallet to view reports");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual blockchain/backend calls
      // Example of how the data will be fetched in the future:
      // const salesResult = await contract.getDesignerSales(account);
      // const statsResult = await contract.getDesignerStats(account);

      // For now, return empty data
      setSalesData([]);
      setMonthlyStats({
        totalSales: 0,
        totalRevenue: 0,
        licenseSales: 0,
        averageRating: 0
      });

    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [isMetaMaskConnected]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <span className="text-gray-500">Loading reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <svg
          className="w-12 h-12 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Reports</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={fetchReportData}>Try Again</Button>
      </div>
    );
  }

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
                <span className="font-medium">{monthlyStats.totalSales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Receita Total:</span>
                <span className="font-medium">€{monthlyStats.totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Licenças Vendidas:</span>
                <span className="font-medium">{monthlyStats.licenseSales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avaliação Média:</span>
                <span className="font-medium">{monthlyStats.averageRating.toFixed(1)}/5</span>
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
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vendas" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No sales data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;