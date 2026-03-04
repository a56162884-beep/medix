import React, { useState } from 'react';
import { User, Mail, Moon, Sun, Monitor, Camera, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { LOGO_URL } from '../constants';

export default function Profile() {
  const [name, setName] = useState('Anjali Sharma');
  const [className, setClassName] = useState('12th Grade - NEET Batch A');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={LOGO_URL} 
            alt="MediX Logo" 
            className="h-8 w-auto"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">My Profile</h1>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-primary font-bold text-sm hover:underline"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-black text-3xl border-4 border-white shadow-lg shadow-indigo-100 overflow-hidden">
              {/* Placeholder for profile pic */}
              <span className="group-hover:opacity-20 transition-opacity">A</span>
              <img src="https://picsum.photos/seed/profile/200" alt="Profile" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border border-slate-100 text-slate-400 group-hover:text-primary transition-colors">
              <Camera size={16} />
            </div>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-4">{name}</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{className}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
              <User size={18} className="text-slate-400" />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-full disabled:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Class / Batch</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
              <User size={18} className="text-slate-400" />
              <input 
                type="text" 
                value={className} 
                onChange={(e) => setClassName(e.target.value)}
                disabled={!isEditing}
                className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-full disabled:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 opacity-75">
              <Mail size={18} className="text-slate-400" />
              <input 
                type="text" 
                value="anjali.sharma@medix.com" 
                disabled
                className="bg-transparent border-none outline-none text-sm font-bold text-slate-500 w-full cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Appearance</label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-indigo-50 text-primary' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
              >
                <Sun size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Light</span>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-indigo-50 text-primary' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
              >
                <Moon size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Dark</span>
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-indigo-50 text-primary' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
              >
                <Monitor size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">System</span>
              </button>
            </div>
          </div>
        </div>

        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-end"
          >
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
            >
              <Save size={18} />
              Save Changes
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
