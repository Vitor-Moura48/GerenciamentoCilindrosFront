import { useState, useEffect } from 'react';
import { SectorsQuantityCylinder } from '../services/cylinder-movementsService';

interface ChartData {
  day: string;
  count: number;
}

export interface DashboardData {
    chartData: ChartData[];
    currentPeriodTotal: number;
    percentageChange: number;
    isIncrease: boolean;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
      chartData: [],
      currentPeriodTotal: 0,
      percentageChange: 0,
      isIncrease: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = () => setRefetchIndex(prev => prev + 1);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const movements = await SectorsQuantityCylinder();
        
        const today = new Date();
        const chartData: ChartData[] = [];
        let currentPeriodTotal = 0;
        let previousPeriodTotal = 0;

        const getCountForDate = (date: Date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const dayOfMonth = date.getDate().toString().padStart(2, '0');
            const dateStringForComparison = `${year}-${month}-${dayOfMonth}`;
            return movements.filter(m => m.data_consumo.startsWith(dateStringForComparison)).length;
        };

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const count = getCountForDate(date);
          const dayForLabel = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          chartData.push({ day: dayForLabel, count });
          currentPeriodTotal += count;
        }

        for (let i = 13; i >= 7; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          previousPeriodTotal += getCountForDate(date);
        }

        let percentageChange = 0;
        if (previousPeriodTotal > 0) {
            percentageChange = ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
        } else if (currentPeriodTotal > 0) {
            percentageChange = 100;
        }
        
        const isIncrease = currentPeriodTotal >= previousPeriodTotal;

        setData({
            chartData,
            currentPeriodTotal,
            percentageChange,
            isIncrease,
        });

      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [refetchIndex]);

  return { data, loading, error, refetch };
}