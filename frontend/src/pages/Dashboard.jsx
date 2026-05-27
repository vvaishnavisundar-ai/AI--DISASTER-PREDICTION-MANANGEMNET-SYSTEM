import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { io } from 'socket.io-client';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    alerts: 0,
    predictions: 0,
    avgConfidence: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('scareychh_token')}` } };
        const [alertRes, predRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/alerts`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/api/predictions`, config)
        ]);
        
        setActiveAlerts(alertRes.data.count);
        
        const preds = predRes.data.data;
        setStats({
          alerts: alertRes.data.count,
          predictions: predRes.data.count,
          avgConfidence: preds.length ? Math.round(preds.reduce((acc, curr) => acc + (curr.probability || 0), 0) / preds.length) : 0
        });

        // Format chart data (last 10 predictions)
        const formattedData = preds.slice(0, 10).reverse().map(p => ({
          time: new Date(p.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          risk: p.probability || 0
        }));
        
        setChartData(formattedData.length > 0 ? formattedData : [
          { time: '00:00', risk: 0 }, { time: '12:00', risk: 0 }
        ]);
        
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    
    fetchData();

    // Setup real socket connection
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    
    socket.on('emergency_alert', () => {
      setActiveAlerts(prev => prev + 1);
      fetchData(); // refresh stats
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
          <p className="text-muted-foreground mt-1">Real-time AI monitoring and analytics center</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface border border-border px-4 py-2 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-fast"></div>
            <span className="text-sm font-mono text-success">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Active Alerts", value: activeAlerts, color: "text-danger", path: "/alerts" },
          { title: "AI Confidence", value: `${stats.avgConfidence}%`, color: "text-primary", path: "/prediction" },
          { title: "Predictions Run", value: stats.predictions, color: "text-secondary", path: "/prediction" },
          { title: "Risk Level", value: stats.avgConfidence > 75 ? "CRITICAL" : "MODERATE", color: "text-warning", path: "/map" }
        ].map((stat, i) => (
          <div 
            key={i} 
            onClick={() => navigate(stat.path)}
            className="bg-surface border border-border p-6 rounded-xl relative overflow-hidden group hover:border-primary/50 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transform transition-all duration-300 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent blur-2xl rounded-full -mr-16 -mt-16 group-hover:from-primary/30 transition-all duration-500"></div>
            <h3 className="text-muted-foreground text-sm font-medium mb-2 group-hover:text-white transition-colors">{stat.title}</h3>
            <p className={`text-3xl font-bold font-mono ${stat.color} group-hover:scale-110 origin-left transition-transform duration-300`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="bg-surface border border-border p-6 rounded-xl h-[400px]">
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
          Global Risk Trend
          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">Live Data</span>
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="time" stroke="#6B7280" tick={{fill: '#6B7280'}} />
            <YAxis stroke="#6B7280" tick={{fill: '#6B7280'}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#151C2C', borderColor: '#1F2937', borderRadius: '8px' }}
              itemStyle={{ color: '#00F0FF' }}
            />
            <Area type="monotone" dataKey="risk" stroke="#00F0FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
