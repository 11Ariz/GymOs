import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  iconGlow?: string;
  delta?: { value: string; positive?: boolean };
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, iconBg, iconGlow, delta, delay = 0 }) => {
  return (
    <div
      className="glass animate-fadeIn"
      style={{
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        animationDelay: `${delay}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>{label}</p>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginTop: 6 }}>
            {value}
          </div>
        </div>
        <div style={{
          width: 44, height: 44,
          borderRadius: '12px',
          background: iconBg ?? 'var(--accent-glow)',
          boxShadow: `0 0 20px ${iconGlow ?? 'var(--accent-glow)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
      {delta && (
        <p style={{ fontSize: 12, color: delta.positive ? 'var(--success)' : 'var(--warning)', margin: 0, fontWeight: 500 }}>
          {delta.value}
        </p>
      )}
    </div>
  );
};
