import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdWarning, 
  MdBarChart, 
  MdShowChart, 
  MdPieChart, 
  MdScatterPlot, 
  MdAssessment,
  MdLightMode,
  MdDarkMode
} from 'react-icons/md';

const Sidebar = ({ analysisData, isDark, toggleTheme }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <MdDashboard className="text-xl" /> },
    { path: '/data-issues', label: 'Data Issues', icon: <MdWarning className="text-xl" /> },
  ];

  const chartTypes = [
    { path: '/charts/bar', label: 'Bar Charts', icon: <MdBarChart className="text-xl" />, key: 'bar' },
    { path: '/charts/line', label: 'Line Charts', icon: <MdShowChart className="text-xl" />, key: 'line' },
    { path: '/charts/pie', label: 'Pie Charts', icon: <MdPieChart className="text-xl" />, key: 'pie' },
    { path: '/charts/scatter', label: 'Scatter Plots', icon: <MdScatterPlot className="text-xl" />, key: 'scatter' },
    { path: '/charts/histogram', label: 'Histograms', icon: <MdAssessment className="text-xl" />, key: 'histogram' },
  ];

  const getChartCount = (chartType) => {
    if (!analysisData?.chart_recommendations?.[chartType]) return 0;
    
    const charts = analysisData.chart_recommendations[chartType];
    
    // Count only charts with actual data
    if (chartType === 'pie') {
      return charts.filter(chart => chart.data && chart.data.categories && chart.data.values).length;
    } else if (chartType === 'scatter') {
      return charts.filter(chart => chart.data && chart.data.points).length;
    } else if (chartType === 'histogram') {
      return charts.filter(chart => chart.data && chart.data.bins && chart.data.frequencies).length;
    } else {
      // For bar and line charts
      return charts.filter(chart => chart.data && chart.data.categories && chart.data.values).length;
    }
  };

  return (
    <div className="w-56 backdrop-blur-xl bg-gothic-charcoal/30 border-r border-gothic-silver/20 relative z-20">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gothic-purple/10 to-transparent"></div>
      
      <div className="relative z-10 p-4 border-b border-gothic-silver/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-gothic-silver to-gothic-accent bg-clip-text text-transparent tracking-wide">
            NEXUS
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gothic-slate/50 backdrop-blur-sm border border-gothic-silver/20 hover:bg-gothic-purple/30 transition-all duration-300 hover:animate-glow"
          >
            {isDark ? <MdLightMode className="text-xl text-gothic-accent" /> : <MdDarkMode className="text-xl text-gothic-silver" />}
          </button>
        </div>
        {analysisData && (
          <div className="bg-gothic-slate/40 backdrop-blur-sm border border-gothic-silver/20 px-4 py-3 rounded-xl">
            <p className="text-sm text-gothic-platinum font-medium">
              📊 {analysisData.dataset_info.filename}
            </p>
          </div>
        )}
      </div>
      
      <nav className="relative z-10 mt-4 px-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-300 group ${
              location.pathname === item.path 
                ? 'bg-gradient-to-r from-gothic-purple to-gothic-violet text-white shadow-2xl shadow-gothic-purple/50 border border-gothic-accent/50' 
                : 'text-gothic-platinum hover:bg-gothic-slate/40 hover:backdrop-blur-sm border border-transparent hover:border-gothic-silver/20'
            }`}
          >
            <span className={`mr-4 transition-transform duration-300 group-hover:scale-110 ${
              location.pathname === item.path ? 'text-white' : 'text-gothic-accent'
            }`}>{item.icon}</span>
            <span className="font-semibold tracking-wide">{item.label}</span>
          </Link>
        ))}
        
        {analysisData && (
          <>
            <div className="px-4 py-3 mt-6 mb-3">
              <div className="bg-gothic-slate/30 backdrop-blur-sm border border-gothic-silver/20 px-4 py-2 rounded-lg">
                <span className="text-xs font-bold text-gothic-accent uppercase tracking-widest">
                  📈 Analytics
                </span>
              </div>
            </div>
            {chartTypes.map((item) => {
              const count = getChartCount(item.key);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 mb-2 rounded-lg transition-all duration-300 group ${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-gothic-purple to-gothic-violet text-white shadow-2xl shadow-gothic-purple/50 border border-gothic-accent/50' 
                      : 'text-gothic-platinum hover:bg-gothic-slate/40 hover:backdrop-blur-sm border border-transparent hover:border-gothic-silver/20'
                  } ${count === 0 ? 'opacity-40' : ''}`}
                >
                  <div className="flex items-center">
                    <span className={`mr-4 transition-transform duration-300 group-hover:scale-110 ${
                      location.pathname === item.path ? 'text-white' : 'text-gothic-accent'
                    }`}>{item.icon}</span>
                    <span className="font-semibold tracking-wide">{item.label}</span>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold backdrop-blur-sm ${
                    location.pathname === item.path 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-gothic-slate/50 text-gothic-accent border border-gothic-silver/20'
                  }`}>
                    {count}
                  </span>
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;