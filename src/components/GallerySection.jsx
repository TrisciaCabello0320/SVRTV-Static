import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { DB } from '../data/database';
import { NewsCards } from "@/components/ui/news-cards";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract YouTube video ID from any embed URL format.
 */
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube(?:-nocookie)?\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

/**
 * Build a privacy-enhanced nocookie embed URL from a video ID.
 */
function buildEmbedUrl(videoId) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}

// ─── YouTube Facade Card ───────────────────────────────────────────────────────
function YoutubeFacade({ url, title }) {
  const [active, setActive] = useState(false);
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return (
      <div className="vid-placeholder">
        <PlayIcon />
        <span className="vid-tile-cap">{title}</span>
      </div>
    );
  }

  const thumbSrc = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (active) {
    return (
      <iframe
        src={buildEmbedUrl(videoId)}
        title={title}
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    );
  }

  return (
    <button
      className="yt-facade"
      onClick={() => setActive(true)}
      aria-label={`Play video: ${title}`}
    >
      <img
        src={thumbSrc}
        alt={title}
        width="800"
        height="450"
        loading="lazy"
        className="yt-facade-thumb"
      />
      <span className="yt-facade-play" aria-hidden="true">
        <svg viewBox="0 0 68 48" width="68" height="48">
          <path
            d="M66.52 7.74C65.7 4.77 63.4 2.46 60.43 1.64 55.14 0 34 0 34 0S12.86 0 7.57 1.64C4.6 2.46 2.3 4.77 1.48 7.74 0 13.05 0 24 0 24s0 10.95 1.48 16.26c.82 2.97 3.12 5.28 6.09 6.1C12.86 48 34 48 34 48s21.14 0 26.43-1.64c2.97-.82 5.27-3.13 6.09-6.1C68 34.95 68 24 68 24s0-10.95-1.48-16.26z"
            fill="#ff0000"
            fillOpacity="0.9"
          />
          <path d="M45 24 27 14v20" fill="#fff" />
        </svg>
      </span>
    </button>
  );
}

function PlayIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ color: 'var(--red)', opacity: 0.7, marginBottom: 12 }}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ items, idx, onClose, onNav }) {
  const dimmingRef = useRef(null);

  useEffect(() => {
    if (idx === null) return;
    const activeFacades = document.querySelectorAll('.yt-facade-active iframe');
    activeFacades.forEach(v => {
      v.style.pointerEvents = 'none';
      v.style.opacity = '.3';
    });
    dimmingRef.current = activeFacades;
    return () => {
      activeFacades.forEach(v => {
        v.style.pointerEvents = 'auto';
        v.style.opacity = '1';
      });
    };
  }, [idx]);

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
              src={buildEmbedUrl(extractYouTubeId(item.src) || '')}
              title={item.cap}
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          )}
          {item.type === 'placeholder' && (
            <div className="vid-placeholder">
              <PlayIcon />
              <span className="vid-tile-cap">{item.cap}</span>
            </div>
          )}
        </div>
        <div className="lb-cap">{item.cap}</div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function GallerySection({ gallery = { photos: [], videos: [], platforms: [] } }) {
  const [lbIdx, setLbIdx] = useState(null);

  const galleryData = gallery.photos.length > 0 ? gallery.photos : DB.gallery.map(g => ({ ...g, title: g.cap }));
  const videosData = gallery.videos.length > 0 ? gallery.videos : DB.videos.map(v => ({ ...v, title: v.cap, url: v.src }));

  const lbItems = useMemo(() => [
    ...galleryData.map((g) => ({ type: 'photo', src: g.url, cap: g.title })),
    ...videosData.map((v) =>
      v.url
        ? { type: 'video', src: v.url, cap: v.title }
        : { type: 'placeholder', cap: v.title }
    ),
  ], [galleryData, videosData]);

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

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') navLB(-1);
      if (e.key === 'ArrowRight') navLB(1);
    },
    [closeLB, navLB]
  );

  useEffect(() => {
    if (lbIdx === null) return;
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lbIdx, handleKey]);

  return (
    <>
      <section id="sec-what" className="sec sec-what-v2 reveal">
        <div className="wrap">
          <div className="what-header">
            <div className="eye what-eye">What We Do</div>
            <h2 className="h2 what-section-title">
              Our Work in <em className="what-em">Faith &amp; Service</em>
            </h2>
            <p className="body what-section-desc">
              Explore our mission through our media gallery and digital platforms.
            </p>
          </div>

          <div className="py-8">
            <NewsCards
              title="Gallery"
              subtitle="Capturing moments of faith and community"
              enableAnimations={true}
              newsCards={galleryData.map((g, i) => ({
                id: String(g.id || i),
                title: g.title || "Community Update",
                category: "Ministry",
                subcategory: "Impact",
                timeAgo: "Recent",
                location: "Philippines",
                image: g.url,
                gradientColors: ["from-red-500/20", "to-orange-500/20"],
                content: [g.desc || "A closer look at our ongoing efforts to serve the community."]
              }))}
            />
          </div>

          <div className="vid-grid mt-12">
            {videosData.map((v, i) => (
              <div key={v.id || i} className="vid-card">
                <div className="vid-frame">
                  {v.url ? (
                    <YoutubeFacade url={v.url} title={v.title} />
                  ) : (
                    <div
                      className="vid-placeholder"
                      onClick={() => openLB(galleryData.length + i)}
                      style={{ cursor: 'pointer' }}
                    >
                      <PlayIcon />
                      <span className="vid-tile-cap">Coming Soon</span>
                    </div>
                  )}
                </div>
                <div className="vid-card-cap">{v.title}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Lightbox items={lbItems} idx={lbIdx} onClose={closeLB} onNav={navLB} />
    </>
  );
}
