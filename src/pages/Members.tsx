import React, { useState, useMemo } from 'react';
import { useMembers } from '../context/MemberContext';
import { MemberForm } from '../components/ui/MemberForm';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import type { Member } from '../types';
import { Plus, Search, Pencil, Trash2, CheckCircle, Clock } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export const Members: React.FC = () => {
  const { members, addMember, updateMember, deleteMember, toggleFeeStatus } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [feeFilter, setFeeFilter] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const today = new Date();

  const filtered = useMemo(() => {
    return members.filter(m => {
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm);
      const matchPlan = planFilter === 'All' || m.plan === planFilter;
      const matchFee = feeFilter === 'All' || m.feeStatus === feeFilter;
      return matchSearch && matchPlan && matchFee;
    });
  }, [members, searchTerm, planFilter, feeFilter]);

  const getMemberStatus = (expiryDate: string) => {
    const days = differenceInDays(new Date(expiryDate), today);
    if (days < 0) return { label: 'Expired', cls: 'badge-danger' };
    if (days <= 7) return { label: `${days}d left`, cls: 'badge-warning' };
    return { label: 'Active', cls: 'badge-success' };
  };

  const getPlanBadgeClass = (plan: string) => {
    if (plan === 'Monthly') return 'badge-accent';
    if (plan === 'Quarterly') return 'badge-info';
    return 'badge-success';
  };

  const handleSave = (data: Omit<Member, '_id'>) => {
    if (editingMember) {
      updateMember(editingMember._id, data);
    } else {
      addMember(data);
    }
    setShowForm(false);
    setEditingMember(null);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            className="input pl-12"
            placeholder="Search name, email, or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select className="input flex-1 min-w-[140px] lg:w-40" value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
            <option value="All">All Plans</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <select className="input flex-1 min-w-[130px] lg:w-36" value={feeFilter} onChange={e => setFeeFilter(e.target.value)}>
            <option value="All">All Fees</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <button className="btn btn-primary w-full sm:w-auto" onClick={() => { setEditingMember(null); setShowForm(true); }}>
            <Plus size={18} /> <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Count */}
      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
        Showing <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{filtered.length}</span> of {members.length} members
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass empty-state">
          <Search size={36} />
          <p>No members found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden p-0">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-0 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
            {['Member', 'Plan', 'Status', 'Expires', 'Fee', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>

          {/* Data rows */}
          {filtered.map((member, i) => {
            const status = getMemberStatus(member.expiryDate);
            return (
              <div
                key={member._id}
                className="animate-fadeIn grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 md:gap-0 items-center px-4 py-4 md:py-2.5 border-b border-white/5 last:border-none hover:bg-white/[0.02] transition-colors"
                style={{
                  animationDelay: `${i * 30}ms`,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Member info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <img
                    src={member.avatar || `https://i.pravatar.cc/150?u=${member._id}`}
                    alt={member.name}
                    style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border)', flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                      {member.name}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.email || member.phone}
                    </p>
                  </div>
                </div>

                {/* Plan - Hidden on very small screens, visible on md+ or logic below */}
                <div className="flex md:block items-center justify-between gap-2">
                  <span className="md:hidden text-[10px] text-slate-500 uppercase font-bold tracking-wider">Plan</span>
                  <span className={`badge ${getPlanBadgeClass(member.plan)} text-[10px] md:text-xs`}>{member.plan}</span>
                </div>

                {/* Status */}
                <div className="flex md:block items-center justify-between gap-2">
                  <span className="md:hidden text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status</span>
                  <span className={`badge ${status.cls} text-[10px] md:text-xs`}>{status.label}</span>
                </div>

                {/* Expiry */}
                <div className="flex md:block items-center justify-between gap-2">
                  <span className="md:hidden text-[10px] text-slate-500 uppercase font-bold tracking-wider">Expires</span>
                  <span className="text-xs md:text-[13px] text-slate-300">
                    {new Date(member.expiryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    <span className="hidden lg:inline"> {new Date(member.expiryDate).getFullYear()}</span>
                  </span>
                </div>

                {/* Fee toggle */}
                <div className="flex md:block items-center justify-between gap-2">
                  <span className="md:hidden text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fee</span>
                  <button
                    className={`btn ${member.feeStatus === 'Paid' ? 'btn-secondary' : 'btn-danger'} h-7 md:h-8 px-2.5 md:px-3 text-[10px] md:text-xs w-fit`}
                    onClick={() => toggleFeeStatus(member._id)}
                  >
                    {member.feeStatus === 'Paid'
                      ? <><CheckCircle size={12} className="text-emerald-400" /> <span className="md:hidden lg:inline">Paid</span></>
                      : <><Clock size={12} /> <span className="md:hidden lg:inline">Pending</span></>
                    }
                  </button>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
                  <button className="btn btn-secondary btn-icon" title="Edit" style={{ width: 28, height: 28 }} onClick={() => handleEdit(member)}>
                    <Pencil size={13} />
                  </button>
                  <button className="btn btn-danger btn-icon" title="Delete" style={{ width: 28, height: 28 }} onClick={() => setDeletingId(member._id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <MemberForm
          member={editingMember}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingMember(null); }}
        />
      )}
      {deletingId && (
        <ConfirmModal
          title="Delete Member"
          message="Are you sure you want to remove this member? This action cannot be undone."
          onConfirm={() => { deleteMember(deletingId); setDeletingId(null); }}
          onClose={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};
