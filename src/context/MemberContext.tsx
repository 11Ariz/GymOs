import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Member } from '../types';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface MemberContextType {
  members: Member[];
  isLoading: boolean;
  addMember: (member: Omit<Member, '_id'>) => Promise<void>;
  updateMember: (_id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (_id: string) => Promise<void>;
  toggleFeeStatus: (_id: string) => Promise<void>;
  refreshMembers: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // To know when someone is logged in

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/api/members');
      if (data.success) {
        setMembers(data.members || []);
      }
    } catch (err: any) {
      console.error('Failed to load members:', err);
      // Optional: uncomment below if you want toast on load failure
      // toast.error('Failed to load members from server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'GYM_OWNER') {
      fetchMembers();
    } else {
      setMembers([]);
    }
  }, [user]);

  const addMember = async (memberData: Omit<Member, '_id'>) => {
    try {
      const { data } = await api.post('/api/members', memberData);
      if (data.success) {
        setMembers(prev => [...prev, data.member]);
        toast.success('Member added successfully!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add member');
      throw err;
    }
  };

  const updateMember = async (_id: string, updatedData: Partial<Member>) => {
    try {
      const { data } = await api.put(`/api/members/${_id}`, updatedData);
      if (data.success) {
        setMembers(prev => prev.map(m => (m._id === _id ? { ...m, ...data.member } : m)));
        toast.success('Member updated!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update member');
      throw err;
    }
  };

  const deleteMember = async (_id: string) => {
    try {
      const { data } = await api.delete(`/api/members/${_id}`);
      if (data.success) {
        setMembers(prev => prev.filter(m => m._id !== _id));
        toast.success('Member removed!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete member');
      throw err;
    }
  };

  const toggleFeeStatus = async (_id: string) => {
    const member = members.find(m => m._id === _id);
    if (!member) return;

    try {
      const newStatus = member.feeStatus === 'Paid' ? 'Pending' : 'Paid';
      const { data } = await api.put(`/api/members/${_id}`, { feeStatus: newStatus });
      if (data.success) {
        setMembers(prev => prev.map(m => (m._id === _id ? { ...m, feeStatus: newStatus } : m)));
        toast.success(`Fee status marked as ${newStatus}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update fee status');
      throw err;
    }
  };

  return (
    <MemberContext.Provider 
      value={{ 
        members, 
        isLoading, 
        addMember, 
        updateMember, 
        deleteMember, 
        toggleFeeStatus,
        refreshMembers: fetchMembers
      }}
    >
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
