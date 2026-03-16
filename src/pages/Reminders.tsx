import React, { useMemo, useState, useCallback } from 'react';
import { useMembers } from '../context/MemberContext';
import { differenceInDays } from 'date-fns';
import { BellRing, Clock, AlertOctagon, CheckCircle2, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

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
      const { data } = await api.post('/api/email/send-reminder', { 
        memberId: m._id 
      });
      setSend(m._id, data.success ? 'success' : 'error');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send');
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
      const { data } = await api.post('/api/email/send-all', { 
        memberIds: withEmail.map(m => m._id) 
      });
      setBulk(label, data.success ? 'success' : 'error');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Bulk send failed');
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
            <div className="flex flex-col gap-3">
              {group.members.map(m => {
                const days = differenceInDays(new Date(m.expiryDate), today);
                return (
                  <div key={m._id} className="glass border-white/5 p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <img src={m.avatar || `https://i.pravatar.cc/150?u=${m._id}`} alt={m.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-bold text-base truncate mb-0.5">{m.name}</p>
                        <p className="text-slate-400 text-xs font-medium">
                          {m.plan} • {new Date(m.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                      <div className="flex items-center gap-2">
                        <span className={`badge text-[10px] font-bold ${days < 0 ? 'badge-danger' : 'badge-warning'}`}>
                          {days < 0 ? `${Math.abs(days)}d Overdue` : days === 0 ? 'Expires Today' : `${days}d Remaining`}
                        </span>
                        <span className={`badge text-[10px] font-bold ${m.feeStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
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
