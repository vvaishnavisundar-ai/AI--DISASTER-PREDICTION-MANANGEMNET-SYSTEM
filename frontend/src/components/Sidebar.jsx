import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, Map, BarChart2, ShieldAlert, Settings, LogOut, X, Globe, Brain, AlertTriangle, FileText, Database, Users as UsersIcon } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('scareychh_token');
    localStorage.removeItem('scareychh_user');
    navigate('/login');
  };
  const userStr = localStorage.getItem('scareychh_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user && user.role === 'admin';

  const links = isAdmin ? [
    { name: 'Dashboard', path: '/admin', icon: Activity },
    { name: 'Live Map', path: '/map', icon: Map },
    { name: 'AI Prediction', path: '/prediction', icon: Brain },
    { name: 'Alerts', path: '/alerts', icon: ShieldAlert },
    { name: 'Emergency', path: '/emergency', icon: AlertTriangle },
    { name: 'Shelters', path: '/shelters', icon: Globe },
    { name: 'Disaster History', path: '/history', icon: FileText },
    { name: 'News & Updates', path: '/news', icon: Database },
    { name: 'Users', path: '/admin/users', icon: UsersIcon },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: Settings },
    { name: 'Settings', path: '/settings', icon: Settings }
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Live Map', path: '/map', icon: Map },
    { name: 'Alerts', path: '/alerts', icon: ShieldAlert },
    { name: 'Emergency', path: '/emergency', icon: AlertTriangle },
    { name: 'Shelters', path: '/shelters', icon: Globe },
    { name: 'Disaster History', path: '/history', icon: FileText },
    { name: 'News & Updates', path: '/news', icon: Database },
    { name: 'Profile', path: '/profile', icon: Settings },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Content */}
      <div className={`w-64 bg-surface border-r border-border h-screen flex flex-col p-4 fixed left-0 top-0 z-[9999] transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              AI Prediction
            </h1>
          </div>
          <button className="md:hidden text-muted-foreground hover:text-white" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
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
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-danger transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
