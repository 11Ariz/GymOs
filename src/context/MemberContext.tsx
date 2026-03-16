import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Member } from '../types';

interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  toggleFeeStatus: (id: string) => void;
}

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '+1 234-567-8901',
    plan: 'Yearly',
    joinDate: '2025-01-15',
    expiryDate: '2026-01-15',
    feeStatus: 'Paid',
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah.s@example.com',
    phone: '+1 234-567-8902',
    plan: 'Monthly',
    joinDate: '2026-02-10',
    expiryDate: '2026-03-10',
    feeStatus: 'Pending',
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: '3',
    name: 'Mike Brown',
    email: 'mike.b@example.com',
    phone: '+1 234-567-8903',
    plan: 'Quarterly',
    joinDate: '2025-12-05',
    expiryDate: '2026-03-05',
    feeStatus: 'Paid',
    avatar: 'https://i.pravatar.cc/150?u=3'
  }
];

const STORAGE_KEY = 'gymOS_members';

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Member[]) : initialMembers;
    } catch {
      return initialMembers;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  const addMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (id: string, updatedData: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const toggleFeeStatus = (id: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, feeStatus: m.feeStatus === 'Paid' ? 'Pending' : 'Paid' };
      }
      return m;
    }));
  };

  return (
    <MemberContext.Provider value={{ members, addMember, updateMember, deleteMember, toggleFeeStatus }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMembers = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
};
