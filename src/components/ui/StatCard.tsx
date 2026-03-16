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
      className="glass animate-fadeIn p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[12px] sm:text-[13px] text-slate-400 font-medium truncate">{label}</p>
          <div className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mt-1 truncate">
            {value}
          </div>
        </div>
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-xl"
          style={{
            background: iconBg ?? 'var(--accent-glow)',
            boxShadow: `0 0 20px ${iconGlow ?? 'var(--accent-glow)'}`,
          }}
        >
          {icon}
        </div>
      </div>
      {delta && (
        <p className={`text-xs font-semibold ${delta.positive ? 'text-emerald-400' : 'text-amber-400'}`}>
          {delta.value}
        </p>
      )}
    </div>
  );
};
