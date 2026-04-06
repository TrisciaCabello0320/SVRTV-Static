import { useState } from 'react';
import { DB } from '../data/database';

function TeamModal({ member, onClose }) {
  if (!member) return null;
  return (
    <div
      className={`pick-modal${member ? ' open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="pick-box" style={{ maxWidth: 500 }}>
        <button className="pick-close" onClick={onClose}>✕</button>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `#${member.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 900,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {member.initial}
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>{member.name}</h3>
            <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
              {member.role}
            </div>
            <p style={{ fontSize: 13, color: 'var(--mute)', lineHeight: 1.8 }}>{member.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WhoWeAre() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <>
      <section id="sec-who" className="sec bg-w">
        <div className="wrap">
          <div className="eye">What We Are</div>
          <div className="h2" style={{ marginBottom: 32 }}>
            About Shepherd's <em style={{ color: 'var(--gold)' }}>Voice Foundation</em>
          </div>

          <div className="editorial">
            <div>
              <div className="rule" />
              <div className="prose">
                <p>
                  <strong>Shepherd's Voice Radio and TV Foundation Inc. (SVRTFI)</strong> is a
                  non-stock, non-profit organization formally organized and registered under the
                  Securities and Exchange Commission (Philippines).
                </p>
                <p>
                  Now on its <strong>eighteenth year of operations</strong>, SVRTFI has consistently
                  passed the review process of the Philippine Council for NGO Certification (PCNC).
                  After its latest review, PCNC granted SVRTFI a{' '}
                  <strong>five-year accreditation</strong> as an NGO.
                </p>
                <p>
                  SVRTFI is an <strong>all-media organization</strong> that produces world-class
                  inspirational and spiritually enriching programs. Its programs provide financial
                  support for cradle-to-grave charity organizations and develop programs for poverty
                  alleviation, while fulfilling the work of evangelization.
                </p>
              </div>

              <div className="info-card">
                <div className="ic-label">PCNC Accreditation</div>
                <div className="ic-val">Five-Year NGO Accreditation — Active &amp; Current</div>
                <div className="ic-label">SEC Registration</div>
                <div className="ic-val" style={{ marginBottom: 0 }}>
                  Non-Stock, Non-Profit — SEC Philippines
                </div>
              </div>

              {/* Mission & Vision */}
              <div className="mvv" style={{ marginTop: 28 }}>
                <div
                  className="mvv-c"
                  style={{ background: 'var(--navy)', borderRadius: 'var(--r2)' }}
                >
                  <div className="mvv-label" style={{ color: 'rgba(255,255,255,.5)' }}>Mission</div>
                  <div className="mvv-body" style={{ color: '#fff' }}>{DB.general.mission}</div>
                </div>
                <div
                  className="mvv-c"
                  style={{
                    background: 'var(--goldp)',
                    border: '1.5px solid rgba(201,147,46,.25)',
                    borderRadius: 'var(--r2)',
                  }}
                >
                  <div className="mvv-label" style={{ color: 'var(--gold)' }}>Vision</div>
                  <div className="mvv-body" style={{ color: 'var(--ink)' }}>{DB.general.vision}</div>
                </div>
              </div>
            </div>

            {/* Image stack */}
            <div className="img-stack">
              <div className="is-main">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&auto=format&fit=crop"
                  alt="Community"
                />
              </div>
              <div className="is-sub">
                <img
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=900&auto=format&fit=crop"
                  alt="Broadcast"
                />
              </div>
            </div>
          </div>

          {/* Team */}
          <div style={{ marginTop: 'clamp(52px,7vw,80px)' }}>
            <div className="eye">Our Leadership</div>
            <div className="h3" style={{ marginBottom: 20 }}>
              The people behind <em>the mission</em>
            </div>
            <div className="team-grid">
              {DB.team.map((member) => (
                <div
                  key={member.id}
                  className="tc"
                  onClick={() => setSelectedMember(member)}
                  style={{ cursor: 'pointer' }}
                >
                  {member.image ? (
                    <img className="tc-photo" src={member.image} alt={member.name} />
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `#${member.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        fontWeight: 900,
                        color: '#fff',
                      }}
                    >
                      {member.initial}
                    </div>
                  )}
                  <div className="tc-body">
                    <div className="t-name">{member.name}</div>
                    <div className="t-role">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TeamModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </>
  );
}
