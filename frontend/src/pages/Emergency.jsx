import React, { useState } from 'react';
import { Phone, MapPin, Activity, Edit2, Trash2, Plus, Save } from 'lucide-react';

const Emergency = () => {
  const userStr = localStorage.getItem('scareychh_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user && user.role === 'admin';

  const [editMode, setEditMode] = useState(false);

  const [contacts, setContacts] = useState([
    { id: 1, name: 'National Disaster Control', number: '1078' },
    { id: 2, name: 'Ambulance / Medical', number: '102' },
    { id: 3, name: 'Fire Department', number: '101' },
  ]);

  const [facilities, setFacilities] = useState([
    { id: 1, name: 'City General Hospital', distance: '2.4 km away', query: 'City General Hospital', color: 'green' },
    { id: 2, name: 'Metro Care Unit', distance: '5.1 km away', query: 'Metro Care Unit', color: 'warning' },
    { id: 3, name: 'Central Fire Station', distance: '3.2 km away', query: 'Central Fire Station', color: 'blue' },
  ]);

  const addContact = () => {
    setContacts([...contacts, { id: Date.now(), name: 'New Contact', number: '000' }]);
  };

  const removeContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const addFacility = () => {
    setFacilities([...facilities, { id: Date.now(), name: 'New Facility', distance: '1.0 km away', query: '', color: 'blue' }]);
  };

  const removeFacility = (id) => {
    setFacilities(facilities.filter(f => f.id !== id));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500 relative">
      {isAdmin && (
        <div className="absolute top-8 right-8">
          <button 
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded font-bold flex items-center gap-2 transition-colors ${editMode ? 'bg-success text-white hover:bg-green-600' : 'bg-primary/20 text-primary hover:bg-primary hover:text-white'}`}
          >
            {editMode ? <><Save className="w-4 h-4" /> Save Directory</> : <><Edit2 className="w-4 h-4" /> Edit Directory</>}
          </button>
        </div>
      )}

      <header className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white mb-2">Emergency Directory</h2>
        <p className="text-gray-400">Direct lines and navigation to immediate emergency services.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contact Services Card */}
        <div className="bg-surface border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Phone className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Contact Services</h3>
                <p className="text-sm text-muted-foreground">Direct lines to authorities</p>
              </div>
            </div>
            {editMode && (
              <button onClick={addContact} className="p-2 bg-primary/20 text-primary rounded hover:bg-primary hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="relative group/item">
                <a 
                  href={editMode ? "#" : `tel:${contact.number}`}
                  className={`flex justify-between items-center bg-background p-4 rounded-xl transition-colors group/link border border-transparent hover:border-primary/30 ${editMode ? 'pr-20' : 'hover:bg-primary/20 cursor-pointer'}`}
                >
                  {editMode ? (
                    <input type="text" defaultValue={contact.name} className="bg-surface border border-border p-1 rounded text-white text-sm w-1/2" />
                  ) : (
                    <span className="text-base font-medium group-hover/link:text-white transition-colors">{contact.name}</span>
                  )}
                  
                  {editMode ? (
                    <input type="text" defaultValue={contact.number} className="bg-surface border border-border p-1 rounded text-blue-400 font-bold text-sm w-1/3 text-right" />
                  ) : (
                    <span className="font-bold text-lg text-blue-400 group-hover/link:text-blue-300">📞 {contact.number}</span>
                  )}
                </a>
                {editMode && (
                  <button onClick={() => removeContact(contact.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-danger/20 text-danger rounded hover:bg-danger hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Facilities Card */}
        <div className="bg-surface border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <Activity className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Nearby Facilities</h3>
                <p className="text-sm text-muted-foreground">Locate medical & rescue centers</p>
              </div>
            </div>
            {editMode && (
              <button onClick={addFacility} className="p-2 bg-primary/20 text-primary rounded hover:bg-primary hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="space-y-4">
            {facilities.map((fac) => (
              <div key={fac.id} className="relative group/item">
                <a 
                  href={editMode ? "#" : `https://maps.google.com/?q=${encodeURIComponent(fac.query)}`} 
                  target={editMode ? "" : "_blank"} 
                  rel="noreferrer" 
                  className={`flex justify-between items-center bg-background p-4 rounded-xl transition-colors group/link border border-transparent hover:border-primary/30 ${editMode ? 'pr-20' : 'hover:bg-primary/20 cursor-pointer'}`}
                >
                  <div className={editMode ? 'w-2/3 space-y-2' : ''}>
                    {editMode ? (
                      <input type="text" defaultValue={fac.name} className="bg-surface border border-border p-1 rounded text-white text-sm w-full" />
                    ) : (
                      <p className="text-base font-bold group-hover/link:text-white transition-colors">{fac.name}</p>
                    )}
                    
                    {editMode ? (
                      <input type="text" defaultValue={fac.distance} className="bg-surface border border-border p-1 rounded text-muted-foreground text-xs w-full" />
                    ) : (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {fac.distance}</p>
                    )}
                  </div>
                  
                  {!editMode && (
                    <span className={`text-xs bg-${fac.color}-500/20 text-${fac.color}-500 px-3 py-1.5 rounded font-bold border border-${fac.color}-500/30`}>Directions ↗</span>
                  )}
                </a>
                {editMode && (
                  <button onClick={() => removeFacility(fac.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-danger/20 text-danger rounded hover:bg-danger hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Emergency;
