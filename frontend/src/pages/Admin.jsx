import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Server, Database, ShieldAlert } from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState({
    users: 0,
    predictions: 0,
    alerts: 0,
    status: 'Online'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [predRes, alertRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/predictions`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/alerts`)
        ]);
        
        setStats({
          users: 42, // Mocked user count for now
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

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Admin Command Center</h2>
        <p className="text-muted-foreground mt-1">System configuration and management</p>
      </header>

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
            <button className="w-full text-left px-4 py-3 bg-background border border-border rounded hover:border-primary transition-colors flex justify-between items-center group">
              <span>Issue Manual Emergency Broadcast</span>
              <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-background border border-border rounded hover:border-secondary transition-colors flex justify-between items-center group">
              <span>Manage User Clearances</span>
              <span className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-background border border-border rounded hover:border-success transition-colors flex justify-between items-center group">
              <span>System Health Diagnostics</span>
              <span className="text-success opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-surface border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Recent System Logs</h3>
          <div className="font-mono text-sm space-y-2 h-48 overflow-y-auto">
            <div className="text-gray-400">[SYSTEM] Initialization sequence complete.</div>
            <div className="text-primary">[AI_ENGINE] Neural network connected.</div>
            <div className="text-success">[DB] MongoDB cluster synchronized.</div>
            <div className="text-warning">[WARNING] High latency detected on node 4.</div>
            <div className="text-gray-400">[AUTH] User 'Admin' logged in securely.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
