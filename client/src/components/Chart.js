import React, { useEffect, useRef } from 'react';

const Chart = ({ options, series, type, height = 350 }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && window.ApexCharts) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const chartConfig = {
        ...options,
        series: series,
        chart: {
          ...options.chart,
          type: type,
          height: height
        }
      };

      chartInstance.current = new window.ApexCharts(chartRef.current, chartConfig);
      chartInstance.current.render();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [options, series, type, height]);

  return <div ref={chartRef}></div>;
};

export default Chart;