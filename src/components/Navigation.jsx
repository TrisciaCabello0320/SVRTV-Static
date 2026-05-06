import { useState, useEffect } from 'react';
import { useScrollToFooter, useNavScroll, useFooterVisible } from '../hooks/useScroll';

export default function Navigation({ onNavigate, activeSection, org = {} }) {
  const dynamicSections = [
    { id: "home", label: org.nav_home || "Home" },
    { id: "who", label: org.nav_who || "What We Are" },
    { id: "what", label: org.nav_what || "What We Do" },
    { id: "programs", label: org.nav_programs || "Programs & Events" },
  ];
  const logoUrl = org.logo_url || "/SVRTV.png";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scrolled = useNavScroll();
  const scrollToFooter = useScrollToFooter();
  const footerVisible = useFooterVisible();

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

  // Add/remove body classes based on active section (hide nav highlight at footer)
  useEffect(() => {
    document.body.classList.remove('at-contact', 'at-footer');
    return () => document.body.classList.remove('at-contact', 'at-footer');
  }, [activeSection]);

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
            <img src={logoUrl} alt="Logo" width="42" height="42" style={{ objectFit: 'contain' }} />
          </div>
          <div className="brand-text">
            <span className="bt1">{org.logo_name1 || "Shepherd's Voice"}</span>
            <span className="bt2">{org.logo_name2 || "Radio and Television"}</span>
            <span className="bt3">{org.logo_name3 || "Foundation Inc."}</span>
          </div>
        </a>

        {/* Desktop nav links */}
        <div className="nav-right">
          {dynamicSections.map((s) => (
            <a key={s.id} href="#" onClick={(e) => { e.preventDefault(); handleNav(s.id); }} className={activeSection === s.id && activeSection !== null && !footerVisible ? 'nact' : ''}>
              <span className="nav-lbl">{s.label}</span>
            </a>
          ))}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleContact(); }}
            className={`nav-contact ${footerVisible ? 'nact' : ''}`}
          >
            <span className="nav-lbl" style={footerVisible ? { color: 'var(--color-text-muted)' } : {}}>Contact Us</span>
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
        {dynamicSections.map((s) => (
          <a key={s.id} href="#" onClick={(e) => { e.preventDefault(); handleNav(s.id); }}>
            {s.label}
          </a>
        ))}
        <a href="#" onClick={(e) => { e.preventDefault(); handleContact(); }}>
          Contact Us
        </a>
      </div>
    </>
  );
}
