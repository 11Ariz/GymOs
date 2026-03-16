import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../context/MemberContext';
import { StatCard } from '../components/ui/StatCard';
import { Users, AlertTriangle, CreditCard, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';
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
    <div className="flex flex-col gap-6 md:gap-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Members"
          value={stats.total}
          icon={<Users size={20} color="var(--accent-light)" />}
          iconBg="rgba(124,58,237,0.15)"
          iconGlow="var(--accent-glow)"
          delta={{ value: `${stats.active} currently active`, positive: true }}
          delay={0}
        />
        <StatCard
          label="Expiring Soon"
          value={stats.expiringSoon.length}
          icon={<AlertTriangle size={20} color="var(--warning)" />}
          iconBg="var(--warning-bg)"
          iconGlow="rgba(245,158,11,0.3)"
          delta={{ value: 'Within next 7 days', positive: false }}
          delay={60}
        />
        <StatCard
          label="Pending Fees"
          value={stats.pending}
          icon={<CreditCard size={20} color="var(--danger)" />}
          iconBg="var(--danger-bg)"
          iconGlow="rgba(239,68,68,0.3)"
          delta={{ value: `${stats.paid} fees collected`, positive: true }}
          delay={120}
        />
        <StatCard
          label="Total Active"
          value={stats.active}
          icon={<TrendingUp size={20} color="var(--success)" />}
          iconBg="var(--success-bg)"
          iconGlow="rgba(16,185,129,0.3)"
          delta={{ value: `${members.length > 0 ? Math.round((stats.active / members.length) * 100) : 0}% retention rate`, positive: true }}
          delay={180}
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Expiring Soon List */}
        <div className="glass animate-fadeIn" style={{ padding: 24, animationDelay: '120ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={18} color="var(--warning)" />
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Expiring Soon</h3>
            </div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
              onClick={() => navigate('/reminders')}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          {stats.expiringSoon.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 16px' }}>
              <CheckCircle size={36} color="var(--success)" style={{ opacity: 0.6 }} />
              <p>No memberships expiring in the next 7 days 🎉</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.expiringSoon.map(m => {
                const days = differenceInDays(new Date(m.expiryDate), today);
                return (
                  <div key={m._id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', background: 'var(--warning-bg)',
                    borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245,158,11,0.2)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={m.avatar} alt={m.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, margin: 0 }}>{m.name}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 11, margin: 0 }}>{m.plan}</p>
                      </div>
                    </div>
                    <span className="badge badge-warning">
                      {days === 0 ? 'Today' : `${days}d left`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Plan Breakdown & Fee Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Plan cards */}
          <div className="glass animate-fadeIn" style={{ padding: 24, animationDelay: '180ms' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Plan Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([
                { label: 'Monthly', count: planBreakdown.monthly, color: 'var(--accent-light)' },
                { label: 'Quarterly', count: planBreakdown.quarterly, color: 'var(--accent-2)' },
                { label: 'Yearly', count: planBreakdown.yearly, color: 'var(--success)' },
              ] as const).map(({ label, count, color }) => {
                const pct = members.length > 0 ? (count / members.length) * 100 : 0;
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color }}>{count}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`, background: color,
                        borderRadius: 99, transition: 'width 0.6s ease',
                        boxShadow: `0 0 8px ${color}`,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fee status */}
          <div className="glass animate-fadeIn" style={{ padding: 24, animationDelay: '240ms' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Fee Status</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{
                flex: 1, padding: '14px', background: 'var(--success-bg)',
                borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16,185,129,0.2)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--success)' }}>{stats.paid}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Paid</div>
              </div>
              <div style={{
                flex: 1, padding: '14px', background: 'var(--danger-bg)',
                borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--danger)' }}>{stats.pending}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
