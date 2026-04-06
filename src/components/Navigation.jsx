import { useState, useEffect } from 'react';
import { SECTIONS } from '../data/database';
import { useScrollToFooter, useNavScroll } from '../hooks/useScroll';

export default function Navigation({ onNavigate }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scrolled = useNavScroll();
  const scrollToFooter = useScrollToFooter();

  // Close drawer on resize past 960px
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 960) setDrawerOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close drawer on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleNav = (id) => {
    onNavigate(id);
    setDrawerOpen(false);
  };

  const handleContact = () => {
    scrollToFooter();
    setDrawerOpen(false);
  };

  return (
    <>
      <nav className={scrolled ? 'nav-scroll' : ''}>
        {/* Brand */}
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); handleNav('home'); }}>
          <div className="brand-logo-img">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="42" height="42" rx="10" fill="url(#brandGrad)"/>
              <text x="21" y="28" textAnchor="middle" fontSize="18" fontWeight="900" fill="white" fontFamily="Montserrat,sans-serif">SV</text>
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="42" y2="42">
                  <stop stopColor="#ff474f"/>
                  <stop offset="1" stopColor="#c9932e"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text">
            <span className="bt1">Shepherd's Voice</span>
            <span className="bt2">Radio and Television</span>
            <span className="bt3">Foundation Inc.</span>
          </div>

          {/* Dropdown */}
          <div className="brand-dropdown">
            {SECTIONS.map((s) => (
              <a key={s.id} href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNav(s.id); }}>
                <span className="bd-ic">{s.icon}</span>{s.label}
              </a>
            ))}
            <div className="bd-divider" />
            <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleContact(); }}>
              <span className="bd-ic">📞</span>Contact Us
            </a>
          </div>
        </a>

        {/* Desktop nav links */}
        <div className="nav-right">
          {SECTIONS.map((s) => (
            <a key={s.id} href="#" onClick={(e) => { e.preventDefault(); handleNav(s.id); }}>
              <span className="nav-lbl">{s.label}</span>
            </a>
          ))}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleContact(); }}
            style={{ color: 'var(--navy)', background: 'var(--goldp)', border: '1.5px solid rgba(201,147,46,.3)' }}
          >
            <span className="nav-lbl">Contact Us</span>
          </a>
        </div>

        {/* Hamburger */}
        <button
          className={`ham${drawerOpen ? ' open' : ''}`}
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`drawer${drawerOpen ? ' open' : ''}`} aria-hidden={!drawerOpen}>
        {SECTIONS.map((s) => (
          <a key={s.id} href="#" onClick={(e) => { e.preventDefault(); handleNav(s.id); }}>
            <span className="d-ic">{s.icon}</span>{s.label}
          </a>
        ))}
        <a href="#" onClick={(e) => { e.preventDefault(); handleContact(); }}>
          <span className="d-ic">📞</span>Contact Us
        </a>
      </div>
    </>
  );
}
