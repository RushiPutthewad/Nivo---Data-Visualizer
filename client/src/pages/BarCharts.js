import React from 'react';
import Chart from '../components/Chart';
import { MdBarChart } from 'react-icons/md';

const BarCharts = ({ data }) => {
  const { chart_recommendations } = data;
  const barCharts = chart_recommendations.bar || [];

  if (barCharts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
          <div className="text-8xl mb-6 animate-pulse">📊</div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-slate-300 mb-4">No Bar Charts Available</h2>
          <p className="text-gray-500 dark:text-slate-400 text-lg">
            Not enough suitable columns to generate bar charts. 
            <br />Bar charts require categorical and numeric columns.
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
      categories: chart.data.categories,
      values: chart.data.values
    };
  };

  const createChartConfig = (chart) => {
    const chartData = generateChartData(chart);
    if (!chartData) return null;
    
    const { categories, values } = chartData;
    
    return {
      series: [{
        name: chart.yColumn,
        data: values
      }],
      options: {
        chart: {
          type: 'bar',
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
        xaxis: {
          categories: categories,
          title: {
            text: chart.xColumn,
            style: {
              color: '#c0c0c0'
            }
          }
        },
        yaxis: {
          title: {
            text: chart.yColumn,
            style: {
              color: '#c0c0c0'
            }
          },
          labels: {
            formatter: function (val) {
              return parseFloat(val).toFixed(2);
            }
          }
        },
        colors: ['#8b5cf6'],
        theme: {
          mode: 'dark'
        },
        chart: {
          background: 'transparent'
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#E8D8E0']
          },
          formatter: function (val) {
            return parseFloat(val).toFixed(2);
          }
        }
      }
    };
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <MdBarChart className="text-5xl text-blue-600" /> Bar Charts
        </h1>
        <p className="text-gray-600 dark:text-slate-400 text-lg">
          <span className="font-semibold text-blue-600 dark:text-blue-400">{barCharts.filter(chart => chart.data && chart.data.categories && chart.data.values).length}</span> bar chart{barCharts.filter(chart => chart.data && chart.data.categories && chart.data.values).length !== 1 ? 's' : ''} with real data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {barCharts.filter(chart => chart.data && chart.data.categories && chart.data.values).map((chart, index) => {
          const chartData = createChartConfig(chart);
          
          if (!chartData) return null;
          
          return (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-4 rounded-xl shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{chart.title}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    {chart.xColumn} vs {chart.yColumn} ({chart.aggregation})
                  </p>
                  {chart.data && (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      {chart.data.values?.length || 0} categories
                    </span>
                  )}
                </div>
              </div>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={280}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarCharts;