import React, { useState } from 'react';
import axios from 'axios';
import { FaFileCsv } from "react-icons/fa6";

const FileUpload = ({ onDataAnalyzed, loading, setLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
   const [progress, setProgress] = useState(0);

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProgress(100);
      setTimeout(() => onDataAnalyzed(response.data), 500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze CSV file');
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Glassmorphism container */}
      <div
        className={`relative backdrop-blur-xl border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-500 ${
          dragActive
            ? 'border-gothic-accent bg-gothic-purple/20 shadow-2xl shadow-gothic-purple/50 scale-105 animate-glow'
            : 'border-gothic-silver/30 bg-gothic-charcoal/40 hover:border-gothic-accent/50 hover:bg-gothic-purple/10 hover:shadow-xl hover:shadow-gothic-purple/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gothic-purple/5 to-gothic-violet/5 rounded-3xl"></div>
        
        <div className="relative z-10">
          {loading ? (
            <div className="py-12">
              <div className="flex justify-center mb-8">
                <div className="warp-loader">
                  <div className="ring"></div>
                  <div className="ring"></div>
                  <div className="ring"></div>
                  <div className="ring"></div>
                  <div className="core-glow"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gothic-platinum mb-4">Analyzing Data</h3>
              <p className="text-gothic-silver font-medium mb-6">Processing your CSV file...</p>
              <div className="w-80 mx-auto bg-gothic-slate/50 rounded-full h-4 backdrop-blur-sm border border-gothic-silver/20 overflow-hidden">
                <div 
                  className="progress-bar bg-gradient-to-r from-gothic-purple via-gothic-accent to-gothic-violet h-full rounded-full shadow-lg shadow-gothic-purple/50 transition-all duration-300 ease-out"
                  style={{width: `${progress}%`}}
                ></div>
              </div>
              <p className="text-gothic-silver text-sm mt-3 font-medium">{Math.round(progress)}% Complete</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-8">
                <FaFileCsv className="text-9xl animate-float filter drop-shadow-2xl text-gothic-accent" />
              </div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-gothic-silver to-gothic-accent bg-clip-text text-transparent mb-4 tracking-wide">
                Upload Dataset
              </h3>
              <p className="text-gothic-platinum text-xl mb-12 font-light">
                Drag and drop your CSV file here, or click to select
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-gradient-to-r from-gothic-purple to-gothic-accent text-white px-12 py-5 rounded-2xl cursor-pointer hover:from-gothic-accent hover:to-gothic-violet transition-all duration-300 shadow-2xl shadow-gothic-purple/50 hover:shadow-gothic-accent/60 transform hover:scale-105 font-bold text-xl tracking-wide backdrop-blur-sm border border-gothic-silver/20"
              >
                📁 Select File
              </label>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-8 p-6 backdrop-blur-xl bg-red-900/30 border border-red-500/30 rounded-2xl shadow-2xl shadow-red-500/20">
          <p className="text-red-300 font-semibold text-lg">⚠️ {error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;