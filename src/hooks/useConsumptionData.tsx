import { useState, useEffect } from 'react';
import { getConsumptionByMonth, RespostaConsumoAnoMes } from '../services/dashboardService';

interface ConsumptionChartData {
  month: string;
  consumed: number;
  delivered: number;
}

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function useConsumptionData() {
  const [data, setData] = useState<ConsumptionChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = () => setRefetchIndex(prev => prev + 1);

  useEffect(() => {
    async function fetchAllMonthsData() {
      try {
        setLoading(true);
        const year = new Date().getFullYear();
        const promises: Promise<RespostaConsumoAnoMes>[] = [];
        
        for (let month = 1; month <= 12; month++) {
          promises.push(getConsumptionByMonth(year, month));
        }

        const results = await Promise.allSettled(promises);

        const chartData = results.map((result, index) => {
          const monthName = monthNames[index];
          
          if (result.status === 'fulfilled') {
            return {
              month: monthName,
              consumed: result.value.consumo,
              delivered: result.value.consumo_estimado,
            };
          } else {
            return {
              month: monthName,
              consumed: 0,
              delivered: 0,
            };
          }
        });

        setData(chartData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllMonthsData();
  }, [refetchIndex]);

  return { data, loading, error, refetch };
}
