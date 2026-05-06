import { useState } from 'react';
import { DB } from '../data/database';
import { useScrollTo } from '../hooks/useScroll';

// ─── Team Member Modal ────────────────────────────────────────────────────────
function TeamModal({ member, onClose }) {
  if (!member) return null;
  return (
    <div
      className={`pick-modal${member ? ' open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="pick-box" style={{ maxWidth: 650 }}>
        <button className="pick-close" onClick={onClose}>✕</button>
        <div className="flex gap-5 items-start flex-wrap">
          {member.image ? (
            <img
              className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-sm"
              src={member.image}
              alt={member.name}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white flex-shrink-0"
              style={{ background: `#${member.color}` }}
            >
              {member.initial}
            </div>
          )}
          <div className="flex-1 min-w-[180px]">
            <h3 className="text-lg font-extrabold mb-1" style={{ color: 'var(--ink)' }}>
              {member.name}
            </h3>
            <div className="text-[10px] tracking-widest uppercase font-bold mb-3" style={{ color: 'var(--red)' }}>
              {member.role}
            </div>
            <p className="text-sm leading-relaxed text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner">
              "{member.quote || member.bio}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mission / Vision Card ────────────────────────────────────────────────────
function MvCard({ type, text }) {
  return (
    <div
      className="mv-card rounded-lg p-8 flex flex-col gap-4 bg-transparent border border-gray-200 border-t-2 border-t-[var(--red)] shadow-sm"
    >
      <div className="text-[10px] font-bold tracking-[.2em] uppercase text-gray-400">
        {type}
      </div>
      <p className="font-medium leading-relaxed text-gray-600" style={{ fontSize: 'clamp(14px, 1.1vw, 16px)' }}>
        {text}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WhoWeAre({ wwa = {}, team = [] }) {
  const [selectedMember, setSelectedMember] = useState(null);

  const eyebrow = wwa.wwa_eyebrow || "Who We Are";
  const heading = wwa.wwa_heading || "About Shepherd's Voice Foundation";

  const prose1 = wwa.wwa_prose_1 || "Shepherd’s Voice Radio and TV Foundation Inc, (SVRTFI) is a non-stock, non-profit organization formally organized and registered under the Securities and Exchange Commission (Philiippines).";
  const prose2 = wwa.wwa_prose_2 || "Now on its eighteenth year of operations, SVRTFI has consistently passed the review process of the Philippine Council for NGO Certification (PCNC). After its latest review of the organization’s operations and documents, PCNC granted SVRTFI a five-year accreditation as an NGO.";
  const prose3 = wwa.wwa_prose_3 || "SVRTFI is an all-media organization that produces world-class inspirational and spiritually enriching programs. Its various programs and projects provide financial support for several cradle-to-grave charity organizations and develops programs for poverty alleviation, while also striving to fulfill the work of evangelization.";

  const aboutLabel = wwa.wwa_about_label || "About Us";
  const aboutText = wwa.wwa_about_text || "Producing world-class inspirational programs that reach souls through radio, television, and digital media while supporting charitable organizations.";

  const missionLabel = wwa.wwa_mission_label || "Our Mission";
  const missionText = wwa.wwa_mission_text || DB.general.mission;
  const visionLabel = wwa.wwa_vision_label || "Our Vision";
  const visionText = wwa.wwa_vision_text || DB.general.vision;

  const mainImage = wwa.wwa_image_main_url || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900";

  const teamData = team && team.length > 0 ? team : DB.team;

  return (
    <>
      <section id="sec-who" className="sec bg-white reveal">
        <div className="wrap">

          {/* Top Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-16">
            <div className="md:w-3/5">
              <div className="eye">{eyebrow}</div>
              <h2 className="h2 what-section-title">
                About <em className="what-em">Shepherd's Voice</em>
              </h2>
            </div>
          </div>

          {/* Bottom Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Image Box */}
            <div className="lg:col-span-2 relative rounded-[var(--r3)] overflow-hidden shadow-xl min-h-[400px]">

              <div className="absolute inset-0 bg-gradient-to-t from-[var(--red)] via-[var(--red-muted)] to-transparent opacity-95" />
              <div className="absolute bottom-8 left-8 right-8 text-white relative z-10">
                <div className="text-lg font-bold mb-2">{aboutLabel}</div>
                <p className="body what-section-desc leading-relaxed text-sm md:text-base">
                  {prose1}
                </p>
                <p className="body what-section-desc leading-relaxed text-sm md:text-base">
                  {prose2}
                </p>
                <p className="body what-section-desc leading-relaxed text-sm md:text-base">
                  {prose3}
                </p>
              </div>
            </div>

            {/* Right Cards Box */}
            <div className="flex flex-col gap-6">
              <div className="flex-1 rounded-[var(--r3)] p-8 bg-[var(--red-muted)] flex flex-col justify-center">
                <div className="text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>{missionLabel}</div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {missionText}
                </p>
              </div>
              <div className="flex-1 rounded-[var(--r3)] p-8 bg-[var(--red)] text-white flex flex-col justify-center">
                <div className="text-xl font-bold mb-4">{visionLabel}</div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {visionText}
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-24">
            <div className="eye">Our Leadership</div>
            <div className="h3 mb-8">
              The people behind <em>the mission</em>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {teamData.map((member, i) => {
                const initial = member.initial || (member.name?.charAt(0) || "?");
                const color = member.color || ['ff474f', 'c92f36', '0d9488', 'd9954e', 'ff8a8f', '2563eb'][i % 6];
                return (
                  <div
                    key={member.id || i}
                    className="tc group relative cursor-pointer overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl"
                    onClick={() => setSelectedMember({ ...member, initial, color })}
                  >
                    {member.image ? (
                      <img className="tc-photo h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={member.image} alt={member.name} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white" style={{ background: `#${color}` }}>{initial}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                    <div className="tc-body relative z-10 p-4">
                      <div className="t-name text-white font-bold">{member.name}</div>
                      <div className="t-role text-white/70 text-[10px] uppercase tracking-wider font-semibold">{member.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <TeamModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </>
  );
}
