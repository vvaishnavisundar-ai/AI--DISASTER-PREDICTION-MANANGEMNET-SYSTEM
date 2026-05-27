import React, { useState, useEffect } from 'react';
import { Calendar, Search, Map, Download, FileText, ChevronRight, Activity, Edit2, Trash2, MapPin } from 'lucide-react';
import axios from 'axios';

const History = () => {
  const userStr = localStorage.getItem('scareychh_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user && user.role === 'admin';

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('scareychh_token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/predictions`);
      setHistoryData(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getSeverityColor = (severity) => {
    if (!severity) return 'bg-blue-500/20 text-blue-500';
    const s = severity.toLowerCase();
    if (s === 'critical' || s === 'high') return 'bg-danger/20 text-danger';
    if (s === 'warning' || s === 'medium') return 'bg-warning/20 text-warning';
    return 'bg-success/20 text-success';
  };

  const getIconColor = (severity) => {
    if (!severity) return 'bg-blue-500';
    const s = severity.toLowerCase();
    if (s === 'critical' || s === 'high') return 'bg-danger';
    if (s === 'warning' || s === 'medium') return 'bg-warning';
    return 'bg-success';
  };

  const exportReport = () => {
    if (historyData.length === 0) {
      alert("No data to export!");
      return;
    }
    const headers = ['Record ID', 'Date', 'Type', 'Region', 'Severity', 'Probability', 'Status'];
    const csvRows = [headers.join(',')];
    historyData.forEach(row => {
      const values = [
        row._id,
        formatDate(row.createdAt),
        row.disasterType,
        row.region,
        row.severity,
        `${row.probability}%`,
        row.status || 'Active'
      ];
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'disaster_history_report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const showDetails = (evt) => {
    alert(`DISASTER PREDICTION REPORT
    
Record ID: ${evt._id}
Type: ${evt.disasterType}
Region: ${evt.region}
Severity: ${evt.severity}
Probability: ${evt.probability}%
Status: ${evt.status || 'Active'}

-- Environmental Metrics --
Temperature: ${evt.temperature || 'N/A'}°C
Rainfall: ${evt.rainfall || 'N/A'} mm
Wind Speed: ${evt.windSpeed || 'N/A'} km/h
Humidity: ${evt.humidity || 'N/A'}%
Pressure: ${evt.pressure || 'N/A'} hPa
Soil Moisture: ${evt.soilMoisture || 'N/A'}%`);
  };

  const editStatus = async (evt) => {
    const newStatus = prompt(`Current Status: ${evt.status || 'Active'}\nEnter new status (Active, Resolved):`, evt.status || 'Active');
    if (!newStatus || !['Active', 'Resolved'].includes(newStatus)) {
      alert("Invalid status");
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/predictions/${evt._id}`, { status: newStatus }, config);
      fetchHistory();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this historical record?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/predictions/${id}`, config);
      fetchHistory();
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  if (isAdmin) {
    return (
      <div className="p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <header>
            <h2 className="text-3xl font-bold tracking-tight">Disaster History Database</h2>
            <p className="text-muted-foreground mt-1">Manage and analyze historical disaster predictions & records.</p>
          </header>
          <button onClick={exportReport} className="bg-surface border border-border text-white px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-primary/20 hover:border-primary hover:text-primary transition-colors">
            <Download className="w-5 h-5" /> Export Report
          </button>
        </div>
        
        <div className="bg-surface border border-border rounded-xl overflow-hidden mb-6">
          <div className="p-4 border-b border-border bg-background/50 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-background border border-border rounded p-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search by region or event type..." className="bg-transparent border-none outline-none w-full text-sm" />
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/80 text-muted-foreground text-sm">
                <th className="p-4 font-medium border-b border-border">Record ID</th>
                <th className="p-4 font-medium border-b border-border">Date</th>
                <th className="p-4 font-medium border-b border-border">Type & Region</th>
                <th className="p-4 font-medium border-b border-border">Severity</th>
                <th className="p-4 font-medium border-b border-border">Status</th>
                <th className="p-4 font-medium border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-muted-foreground"><Activity className="w-6 h-6 animate-spin mx-auto"/></td></tr>
              ) : historyData.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-muted-foreground">No historical records found. Run a prediction to generate data.</td></tr>
              ) : historyData.map((evt) => (
                <tr key={evt._id} className="hover:bg-background/50 transition-colors border-b border-border last:border-0">
                  <td className="p-4 text-sm font-mono text-gray-400">{evt._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4 text-sm">{formatDate(evt.createdAt)}</td>
                  <td className="p-4">
                    <p className="text-sm font-bold">{evt.disasterType}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/>{evt.region}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getSeverityColor(evt.severity)}`}>
                      {evt.severity || 'Normal'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${evt.status === 'Resolved' ? 'bg-success/20 text-success' : 'bg-blue-500/20 text-blue-500'}`}>
                      {evt.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => showDetails(evt)} title="View Details" className="p-2 bg-background border border-border rounded hover:bg-primary/20 hover:text-primary transition-colors"><FileText className="w-4 h-4" /></button>
                      <button onClick={() => editStatus(evt)} title="Edit Status" className="p-2 bg-background border border-border rounded hover:bg-warning/20 hover:text-warning transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteRecord(evt._id)} title="Delete Record" className="p-2 bg-background border border-border rounded hover:bg-danger/20 hover:text-danger transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Client View
  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <header className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Regional Disaster History</h2>
        <p className="text-muted-foreground mt-1">Review live and past AI-predicted environmental events.</p>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <Activity className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : historyData.length === 0 ? (
        <div className="bg-surface border border-border p-12 text-center rounded-xl">
          <p className="text-gray-400">No historical events recorded yet.</p>
        </div>
      ) : (
        <div className="relative border-l border-primary/30 ml-4 md:ml-8 space-y-12">
          {historyData.map((evt, i) => (
            <div key={evt._id} className="relative pl-8 md:pl-12">
              <div className={`absolute -left-4 top-0 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center ${getIconColor(evt.severity)}`}>
                <Calendar className="w-3 h-3 text-white" />
              </div>
              
              <div className="bg-surface border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-primary font-mono font-bold">{formatDate(evt.createdAt)}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getSeverityColor(evt.severity)}`}>
                        {evt.severity || 'Normal'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{evt.disasterType} Analysis</h3>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border">
                    <Map className="w-4 h-4" /> <span className="text-sm font-medium">{evt.region}</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  A historical AI prediction record of a potential <strong className="text-white">{evt.disasterType}</strong> targeting the <strong className="text-white">{evt.region}</strong> region. 
                  The AI Prediction Engine recorded this event with a probability of <strong className="text-white">{evt.probability}%</strong> and assigned it a <strong className="text-white">{evt.severity}</strong> severity rating based on environmental data sensors (Temp: {evt.temperature}°C, Wind: {evt.windSpeed}km/h).
                </p>
                
                <button onClick={() => showDetails(evt)} className="flex items-center text-primary text-sm font-bold group-hover:underline bg-transparent border-none outline-none cursor-pointer p-0">
                  View Full Aftermath Report <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
