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

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
          ⚠️ Data Issues
        </h1>
        <p className="text-gray-600 dark:text-slate-400 text-lg">Analysis of missing and problematic data</p>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          📈 Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg">
            <h3 className="text-sm font-medium text-red-100">Columns with Issues</h3>
            <p className="text-3xl font-bold">
              {columns.filter(col => col.null_count > 0).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
            <h3 className="text-sm font-medium text-orange-100">Total Missing Values</h3>
            <p className="text-3xl font-bold">
              {columns.reduce((sum, col) => sum + col.null_count, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-xl text-white shadow-lg">
            <h3 className="text-sm font-medium text-pink-100">Worst Column</h3>
            <p className="text-xl font-bold">
              {columns.reduce((worst, col) => 
                col.null_percent > worst.null_percent ? col : worst, columns[0]
              ).name}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
        <Chart
          options={nullValuesChart.options}
          series={nullValuesChart.series}
          type="bar"
          height={400}
        />
      </div>

      {/* Detailed Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            📋 Column Details
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Column Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Data Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Null Count
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Null Percentage
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Unique Values
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {columns.map((column, index) => (
                <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                  index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-750'
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                    {column.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      column.dtype === 'numeric' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                      column.dtype === 'categorical' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      column.dtype === 'datetime' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {column.dtype}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {column.null_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-bold ${
                      column.null_percent > 50 ? 'text-red-600 dark:text-red-400' :
                      column.null_percent > 20 ? 'text-yellow-600 dark:text-yellow-400' :
                      column.null_percent > 0 ? 'text-orange-600 dark:text-orange-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {column.null_percent}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {column.unique_count.toLocaleString()}
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