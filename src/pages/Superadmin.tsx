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
        <section className="w-full md:w-1/3 bg-slate-800 border border-slate-700 rounded-2xl p-6 h-fit shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">New Gym License</h2>
          </div>

          <form onSubmit={handleCreateGym} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Gym Name</label>
              <input
                type="text"
                value={gymName} onChange={e => setGymName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none"
                placeholder="Iron Paradise" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Owner Email</label>
              <input
                type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none"
                placeholder="owner@iron.com" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Initial Password</label>
              <input
                type="text"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none"
                placeholder="GymPass123" minLength={6} required
              />
            </div>
            <button
              type="submit" disabled={creating}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all flex justify-center mt-6"
            >
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>
        </section>

        {/* Existing Gyms List */}
        <section className="w-full md:w-2/3">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            Active Gym Franchises
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-1 border border-slate-700 bg-slate-800 rounded-2xl p-6 flex justify-center">
               <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
              </div>
            ) : gyms.length === 0 ? (
               <div className="col-span-full border border-slate-700 border-dashed bg-slate-800/50 rounded-2xl p-8 text-center text-slate-500">
                No gyms created yet. Sell your first software license!
              </div>
            ) : (
              gyms.map(gym => (
                <div key={gym._id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-slate-600 transition">
                  <h3 className="text-lg font-bold text-white mb-1 truncate">{gym.gymName}</h3>
                  <p className="text-slate-400 text-sm truncate mb-4">{gym.email}</p>
                  <p className="text-xs text-slate-500">Joined: {new Date(gym.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
};
