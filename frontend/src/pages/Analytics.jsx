import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, ShieldAlert, BarChart2 } from 'lucide-react';

const Analytics = () => {
  const [alerts, setAlerts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('scareychh_token')}` } };
        const [alertsRes, predRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/alerts`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/api/predictions`, config)
        ]);
        
        setAlerts(alertsRes.data.data || []);
        setPredictions(predRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Process data for charts
  // 1. Alerts by Severity (Pie Chart)
  const severityCounts = alerts.reduce((acc, curr) => {
    acc[curr.severity] = (acc[curr.severity] || 0) + 1;
    return acc;
  }, {});
  const severityData = Object.keys(severityCounts).map(key => ({
    name: key,
    value: severityCounts[key],
    color: key.toLowerCase() === 'critical' ? '#ef4444' : key.toLowerCase() === 'warning' ? '#f97316' : '#3b82f6'
  }));

  // 2. Predictions by Type (Bar Chart)
  const typeCounts = predictions.reduce((acc, curr) => {
    acc[curr.disasterType] = (acc[curr.disasterType] || 0) + 1;
    return acc;
  }, {});
  const typeData = Object.keys(typeCounts).map(key => ({
    name: key,
    count: typeCounts[key]
  }));

  // 3. Predictions Timeline (Line/Area Chart)
  const timelineCounts = predictions.reduce((acc, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const timelineData = Object.keys(timelineCounts).sort((a,b) => new Date(a) - new Date(b)).map(date => ({
    date,
    predictions: timelineCounts[date]
  }));

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Activity className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <BarChart2 className="w-5 h-5 text-primary" />
            </div>
            Real-Time Analytics
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">Live data visualization of platform alerts and AI predictions. All data is dynamically fetched from the database in real-time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Alerts by Severity */}
        <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col h-[400px]">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-danger" /> Alerts by Severity</h3>
          <div className="flex-1 min-h-0">
            {alerts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={severityData} 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={5} 
                    dataKey="value" 
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm bg-background/50 rounded-lg border border-dashed border-border">No alert data available</div>
            )}
          </div>
        </div>

        {/* Predictions Timeline */}
        <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col h-[400px]">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Prediction Activity Timeline</h3>
          <div className="flex-1 min-h-0">
            {predictions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#4b5563" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff'}} />
                  <Area type="monotone" dataKey="predictions" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorPred)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm bg-background/50 rounded-lg border border-dashed border-border">No prediction data available</div>
            )}
          </div>
        </div>

        {/* Predictions by Type */}
        <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col h-[400px] md:col-span-2">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-green-500" /> AI Predictions by Disaster Type</h3>
          <div className="flex-1 min-h-0">
            {predictions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#4b5563" fontSize={12} allowDecimals={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff'}} />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-muted-foreground text-sm bg-background/50 rounded-lg border border-dashed border-border">No prediction data available</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
