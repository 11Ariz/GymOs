import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BellRing } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/reminders', icon: BellRing, label: 'Alerts' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-[env(safe-area-inset-bottom)] pt-2 mb-4">
      <div className="glass border-white/10 bg-slate-900/80 backdrop-blur-2xl rounded-3xl flex items-center justify-around h-16 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 w-full h-full relative group
              ${isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}
              transition-all duration-300
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300
                  ${isActive ? 'bg-indigo-500/10' : 'bg-transparent'}
                `}>
                  <Icon className={`w-6 h-6 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'scale-100'}`} />
                </div>
                <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 w-8 h-1 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
