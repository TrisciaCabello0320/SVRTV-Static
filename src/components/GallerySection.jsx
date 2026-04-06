import { useState, useCallback } from 'react';
import { DB } from '../data/database';

function Lightbox({ items, idx, onClose, onNav }) {
  if (idx === null) return null;
  const item = items[idx];
  if (!item) return null;

  return (
    <div
      id="lightbox"
      className="open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button className="lb-close" onClick={onClose}>✕</button>
      <button className="lb-prev" onClick={() => onNav(-1)}>&#8249;</button>
      <button className="lb-next" onClick={() => onNav(1)}>&#8250;</button>
      <div className="lb-inner">
        <div className="lb-media">
          {item.type === 'photo' && <img src={item.src} alt={item.cap} />}
          {item.type === 'video' && (
            <iframe
              src={`${item.src}?autoplay=1`}
              title={item.cap}
              allowFullScreen
              allow="autoplay"
            />
          )}
          {item.type === 'placeholder' && (
            <div className="vid-placeholder">
              <i className="fas fa-play-circle" />
              <span className="vid-tile-cap">{item.cap}</span>
              <code className="vid-tile-hint">No video set yet</code>
            </div>
          )}
        </div>
        <div className="lb-cap">{item.cap}</div>
      </div>
    </div>
  );
}

export default function GallerySection() {
  const [lbIdx, setLbIdx] = useState(null);

  // Build the full lightbox items list: photos + videos
  const lbItems = [
    ...DB.gallery.map((g) => ({ type: 'photo', src: g.url, cap: g.cap })),
    ...DB.videos.map((v) =>
      v.src
        ? { type: 'video', src: v.src, cap: v.cap }
        : { type: 'placeholder', cap: v.cap }
    ),
  ];

  const openLB = useCallback((i) => {
    setLbIdx(i);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLB = useCallback(() => {
    setLbIdx(null);
    document.body.style.overflow = '';
  }, []);

  const navLB = useCallback(
    (dir) => setLbIdx((prev) => (prev + dir + lbItems.length) % lbItems.length),
    [lbItems.length]
  );

  // Keyboard nav
  const handleKey = useCallback(
    (e) => {
      if (lbIdx === null) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') navLB(-1);
      if (e.key === 'ArrowRight') navLB(1);
    },
    [lbIdx, closeLB, navLB]
  );

  // Add/remove keydown listener when lightbox open
  if (typeof window !== 'undefined') {
    if (lbIdx !== null) {
      document.addEventListener('keydown', handleKey);
    } else {
      document.removeEventListener('keydown', handleKey);
    }
  }

  return (
    <>
      <section id="sec-gallery" className="sec bg-cream">
        <div className="wrap">
          <div className="eye">What We Do</div>
          <div className="h2" style={{ marginBottom: 8 }}>
            Our Work in <em style={{ color: 'var(--gold)' }}>Faith &amp; Service</em>
          </div>
          <p className="body" style={{ marginBottom: 16, color: 'var(--mute)', fontSize: 13 }}>
            Photos and videos from our community. Manage via the Excel data sheet.
          </p>

          {/* Photo Mosaic */}
          <div className="gal-mosaic">
            {DB.gallery.map((item, i) => (
              <div key={item.id} className="gal-item" onClick={() => openLB(i)}>
                <img src={item.url} alt={item.cap} loading="lazy" />
                <div className="gal-ov">
                  <div className="gal-cap">{item.cap}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Grid */}
          <div className="vid-grid" style={{ marginTop: 20 }}>
            {DB.videos.map((v, i) => (
              <div
                key={v.id}
                className="vid-card"
                onClick={() => openLB(DB.gallery.length + i)}
                style={{ cursor: 'pointer' }}
              >
                <div className="vid-frame">
                  {v.src ? (
                    <iframe src={v.src} title={v.cap} allowFullScreen loading="lazy" />
                  ) : (
                    <div className="vid-placeholder">
                      <i className="fas fa-play-circle" />
                      <span className="vid-tile-cap">Add Your Video</span>
                      <code className="vid-tile-hint">
                        YouTube: youtube.com/embed/ID
                        <br />
                        Vimeo: player.vimeo.com/video/ID
                      </code>
                    </div>
                  )}
                </div>
                <div className="vid-card-cap">{v.cap}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Lightbox items={lbItems} idx={lbIdx} onClose={closeLB} onNav={navLB} />
    </>
  );
}
