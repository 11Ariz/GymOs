import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BellRing, Dumbbell, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/reminders', icon: BellRing, label: 'Reminders' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800
      transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      flex flex-col py-6 shadow-2xl lg:shadow-none
    `}>
      {/* Header & Logo */}
      <div className="px-6 pb-6 border-b border-slate-800 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Dumbbell className="text-white w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white leading-tight">GymOS</div>
            <div className="text-xs font-medium text-slate-400">Owner Portal</div>
          </div>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm
              ${isActive 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'}
            `}
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 pt-4 border-t border-slate-800 mt-4">
        <div className="text-xs text-center text-slate-500">
          © {new Date().getFullYear()} GymOS SaaS
        </div>
      </div>
    </aside>
  );
};
