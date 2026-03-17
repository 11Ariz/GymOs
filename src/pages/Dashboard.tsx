import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../context/MemberContext';
import { StatCard } from '../components/ui/StatCard';
import { Users, CreditCard, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { members } = useMembers();
  const navigate = useNavigate();
  const today = new Date();

  const stats = useMemo(() => {
    const active = members.filter(m => new Date(m.expiryDate) >= today).length;
    const expiringSoon = members.filter(m => {
      const days = differenceInDays(new Date(m.expiryDate), today);
      return days >= 0 && days <= 7;
    });
    const pending = members.filter(m => m.feeStatus === 'Pending').length;
    const paid = members.filter(m => m.feeStatus === 'Paid').length;
    return { total: members.length, active, expiringSoon, pending, paid };
  }, [members]);

  const planBreakdown = useMemo(() => {
    const monthly = members.filter(m => m.plan === 'Monthly').length;
    const quarterly = members.filter(m => m.plan === 'Quarterly').length;
    const yearly = members.filter(m => m.plan === 'Yearly').length;
    return { monthly, quarterly, yearly };
  }, [members]);

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Members" 
          value={stats.total} 
          icon={<Users className="w-5 h-5 text-indigo-400" />} 
          iconBg="rgba(129, 140, 248, 0.15)"
          iconGlow="rgba(129, 140, 248, 0.3)"
          delay={0}
        />
        <StatCard 
          label="Paid (This Month)" 
          value={stats.paid} 
          icon={<CheckCircle className="w-5 h-5 text-emerald-400" />} 
          iconBg="rgba(16, 185, 129, 0.15)"
          iconGlow="rgba(16, 185, 129, 0.3)"
          delay={100}
        />
        <StatCard 
          label="Pending Payments" 
          value={stats.pending} 
          icon={<CreditCard className="w-5 h-5 text-rose-400" />} 
          iconBg="rgba(244, 63, 94, 0.15)"
          iconGlow="rgba(244, 63, 94, 0.3)"
          delay={200}
        />
        <StatCard 
          label="Next 7 Days Expiry" 
          value={stats.expiringSoon.length} 
          icon={<Clock className="w-5 h-5 text-amber-400" />} 
          iconBg="rgba(245, 158, 11, 0.15)"
          iconGlow="rgba(245, 158, 11, 0.3)"
          delay={300}
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Expiring Soon List */}
        <div className="glass p-6 animate-fadeIn" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Expiring Soon</h3>
            </div>
            <button
              className="btn btn-secondary h-8 px-3 text-xs"
              onClick={() => navigate('/app/reminders')}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          {stats.expiringSoon.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-slate-400 text-sm">No memberships expiring soon 🎉</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.expiringSoon.map(m => {
                const days = differenceInDays(new Date(m.expiryDate), today);
                return (
                  <div key={m._id} className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/10 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-xl object-cover border border-white/5" />
                      <div className="min-w-0">
                        <p className="text-white text-[13px] font-bold truncate">{m.name}</p>
                        <p className="text-slate-500 text-[11px] truncate">{m.plan}</p>
                      </div>
                    </div>
                    <span className="badge badge-warning text-[10px] font-bold">
                      {days === 0 ? 'Today' : `${days}d left`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Plan Breakdown & Fee Status */}
        <div className="flex flex-col gap-4">
          {/* Plan cards */}
          <div className="glass p-6 animate-fadeIn" style={{ animationDelay: '180ms' }}>
            <h3 className="text-base font-bold text-white mb-6">Plan Breakdown</h3>
            <div className="flex flex-col gap-4">
              {([
                { label: 'Monthly', count: planBreakdown.monthly, color: 'var(--accent-light)' },
                { label: 'Quarterly', count: planBreakdown.quarterly, color: 'var(--accent-2)' },
                { label: 'Yearly', count: planBreakdown.yearly, color: 'var(--success)' },
              ] as const).map(({ label, count, color }) => {
                const pct = members.length > 0 ? (count / members.length) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-400">{label}</span>
                      <span className="text-sm font-bold" style={{ color }}>{count}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(255,255,255,0.1)]" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fee status */}
          <div className="glass p-6 animate-fadeIn" style={{ animationDelay: '240ms' }}>
            <h3 className="text-base font-bold text-white mb-6">Fee Status Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/10 rounded-2xl text-center">
                <div className="text-2xl font-black text-emerald-400">{stats.paid}</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Paid</div>
              </div>
              <div className="p-4 bg-rose-500/10 border border-rose-500/10 rounded-2xl text-center">
                <div className="text-2xl font-black text-rose-400">{stats.pending}</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
