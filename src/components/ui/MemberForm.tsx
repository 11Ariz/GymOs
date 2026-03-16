import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Member, PlanType, FeeStatus } from '../../types';
import { addMonths, addYears, format } from 'date-fns';

interface MemberFormProps {
  member?: Member | null;
  onSave: (data: Omit<Member, '_id'>) => void;
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
    <div className="overlay items-end sm:items-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="glass animate-slideUp sm:animate-scaleIn w-full max-w-lg p-6 sm:p-8 relative rounded-t-[32px] sm:rounded-3xl border-b-0 sm:border-b"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 sm:hidden" />
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-white">
            {member ? 'Edit Member' : 'New Member'}
          </h2>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label>Join Date *</label>
              <input name="joinDate" type="date" className="input" value={form.joinDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Expiry Date <span className="text-[10px] text-slate-500">(auto)</span></label>
              <div className="input flex items-center cursor-default text-slate-400 bg-white/5">
                {expiryDate
                  ? new Date(expiryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'}
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end mt-4">
            <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary w-full sm:w-auto">
              {member ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
