import { useState, useMemo } from "react";

export default function ProgramsSection({ programs = { list: [], featured: null } }) {
  const [search, setSearch] = useState("");

  const processedList = useMemo(() => {
    const list = programs.list || [];
    const s = search.toLowerCase();
    if (!s) return list;

    return list.filter(p =>
      p.title?.toLowerCase().includes(s) ||
      p.desc?.toLowerCase().includes(s) ||
      p.badge?.toLowerCase().includes(s) ||
      p.start?.toLowerCase().includes(s)
    );
  }, [programs.list, search]);

  const featured = programs.featured;
  
  const gridItems = search 
    ? processedList 
    : processedList.filter(p => p.title !== featured?.title);

  return (
    <section id="sec-programs" className="sec bg-[var(--bg-alt)] reveal">
      <div className="wrap">
        <div className="eye">Programs &amp; Events</div>
        <div className="prog-title h2 mb-8">Get Involved with Us</div>

        {!search && featured && (
          <div className="prog-feat mb-8">
            <div className="prog-feat-bg">
              <img
                src={featured.image || "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1000&auto=format&fit=crop"}
                alt={featured.title}
              />
            </div>
            <div className="prog-feat-inner">
              <div className="pf-tag" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {featured.type}
                <span className="pf-latest" style={{ margin: 0 }}>{featured.badge}</span>
              </div>
              <div className="pf-title">{featured.title}</div>
              <div className="pf-meta">{featured.start}{featured.end ? ` — ${featured.end}` : ''}</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <div className="prog-search-wrap" style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span className="prog-search-icon" style={{ display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              className="prog-search-input"
              style={{ display: 'block', width: '100%', paddingLeft: 42, paddingRight: 14, paddingTop: 12, paddingBottom: 12 }}
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="ev-cards-wrap" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gridItems.length > 0 ? (
              gridItems.map((p, i) => (
                <div
                  key={i}
                  className={`ev-c ${p.status === "upcoming" ? "ev-upcoming"
                    : p.status === "open" ? "ev-open"
                      : "ev-ended"
                    }`}
                >
                  <div className="ev-status-dot" style={{ backgroundColor: `var(--badge-${p.status}-bg, var(--red))` }} />
                  <div className="ev-date">{p.start}</div>
                  <h3 className="ev-title">{p.title}</h3>
                  <p className="ev-desc">{p.desc}</p>
                  <span 
                    className="ev-pill"
                    style={{ 
                      backgroundColor: `var(--badge-${p.status}-bg, #f3f4f6)`,
                      color: `var(--badge-${p.status}-text, #374151)`
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
              ))
            ) : (
              <div className="ev-no-results col-span-full">
                {search ? `No programs found matching "${search}"` : "No programs available."}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}