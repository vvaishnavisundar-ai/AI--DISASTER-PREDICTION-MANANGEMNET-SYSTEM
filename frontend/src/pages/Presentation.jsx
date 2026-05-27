import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Map, BarChart2, Globe, Server, CheckCircle } from 'lucide-react';

const Presentation = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-4 md:p-8 space-y-12 animate-in fade-in duration-500 max-w-5xl mx-auto font-sans">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Globe className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary uppercase">
          AI Disaster Prediction <br/> Management System
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          An advanced AI-powered platform designed for real-time disaster monitoring, prediction, emergency management, and risk analysis.
        </p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-12">
        
        {/* Project Overview */}
        <motion.section variants={itemVariants} className="bg-[#0B1121]/50 border border-border p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            Project Overview
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            The AI Disaster Prediction Management System is a futuristic real-time monitoring platform that helps predict and manage natural disasters using Artificial Intelligence and live environmental data.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">The Platform Provides:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> AI-based disaster prediction</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Real-time emergency alerts</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Interactive live maps</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Disaster analytics</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Emergency response management</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Risk monitoring dashboard</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Designed For:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Government agencies</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Disaster management authorities</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Emergency response teams</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Smart city monitoring</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Environmental monitoring centers</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Key Features Grid */}
        <motion.section variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Key Features & Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-surface border border-border p-6 rounded-xl hover:border-primary/50 transition-colors">
              <BarChart2 className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">AI Disaster Prediction</h3>
              <p className="text-sm text-gray-400 mb-4">Predicts floods, cyclones, earthquakes, wildfires, and landslides using advanced algorithms.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">Temperature</span>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">Rainfall</span>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">Humidity</span>
              </div>
            </div>

            <div className="bg-surface border border-border p-6 rounded-xl hover:border-secondary/50 transition-colors">
              <Activity className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Monitoring</h3>
              <p className="text-sm text-gray-400 mb-4">Interactive dashboard displaying active disaster alerts, high-risk zones, and live weather data.</p>
            </div>

            <div className="bg-surface border border-border p-6 rounded-xl hover:border-accent/50 transition-colors">
              <Map className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Interactive Disaster Map</h3>
              <p className="text-sm text-gray-400 mb-4">Live map visualization with flood zones, cyclone paths, and safe zone markers.</p>
            </div>

            <div className="bg-surface border border-border p-6 rounded-xl hover:border-warning/50 transition-colors">
              <ShieldAlert className="w-8 h-8 text-warning mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Emergency Response</h3>
              <p className="text-sm text-gray-400 mb-4">Includes SOS reporting, emergency contacts, shelter management, and rescue coordination.</p>
            </div>

            <div className="bg-surface border border-border p-6 rounded-xl hover:border-purple-500/50 transition-colors">
              <Server className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">AI Analytics Engine</h3>
              <p className="text-sm text-gray-400 mb-4">Provides prediction accuracy, risk analysis, seasonal trends, and region-wise reports.</p>
            </div>

          </div>
        </motion.section>

        {/* Tech Stack & Design */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.section variants={itemVariants} className="bg-surface border border-border p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider text-primary">Technology Stack</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {['React.js', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Socket.io', 'Leaflet.js'].map(tech => (
                    <span key={tech} className="px-3 py-1 bg-[#1A2235] rounded-md text-sm text-gray-300">{tech}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Backend & Database</h3>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Express.js', 'MongoDB'].map(tech => (
                    <span key={tech} className="px-3 py-1 bg-[#1A2235] rounded-md text-sm text-gray-300">{tech}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">AI / Machine Learning</h3>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'Scikit-learn', 'TensorFlow', 'Random Forest'].map(tech => (
                    <span key={tech} className="px-3 py-1 bg-[#1A2235] rounded-md text-sm text-gray-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="bg-surface border border-border p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider text-secondary">UI / UX Experience</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div> Futuristic dark UI</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div> Glassmorphism effects & Neon gradients</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div> Animated dashboards & Interactive charts</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div> Fully responsive layout (Desktop, Tablet, Mobile)</li>
              </ul>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-gray-400 italic">
                "Design Inspiration: NASA monitoring systems, Government emergency dashboards, and Cyberpunk analytics interfaces."
              </p>
            </div>
          </motion.section>
        </div>

        {/* Business Benefits */}
        <motion.section variants={itemVariants} className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Business Benefits & Goal</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['Faster Response', 'Improved Public Safety', 'Real-time Monitoring', 'Accurate AI Predictions', 'Better Planning', 'Reduced Impact'].map(benefit => (
              <span key={benefit} className="px-4 py-2 bg-black/40 border border-white/10 rounded-full text-sm font-medium text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" /> {benefit}
              </span>
            ))}
          </div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto font-medium">
            To build a modern AI-powered disaster intelligence platform capable of predicting disasters, monitoring risks in real time, and helping emergency teams respond faster and more effectively.
          </p>
        </motion.section>

      </motion.div>
    </div>
  );
};

export default Presentation;
