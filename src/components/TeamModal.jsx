import { X } from 'lucide-react';

export default function TeamModal({ member, onClose }) {
  if (!member) return null;

  return (
    <div className={`modal-overlay ${member ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={16} />
        </button>
        <div className="modal-content">
          <div className="modal-avatar">{member.initial}</div>
          <div className="modal-text">
            <h3>{member.name}</h3>
            <div className="modal-role">{member.role}</div>
            <p className="modal-bio">{member.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}