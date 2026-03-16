import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMembers } from '../../context/MemberContext';
import { Bell } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/reminders': 'Reminders',
};

export const Header: React.FC = () => {
  const location = useLocation();
  const { members } = useMembers();
  const title = pageTitles[location.pathname] ?? 'GymOS';

  const today = new Date();
  const expiringSoon = members.filter(m => {
    const days = Math.ceil((new Date(m.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days >= 0;
  }).length;

  return (
    <header style={{
      height: 'var(--header-height)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      background: 'rgba(10,11,15,0.8)',
      backdropFilter: 'blur(12px)',
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Notification bell */}
        <button className="btn btn-secondary btn-icon" style={{ position: 'relative' }} title="Expiring memberships">
          <Bell size={18} />
          {expiringSoon > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8,
              borderRadius: '50%',
              background: 'var(--warning)',
              border: '1px solid var(--bg-primary)',
            }} />
          )}
        </button>
        {/* Avatar placeholder */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer',
          boxShadow: '0 0 15px var(--accent-glow)',
          flexShrink: 0,
        }}>
          GO
        </div>
      </div>
    </header>
  );
};
