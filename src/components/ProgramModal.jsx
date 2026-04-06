import { X } from 'lucide-react';

export default function ProgramModal({ program, onClose }) {
  if (!program) return null;

  return (
    <div className={`modal-overlay ${program ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={16} />
        </button>
        <div className="modal-body">
          <h3>{program.title}</h3>
          <div className="modal-meta">
            <div className="meta-item">📅 {program.date}</div>
            <div className="meta-item">📂 {program.type}</div>
            <div className="meta-item">🔔 {program.status}</div>
          </div>
          <p>{program.desc}</p>
        </div>
      </div>
    </div>
  );
}