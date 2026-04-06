import { useState, useRef } from 'react';
import { DB, ST_CLS, ACCS } from '../data/database';

function ProgramModal({ program, onClose }) {
  if (!program) return null;
  const stClass = ST_CLS[program.status] || 'ps-o';
  return (
    <div
      className="pick-modal open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="pick-box" style={{ maxWidth: 520 }}>
        <button className="pick-close" onClick={onClose}>✕</button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span className={`ps ${stClass}`}>{program.status}</span>
            <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--mute)' }}>
              {program.type}
            </span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.25 }}>
            {program.title}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--mute)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📅</span> {program.date}
            </div>
            <div style={{ fontSize: 12, color: 'var(--mute)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📂</span> {program.type}
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--mute)', lineHeight: 1.85 }}>{program.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProgramsSection() {
  const [search, setSearch] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const wrapRef = useRef(null);

  const featuredProgram =
    DB.programs.find((p) => p.type === 'Flagship Event') || DB.programs[0];

  const filtered = DB.programs.filter(
    (p) =>
      p.id !== featuredProgram.id &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase()) ||
        p.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const scrollList = (dir) => {
    if (wrapRef.current) wrapRef.current.scrollBy({ top: dir * 180, behavior: 'smooth' });
  };

  return (
    <>
      <section id="sec-programs" className="sec bg-cream">
        <div className="wrap">
          <div className="eye">Programs &amp; Events</div>
          <div className="h2" style={{ marginBottom: 18 }}>
            Ministry Programs &amp; Upcoming Events
          </div>

          {/* Featured Banner */}
          <div className="prog-feat">
            <div className="prog-feat-bg">
              <img
                src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop"
                alt=""
              />
            </div>
            <div className="prog-feat-inner">
              <div className="pf-tag">{featuredProgram.type} · {featuredProgram.date}</div>
              <div className="pf-title">{featuredProgram.title}</div>
              <div className="pf-meta">{featuredProgram.desc}</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="prog-toolbar">
            <div className="prog-search-wrap">
              <i className="fas fa-search prog-search-icon" />
              <input
                type="text"
                className="prog-search"
                placeholder="Search programs &amp; events…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="prog-scroll-btns">
              <button onClick={() => scrollList(-1)} title="Scroll up">&#8679;</button>
              <button onClick={() => scrollList(1)} title="Scroll down">&#8681;</button>
            </div>
          </div>

          {/* Cards */}
          <div className="ev-cards-wrap" ref={wrapRef}>
            <div className="ev-cards">
              {filtered.length === 0 ? (
                <div className="ev-no-results">No programs found.</div>
              ) : (
                filtered.map((prog, i) => {
                  const statusClass =
                    prog.status === 'Upcoming'
                      ? 'ev-upcoming'
                      : prog.status === 'Open'
                      ? 'ev-open'
                      : prog.status === 'Active'
                      ? 'ev-open'
                      : 'ev-ended';
                  const pillClass = ST_CLS[prog.status] || 'ps-o';
                  return (
                    <div
                      key={prog.id}
                      className={`ev-c ${statusClass}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedProgram(prog)}
                    >
                      <div className="ev-status-dot" />
                      <div className="ev-date">{prog.date}</div>
                      <div className="ev-title">{prog.title}</div>
                      <div className="ev-desc">{prog.desc}</div>
                      <span className={`ev-pill ${pillClass}`}>{prog.status}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      <ProgramModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
    </>
  );
}
