import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Shield, Search, Activity, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'client' });

  const token = localStorage.getItem('scareychh_token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, config);
      setUsers(res.data.data || []);
      setErrorMsg(null);
    } catch (error) {
      if (error.response?.status === 403) {
        setErrorMsg("Access Denied: You must be an Admin to view this page.");
      } else {
        console.error("Failed to fetch users", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, newUser);
      alert("User added successfully!");
      setIsAddModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'client' });
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      if (msg.toLowerCase().includes('already exists')) {
        alert(`Failed: User already exists! The table has been filtered to show the existing account for ${newUser.email}.`);
        setSearchTerm(newUser.email);
        setIsAddModalOpen(false);
      } else {
        alert("Failed to add user: " + msg);
      }
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/users/${userId}`, { role: newRole }, config);
      fetchUsers(); // Refresh the list to show new role instantly
    } catch (error) {
      alert("Failed to update user role: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/users/${userId}`, config);
      fetchUsers();
    } catch (error) {
      alert("Failed to delete user: " + (error.response?.data?.message || error.message));
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Access Control & Users</h2>
          <p className="text-muted-foreground mt-1">Manage platform users, roles, and security access levels in real-time.</p>
        </header>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-background px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            + Add User
          </button>
          <div className="bg-primary/20 text-primary px-4 py-2 rounded-xl flex items-center gap-2 border border-primary/30">
            <UsersIcon className="w-5 h-5" />
            <span className="font-bold">{users.length} Total Users</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-border p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-bold mb-1">Total Users</p>
            <h3 className="text-3xl font-bold text-white">{users.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <UsersIcon className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-bold mb-1">Admin Accounts</p>
            <h3 className="text-3xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center border border-danger/30">
            <Shield className="w-6 h-6 text-danger" />
          </div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-bold mb-1">Client Accounts</p>
            <h3 className="text-3xl font-bold text-white">{users.filter(u => u.role === 'client').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <UsersIcon className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-6 shadow-xl">
        <div className="p-4 border-b border-border bg-background/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-background border border-border rounded p-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm text-white" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/80 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-border">User ID</th>
                <th className="p-4 font-bold border-b border-border">Name</th>
                <th className="p-4 font-bold border-b border-border">Email Address</th>
                <th className="p-4 font-bold border-b border-border">Access Level</th>
                <th className="p-4 font-bold border-b border-border">Joined</th>
                <th className="p-4 font-bold border-b border-border text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-12 text-center text-muted-foreground"><Activity className="w-8 h-8 animate-spin mx-auto text-primary"/></td></tr>
              ) : errorMsg ? (
                <tr><td colSpan="6" className="p-12 text-center text-danger font-bold">{errorMsg}</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="6" className="p-12 text-center text-muted-foreground">No users found matching your search.</td></tr>
              ) : filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-background/50 transition-colors border-b border-border last:border-0 group">
                  <td className="p-4 text-xs font-mono text-gray-500">{u._id.slice(-8).toUpperCase()}</td>
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <span className="text-primary text-xs font-bold">{u.name.charAt(0).toUpperCase()}</span>
                    </div>
                    {u.name}
                  </td>
                  <td className="p-4 text-sm text-gray-400">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-fit ${u.role === 'admin' ? 'bg-danger/20 text-danger border border-danger/30' : 'bg-blue-500/20 text-blue-500 border border-blue-500/30'}`}>
                      {u.role === 'admin' && <Shield className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleRoleChange(u._id, u.role)}
                        title={u.role === 'admin' ? 'Demote to Client' : 'Promote to Admin'} 
                        className={`p-2 rounded border transition-colors ${u.role === 'admin' ? 'bg-background border-border hover:bg-warning/20 hover:text-warning hover:border-warning/30 text-muted-foreground' : 'bg-background border-border hover:bg-success/20 hover:text-success hover:border-success/30 text-muted-foreground'}`}
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        title="Delete User" 
                        className="p-2 bg-background border border-border text-muted-foreground rounded hover:bg-danger/20 hover:text-danger hover:border-danger/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border p-6 rounded-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-bold uppercase block mb-1">Full Name</label>
                <input required type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white outline-none focus:border-primary text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-bold uppercase block mb-1">Email Address</label>
                <input required type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white outline-none focus:border-primary text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-bold uppercase block mb-1">Password</label>
                <input required type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white outline-none focus:border-primary text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-bold uppercase block mb-1">Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white outline-none focus:border-primary text-sm">
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="bg-primary text-background px-4 py-2 rounded font-bold text-sm flex-1">Create User</button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-surface border border-border px-4 py-2 rounded text-white text-sm flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
