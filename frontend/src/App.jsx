import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import PredictionForm from './pages/PredictionForm';
import Login from './pages/Login';
import Alerts from './pages/Alerts';
import Admin from './pages/Admin';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Landing from './pages/Landing';
import Emergency from './pages/Emergency';
import Shelters from './pages/Shelters';
import History from './pages/History';
import News from './pages/News';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('scareychh_token');
  const userStr = localStorage.getItem('scareychh_user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token) return <Navigate to="/login" replace />;
  if (requireAdmin && (!user || user.role !== 'admin')) return <Navigate to="/dashboard" replace />;
  
  return children;
};

function Layout({ children, isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  if (isLandingPage || isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-surface z-[9000] sticky top-0">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          AI Disaster Prediction
        </h1>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-white bg-primary/20 rounded">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 md:ml-64 bg-background w-full">
        {children}
      </main>
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><LiveMap /></ProtectedRoute>} />
          <Route path="/prediction" element={<ProtectedRoute requireAdmin={true}><PredictionForm /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
          <Route path="/shelters" element={<ProtectedRoute><Shelters /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requireAdmin={true}><Users /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin={true}><Analytics /></ProtectedRoute>} />
          <Route path="*" element={<div className="p-8">Page Not Found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
