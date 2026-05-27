import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Activity } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      });
      
      // Store token
      localStorage.setItem('scareychh_token', response.data.token);
      localStorage.setItem('scareychh_user', JSON.stringify({
        id: response.data._id,
        name: response.data.name,
        role: response.data.role
      }));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md bg-surface/80 backdrop-blur border border-border p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 relative">
            <div className="absolute inset-0 border-2 border-primary rounded-full animate-spin-slow border-t-transparent"></div>
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-center">System Login</h2>
          <p className="text-muted-foreground mt-2 text-center text-sm">Restricted Access: Government Personnel Only</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Clearance Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="agent@scareychh.gov"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Access Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/80 text-background font-bold py-3 rounded-lg uppercase tracking-wider transition-all mt-4 relative overflow-hidden"
          >
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
