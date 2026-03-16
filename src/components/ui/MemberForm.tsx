import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Member, PlanType, FeeStatus } from '../../types';
import { addMonths, addYears, format } from 'date-fns';

interface MemberFormProps {
  member?: Member | null;
  onSave: (data: Omit<Member, 'id'>) => void;
  onClose: () => void;
}

const calcExpiry = (joinDate: string, plan: PlanType): string => {
  if (!joinDate) return '';
  const d = new Date(joinDate);
  if (plan === 'Monthly') return format(addMonths(d, 1), 'yyyy-MM-dd');
  if (plan === 'Quarterly') return format(addMonths(d, 3), 'yyyy-MM-dd');
  return format(addYears(d, 1), 'yyyy-MM-dd');
};

const todayStr = () => new Date().toISOString().split('T')[0];

export const MemberForm: React.FC<MemberFormProps> = ({ member, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: member?.name ?? '',
    email: member?.email ?? '',
    phone: member?.phone ?? '',
    plan: (member?.plan ?? 'Monthly') as PlanType,
    joinDate: member?.joinDate ?? todayStr(),
    feeStatus: (member?.feeStatus ?? 'Pending') as FeeStatus,
    avatar: member?.avatar ?? '',
  });

  const [expiryDate, setExpiryDate] = useState(() =>
    member?.expiryDate ?? calcExpiry(form.joinDate, form.plan)
  );

  // Recalculate whenever join date or plan changes
  useEffect(() => {
    setExpiryDate(calcExpiry(form.joinDate, form.plan));
  }, [form.joinDate, form.plan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      expiryDate,
      avatar: form.avatar || `https://i.pravatar.cc/150?u=${Math.random()}`,
    });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="glass animate-scaleIn"
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 500, padding: '24px', position: 'relative' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
            {member ? 'Edit Member' : 'Add New Member'}
          </h2>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Name + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" className="input" value={form.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" className="input" value={form.phone} onChange={handleChange} placeholder="+1 234-567-8900" />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" className="input" value={form.email} onChange={handleChange} placeholder="john@example.com" />
          </div>

          {/* Plan + Fee Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Plan *</label>
              <select name="plan" className="input" value={form.plan} onChange={handleChange} required>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fee Status</label>
              <select name="feeStatus" className="input" value={form.feeStatus} onChange={handleChange}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Join Date + Auto Expiry preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Join Date *</label>
              <input name="joinDate" type="date" className="input" value={form.joinDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Expiry Date <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>(auto)</span></label>
              <div className="input" style={{ display: 'flex', alignItems: 'center', cursor: 'default', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)' }}>
                {expiryDate
                  ? new Date(expiryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'}
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {member ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
