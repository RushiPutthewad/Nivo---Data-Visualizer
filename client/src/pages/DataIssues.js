import React from 'react';
import Chart from '../components/Chart';

const DataIssues = ({ data }) => {
  const { columns } = data;

  // Chart for null values
  const nullValuesChart = {
    series: [{
      name: 'Null Count',
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
        categories: columns.map(col => col.name),
        labels: {
          rotate: -45
        }
      },
      title: {
        text: 'Missing Values by Column',
        style: {
          color: '#c0c0c0'
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
          colors: ['#304758']
        }
      }
    }
  };

  // Chart for outliers (numeric columns only)
  const numericColumns = columns.filter(col => col.dtype === 'numeric' && col.outlier_count > 0);
  const outliersChart = {
    series: [{
      name: 'Outlier Count',
      data: numericColumns.map(col => col.outlier_count)
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
        categories: numericColumns.map(col => col.name),
        labels: {
          rotate: -45
        }
      },
      title: {
        text: 'Outliers in Numeric Columns',
        style: {
          color: '#c0c0c0'
        }
      },
      colors: ['#f59e0b'],
      theme: {
        mode: 'dark'
      },
      chart: {
        background: 'transparent'
      },
      plotOptions: {
        bar: {
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
          colors: ['#304758']
        }
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4 tracking-wide">
          DATA DIAGNOSTICS
        </h1>
        <p className="text-gothic-platinum text-xl font-light">Analysis of missing and problematic data</p>
      </div>

      {/* Glassmorphism Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="group relative backdrop-blur-xl bg-gothic-charcoal/40 border border-gothic-silver/20 p-4 rounded-2xl shadow-2xl shadow-red-500/20 hover:shadow-red-400/30 transform hover:scale-105 transition-all duration-500 hover:animate-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-gothic-silver uppercase tracking-widest mb-2">Columns with Issues</h3>
            <p className="text-2xl font-bold text-gothic-platinum mb-2">
              {columns.filter(col => col.null_count > 0).length}
            </p>
            <div className="w-full h-1 bg-gothic-slate/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="group relative backdrop-blur-xl bg-gothic-charcoal/40 border border-gothic-silver/20 p-4 rounded-2xl shadow-2xl shadow-orange-500/20 hover:shadow-orange-400/30 transform hover:scale-105 transition-all duration-500 hover:animate-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-gothic-silver uppercase tracking-widest mb-2">Total Missing</h3>
            <p className="text-2xl font-bold text-gothic-platinum mb-2">
              {columns.reduce((sum, col) => sum + col.null_count, 0).toLocaleString()}
            </p>
            <div className="w-full h-1 bg-gothic-slate/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        </div>
        
        <div className="group relative backdrop-blur-xl bg-gothic-charcoal/40 border border-gothic-silver/20 p-4 rounded-2xl shadow-2xl shadow-pink-500/20 hover:shadow-pink-400/30 transform hover:scale-105 transition-all duration-500 hover:animate-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-gothic-silver uppercase tracking-widest mb-2">Worst Column</h3>
            <p className="text-xl font-bold text-gothic-platinum mb-2">
              {columns.reduce((worst, col) => 
                col.null_percent > worst.null_percent ? col : worst, columns[0]
              ).name}
            </p>
            <div className="w-full h-1 bg-gothic-slate/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
        
        <div className="group relative backdrop-blur-xl bg-gothic-charcoal/40 border border-gothic-silver/20 p-4 rounded-2xl shadow-2xl shadow-yellow-500/20 hover:shadow-yellow-400/30 transform hover:scale-105 transition-all duration-500 hover:animate-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-gothic-silver uppercase tracking-widest mb-2">Total Outliers</h3>
            <p className="text-2xl font-bold text-gothic-platinum mb-2">
              {columns.reduce((sum, col) => sum + (col.outlier_count || 0), 0).toLocaleString()}
            </p>
            <div className="w-full h-1 bg-gothic-slate/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Values Chart */}
        <div className="relative backdrop-blur-xl bg-gothic-charcoal/30 border border-gothic-silver/20 p-6 rounded-2xl shadow-2xl shadow-gothic-purple/20 hover:shadow-gothic-accent/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-gothic-purple/10 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <Chart
              options={nullValuesChart.options}
              series={nullValuesChart.series}
              type="bar"
              height={400}
            />
          </div>
        </div>
        
        {/* Outliers Chart */}
        {numericColumns.length > 0 && (
          <div className="relative backdrop-blur-xl bg-gothic-charcoal/30 border border-gothic-silver/20 p-6 rounded-2xl shadow-2xl shadow-yellow-500/20 hover:shadow-yellow-400/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-2xl"></div>
            <div className="relative z-10">
              <Chart
                options={outliersChart.options}
                series={outliersChart.series}
                type="bar"
                height={400}
              />
            </div>
          </div>
        )}
      </div>

      {/* Detailed Table */}
      <div className="relative backdrop-blur-xl bg-gothic-charcoal/30 border border-gothic-silver/20 rounded-3xl shadow-2xl shadow-gothic-purple/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gothic-purple/5 to-gothic-violet/5 rounded-3xl"></div>
        <div className="relative z-10 px-10 py-8 border-b border-gothic-silver/20">
          <h2 className="text-3xl font-bold text-gothic-platinum tracking-wide">
            Column Diagnostics
          </h2>
        </div>
        <div className="relative z-10 overflow-x-auto">
          <table className="min-w-full divide-y divide-gothic-silver/20">
            <thead className="backdrop-blur-sm bg-gothic-slate/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gothic-silver uppercase tracking-widest">
                  Column Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gothic-silver uppercase tracking-widest">
                  Data Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gothic-silver uppercase tracking-widest">
                  Null Count
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gothic-silver uppercase tracking-widest">
                  Null Percentage
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gothic-silver uppercase tracking-widest">
                  Unique Values
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gothic-silver uppercase tracking-widest">
                  Outliers
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gothic-silver uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="backdrop-blur-sm divide-y divide-gothic-silver/10">
              {columns.map((column, index) => (
                <tr key={index} className={`hover:bg-gothic-slate/20 transition-all duration-300 backdrop-blur-sm ${
                  index % 2 === 0 ? 'bg-gothic-charcoal/20' : 'bg-gothic-slate/10'
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gothic-platinum">
                    {column.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gothic-silver">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      column.dtype === 'numeric' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                      column.dtype === 'categorical' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      column.dtype === 'datetime' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {column.dtype}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gothic-platinum">
                    {column.null_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-bold ${
                      column.null_percent > 50 ? 'text-red-400' :
                      column.null_percent > 20 ? 'text-yellow-400' :
                      column.null_percent > 0 ? 'text-orange-400' :
                      'text-green-400'
                    }`}>
                      {column.null_percent}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gothic-platinum">
                    {column.unique_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {column.dtype === 'numeric' ? (
                      <span className={`font-bold ${
                        (column.outlier_percent || 0) > 10 ? 'text-red-400' :
                        (column.outlier_percent || 0) > 5 ? 'text-yellow-400' :
                        (column.outlier_percent || 0) > 0 ? 'text-orange-400' :
                        'text-green-400'
                      }`}>
                        {column.outlier_count || 0} ({(column.outlier_percent || 0).toFixed(1)}%)
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                      column.null_percent === 0 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      column.null_percent < 20 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {column.null_percent === 0 ? '✓ Clean' :
                       column.null_percent < 20 ? '⚠️ Minor Issues' : '❌ Major Issues'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataIssues;