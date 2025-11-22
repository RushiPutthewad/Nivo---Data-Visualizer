import React from 'react';
import Chart from '../components/Chart';
import { MdShowChart } from 'react-icons/md';

const LineCharts = ({ data }) => {
  const { chart_recommendations } = data;
  const lineCharts = chart_recommendations.line || [];

  if (lineCharts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
          <div className="text-8xl mb-6 animate-pulse">📈</div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-slate-300 mb-4">No Line Charts Available</h2>
          <p className="text-gray-500 dark:text-slate-400 text-lg">
            Not enough suitable columns to generate line charts.
            <br />Line charts require datetime or ordered numeric columns with numeric values.
          </p>
        </div>
      </div>
    );
  }

  const generateChartData = (chart) => {
    if (!chart.data || !chart.data.categories || !chart.data.values) {
      return null;
    }
    
    const categories = chart.data.categories.map(date => 
      new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const values = chart.data.values;
    
    return { categories, values };
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
          type: 'line',
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
        stroke: {
          curve: 'smooth',
          width: 3
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
          }
        },
        colors: ['#8b5cf6'],
        theme: {
          mode: 'dark'
        },
        chart: {
          background: 'transparent'
        },
        markers: {
          size: 6,
          hover: {
            size: 8
          }
        },
        grid: {
          borderColor: '#f1f5f9'
        }
      }
    };
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <MdShowChart className="text-5xl text-green-600" /> Line Charts
        </h1>
        <p className="text-gray-600 dark:text-slate-400 text-lg">
          <span className="font-semibold text-green-600 dark:text-green-400">{lineCharts.filter(chart => chart.data && chart.data.categories && chart.data.values).length}</span> line chart{lineCharts.filter(chart => chart.data && chart.data.categories && chart.data.values).length !== 1 ? 's' : ''} with real data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {lineCharts.filter(chart => chart.data && chart.data.categories && chart.data.values).map((chart, index) => {
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
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {chart.data.values?.length || 0} data points
                    </span>
                  )}
                </div>
              </div>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={220}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LineCharts;