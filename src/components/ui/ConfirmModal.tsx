import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, message, confirmLabel = 'Delete', onConfirm, onClose }) => {
  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="glass animate-scaleIn"
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 400, padding: '28px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--danger-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={18} color="var(--danger)" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};
