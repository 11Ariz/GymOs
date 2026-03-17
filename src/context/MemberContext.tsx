import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Member } from '../types';

interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, '_id'>) => void;
  updateMember: (_id: string, member: Partial<Member>) => void;
  deleteMember: (_id: string) => void;
  toggleFeeStatus: (_id: string) => void;
}

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const addMonths = (d: Date, n: number) => { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; };
const addYears = (d: Date, n: number) => { const r = new Date(d); r.setFullYear(r.getFullYear() + n); return r; };

const initialMembers: Member[] = [
  {
    _id: '1',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '+1 234-567-8901',
    plan: 'Yearly',
    joinDate: fmt(addYears(today, -1)),
    expiryDate: fmt(addDays(today, 120)),
    feeStatus: 'Paid',
    avatar: 'https://i.pravatar.cc/150?u=alex1'
  },
  {
    _id: '2',
    name: 'Sarah Smith',
    email: 'sarah.s@example.com',
    phone: '+1 234-567-8902',
    plan: 'Monthly',
    joinDate: fmt(addDays(today, -25)),
    expiryDate: fmt(addDays(today, 5)),
    feeStatus: 'Pending',
    avatar: 'https://i.pravatar.cc/150?u=sarah2'
  },
  {
    _id: '3',
    name: 'Mike Brown',
    email: 'mike.b@example.com',
    phone: '+1 234-567-8903',
    plan: 'Quarterly',
    joinDate: fmt(addMonths(today, -2)),
    expiryDate: fmt(addDays(today, 2)),
    feeStatus: 'Paid',
    avatar: 'https://i.pravatar.cc/150?u=mike3'
  },
  {
    _id: '4',
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    phone: '+1 234-567-8904',
    plan: 'Monthly',
    joinDate: fmt(addDays(today, -40)),
    expiryDate: fmt(addDays(today, -10)),
    feeStatus: 'Pending',
    avatar: 'https://i.pravatar.cc/150?u=priya4'
  },
  {
    _id: '5',
    name: 'Jordan Lee',
    email: 'jordan.l@example.com',
    phone: '+1 234-567-8905',
    plan: 'Yearly',
    joinDate: fmt(addDays(today, -90)),
    expiryDate: fmt(addDays(today, 275)),
    feeStatus: 'Paid',
    avatar: 'https://i.pravatar.cc/150?u=jordan5'
  },
];

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(initialMembers);

  const addMember = (memberData: Omit<Member, '_id'>) => {
    const newMember: Member = {
      ...memberData,
      _id: Math.random().toString(36).substr(2, 9),
    };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (_id: string, updatedData: Partial<Member>) => {
    setMembers(prev => prev.map(m => m._id === _id ? { ...m, ...updatedData } : m));
  };

  const deleteMember = (_id: string) => {
    setMembers(prev => prev.filter(m => m._id !== _id));
  };

  const toggleFeeStatus = (_id: string) => {
    setMembers(prev => prev.map(m => {
      if (m._id === _id) {
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
