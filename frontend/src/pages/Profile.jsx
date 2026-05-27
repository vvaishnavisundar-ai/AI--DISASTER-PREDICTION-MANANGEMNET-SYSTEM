import React, { useState, useEffect } from 'react';
import { User, Settings as SettingsIcon, Shield, Bell, Lock, Server, MapPin, Plus, Trash2, Save, Activity, Edit2, Download } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const token = localStorage.getItem('scareychh_token');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, config);
      setUser(res.data.user);
      setEditName(res.data.user.name);
      setEditEmail(res.data.user.email);
      setIsAdmin(res.data.user.role === 'admin');
      setLocations(res.data.user.savedLocations || []);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updates) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/profile`, updates, config);
      setUser(res.data);
      setLocations(res.data.savedLocations || []);
      
      // Update local storage so sidebar reflects new name/email immediately
      localStorage.setItem('scareychh_user', JSON.stringify(res.data));
      
      alert('Profile updated successfully!');
      return true;
    } catch (error) {
      alert('Failed to update profile: ' + (error.response?.data?.message || error.message));
      return false;
    }
  };

  const handleSaveProfileDetails = async (e) => {
    e.preventDefault();
    if (!editName || !editEmail) return;
    const success = await handleUpdateProfile({ name: editName, email: editEmail });
    if (success) {
      setIsEditingProfile(false);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.trim()) return;
    const updatedLocations = [...locations, newLocation.trim()];
    const success = await handleUpdateProfile({ savedLocations: updatedLocations });
    if (success) setNewLocation('');
  };

  const handleRemoveLocation = async (index) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    await handleUpdateProfile({ savedLocations: updatedLocations });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    const success = await handleUpdateProfile({ password: newPassword });
    if (success) {
      setIsChangingPassword(false);
      setNewPassword('');
    }
  };

  const downloadAuditLogs = () => {
    const headers = ['Timestamp', 'User', 'Action', 'IP Address', 'Status'];
    const rows = [
      ['2026-05-27T10:15:00Z', user?.email, 'LOGIN_SUCCESS', '192.168.1.45', 'SUCCESS'],
      ['2026-05-27T12:30:15Z', user?.email, 'UPDATE_PREDICTION', '192.168.1.45', 'SUCCESS'],
      ['2026-05-27T14:45:22Z', user?.email, 'EXPORT_REPORT', '192.168.1.45', 'SUCCESS'],
    ];
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'system_audit_logs.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Activity className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{isAdmin ? 'Admin Profile' : 'Citizen Profile'}</h2>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </header>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-primary/20 to-surface h-32 relative">
          <div className="absolute -bottom-10 left-8 w-24 h-24 bg-background border-4 border-surface rounded-full flex items-center justify-center shadow-xl">
            <User className="w-10 h-10 text-primary" />
          </div>
        </div>
        <div className="pt-14 p-8 relative">
          {!isEditingProfile && (
            <button 
              onClick={() => setIsEditingProfile(true)} 
              className="absolute top-4 right-8 bg-background border border-border p-2 rounded hover:bg-primary/20 hover:text-primary transition-colors text-muted-foreground"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfileDetails} className="space-y-4 max-w-sm">
              <div>
                <label className="text-xs text-muted-foreground font-bold uppercase block mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-background border border-border rounded p-2 text-white outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-bold uppercase block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded p-2 text-white outline-none focus:border-primary text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-primary text-background px-4 py-2 rounded font-bold text-sm flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
                <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-surface border border-border px-4 py-2 rounded text-white text-sm">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-white">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
            </>
          )}

          <div className="mt-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isAdmin ? 'bg-danger/20 text-danger' : 'bg-blue-500/20 text-blue-500'}`}>
              {user?.role} Account
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border p-6 rounded-2xl h-fit">
          <h4 className="font-bold mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> Security</h4>
          
          {isChangingPassword ? (
            <form onSubmit={handleChangePassword} className="space-y-3 bg-background p-3 rounded border border-border mb-2">
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (min 6 chars)" 
                className="w-full bg-surface border border-border rounded p-2 text-white outline-none focus:border-primary text-sm"
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-primary text-background px-3 py-1.5 rounded text-sm font-bold flex-1">Save</button>
                <button type="button" onClick={() => setIsChangingPassword(false)} className="bg-surface border border-border text-white px-3 py-1.5 rounded text-sm flex-1">Cancel</button>
              </div>
            </form>
          ) : (
            <button onClick={() => setIsChangingPassword(true)} className="w-full text-left p-3 hover:bg-background rounded transition-colors text-sm text-gray-400 font-medium">
              Change Password
            </button>
          )}
          
          <button className="w-full text-left p-3 hover:bg-background rounded transition-colors text-sm text-gray-400 font-medium">Two-Factor Authentication</button>
        </div>
        
        {isAdmin ? (
          <div className="bg-surface border border-border p-6 rounded-2xl h-fit">
            <h4 className="font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-danger" /> Admin Controls</h4>
            <button onClick={() => navigate('/admin')} className="w-full text-left p-3 hover:bg-background rounded transition-colors text-sm text-gray-400 font-medium group flex justify-between items-center">
              Manage Access Permissions
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-primary/20 text-primary px-2 py-1 rounded">Open Users Hub</span>
            </button>
            <button onClick={downloadAuditLogs} className="w-full text-left p-3 hover:bg-background rounded transition-colors text-sm text-gray-400 font-medium group flex justify-between items-center">
              View Audit Logs
              <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </button>
          </div>
        ) : (
          <div className="bg-surface border border-border p-6 rounded-2xl h-fit">
            <h4 className="font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-500" /> Saved Locations</h4>
            
            <div className="space-y-2 mb-4">
              {locations.length === 0 ? (
                <p className="text-xs text-muted-foreground p-2">No saved locations.</p>
              ) : (
                locations.map((loc, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-background p-3 rounded border border-border group">
                    <span className="text-sm font-medium text-gray-300">{loc}</span>
                    <button onClick={() => handleRemoveLocation(idx)} className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Mumbai, Home"
                className="flex-1 bg-background border border-border rounded p-2 text-white outline-none focus:border-primary text-sm"
              />
              <button onClick={handleAddLocation} className="bg-primary/20 text-primary border border-primary/30 px-3 py-2 rounded font-bold hover:bg-primary hover:text-background transition-colors text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
