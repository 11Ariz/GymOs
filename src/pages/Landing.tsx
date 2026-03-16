import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 md:px-8 border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-indigo-400 w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">GymOS</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
        >
          Login
        </button>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <main className="flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          The future of Gym Management
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 leading-tight">
          Manage your gym members <br className="hidden md:block"/> effortlessly.
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12">
          An all-in-one platform to track memberships, automate payment reminders, and retain clients. Built specifically for modern fitness center owners.
        </p>

        <div className="flex flex-col w-full sm:flex-row sm:w-auto gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all text-lg"
          >
            Get Started
          </button>
        </div>
      </main>

      {/* Feature Grid - Mobile Stacked, Desktop Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
              <Users className="text-emerald-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Member Tracking</h3>
            <p className="text-slate-400 leading-relaxed">Easily add, manage, and search through thousands of active and expired members on any device.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center mb-4">
              <TrendingUp className="text-amber-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fee Management</h3>
            <p className="text-slate-400 leading-relaxed">Quickly view who has paid and who is pending. Send single or bulk automated email reminders instantly.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
              <ShieldCheck className="text-indigo-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Cloud Synced</h3>
            <p className="text-slate-400 leading-relaxed">Everything is securely backed up and isolated. Access your gym's data securely from anywhere.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
