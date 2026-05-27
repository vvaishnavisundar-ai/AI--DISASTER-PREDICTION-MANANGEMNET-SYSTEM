import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import PredictionForm from './pages/PredictionForm';
import Login from './pages/Login';
import Alerts from './pages/Alerts';
import Admin from './pages/Admin';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 bg-background">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="/prediction" element={<PredictionForm />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<div className="p-8">Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
