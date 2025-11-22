import { useState, useCallback } from 'react';

export const useChartData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChartData = useCallback(async (csvFile, chartConfig) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', csvFile);
      formData.append('chartType', chartConfig.chartType);
      formData.append('xColumn', chartConfig.xColumn);
      formData.append('yColumn', chartConfig.yColumn);
      formData.append('aggregation', chartConfig.aggregation || 'mean');

      const response = await fetch('http://localhost:5000/api/chart-data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchChartData, loading, error };
};