import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between h-16 px-4 md:px-8 border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 pr-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Dumbbell className="text-indigo-400 w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">GymOS</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-full transition-all active:scale-95 whitespace-nowrap"
        >
          Login
        </button>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <main className="relative flex flex-col items-center justify-center px-4 pt-20 pb-24 md:pt-32 md:pb-40 text-center">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[11px] md:text-xs font-semibold uppercase tracking-wider mb-8 animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_var(--accent-light)]" />
          Next Generation Gym ERP
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl text-white mb-8 leading-[1.1] animate-fadeIn">
          Manage your gym <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">effortlessly.</span>
        </h1>
        
        <p className="text-slate-400 text-base md:text-lg lg:text-xl max-w-2xl mb-12 leading-relaxed animate-fadeIn" style={{ animationDelay: '100ms' }}>
          An all-in-one platform to track memberships, automate payment reminders, and retain clients. Built specifically for modern fitness center owners.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-10 py-4 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-500/20 transition-all text-base md:text-lg"
          >
            Get Started Free
          </button>
          <div className="text-slate-500 text-sm font-medium">No credit card required</div>
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
