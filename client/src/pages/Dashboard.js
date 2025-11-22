import React from 'react';
import Chart from '../components/Chart';

const Dashboard = ({ data }) => {
  const { dataset_info, columns, chart_recommendations } = data;

  // Get summary stats
  const totalNullValues = columns.reduce((sum, col) => sum + col.null_count, 0);
  const numericColumns = columns.filter(col => col.dtype === 'numeric').length;
  const categoricalColumns = columns.filter(col => col.dtype === 'categorical').length;

  // Sample chart for null values per column
  const nullValuesChart = {
    series: [{
      name: 'Null Values',
      data: columns.map(col => col.null_count)
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
        categories: columns.map(col => col.name)
      },
      title: {
        text: 'Missing Values Analysis',
        style: {
          color: '#c0c0c0',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      colors: ['#8b5cf6'],
      theme: {
        mode: 'dark'
      },
      grid: {
        borderColor: '#2a2a2a'
      },
      chart: {
        background: 'transparent'
      }
    }
  };

  // Sample pie chart for column types
  const columnTypesChart = {
    series: [numericColumns, categoricalColumns, columns.length - numericColumns - categoricalColumns],
    options: {
      chart: {
        type: 'pie',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      labels: ['Numeric', 'Categorical', 'Other'],
      title: {
        text: 'Data Type Distribution',
        style: {
          color: '#c0c0c0',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      colors: ['#8b5cf6', '#a855f7', '#6b46c1'],
      theme: {
        mode: 'dark'
      },
      legend: {
        labels: {
          colors: ['#c0c0c0']
        }
      },
      chart: {
        background: 'transparent'
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gothic-silver via-gothic-accent to-gothic-violet bg-clip-text text-transparent mb-4 tracking-wide">
          ANALYTICS NEXUS
        </h1>
        <p className="text-gothic-platinum text-xl font-light">
          Dataset: <span className="font-semibold text-gothic-accent">{dataset_info.filename}</span>
        </p>
      </div>

      {/* Glassmorphism Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="group relative backdrop-blur-xl bg-gothic-charcoal/40 border border-gothic-silver/20 p-4 rounded-2xl shadow-2xl shadow-gothic-purple/20 hover:shadow-gothic-accent/30 transform hover:scale-105 transition-all duration-500 hover:animate-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-gothic-purple/20 to-transparent rounded-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-gothic-silver uppercase tracking-widest mb-2">Total Rows</h3>
            <p className="text-2xl font-bold text-gothic-platinum mb-2">{dataset_info.row_count.toLocaleString()}</p>
            <div className="w-full h-1 bg-gothic-slate/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gothic-purple to-gothic-accent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="group relative backdrop-blur-xl bg-gothic-charcoal/40 border border-gothic-silver/20 p-4 rounded-2xl shadow-2xl shadow-gothic-violet/20 hover:shadow-gothic-accent/30 transform hover:scale-105 transition-all duration-500 hover:animate-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-gothic-violet/20 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-gothic-silver uppercase tracking-widest mb-2">Columns</h3>
            <p className="text-2xl font-bold text-gothic-platinum mb-2">{dataset_info.column_count}</p>
            <div className="w-full h-1 bg-gothic-slate/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gothic-violet to-gothic-accent rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        </div>
        
        <div className="group relative backdrop-blur-xl bg-gothic-charcoal/40 border border-gothic-silver/20 p-4 rounded-2xl shadow-2xl shadow-red-500/20 hover:shadow-red-400/30 transform hover:scale-105 transition-all duration-500 hover:animate-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-gothic-silver uppercase tracking-widest mb-2">Missing</h3>
            <p className="text-2xl font-bold text-gothic-platinum mb-2">{totalNullValues.toLocaleString()}</p>
            <div className="w-full h-1 bg-gothic-slate/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
        
        <div className="group relative backdrop-blur-xl bg-gothic-charcoal/40 border border-gothic-silver/20 p-4 rounded-2xl shadow-2xl shadow-green-500/20 hover:shadow-green-400/30 transform hover:scale-105 transition-all duration-500 hover:animate-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-gothic-silver uppercase tracking-widest mb-2">Quality</h3>
            <p className="text-2xl font-bold text-gothic-platinum mb-2">
              {((1 - totalNullValues / (dataset_info.row_count * dataset_info.column_count)) * 100).toFixed(1)}%
            </p>
            <div className="w-full h-1 bg-gothic-slate/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Glassmorphism Chart Containers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative backdrop-blur-xl bg-gothic-charcoal/30 border border-gothic-silver/20 p-6 rounded-2xl shadow-2xl shadow-gothic-purple/20 hover:shadow-gothic-accent/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-gothic-purple/10 to-transparent rounded-3xl"></div>
          <div className="relative z-10">
            <Chart
              options={{...nullValuesChart.options, theme: { mode: 'dark' }}}
              series={nullValuesChart.series}
              type="bar"
              height={280}
            />
          </div>
        </div>
        
        <div className="relative backdrop-blur-xl bg-gothic-charcoal/30 border border-gothic-silver/20 p-6 rounded-2xl shadow-2xl shadow-gothic-violet/20 hover:shadow-gothic-accent/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-gothic-violet/10 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <Chart
              options={{...columnTypesChart.options, theme: { mode: 'dark' }}}
              series={columnTypesChart.series}
              type="pie"
              height={280}
            />
          </div>
        </div>
      </div>

      {/* Chart Recommendations */}
      <div className="relative backdrop-blur-xl bg-gothic-charcoal/30 border border-gothic-silver/20 p-10 rounded-3xl shadow-2xl shadow-gothic-purple/20">
        <div className="absolute inset-0 bg-gradient-to-br from-gothic-purple/5 to-gothic-violet/5 rounded-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-gothic-platinum mb-8 tracking-wide">
            Available Analytics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.entries(chart_recommendations).map(([chartType, recommendations]) => (
              <div key={chartType} className="group relative backdrop-blur-sm bg-gothic-slate/30 border border-gothic-silver/20 p-6 rounded-2xl shadow-lg hover:shadow-gothic-accent/30 transition-all duration-300 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-gothic-accent/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-gothic-accent to-gothic-violet bg-clip-text text-transparent mb-2">
                    {recommendations.length}
                  </div>
                  <div className="text-sm text-gothic-silver capitalize font-semibold tracking-wide">
                    {chartType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;