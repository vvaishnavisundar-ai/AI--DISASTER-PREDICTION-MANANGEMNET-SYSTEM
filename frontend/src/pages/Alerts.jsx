import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AlertTriangle, Clock, MapPin, Shield } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial alerts
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/alerts`);
        setAlerts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();

    // Setup Socket connection for real-time alerts
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.on('emergency_alert', (newAlert) => {
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    });

    return () => socket.disconnect();
  }, []);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'text-danger bg-danger/10 border-danger';
      case 'Danger': return 'text-orange-500 bg-orange-500/10 border-orange-500';
      case 'Warning': return 'text-warning bg-warning/10 border-warning';
      case 'Info': return 'text-primary bg-primary/10 border-primary';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Active Emergency Alerts</h2>
        <p className="text-muted-foreground mt-1">Real-time broadcast system</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <Shield className="w-16 h-16 text-success mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-gray-300">No Active Alerts</h3>
          <p className="text-muted-foreground">All regions are currently stable.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {alerts.map((alert) => (
            <div key={alert._id || alert.timestamp} className={`border border-l-4 rounded-lg p-5 bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:translate-x-1 ${getSeverityColor(alert.severity).split(' ')[2]}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full shrink-0 ${getSeverityColor(alert.severity).split(' ').slice(0,2).join(' ')}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold">{alert.title}</h3>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${getSeverityColor(alert.severity).split(' ').slice(0,2).join(' ')}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2">{alert.message}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.region}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
