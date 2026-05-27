import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Map, BarChart2, ShieldAlert, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Live Map', path: '/map', icon: Map },
    { name: 'AI Prediction', path: '/prediction', icon: BarChart2 },
    { name: 'Alerts', path: '/alerts', icon: ShieldAlert },
    { name: 'Admin', path: '/admin', icon: Settings },
  ];

  return (
    <div className="w-64 bg-surface border-r border-border h-screen flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          ScareyChh
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                  : 'text-muted-foreground hover:bg-surface-light hover:text-white'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-danger transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
