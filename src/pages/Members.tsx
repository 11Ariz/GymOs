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

  const handleSave = (data: Omit<Member, 'id'>) => {
    if (editingMember) {
      updateMember(editingMember.id, data);
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            placeholder="Search members..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 34, height: 36, fontSize: 13 }}
          />
        </div>
        <select className="input" value={planFilter} onChange={e => setPlanFilter(e.target.value)} style={{ width: 'auto', minWidth: 120, height: 36, fontSize: 13 }}>
          <option value="All">All Plans</option>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </select>
        <select className="input" value={feeFilter} onChange={e => setFeeFilter(e.target.value)} style={{ width: 'auto', minWidth: 110, height: 36, fontSize: 13 }}>
          <option value="All">All Fees</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
        <button className="btn btn-primary" style={{ height: 36, fontSize: 13, whiteSpace: 'nowrap' }} onClick={() => { setEditingMember(null); setShowForm(true); }}>
          <Plus size={15} /> Add Member
        </button>
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
        <div className="glass" style={{ overflow: 'hidden', padding: 0 }}>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
            gap: 0,
            padding: '10px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.03)',
          }}>
            {['Member', 'Plan', 'Status', 'Expires', 'Fee', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>

          {/* Data rows */}
          {filtered.map((member, i) => {
            const status = getMemberStatus(member.expiryDate);
            return (
              <div
                key={member.id}
                className="animate-fadeIn"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                  gap: 0,
                  alignItems: 'center',
                  padding: '11px 16px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s',
                  animationDelay: `${i * 30}ms`,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Member info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <img
                    src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`}
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

                {/* Plan */}
                <span className={`badge ${getPlanBadgeClass(member.plan)}`} style={{ fontSize: 11 }}>{member.plan}</span>

                {/* Status */}
                <span className={`badge ${status.cls}`} style={{ fontSize: 11 }}>{status.label}</span>

                {/* Expiry */}
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {new Date(member.expiryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>

                {/* Fee toggle */}
                <button
                  className={`btn ${member.feeStatus === 'Paid' ? 'btn-secondary' : 'btn-danger'}`}
                  style={{ fontSize: 11, padding: '4px 10px', gap: 5, width: 'fit-content' }}
                  onClick={() => toggleFeeStatus(member.id)}
                  title="Toggle fee status"
                >
                  {member.feeStatus === 'Paid'
                    ? <><CheckCircle size={11} color="var(--success)" /> Paid</>
                    : <><Clock size={11} /> Pending</>
                  }
                </button>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
                  <button className="btn btn-secondary btn-icon" title="Edit" style={{ width: 28, height: 28 }} onClick={() => handleEdit(member)}>
                    <Pencil size={13} />
                  </button>
                  <button className="btn btn-danger btn-icon" title="Delete" style={{ width: 28, height: 28 }} onClick={() => setDeletingId(member.id)}>
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
