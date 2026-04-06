import { useScrollTo } from '../hooks/useScroll';
import { DB } from '../data/database';

export default function HeroSection() {
  const scrollTo = useScrollTo();

  const videoId = '4ThI7WgEPFY';

  return (
    <section id="sec-home" style={{ background: 'var(--white)' }}>
      <div className="hero">
        {/* YouTube background video — loops, muted, covers hero area, HD */}
        <iframe
          className="hero-video"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&mute=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&vq=hd720&playsinline=1`}
          allow="autoplay; encrypted-media"
          loading="lazy"
          title="Hero background video"
        />

        {/* Dark overlay so text remains readable */}
        <div className="hero-video-overlay" />

        <div className="hero-l">
          <div className="hero-badge">{DB.general.org_tagline}</div>
          <div className="h1"><span className="hero-accent">
            Shepherd's Voice</span>
          </div>
          <p className="hero-sub" style={{ margin: '0 0 10px' }}>
            {DB.general.org_short}
          </p>
          <p className="hero-desc">
            An all-media, non-profit organization producing world-class inspirational and
            spiritually enriching programs — reaching souls for Jesus Christ through radio,
            television, and digital media.
          </p>
          <div className="hero-btns" style={{ justifyContent: 'center' }}>
            <button className="btn btn-n" onClick={() => scrollTo('who')}>
              ✝ What We Are
            </button>
            <button className="btn btn-out" onClick={() => scrollTo('programs')}>
              Programs &amp; Events
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
