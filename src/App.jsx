import { useEffect } from 'react';
import { useScrollTo, useReveal } from './hooks/useScroll';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import GallerySection from './components/GallerySection';
import ProgramsSection from './components/ProgramsSection';
import AwardsSection from './components/AwardsSection';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import BackToTop from './components/BackToTop';
import './App.css';

export default function App() {
  const scrollTo = useScrollTo();

  // Run scroll-reveal observer after every render (catches newly added items)
  useReveal();

  return (
    <>
      {/* ── Loading Screen ── */}
      <LoadingScreen />

      {/* ── Navigation ── */}
      <Navigation onNavigate={scrollTo} />

      {/* ── Page ── */}
      <div className="page">
        <HeroSection />
        <WhoWeAre />
        <GallerySection />
        <ProgramsSection />
        <AwardsSection />
        <Footer />
      </div>

      {/* ── Back to Top FAB ── */}
      <BackToTop />
    </>
  );
}
