import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMembers } from '../../context/MemberContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut } from 'lucide-react';

interface HeaderProps {
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/reminders': 'Reminders',
};

export const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const { members } = useMembers();
  const { user, logout } = useAuth();
  const title = pageTitles[location.pathname] ?? 'GymOS';

  const today = new Date();
  const expiringSoon = members.filter(m => {
    const days = Math.ceil((new Date(m.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days >= 0;
  }).length;

  const getInitials = (name?: string) => name ? name.substring(0, 2).toUpperCase() : 'GO';

  return (
    <header className="h-16 md:h-20 shrink-0 border-b border-slate-800 px-4 md:px-8 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white shrink-0 truncate max-w-[150px] sm:max-w-xs">{title}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition" title="Expiring memberships">
          <Bell className="w-5 h-5" />
          {expiringSoon > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-slate-900" />
          )}
        </button>
        
        {/* User Info & Avatar */}
        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-800">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-white">{user?.gymName || 'Gym Owner'}</span>
            <span className="text-xs text-slate-400">{user?.email}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
            {getInitials(user?.gymName)}
          </div>
          <button 
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition ml-1"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
