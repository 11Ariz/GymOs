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
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            className="input pl-10"
            placeholder="Search name, email, or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select className="input flex-1" value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
            <option value="All">All Plans</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <select className="input flex-1" value={feeFilter} onChange={e => setFeeFilter(e.target.value)}>
            <option value="All">All Fees</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <button className="btn btn-primary hidden lg:flex shrink-0" onClick={() => { setEditingMember(null); setShowForm(true); }}>
            <Plus size={16} /> Add Member
          </button>
        </div>
      </div>

      {/* Count */}
      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
        Showing <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{filtered.length}</span> of {members.length} members
      </p>

      {/* Member List */}
      {filtered.length === 0 ? (
        <div className="glass empty-state">
          <Search size={36} />
          <p>No members found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Desktop table header */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
            {['Member', 'Plan', 'Status', 'Expires', 'Fee', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((member, i) => {
            const status = getMemberStatus(member.expiryDate);
            return (
              <div
                key={member._id}
                className="glass animate-fadeIn !p-4"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Desktop row */}
                <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={member.avatar || `https://i.pravatar.cc/150?u=${member._id}`}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-white truncate">{member.name}</p>
                      <p className="text-xs text-slate-500 truncate">{member.email || member.phone}</p>
                    </div>
                  </div>
                  <span className={`badge ${getPlanBadgeClass(member.plan)} text-xs w-fit`}>{member.plan}</span>
                  <span className={`badge ${status.cls} text-xs w-fit`}>{status.label}</span>
                  <span className="text-xs text-slate-300">
                    {new Date(member.expiryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    className={`btn h-8 px-3 text-xs w-fit ${member.feeStatus === 'Paid' ? 'btn-secondary' : 'btn-danger'}`}
                    onClick={() => toggleFeeStatus(member._id)}
                  >
                    {member.feeStatus === 'Paid' ? <CheckCircle size={12} className="text-emerald-400" /> : <Clock size={12} />}
                    {member.feeStatus}
                  </button>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-icon h-8 w-8" onClick={() => handleEdit(member)}><Pencil size={13} /></button>
                    <button className="btn btn-danger btn-icon h-8 w-8" onClick={() => setDeletingId(member._id)}><Trash2 size={13} /></button>
                  </div>
                </div>

                {/* Mobile card - clean single card */}
                <div className="md:hidden">
                  {/* Top: avatar + name + actions */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={member.avatar || `https://i.pravatar.cc/150?u=${member._id}`}
                      alt={member.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-white truncate">{member.name}</p>
                      <p className="text-xs text-slate-500 truncate">{member.email || member.phone}</p>
                    </div>
                    <button className="btn btn-secondary btn-icon h-8 w-8" onClick={() => handleEdit(member)}><Pencil size={13} /></button>
                    <button className="btn btn-danger btn-icon h-8 w-8" onClick={() => setDeletingId(member._id)}><Trash2 size={13} /></button>
                  </div>

                  {/* Badges row */}
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className={`badge ${getPlanBadgeClass(member.plan)} text-xs`}>{member.plan}</span>
                    <span className={`badge ${status.cls} text-xs`}>{status.label}</span>
                    <span className="text-xs text-slate-400">Exp: {new Date(member.expiryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  {/* Fee toggle */}
                  <button
                    className={`btn w-full justify-center h-10 text-sm ${member.feeStatus === 'Paid' ? 'btn-secondary' : 'btn-danger'}`}
                    onClick={() => toggleFeeStatus(member._id)}
                  >
                    {member.feeStatus === 'Paid' ? <CheckCircle size={15} className="text-emerald-400" /> : <Clock size={15} />}
                    Fee: {member.feeStatus} — tap to toggle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile FAB */}
      <button
        className="lg:hidden fixed bottom-24 right-5 w-14 h-14 rounded-2xl bg-indigo-500 text-white shadow-[0_8px_30px_rgba(99,102,241,0.5)] flex items-center justify-center active:scale-95 transition-all z-40 border border-white/20"
        onClick={() => { setEditingMember(null); setShowForm(true); }}
      >
        <Plus size={26} />
      </button>

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
