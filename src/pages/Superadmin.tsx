import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { UserPlus, Building2, LogOut, ShieldCheck, Loader2 } from 'lucide-react';

interface Gym {
  _id: string;
  email: string;
  gymName: string;
  createdAt: string;
}

export const Superadmin: React.FC = () => {
  const { user, logout } = useAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [gymName, setGymName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  if (!user || user.role !== 'SUPERADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchGyms = async () => {
    try {
      const { data } = await api.get('/api/admin/gyms');
      if (data.success) setGyms(data.gyms);
    } catch (error) {
      toast.error('Failed to load gyms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGyms();
  }, []);

  const handleCreateGym = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymName || !email || !password) return toast.error('Fill all fields');
    
    setCreating(true);
    try {
      const { data } = await api.post('/api/admin/create-gym', { gymName, email, password });
      if (data.success) {
        toast.success(`Gym ${gymName} created!`);
        setGymName(''); setEmail(''); setPassword('');
        fetchGyms();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create gym');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-xl font-bold text-white">SuperAdmin Portal</h1>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 lg:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Create Gym Form */}
        <section className="w-full md:w-[380px] shrink-0">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-xl sticky top-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">New License</h2>
            </div>

            <form onSubmit={handleCreateGym} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase ml-1">Gym Name</label>
                <input
                  type="text"
                  value={gymName} onChange={e => setGymName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                  placeholder="Iron Paradise" required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase ml-1">Owner Email</label>
                <input
                  type="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                  placeholder="owner@iron.com" required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase ml-1">Initial Password</label>
                <input
                  type="text"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all font-mono text-sm"
                  placeholder="GymPass123" minLength={6} required
                />
              </div>
              <button
                type="submit" disabled={creating}
                className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-8 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </form>
          </div>
        </section>

        {/* Existing Gyms List */}
        <section className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-white">Active Franchises</span>
            </h2>
            <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-400">
              {gyms.length} Licenses
            </div>
          </div>

          {loading ? (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-slate-400 text-sm font-medium">Synchronizing with system...</p>
            </div>
          ) : gyms.length === 0 ? (
            <div className="bg-slate-800/30 border-2 border-slate-700/50 border-dashed rounded-3xl p-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No gyms created yet</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">Start growing your network by creating your first gym license above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {gyms.map((gym, i) => (
                <div 
                  key={gym._id} 
                  className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 hover:border-indigo-500/30 transition-all duration-300 animate-fadeIn"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                      <Building2 className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(gym.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 truncate">{gym.gymName}</h3>
                  <p className="text-slate-400 text-sm truncate mb-4 font-medium">{gym.email}</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Active License</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};
