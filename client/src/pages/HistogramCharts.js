import React from 'react';
import Chart from '../components/Chart';
import { MdAssessment } from 'react-icons/md';

const HistogramCharts = ({ data }) => {
  const { chart_recommendations } = data;
  const histogramCharts = chart_recommendations.histogram || [];

  if (histogramCharts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Histograms Available</h2>
          <p className="text-gray-500">
            Not enough suitable columns to generate histograms. 
            Histograms require numeric columns.
          </p>
        </div>
      </div>
    );
  }

  const generateChartData = (chart) => {
    if (!chart.data || !chart.data.bins || !chart.data.frequencies) {
      return null;
    }
    
    return {
      series: [{
        name: 'Frequency',
        data: chart.data.frequencies
      }],
      options: {
        chart: {
          type: 'bar',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        xaxis: {
          categories: chart.data.bins,
          title: {
            text: chart.column
          }
        },
        yaxis: {
          title: {
            text: 'Frequency'
          }
        },

        colors: ['#8b5cf6'],
        chart: {
          background: 'transparent'
        },
        theme: {
          mode: 'dark'
        },
        plotOptions: {
          bar: {
            borderRadius: 2,
            columnWidth: '90%'
          }
        },
        dataLabels: {
          enabled: false
        }
      }
    };
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <MdAssessment className="text-5xl text-orange-600" /> Histograms
        </h1>
        <p className="text-gray-600">
          {histogramCharts.filter(chart => chart.data && chart.data.bins && chart.data.frequencies).length} histogram{histogramCharts.filter(chart => chart.data && chart.data.bins && chart.data.frequencies).length !== 1 ? 's' : ''} with real data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {histogramCharts.filter(chart => chart.data && chart.data.bins && chart.data.frequencies).map((chart, index) => {
          const chartData = generateChartData(chart);
          
          if (!chartData) return null;
          
          return (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-4 rounded-xl shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{chart.title}</h3>
                <p className="text-xs text-gray-400">
                  Distribution of {chart.column}
                </p>
              </div>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={220}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistogramCharts;