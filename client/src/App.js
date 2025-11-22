import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DataIssues from './pages/DataIssues';
import BarCharts from './pages/BarCharts';
import LineCharts from './pages/LineCharts';
import PieCharts from './pages/PieCharts';
import ScatterCharts from './pages/ScatterCharts';
import HistogramCharts from './pages/HistogramCharts';
import FileUpload from './components/FileUpload';
import { useTheme } from './hooks/useTheme';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleDataAnalyzed = (data) => {
    setAnalysisData(data);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gothic-black relative overflow-hidden">
        {/* Glassmorphism Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-gothic-purple/20 via-gothic-black to-gothic-violet/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gothic-purple/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gothic-violet/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        
        <Sidebar analysisData={analysisData} isDark={isDark} toggleTheme={toggleTheme} />
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          {!analysisData ? (
            <div className="flex-1 flex items-center justify-center backdrop-blur-sm">
              <FileUpload 
                onDataAnalyzed={handleDataAnalyzed}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          ) : (
            <main className="flex-1 overflow-x-hidden overflow-y-auto backdrop-blur-sm p-6">
              <Routes>
                <Route path="/" element={<Dashboard data={analysisData} />} />
                <Route path="/data-issues" element={<DataIssues data={analysisData} />} />
                <Route path="/charts/bar" element={<BarCharts data={analysisData} />} />
                <Route path="/charts/line" element={<LineCharts data={analysisData} />} />
                <Route path="/charts/pie" element={<PieCharts data={analysisData} />} />
                <Route path="/charts/scatter" element={<ScatterCharts data={analysisData} />} />
                <Route path="/charts/histogram" element={<HistogramCharts data={analysisData} />} />
              </Routes>
            </main>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;