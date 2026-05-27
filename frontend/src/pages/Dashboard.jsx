import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import axios from 'axios';
import { ShieldAlert, MapPin, CloudRain, Wind, Activity, AlertTriangle, ThermometerSun, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper to map Open-Meteo WMO weather codes to strings
const getWeatherDescription = (code) => {
  if (code === 0) return 'Clear sky';
  if (code >= 1 && code <= 3) return 'Partly cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  
  // Real Geolocation and API Data
  const [geoData, setGeoData] = useState({
    lat: 20.5937, // Default India
    lon: 78.9629,
    city: 'Detecting Location...',
    country: '...',
    temp: '--',
    weatherDesc: 'Loading...',
    realRisks: null
  });

  const [loading, setLoading] = useState(true);
  const userStr = localStorage.getItem('scareychh_user');
  const user = userStr ? JSON.parse(userStr) : { name: 'User' };

  useEffect(() => {
    // 1. Fetch Backend Data (Alerts and Risk Props)
    const fetchBackendData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('scareychh_token')}` } };
        const dashRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/client`, config);
        setDashboardData(dashRes.data.data);

        const alertRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/alerts`, config);
        setActiveAlerts(alertRes.data.data || []);
      } catch (err) {
        console.error("Error fetching dashboard backend data", err);
      }
    };

    // 2. Fetch Real Geolocation and APIs
    const fetchRealLocationData = () => {
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;

              try {
                // OpenStreetMap Nominatim for Reverse Geocoding
                const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const address = geoRes.data.address;
                const city = address.city || address.town || address.village || address.county || 'Unknown Area';
                const country = address.country || '';

                // Open-Meteo for Real Weather
                const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,precipitation`);
                const tempVal = weatherRes.data.current.temperature_2m;
                const windSpeed = weatherRes.data.current.wind_speed_10m;
                const precip = weatherRes.data.current.precipitation;
                
                const temp = `${Math.round(tempVal)}°C`;
                const weatherDesc = getWeatherDescription(weatherRes.data.current.weather_code);

                // Calculate Real-Time Risks based on actual weather
                const heatwaveProb = Math.min(99, Math.max(5, Math.round((tempVal / 45) * 100)));
                const cycloneProb = Math.min(99, Math.max(5, Math.round((windSpeed / 100) * 100)));
                const floodProb = Math.min(99, Math.max(5, Math.round((precip / 20) * 100)));
                const earthquakeProb = Math.floor(Math.random() * 15) + 1; // Earthquakes are unpredictable, keep low

                const getLevel = (prob) => prob > 75 ? 'Extreme' : prob > 50 ? 'High' : prob > 25 ? 'Medium' : 'Low';
                const getColor = (prob) => prob > 75 ? 'text-red-500' : prob > 50 ? 'text-orange-500' : prob > 25 ? 'text-yellow-500' : 'text-green-500';
                const getBg = (prob) => prob > 75 ? 'bg-red-500/10' : prob > 50 ? 'bg-orange-500/10' : prob > 25 ? 'bg-yellow-500/10' : 'bg-green-500/10';

                const realRisks = [
                  { type: 'Flood Risk', level: getLevel(floodProb), probability: floodProb, color: getColor(floodProb), bg: getBg(floodProb) },
                  { type: 'Cyclone Risk', level: getLevel(cycloneProb), probability: cycloneProb, color: getColor(cycloneProb), bg: getBg(cycloneProb) },
                  { type: 'Earthquake Risk', level: getLevel(earthquakeProb), probability: earthquakeProb, color: getColor(earthquakeProb), bg: getBg(earthquakeProb) },
                  { type: 'Heatwave Risk', level: getLevel(heatwaveProb), probability: heatwaveProb, color: getColor(heatwaveProb), bg: getBg(heatwaveProb) }
                ];

                setGeoData({ lat, lon, city, country, temp, weatherDesc, realRisks });
                resolve();
              } catch (err) {
                console.error("Error fetching location APIs", err);
                setGeoData(prev => ({...prev, city: 'Location API Error'}));
                resolve();
              }
            },
            (error) => {
              console.error("Geolocation denied or error:", error);
              setGeoData(prev => ({...prev, city: 'Location Access Denied'}));
              resolve();
            }
          );
        } else {
          setGeoData(prev => ({...prev, city: 'Geolocation not supported'}));
          resolve();
        }
      });
    };
    
    const loadAllData = async () => {
      await Promise.all([fetchBackendData(), fetchRealLocationData()]);
      setLoading(false);
    };

    loadAllData();

    // Setup real socket connection
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.on('emergency_alert', () => {
      fetchBackendData();
    });

    return () => socket.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const displayRisks = geoData.realRisks || dashboardData?.riskProbabilities || [];
  
  // Calculate dynamic AQI mock based on alerts for flair, or keep it static if no real AQI API
  const dynamicRiskStatus = activeAlerts.length > 0 ? 'High' : 'Safe';
  const dynamicRiskMessage = activeAlerts.length > 0 ? 'Active Disasters Nearby' : 'All Clear in your region';
  const riskColor = activeAlerts.length > 0 ? 'text-red-500' : 'text-green-500';

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500 max-w-screen-2xl mx-auto font-sans bg-background min-h-screen">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <p className="text-gray-400 text-sm">Welcome back,</p>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {user.name} <span className="text-xl">👋</span>
          </h2>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-extrabold tracking-widest text-white uppercase shadow-sm">
            CLIENT / USER DASHBOARD
          </h1>
          <p className="text-gray-400 text-sm tracking-wide mt-1">
            Real-time Alerts • Easy Predictions • Stay Safe
          </p>
        </div>
      </header>

      {/* Top Cards (4 Grid) */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Dynamic Risk Level */}
        <motion.div variants={itemVariants} className="bg-surface border border-border p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 ${activeAlerts.length > 0 ? 'bg-red-500/10' : 'bg-green-500/10'} blur-2xl rounded-full -mr-16 -mt-16`}></div>
          <div className={`w-14 h-14 rounded-xl ${activeAlerts.length > 0 ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/20 border-green-500/30'} flex items-center justify-center border shadow-[0_0_15px_rgba(239,68,68,0.3)]`}>
            {activeAlerts.length > 0 ? <ShieldAlert className="w-7 h-7 text-red-500" /> : <CheckCircle className="w-7 h-7 text-green-500" />}
          </div>
          <div className="z-10">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Current Risk Level</p>
            <h3 className={`text-2xl font-bold ${riskColor}`}>{dynamicRiskStatus}</h3>
            <p className="text-xs text-gray-400 mt-1">{dynamicRiskMessage}</p>
          </div>
        </motion.div>

        {/* Real Weather */}
        <motion.div variants={itemVariants} className="bg-surface border border-border p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full -mr-16 -mt-16"></div>
          <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <CloudRain className="w-7 h-7 text-blue-400" />
          </div>
          <div className="z-10">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Real Weather</p>
            <h3 className="text-2xl font-bold text-white">{geoData.temp}</h3>
            <p className="text-xs text-gray-400 mt-1">{geoData.weatherDesc}</p>
          </div>
        </motion.div>

        {/* Air Quality Card */}
        <motion.div variants={itemVariants} className="bg-surface border border-border p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-2xl rounded-full -mr-16 -mt-16"></div>
          <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Wind className="w-7 h-7 text-green-400" />
          </div>
          <div className="z-10">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Air Quality</p>
            <h3 className="text-2xl font-bold text-white">AQI 42</h3>
            <p className="text-xs text-gray-400 mt-1">Good</p>
          </div>
        </motion.div>

        {/* Real Location Card */}
        <motion.div variants={itemVariants} className="bg-surface border border-border p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full -mr-16 -mt-16"></div>
          <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <MapPin className="w-7 h-7 text-purple-400" />
          </div>
          <div className="z-10">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Your Location</p>
            <h3 className="text-lg font-bold text-white leading-tight">{geoData.city}</h3>
            <p className="text-xs text-gray-400 mt-1">{geoData.country}</p>
          </div>
        </motion.div>

      </motion.div>

      {/* Middle Section: Map + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real Interactive Leaflet Map */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-surface border border-border rounded-2xl overflow-hidden flex flex-col relative z-0"
        >
          <div className="p-4 border-b border-border flex justify-between items-center bg-background/80 backdrop-blur-md absolute top-0 w-full z-[1000]">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Live Interactive Map</h3>
          </div>
          <div className="h-[400px] w-full bg-background relative z-0">
             {/* Replace static image with real react-leaflet */}
             <MapContainer 
                center={[geoData.lat, geoData.lon]} 
                zoom={5} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                {/* Dark matter styled tiles */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {/* User's Current Location Pin */}
                <Marker position={[geoData.lat, geoData.lon]}>
                  <Popup className="bg-surface text-white border border-primary">
                    <b>You are here</b><br/>{geoData.city}
                  </Popup>
                </Marker>

                {/* Simulated Danger Zones for Visual Effect (Heatmap proxy) */}
                <CircleMarker center={[26.2006, 92.9376]} radius={40} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }}>
                  <Popup>Assam - High Flood Risk</Popup>
                </CircleMarker>
                <CircleMarker center={[28.7041, 77.1025]} radius={30} pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.3 }}>
                  <Popup>Delhi NCR - Heatwave Warning</Popup>
                </CircleMarker>
              </MapContainer>
          </div>
        </motion.div>

        {/* Active Alerts */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-surface border border-border rounded-2xl flex flex-col h-[400px]"
        >
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Active Alerts</h3>
            <button onClick={() => navigate('/alerts')} className="text-xs text-primary hover:text-white transition-colors">View All</button>
          </div>
          <div className="p-4 overflow-y-auto space-y-3 custom-scrollbar flex-1">
            {activeAlerts.length > 0 ? (
               activeAlerts.map((alert, i) => (
                <div key={i} className="bg-background border border-red-900/30 p-4 rounded-xl flex items-start gap-3 hover:border-red-500/50 transition-colors cursor-pointer group">
                  <div className="mt-1">
                    <ShieldAlert className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-red-400">{alert.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{alert.message.substring(0, 50)}...</p>
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
                <CheckCircle className="w-10 h-10 text-green-500/50" />
                <p className="text-sm">No active alerts. Region is safe.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Risk Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayRisks.map((risk, i) => (
          <motion.div variants={itemVariants} key={i} className="bg-surface border border-border p-5 rounded-2xl flex items-center gap-4 hover:bg-background transition-colors cursor-default">
            <div className={`w-12 h-12 rounded-full ${risk.bg} flex items-center justify-center`}>
              {risk.type.includes('Flood') && <CloudRain className={`w-6 h-6 ${risk.color}`} />}
              {risk.type.includes('Cyclone') && <Wind className={`w-6 h-6 ${risk.color}`} />}
              {risk.type.includes('Earthquake') && <Activity className={`w-6 h-6 ${risk.color}`} />}
              {risk.type.includes('Heatwave') && <ThermometerSun className={`w-6 h-6 ${risk.color}`} />}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold">{risk.type}</p>
              <h4 className={`text-lg font-bold ${risk.color}`}>{risk.level}</h4>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <span className="text-white">→ Probability {risk.probability}%</span>
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
};

export default Dashboard;
