import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import axios from 'axios';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

const LiveMap = () => {
  // Center of India roughly
  const center = [20.5937, 78.9629];
  const [alertZones, setAlertZones] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/alerts`);
        
        // Map backend alerts to map zones (mocking coordinates based on region name for demo)
        const getCoords = (region) => {
          const regionMap = {
            'Mumbai': [19.0760, 72.8777],
            'Delhi': [28.7041, 77.1025],
            'Kolkata': [22.5726, 88.3639],
            'Chennai': [13.0827, 80.2707],
            'Bangalore': [12.9716, 77.5946]
          };
          return regionMap[region] || [20.5937, 78.9629]; // Default to center if unknown
        };

        const getColor = (severity) => {
          if (severity === 'Critical') return 'red';
          if (severity === 'Danger' || severity === 'High') return 'orange';
          return 'yellow';
        };

        const zones = res.data.data.map(alert => ({
          id: alert._id,
          pos: getCoords(alert.region),
          radius: alert.severity === 'Critical' ? 60000 : 30000,
          color: getColor(alert.severity),
          info: `${alert.severity} ${alert.title} - ${alert.region}`
        }));
        
        setAlertZones(zones);
      } catch (err) {
        console.error("Error fetching map alerts", err);
      }
    };

    fetchAlerts();

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.on('emergency_alert', () => {
      fetchAlerts(); // Refresh zones on new alert
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="h-screen flex flex-col p-8">
      <header className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Live Threat Map</h2>
        <p className="text-muted-foreground mt-1">Geospatial AI disaster tracking</p>
      </header>

      <div className="flex-1 rounded-xl overflow-hidden border border-border relative">
        <div className="absolute top-4 right-4 z-[1000] bg-surface/90 backdrop-blur border border-border p-4 rounded-lg shadow-xl">
          <h4 className="text-sm font-bold mb-3 border-b border-border pb-2">Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Critical</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Warning</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Watch</div>
          </div>
        </div>

        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%', backgroundColor: '#0B0F19' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {alertZones.map(zone => (
            <Circle 
              key={zone.id} 
              center={zone.pos} 
              radius={zone.radius}
              pathOptions={{ 
                color: zone.color, 
                fillColor: zone.color, 
                fillOpacity: 0.4,
                className: 'animate-pulse' 
              }}
            >
              <Popup className="custom-popup">
                <div className="font-bold text-gray-900">{zone.info}</div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveMap;
