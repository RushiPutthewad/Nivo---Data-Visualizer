import React from 'react';
import Chart from '../components/Chart';
import { MdScatterPlot } from 'react-icons/md';

const ScatterCharts = ({ data }) => {
  const { chart_recommendations } = data;
  const scatterCharts = chart_recommendations.scatter || [];

  if (scatterCharts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">⚫</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Scatter Plots Available</h2>
          <p className="text-gray-500">
            Not enough suitable columns to generate scatter plots. 
            Scatter plots require two numeric columns.
          </p>
        </div>
      </div>
    );
  }

  const generateChartData = (chart) => {
    if (!chart.data || !chart.data.points) {
      return null;
    }
    
    return {
      series: [{
        name: `${chart.xColumn} vs ${chart.yColumn}`,
        data: chart.data.points
      }],
      options: {
        chart: {
          type: 'scatter',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        xaxis: {
          title: {
            text: chart.xColumn
          }
        },
        yaxis: {
          title: {
            text: chart.yColumn
          },
          labels: {
            formatter: function (val) {
              return val.toFixed(2);
            }
          }
        },
        colors: ['#8b5cf6'],
        chart: {
          background: 'transparent'
        },
        theme: {
          mode: 'dark'
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
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <MdScatterPlot className="text-5xl text-purple-600" /> Scatter Plots
        </h1>
        <p className="text-gray-600">
          {scatterCharts.filter(chart => chart.data && chart.data.points).length} scatter plot{scatterCharts.filter(chart => chart.data && chart.data.points).length !== 1 ? 's' : ''} with real data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {scatterCharts.filter(chart => chart.data && chart.data.points).map((chart, index) => {
          const chartData = generateChartData(chart);
          
          if (!chartData) return null;
          
          return (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-4 rounded-xl shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{chart.title}</h3>
                <p className="text-xs text-gray-400">
                  Correlation between {chart.xColumn} and {chart.yColumn}
                </p>
              </div>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="scatter"
                height={300}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScatterCharts;