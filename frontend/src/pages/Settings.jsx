import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Palette, Globe, Shield, Database, Check } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
  const userStr = localStorage.getItem('scareychh_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user && user.role === 'admin';

  // Load preferences from local storage or default
  const [pushEnabled, setPushEnabled] = useState(localStorage.getItem('scareychh_push') !== 'false');
  const [emailEnabled, setEmailEnabled] = useState(localStorage.getItem('scareychh_email') === 'true');
  const [theme, setTheme] = useState(localStorage.getItem('scareychh_theme') || 'dark');

  useEffect(() => {
    // Apply theme
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('scareychh_theme', theme);
  }, [theme]);

  const togglePush = () => {
    const newVal = !pushEnabled;
    setPushEnabled(newVal);
    localStorage.setItem('scareychh_push', newVal);
  };

  const toggleEmail = () => {
    const newVal = !emailEnabled;
    setEmailEnabled(newVal);
    localStorage.setItem('scareychh_email', newVal);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground mt-1">Customize your experience and system configurations.</p>
      </header>

      <div className="space-y-6">
        
        <div className="bg-surface border border-border p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between cursor-pointer" onClick={togglePush}>
              <div>
                <p className="font-medium text-white">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive instant alerts for disasters in your area.</p>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${pushEnabled ? 'bg-primary' : 'bg-gray-600'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pushEnabled ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between cursor-pointer" onClick={toggleEmail}>
              <div>
                <p className="font-medium text-white">Email Alerts</p>
                <p className="text-xs text-muted-foreground">Daily summaries of weather conditions sent to {user?.email || 'your inbox'}.</p>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${emailEnabled ? 'bg-primary' : 'bg-gray-600'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${emailEnabled ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Palette className="w-5 h-5 text-primary" /> Appearance</h3>
          <div className="flex gap-4">
            <button 
              onClick={() => setTheme('dark')}
              className={`flex-1 p-4 rounded-xl text-center border-2 transition-all flex flex-col items-center justify-center gap-2 ${theme === 'dark' ? 'bg-background border-primary text-white' : 'bg-background border-transparent text-gray-500 hover:border-gray-600'}`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-600">
                {theme === 'dark' && <Check className="w-4 h-4 text-primary" />}
              </div>
              <span className="font-bold">Dark Mode</span>
            </button>
            <button 
              onClick={() => setTheme('light')}
              className={`flex-1 p-4 rounded-xl text-center border-2 transition-all flex flex-col items-center justify-center gap-2 ${theme === 'light' ? 'bg-white border-primary text-black' : 'bg-white border-transparent text-gray-400 hover:border-gray-300'}`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                {theme === 'light' && <Check className="w-4 h-4 text-primary" />}
              </div>
              <span className="font-bold">Light Mode</span>
            </button>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-surface border border-danger/50 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-danger/5 blur-3xl"></div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-danger"><Database className="w-5 h-5" /> Admin Configurations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-background p-4 rounded-xl">
                <div>
                  <p className="font-medium text-white">System Backup</p>
                  <p className="text-xs text-muted-foreground">Last backup: 2 hours ago</p>
                </div>
                <button onClick={() => alert('Starting database backup...')} className="bg-surface border border-border px-4 py-2 rounded text-sm hover:text-white transition-colors">Run Backup</button>
              </div>
              <div className="flex items-center justify-between bg-background p-4 rounded-xl">
                <div>
                  <p className="font-medium text-white">API Keys Management</p>
                  <p className="text-xs text-muted-foreground">Manage third-party weather integrations.</p>
                </div>
                <button onClick={() => alert('Navigating to API Gateway...')} className="bg-surface border border-border px-4 py-2 rounded text-sm hover:text-white transition-colors">Manage APIs</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
