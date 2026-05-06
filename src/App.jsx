import { useEffect, useState } from 'react';
import { useScrollTo, useReveal, useActiveSection } from './hooks/useScroll';
import { getGoogleSheetsData } from './data/googleSheetsLoader';
import { DB } from './data/database';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import GallerySection from './components/GallerySection';
import ProgramsSection from './components/ProgramsSection';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import BackToTop from './components/BackToTop';
import './App.css';

export default function App() {
  const [content, setContent] = useState(null);
  const scrollTo = useScrollTo();
  const activeSection = useActiveSection(['home', 'who', 'what', 'programs']);

  // Load content from Google Sheets on mount
  useEffect(() => {
    getGoogleSheetsData()
      .then(data => {
        if (data) {
          setContent(data);
        } else {
          // Fallback to local DB if sheets fail
          setContent({
            hero:     data?.hero || {},
            wwa:      data?.wwa || {},
            team:     data?.team || DB.team,
            whatWeDo: data?.whatWeDo || { photos: DB.gallery, videos: [], platforms: [] },
            programs: data?.programs || { list: DB.programs, featured: DB.programs[0] },
            contact:  data?.contact || {
              address: DB.general.contact_address,
              email: DB.general.contact_email,
              phone: DB.general.contact_phone,
              hours: DB.general.contact_hours,
            },
            social:   data?.social || {
              facebook: DB.general.social_facebook,
              youtube: DB.general.social_youtube,
              instagram: DB.general.social_instagram,
            },
            footer:   data?.footer || {},
            accred:   data?.accred || {},
            general:  data?.general || DB.general,
          });
        }
      })
      .catch(err => {
        console.error('Failed to load Google Sheets:', err);
      });
  }, []);

  // Apply Global Theme Settings (Colors, Fonts, SEO)
  useEffect(() => {
    if (!content || !content.general) return;
    const g = content.general;

    // 1. Inject CSS Variables into :root
    const root = document.documentElement;
    Object.entries(g).forEach(([key, val]) => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, val);
      } else if (key.includes('bg') || key.includes('text') || key.includes('color')) {
        // Handle snake_case colors by converting to CSS vars (e.g. badge_active_bg -> --badge-active-bg)
        const cssVar = '--' + key.replace(/_/g, '-');
        root.style.setProperty(cssVar, val);
      } else if (key.startsWith('font_') || key.startsWith('section_') || key.startsWith('wrap_') || key.startsWith('max_')) {
        const cssVar = '--' + key.replace(/_/g, '-');
        root.style.setProperty(cssVar, val);
      }
    });

    // 2. Load External Font if provided
    if (g.font_url && g.font_url.startsWith('http')) {
      let link = document.getElementById('cms-font');
      if (!link) {
        link = document.createElement('link');
        link.id = 'cms-font';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = g.font_url;
    }

    // 3. Update SEO Metadata
    if (g.site_title) document.title = g.site_title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && g.site_description) metaDesc.setAttribute('content', g.site_description);

  }, [content]);

  useReveal(content);

  if (!content) return <LoadingScreen />;

  return (
    <>
      {/* ── Navigation ── */}
      <Navigation onNavigate={scrollTo} activeSection={activeSection} org={content.hero} />

      {/* ── Page ── */}
      <div className="page">
        <HeroSection hero={content.hero} />
        <WhoWeAre wwa={content.wwa} team={content.team} />
        <GallerySection gallery={content.whatWeDo} />
        <ProgramsSection programs={content.programs} />
        <Footer 
          footer={content.footer} 
          contact={content.contact} 
          social={content.social} 
          accred={content.accred}
        />
      </div>

      {/* ── Back to Top FAB ── */}
      <BackToTop />
    </>
  );
}
