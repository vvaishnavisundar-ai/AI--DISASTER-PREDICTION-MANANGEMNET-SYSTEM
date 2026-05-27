import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    disasterType: 'Flood',
    temperature: 30,
    rainfall: 100,
    humidity: 70,
    windSpeed: 15,
    pressure: 1010,
    populationDensity: 500,
    region: 'Mumbai',
    soilMoisture: 50,
    riverWaterLevel: 5
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('scareychh_token')}`
        }
      };
      
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/predictions`, formData, config);
      
      setResult({
        probability: data.data.probability,
        severity: data.data.severity,
        risk_level: data.data.prediction,
        status: data.data.prediction,
        suggested_precautions: [
          'Evacuate if instructed',
          'Secure property',
          'Follow official channels'
        ]
      });
      setErrorMsg('');
    } catch (error) {
      console.error("Prediction API Error:", error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">AI Prediction Engine</h2>
        <p className="text-muted-foreground mt-1">Run environmental parameters through the neural network</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2 bg-surface border border-border p-6 rounded-xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Region</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} className="bg-background border border-border rounded p-2 text-white focus:border-primary outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Disaster Type</label>
              <select name="disasterType" value={formData.disasterType} onChange={handleChange} className="bg-background border border-border rounded p-2 text-white focus:border-primary outline-none">
                <option>Flood</option>
                <option>Earthquake</option>
                <option>Cyclone</option>
                <option>Wildfire</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Temperature (°C)</label>
              <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} className="bg-background border border-border rounded p-2 text-white focus:border-primary outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Rainfall (mm)</label>
              <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} className="bg-background border border-border rounded p-2 text-white focus:border-primary outline-none" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Wind Speed (km/h)</label>
              <input type="number" name="windSpeed" value={formData.windSpeed} onChange={handleChange} className="bg-background border border-border rounded p-2 text-white focus:border-primary outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Air Pressure (hPa)</label>
              <input type="number" name="pressure" value={formData.pressure} onChange={handleChange} className="bg-background border border-border rounded p-2 text-white focus:border-primary outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Population Density</label>
              <input type="number" name="populationDensity" value={formData.populationDensity} onChange={handleChange} className="bg-background border border-border rounded p-2 text-white focus:border-primary outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Soil Moisture (%)</label>
              <input type="number" name="soilMoisture" value={formData.soilMoisture} onChange={handleChange} className="bg-background border border-border rounded p-2 text-white focus:border-primary outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">River Water Level (m)</label>
              <input type="number" name="riverWaterLevel" value={formData.riverWaterLevel} onChange={handleChange} className="bg-background border border-border rounded p-2 text-white focus:border-primary outline-none" />
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary/20 text-primary border border-primary hover:bg-primary hover:text-background transition-colors font-bold py-3 rounded uppercase tracking-wider relative overflow-hidden"
              >
                {loading ? 'Analyzing Neural Network...' : 'Run Prediction'}
                {loading && <div className="absolute inset-0 bg-primary/30 animate-pulse"></div>}
              </button>
            </div>
            
            {errorMsg && (
              <div className="col-span-1 md:col-span-2 mt-2 p-3 bg-danger/20 border border-danger text-danger rounded text-center">
                <strong>Error:</strong> {errorMsg}
                <br />
                <span className="text-xs text-white">Hint: Ensure your Python Server (port 8000) and Node.js Server (port 5000) are both running in your terminal!</span>
              </div>
            )}
          </form>
        </div>

        {/* Output Panel */}
        <div className="bg-surface border border-border p-6 rounded-xl flex flex-col items-center justify-center min-h-[400px]">
          {result ? (
            <div className="text-center w-full animate-in fade-in zoom-in duration-500">
              <div className="relative inline-flex items-center justify-center mb-6">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="#1F2937" strokeWidth="12" fill="none" />
                  <circle 
                    cx="96" cy="96" r="80" 
                    stroke={result.probability > 75 ? '#FF003C' : '#FFB800'} 
                    strokeWidth="12" fill="none" 
                    strokeDasharray="502" 
                    strokeDashoffset={502 - (502 * result.probability) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold font-mono text-white">{result.probability}%</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Probability</span>
                </div>
              </div>
              
              <h3 className={`text-2xl font-bold mb-2 ${result.probability > 75 ? 'text-danger' : 'text-warning'}`}>
                {result.risk_level} RISK
              </h3>
              
              <div className="bg-background rounded p-4 text-left mt-6">
                <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2 border-b border-border pb-1">AI Recommendations</h4>
                <ul className="space-y-2">
                  {result.suggested_precautions.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                      <span className="text-primary">▸</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 border-2 border-dashed border-border rounded-full mx-auto mb-4 animate-spin-slow"></div>
              <p>Awaiting parameters for<br/>disaster prognosis</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PredictionForm;
