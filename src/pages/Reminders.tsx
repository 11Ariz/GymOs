import React, { useMemo, useState, useCallback } from 'react';
import { useMembers } from '../context/MemberContext';
import { differenceInDays } from 'date-fns';
import { BellRing, Clock, AlertOctagon, CheckCircle2, Send, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

type SendState = 'idle' | 'loading' | 'success' | 'error';

interface MemberSendState {
  [id: string]: SendState;
}

export const Reminders: React.FC = () => {
  const { members } = useMembers();
  const today = new Date();
  const [sendStates, setSendStates] = useState<MemberSendState>({});
  const [bulkState, setBulkState] = useState<Record<string, SendState>>({});

  const setSend = (id: string, state: SendState) =>
    setSendStates(prev => ({ ...prev, [id]: state }));

  const setBulk = (label: string, state: SendState) =>
    setBulkState(prev => ({ ...prev, [label]: state }));

  const groups = useMemo(() => {
    const expired = members.filter(m => differenceInDays(new Date(m.expiryDate), today) < 0);
    const critical = members.filter(m => {
      const d = differenceInDays(new Date(m.expiryDate), today);
      return d >= 0 && d <= 3;
    });
    const soon = members.filter(m => {
      const d = differenceInDays(new Date(m.expiryDate), today);
      return d > 3 && d <= 14;
    });
    const healthy = members.filter(m => differenceInDays(new Date(m.expiryDate), today) > 14);

    return [
      { label: 'Expired', color: 'var(--danger)', bg: 'var(--danger-bg)', icon: <AlertOctagon size={18} color="var(--danger)" />, members: expired, canBulk: true },
      { label: 'Critical (≤3 days)', color: 'var(--warning)', bg: 'var(--warning-bg)', icon: <Clock size={18} color="var(--warning)" />, members: critical, canBulk: true },
      { label: 'Expiring Soon (≤14 days)', color: 'var(--accent-2)', bg: 'rgba(6,182,212,0.1)', icon: <BellRing size={18} color="var(--accent-2)" />, members: soon, canBulk: false },
      { label: 'Good Standing (>14 days)', color: 'var(--success)', bg: 'var(--success-bg)', icon: <CheckCircle2 size={18} color="var(--success)" />, members: healthy, canBulk: false },
    ];
  }, [members]);

  // Send reminder to a single member
  const sendOne = useCallback(async (m: (typeof members)[0]) => {
    if (!m.email) {
      setSend(m._id, 'error');
      setTimeout(() => setSend(m._id, 'idle'), 3000);
      return;
    }
    setSend(m._id, 'loading');
    try {
      const res = await fetch(`${API}/api/email/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: m.name, email: m.email, plan: m.plan, expiryDate: m.expiryDate, feeStatus: m.feeStatus }),
      });
      const data = await res.json();
      setSend(m._id, data.success ? 'success' : 'error');
    } catch {
      setSend(m._id, 'error');
    }
    setTimeout(() => setSend(m._id, 'idle'), 3500);
  }, []);

  // Send reminders to all members in a group
  const sendAll = useCallback(async (label: string, groupMembers: typeof members) => {
    const withEmail = groupMembers.filter(m => m.email);
    if (withEmail.length === 0) return;
    setBulk(label, 'loading');
    try {
      const res = await fetch(`${API}/api/email/send-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: withEmail.map(m => ({ name: m.name, email: m.email, plan: m.plan, expiryDate: m.expiryDate, feeStatus: m.feeStatus })) }),
      });
      const data = await res.json();
      setBulk(label, data.success ? 'success' : 'error');
    } catch {
      setBulk(label, 'error');
    }
    setTimeout(() => setBulk(label, 'idle'), 3500);
  }, []);

  const SendBtn: React.FC<{ id: string; member: (typeof members)[0] }> = ({ id, member }) => {
    const state = sendStates[id] ?? 'idle';
    const hasEmail = !!member.email;
    return (
      <button
        className={`btn ${state === 'success' ? 'btn-secondary' : state === 'error' ? 'btn-danger' : 'btn-secondary'}`}
        style={{ fontSize: 12, padding: '5px 12px', gap: 5, whiteSpace: 'nowrap', opacity: hasEmail ? 1 : 0.4 }}
        onClick={() => sendOne(member)}
        disabled={state === 'loading' || !hasEmail}
        title={hasEmail ? 'Send reminder email' : 'No email address on file'}
      >
        {state === 'loading' && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />}
        {state === 'success' && <CheckCircle2 size={12} color="var(--success)" />}
        {state === 'error' && '✗'}
        {state === 'idle' && <Send size={12} />}
        {state === 'loading' ? 'Sending…' : state === 'success' ? 'Sent!' : state === 'error' ? (hasEmail ? 'Failed' : 'No Email') : 'Send'}
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="glass animate-fadeIn" style={{ padding: '20px 24px', background: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BellRing size={20} color="var(--accent-light)" />
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Membership Expiry Reminders</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
              Monitor and send renewal reminders to members
            </p>
          </div>
        </div>
      </div>

      {/* Groups */}
      {groups.map((group, gi) => (
        <div key={group.label} className="glass animate-fadeIn" style={{ padding: 24, animationDelay: `${gi * 60}ms` }}>
          {/* Group header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            {group.icon}
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: group.color }}>{group.label}</h3>
            <span className="badge" style={{ background: group.bg, color: group.color, marginLeft: 4 }}>
              {group.members.length}
            </span>

            {/* Bulk send button for critical groups */}
            {group.canBulk && group.members.length > 0 && (
              <button
                className="btn btn-secondary"
                style={{ marginLeft: 'auto', fontSize: 12, padding: '5px 14px', gap: 6 }}
                onClick={() => sendAll(group.label, group.members)}
                disabled={bulkState[group.label] === 'loading'}
              >
                {bulkState[group.label] === 'loading' && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />}
                {bulkState[group.label] === 'success' && <CheckCircle2 size={12} color="var(--success)" />}
                {(!bulkState[group.label] || bulkState[group.label] === 'idle') && <Send size={12} />}
                {bulkState[group.label] === 'loading' ? 'Sending…' :
                  bulkState[group.label] === 'success' ? 'All Sent!' :
                  bulkState[group.label] === 'error' ? 'Some Failed' :
                  `Send All (${group.members.filter(m => m.email).length})`}
              </button>
            )}
          </div>

          {group.members.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>No members in this category</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {group.members.map(m => {
                const days = differenceInDays(new Date(m.expiryDate), today);
                return (
                  <div key={m._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-xl border border-white/5 gap-3" style={{ background: group.bg }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <img src={m.avatar || `https://i.pravatar.cc/150?u=${m._id}`} alt={m.name}
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                          {m.plan} · Expires {new Date(m.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-none border-white/5">
                      <div className="flex gap-2">
                        <span className="badge text-[10px]" style={{ background: group.bg, color: group.color }}>
                          {days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? 'Today' : `${days}d left`}
                        </span>
                        <span className={`badge ${m.feeStatus === 'Paid' ? 'badge-success' : 'badge-danger'} text-[10px]`}>
                          {m.feeStatus}
                        </span>
                      </div>
                      <SendBtn id={m._id} member={m} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
