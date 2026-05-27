import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Server, Database, ShieldAlert, X } from 'lucide-react';
import { io } from 'socket.io-client';

const Admin = () => {
  const [stats, setStats] = useState({
    users: 0,
    predictions: 0,
    alerts: 0,
    status: 'Online'
  });

  const [logs, setLogs] = useState([
    { id: 1, type: 'system', text: "[SYSTEM] Initialization sequence complete." },
    { id: 2, type: 'ai', text: "[AI_ENGINE] Neural network connected." },
    { id: 3, type: 'db', text: "[DB] MongoDB cluster synchronized." },
    { id: 4, type: 'auth', text: "[AUTH] User 'Admin' logged in securely." }
  ]);

  const [loading, setLoading] = useState(true);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: 'Manual Emergency Override',
    message: '',
    severity: 'Warning',
    region: 'Global'
  });
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchStats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('scareychh_token')}` } };
      const [predRes, alertRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/predictions`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/alerts`, config)
      ]);
      
      setStats({
        users: 1, // We only have the admin user registered right now
        predictions: predRes.data.count,
        alerts: alertRes.data.count,
        status: 'Online'
      });
    } catch (error) {
      console.error("Error fetching admin stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    
    socket.on('emergency_alert', (data) => {
      setLogs(prev => [{ id: Date.now(), type: 'alert', text: `[ALERT] New ${data.severity} alert broadcasted for ${data.region}` }, ...prev].slice(0, 50));
      fetchStats();
    });

    socket.on('new_prediction', (data) => {
      setLogs(prev => [{ id: Date.now(), type: 'ai', text: `[AI] Prediction run for ${data.region}: Risk ${data.prediction}` }, ...prev].slice(0, 50));
      fetchStats();
    });

    return () => socket.disconnect();
  }, []);

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('scareychh_token')}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/alerts`, broadcastForm, config);
      setShowBroadcastModal(false);
      setLogs(prev => [{ id: Date.now(), type: 'system', text: `[SYSTEM] Manual broadcast successfully issued.` }, ...prev]);
      setBroadcastForm({ title: 'Manual Emergency Override', message: '', severity: 'Warning', region: 'Global' });
    } catch (err) {
      alert("Failed to issue broadcast.");
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'system': return 'text-gray-400';
      case 'ai': return 'text-primary';
      case 'db': return 'text-success';
      case 'warning': return 'text-warning';
      case 'alert': return 'text-danger';
      case 'auth': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="p-8 relative">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Admin Command Center</h2>
        <p className="text-muted-foreground mt-1">System configuration and management</p>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-8 right-8 bg-surface border border-border px-6 py-3 rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-top-5">
          <p className="text-primary font-medium">{toast}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Registered Personnel", value: stats.users, icon: Users, color: "text-primary" },
          { label: "Total Predictions", value: stats.predictions, icon: Database, color: "text-secondary" },
          { label: "Active Broadcasts", value: stats.alerts, icon: ShieldAlert, color: "text-warning" },
          { label: "Server Status", value: stats.status, icon: Server, color: "text-success" }
        ].map((stat, i) => (
          <div key={i} className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
            <div className={`p-4 rounded-lg bg-background ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <p className={`text-2xl font-bold font-mono ${stat.color}`}>{loading ? '...' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-surface border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setShowBroadcastModal(true)}
              className="w-full text-left px-4 py-3 bg-background border border-border rounded hover:border-primary transition-colors flex justify-between items-center group"
            >
              <span>Issue Manual Emergency Broadcast</span>
              <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button 
              onClick={() => showToast('Clearance level insufficient or module in development.')}
              className="w-full text-left px-4 py-3 bg-background border border-border rounded hover:border-secondary transition-colors flex justify-between items-center group"
            >
              <span>Manage User Clearances</span>
              <span className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button 
              onClick={() => showToast('System Diagnostics are currently green across all nodes.')}
              className="w-full text-left px-4 py-3 bg-background border border-border rounded hover:border-success transition-colors flex justify-between items-center group"
            >
              <span>System Health Diagnostics</span>
              <span className="text-success opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-surface border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4 border-b border-border pb-2 flex justify-between items-center">
            <span>Recent System Logs</span>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          </h3>
          <div className="font-mono text-sm space-y-2 h-48 overflow-y-auto pr-2 custom-scrollbar">
            {logs.map((log) => (
              <div key={log.id} className={getLogColor(log.type)}>{log.text}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border flex justify-between items-center bg-background/50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-danger" />
                Manual Broadcast
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-muted-foreground hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBroadcastSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Region</label>
                <input 
                  type="text" 
                  required
                  value={broadcastForm.region}
                  onChange={e => setBroadcastForm({...broadcastForm, region: e.target.value})}
                  className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Severity</label>
                <select 
                  value={broadcastForm.severity}
                  onChange={e => setBroadcastForm({...broadcastForm, severity: e.target.value})}
                  className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary outline-none"
                >
                  <option>Info</option>
                  <option>Warning</option>
                  <option>Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Message</label>
                <textarea 
                  required
                  value={broadcastForm.message}
                  onChange={e => setBroadcastForm({...broadcastForm, message: e.target.value})}
                  className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary outline-none h-24 resize-none" 
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-danger hover:bg-danger/80 text-white font-bold py-3 rounded uppercase tracking-wider transition-colors mt-2"
              >
                Transmit Alert
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
