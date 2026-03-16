import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BellRing, Dumbbell } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/reminders', icon: BellRing, label: 'Reminders' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      minWidth: 'var(--sidebar-width)',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0',
    }}>
      {/* Logo */}
      <div style={{
        padding: '0 20px 24px',
        borderBottom: '1px solid var(--border)',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px var(--accent-glow)',
          }}>
            <Dumbbell size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>GymOS</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Membership Manager</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(124,58,237,0.25)' : 'transparent'}`,
              transition: 'all 0.15s ease',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} style={{ opacity: isActive ? 1 : 0.7 }} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px 0',
        borderTop: '1px solid var(--border)',
        marginTop: '12px',
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
          © 2026 GymOS v1.0
        </div>
      </div>
    </aside>
  );
};
