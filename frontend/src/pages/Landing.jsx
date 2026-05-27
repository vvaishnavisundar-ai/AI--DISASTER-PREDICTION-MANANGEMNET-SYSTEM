import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Globe, ShieldAlert, Activity, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#060B19] text-white overflow-hidden relative font-sans">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            AI Disaster Prediction
          </h1>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-[#060B19] transition-all font-medium shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
        >
          Secure Login
        </button>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center px-4 max-w-5xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full border border-secondary/50 bg-secondary/10 text-secondary text-sm font-medium mb-4 backdrop-blur-sm">
            v2.0 Enterprise Intelligence Core
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            National <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Disaster Command</span> Center
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Real-time AI powered monitoring and prediction system for floods, earthquakes, cyclones, and wildfires. Powered by deterministic Machine Learning algorithms.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-[#060B19] font-bold text-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-105"
            >
              <Activity className="w-5 h-5" />
              Launch Dashboard
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-8 py-4 rounded-lg border border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-500 font-bold text-lg transition-all backdrop-blur-sm"
            >
              View Live Map <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Widgets Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          {[
            { title: "Live Tracking", icon: Globe, color: "text-primary", bg: "bg-primary/10" },
            { title: "AI Analytics", icon: Activity, color: "text-secondary", bg: "bg-secondary/10" },
            { title: "Emergency Broadcasts", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-800 bg-[#0B1121]/50 backdrop-blur-md flex flex-col items-center hover:border-gray-600 transition-colors">
              <div className={`p-4 rounded-full ${feature.bg} mb-4`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-lg">{feature.title}</h3>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
