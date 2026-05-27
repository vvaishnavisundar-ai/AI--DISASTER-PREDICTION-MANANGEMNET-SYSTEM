import React, { useState, useEffect } from 'react';
import { Globe, Radio, Bell, Plus, Edit, Activity } from 'lucide-react';
import axios from 'axios';

const News = () => {
  const userStr = localStorage.getItem('scareychh_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user && user.role === 'admin';

  const [newsFeeds, setNewsFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Weather Alert');
  const [content, setContent] = useState('');
  const [isPushing, setIsPushing] = useState(false);

  const token = localStorage.getItem('scareychh_token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`, config);
      setNewsFeeds(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Auto-refresh news every 5 seconds for real-time client updates
    const interval = setInterval(() => {
      fetchNews();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePushNotification = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please enter a title and message content.");
      return;
    }
    
    setIsPushing(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/news`, {
        title,
        type,
        content
      }, config);
      
      setTitle('');
      setContent('');
      alert("Broadcast sent successfully!");
      fetchNews();
    } catch (err) {
      alert("Failed to send broadcast.");
    } finally {
      setIsPushing(false);
    }
  };

  const getTimeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  if (isAdmin) {
    return (
      <div className="p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <header>
            <h2 className="text-3xl font-bold tracking-tight">Broadcast Center</h2>
            <p className="text-muted-foreground mt-1">Publish news, announcements, and push notifications.</p>
          </header>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-primary"/> Compose Broadcast</h3>
              <form onSubmit={handlePushNotification} className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-bold uppercase mb-1 block">Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-background border border-border rounded p-3 text-white outline-none focus:border-primary" 
                    placeholder="Enter headline..." 
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-bold uppercase mb-1 block">Category</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-background border border-border rounded p-3 text-white outline-none focus:border-primary"
                  >
                    <option value="Weather Alert">Weather Alert</option>
                    <option value="Government Announcement">Government Announcement</option>
                    <option value="Emergency Broadcast">Emergency Broadcast</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-bold uppercase mb-1 block">Message Content</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-background border border-border rounded p-3 text-white outline-none focus:border-primary h-32" 
                    placeholder="Write full announcement here..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isPushing}
                    className="bg-primary text-background px-6 py-3 rounded font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isPushing ? <Activity className="w-4 h-4 animate-spin"/> : <Radio className="w-4 h-4"/>} 
                    {isPushing ? 'Broadcasting...' : 'Push Notification'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Recent Publications</h3>
            {loading && newsFeeds.length === 0 ? (
              <div className="text-center p-8"><Activity className="w-6 h-6 animate-spin mx-auto text-primary"/></div>
            ) : newsFeeds.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground text-sm">No recent publications.</div>
            ) : newsFeeds.map((n) => (
              <div key={n._id} className="bg-surface border border-border p-4 rounded-xl hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] bg-background px-2 py-1 rounded text-primary font-bold uppercase">{n.type}</span>
                  <button className="text-muted-foreground hover:text-white"><Edit className="w-4 h-4"/></button>
                </div>
                <h4 className="font-bold text-sm mb-1">{n.title}</h4>
                <p className="text-xs text-gray-500">{getTimeAgo(n.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Client View
  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 relative">
          <Globe className="w-6 h-6 text-primary" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">News & Live Updates</h2>
          <p className="text-muted-foreground mt-1">Stay informed with the latest regional broadcasts in real-time.</p>
        </div>
      </header>

      <div className="space-y-6">
        {loading && newsFeeds.length === 0 ? (
          <div className="flex justify-center p-12">
            <Activity className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : newsFeeds.length === 0 ? (
          <div className="bg-surface border border-border p-12 text-center rounded-xl">
            <p className="text-gray-400">No news or updates have been published yet.</p>
          </div>
        ) : newsFeeds.map((n) => (
          <div key={n._id} className="bg-surface border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2">
                <Bell className="w-3 h-3" /> {n.type}
              </span>
              <span className="text-xs font-medium text-gray-500 bg-background px-3 py-1 rounded-full border border-border">{getTimeAgo(n.createdAt)}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{n.title}</h3>
            <p className="text-gray-400 leading-relaxed relative z-10 whitespace-pre-wrap">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
