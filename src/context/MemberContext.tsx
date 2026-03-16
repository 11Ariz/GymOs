import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Member } from '../types';
import api from '../api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface MemberContextType {
  members: Member[];
  loading: boolean;
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<Member, '_id'>) => Promise<boolean>;
  updateMember: (id: string, member: Partial<Member>) => Promise<boolean>;
  deleteMember: (id: string) => Promise<boolean>;
  toggleFeeStatus: (id: string) => Promise<boolean>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMembers = useCallback(async () => {
    if (!user || user.role !== 'GYM_OWNER') {
      setMembers([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/api/members');
      if (data.success) setMembers(data.members);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addMember = async (memberData: Omit<Member, '_id'>) => {
    try {
      const { data } = await api.post('/api/members', memberData);
      if (data.success) {
        setMembers(prev => [...prev, data.member]);
        toast.success('Member added successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Add member error:', error);
      toast.error('Failed to add member');
      return false;
    }
  };

  const updateMember = async (id: string, updatedData: Partial<Member>) => {
    try {
      const { data } = await api.put(`/api/members/${id}`, updatedData);
      if (data.success) {
        setMembers(prev => prev.map(m => m._id === id ? data.member : m));
        toast.success('Member updated');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update member error:', error);
      toast.error('Failed to update member');
      return false;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { data } = await api.delete(`/api/members/${id}`);
      if (data.success) {
        setMembers(prev => prev.filter(m => m._id !== id));
        toast.success('Member deleted');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete member error:', error);
      toast.error('Failed to delete member');
      return false;
    }
  };

  const toggleFeeStatus = async (id: string) => {
    const member = members.find(m => m._id === id);
    if (!member) return false;
    
    const newStatus = member.feeStatus === 'Paid' ? 'Pending' : 'Paid';
    return await updateMember(id, { feeStatus: newStatus });
  };

  return (
    <MemberContext.Provider value={{ members, loading, fetchMembers, addMember, updateMember, deleteMember, toggleFeeStatus }}>
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
