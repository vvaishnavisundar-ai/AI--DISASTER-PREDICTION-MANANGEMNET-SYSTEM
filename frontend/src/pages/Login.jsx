import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ShieldAlert, Activity, User, Lock, Fingerprint } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('client'); // default to citizen/client
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password, role };
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, payload);
      
      // Store token and user data
      localStorage.setItem('scareychh_token', response.data.token);
      localStorage.setItem('scareychh_user', JSON.stringify({
        id: response.data._id,
        name: response.data.name,
        role: response.data.role // 'admin' or 'client'
      }));
      
      // Smart Routing Based on Role
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060B19] p-4 relative overflow-hidden font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0B1121]/80 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 relative shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <div className="absolute inset-0 border-2 border-primary rounded-full animate-[spin_3s_linear_infinite] border-t-transparent"></div>
            <Fingerprint className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {isLogin ? 'Security Clearance' : 'Citizen Registration'}
          </h2>
          <p className="text-gray-400 mt-2 text-center text-sm font-medium">
            National Disaster Intelligence System
          </p>
        </div>

        {/* Auth Toggle */}
        <div className="flex p-1 bg-gray-900 rounded-lg mb-6">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${isLogin ? 'bg-primary text-[#060B19]' : 'text-gray-400 hover:text-white'}`}
          >
            LOGIN
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${!isLogin ? 'bg-primary text-[#060B19]' : 'text-gray-400 hover:text-white'}`}
          >
            REGISTER
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start gap-3"
            >
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      required={!isLogin}
                      value={name}
                      autoComplete="off"
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Clearance Level</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all appearance-none"
                  >
                    <option value="client">Citizen (Public Access)</option>
                    <option value="admin">Administrator (Command Level)</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Identification</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                required
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="citizen@domain.com"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                required
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-white text-[#060B19] font-bold py-4 rounded-lg uppercase tracking-widest transition-all mt-6 shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Establish Connection' : 'Register Identity'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
