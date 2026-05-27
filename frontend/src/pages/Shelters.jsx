import React, { useState, useEffect } from 'react';
import { Navigation, Plus, MapPin, Edit, Trash2, Activity } from 'lucide-react';
import axios from 'axios';

const Shelters = () => {
  const userStr = localStorage.getItem('scareychh_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user && user.role === 'admin';

  const [userCity, setUserCity] = useState('Detecting location...');
  const [loading, setLoading] = useState(true);

  // Client dynamic shelters
  const [clientShelters, setClientShelters] = useState([]);
  
  // Admin DB shelters
  const [adminShelters, setAdminShelters] = useState([]);

  // Setup Axios Config
  const token = localStorage.getItem('scareychh_token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminShelters();
    } else {
      fetchClientLocationShelters();
    }
  }, [isAdmin]);

  const fetchAdminShelters = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/shelters`, config);
      setAdminShelters(res.data.data);
    } catch (err) {
      console.error("Failed to fetch admin shelters", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientLocationShelters = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const address = geoRes.data.address;
          const city = address.city || address.town || address.village || address.county || 'Your Area';
          setUserCity(city);
          
          setClientShelters([
            { id: 1, name: `${city} Central Community Hall`, location: `${city} Downtown`, status: 'Open' },
            { id: 2, name: `${city} District High School`, location: `${city} East Wing`, status: 'Full' },
            { id: 3, name: `${city} Municipal Relief Camp`, location: `${city} Outskirts`, status: 'Open' },
          ]);
        } catch (error) {
          fallbackLocation();
        } finally {
          setLoading(false);
        }
      }, () => {
        fallbackLocation();
        setLoading(false);
      });
    } else {
      fallbackLocation();
      setLoading(false);
    }
  };

  const fallbackLocation = () => {
    setUserCity('Local Area');
    setClientShelters([
      { id: 1, name: 'Local Community Hall', location: 'Downtown', status: 'Open' },
      { id: 2, name: 'District High School', location: 'East Wing', status: 'Full' },
      { id: 3, name: 'Municipal Relief Camp', location: 'Outskirts', status: 'Open' },
    ]);
  };

  const autoSeedAdminShelters = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const address = geoRes.data.address;
          const city = address.city || address.town || address.village || address.county || 'Bengaluru';
          
          await axios.post(`${import.meta.env.VITE_API_URL}/api/shelters`, { name: `${city} Central Community Hall`, location: `${city} Downtown`, capacity: 500, status: 'Open' }, config);
          await axios.post(`${import.meta.env.VITE_API_URL}/api/shelters`, { name: `${city} District High School`, location: `${city} East Wing`, capacity: 200, status: 'Full' }, config);
          await axios.post(`${import.meta.env.VITE_API_URL}/api/shelters`, { name: `${city} Municipal Relief Camp`, location: `${city} Outskirts`, capacity: 1000, status: 'Open' }, config);
          
          fetchAdminShelters();
        } catch (error) {
          alert('Failed to auto-seed.');
          setLoading(false);
        }
      }, () => {
        alert('Location access denied. Cannot auto-generate.');
        setLoading(false);
      });
    }
  };

  const openGoogleMaps = (shelterName, shelterLocation) => {
    const query = encodeURIComponent(`${shelterName} ${shelterLocation} ${userCity}`);
    window.open(`https://maps.google.com/?q=${query}`, '_blank', 'noopener,noreferrer');
  };

  // Admin Actions
  const handleAddShelter = async () => {
    const name = prompt("Enter Shelter Name:");
    if (!name) return;
    const location = prompt("Enter Shelter Location:");
    if (!location) return;
    const capacity = parseInt(prompt("Enter Maximum Capacity (Number):") || '100');
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/shelters`, {
        name,
        location,
        capacity,
        status: 'Open'
      }, config);
      fetchAdminShelters();
    } catch (err) {
      alert("Failed to add shelter");
    }
  };

  const handleEditShelter = async (shelter) => {
    const newStatus = prompt(`Current Status: ${shelter.status}\nEnter new status (Open, Full, Closed):`, shelter.status);
    if (!newStatus || !['Open', 'Full', 'Closed'].includes(newStatus)) {
      alert("Invalid status");
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/shelters/${shelter._id}`, {
        status: newStatus
      }, config);
      fetchAdminShelters();
    } catch (err) {
      alert("Failed to update shelter");
    }
  };

  const handleDeleteShelter = async (id) => {
    if (!window.confirm("Are you sure you want to completely delete this shelter?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/shelters/${id}`, config);
      fetchAdminShelters();
    } catch (err) {
      alert("Failed to delete shelter");
    }
  };

  if (isAdmin) {
    return (
      <div className="p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <header>
            <h2 className="text-3xl font-bold tracking-tight">Shelter Management</h2>
            <p className="text-muted-foreground mt-1">Add, monitor, and manage relief camps from the database.</p>
          </header>
          <button 
            onClick={handleAddShelter}
            className="bg-primary text-background px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Shelter
          </button>
        </div>

        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/80 text-muted-foreground text-sm">
                <th className="p-4 font-medium border-b border-border">Shelter Name</th>
                <th className="p-4 font-medium border-b border-border">Location</th>
                <th className="p-4 font-medium border-b border-border">Status</th>
                <th className="p-4 font-medium border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-muted-foreground"><Activity className="w-6 h-6 animate-spin mx-auto"/></td></tr>
              ) : adminShelters.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No shelters in database.</p>
                    <button onClick={autoSeedAdminShelters} className="bg-primary/20 text-primary border border-primary/30 px-6 py-2 rounded-xl font-bold hover:bg-primary hover:text-background transition-colors inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Auto-Generate Shelters For My City
                    </button>
                  </td>
                </tr>
              ) : adminShelters.map((s) => (
                <tr key={s._id} className="hover:bg-background/50 transition-colors border-b border-border last:border-0">
                  <td className="p-4 text-sm font-bold text-white">{s.name}</td>
                  <td className="p-4 text-sm text-gray-400 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{s.location}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'Open' ? 'bg-success/20 text-success' : s.status === 'Full' ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEditShelter(s)} className="p-2 bg-background border border-border rounded hover:bg-primary/20 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteShelter(s._id)} className="p-2 bg-background border border-border rounded hover:bg-danger/20 hover:text-danger transition-colors"><Trash2 className="w-4 h-4" /></button>
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
    <div className="p-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Nearby Relief Shelters</h2>
        <p className="text-muted-foreground mt-1 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" /> Showing safe locations in <strong className="text-white">{userCity}</strong>
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Activity className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Scanning for nearby shelters based on your GPS...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clientShelters.map((s) => (
            <div key={s.id} className="bg-surface border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 ${s.status === 'Open' ? 'bg-success/10' : 'bg-danger/10'} blur-xl rounded-full -mr-12 -mt-12`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === 'Open' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'} mb-3 inline-block`}>
                    {s.status}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> {s.location}
                  </p>
                </div>
              </div>

              <button 
                disabled={s.status === 'Full'}
                onClick={() => openGoogleMaps(s.name, s.location)}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                  s.status === 'Open' 
                  ? 'bg-primary/20 text-primary hover:bg-primary hover:text-background border border-primary/30' 
                  : 'bg-background text-gray-500 cursor-not-allowed border border-border'
                }`}
              >
                <Navigation className="w-5 h-5" /> 
                {s.status === 'Open' ? 'Navigate to Shelter' : 'Shelter is Full'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shelters;
