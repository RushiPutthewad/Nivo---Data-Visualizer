import React from 'react';
import Chart from '../components/Chart';
import { MdPieChart } from 'react-icons/md';

const PieCharts = ({ data }) => {
  const { chart_recommendations } = data;
  const pieCharts = chart_recommendations.pie || [];

  if (pieCharts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">🥧</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Pie Charts Available</h2>
          <p className="text-gray-500">
            Not enough suitable columns to generate pie charts. 
            Pie charts require categorical columns with 2-12 unique values.
          </p>
        </div>
      </div>
    );
  }

  const generateChartData = (chart) => {
    if (!chart.data || !chart.data.categories || !chart.data.values) {
      return null;
    }
    
    return {
      series: chart.data.values,
      options: {
        chart: {
          type: 'pie',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            }
          }
        },
        labels: chart.data.categories,
        colors: ['#8b5cf6', '#a855f7', '#6b46c1', '#c084fc', '#ddd6fe'],
        theme: {
          mode: 'dark'
        },
        chart: {
          background: 'transparent'
        },
        legend: {
          position: 'bottom',
          labels: {
            colors: ['#c0c0c0']
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '0%'
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(1) + '%';
          }
        }
      }
    };
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <MdPieChart className="text-5xl text-yellow-600" /> Pie Charts
        </h1>
        <p className="text-gray-600">
          {pieCharts.length} pie chart{pieCharts.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pieCharts.map((chart, index) => {
          const chartData = generateChartData(chart);
          
          if (!chartData) {
            return (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-4 rounded-xl shadow-lg">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{chart.title}</h3>
                  <p className="text-xs text-red-400">No data available</p>
                </div>
              </div>
            );
          }
          
          return (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-4 rounded-xl shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{chart.title}</h3>
                <p className="text-xs text-gray-400">
                  {chart.column} distribution ({chart.aggregation})
                </p>
              </div>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="pie"
                height={250}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieCharts;