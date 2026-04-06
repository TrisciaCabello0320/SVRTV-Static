import { useEffect, useRef, useState, useCallback } from 'react';

// ── Scroll to a section by ID ──
export function useScrollTo() {
  return useCallback((sectionId) => {
    const el = document.getElementById('sec-' + sectionId);
    if (!el) return;
    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav') || '66'
    );
    const y = el.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);
}

// ── Scroll to footer ──
export function useScrollToFooter() {
  return useCallback(() => {
    const footer = document.getElementById('footer-contact');
    if (!footer) return;
    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav') || '66'
    );
    const y = footer.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);
}

// ── Track scroll position / show FAB ──
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrollY;
}

// ── Scroll-reveal via IntersectionObserver ──
export function useReveal() {
  useEffect(() => {
    const init = () => {
      const items = document.querySelectorAll('.reveal:not(.vis)');
      if (!items.length) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('vis');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
      );
      items.forEach((el) => io.observe(el));
      return io;
    };
    const io = init();
    return () => io && io.disconnect();
  });
}

// ── Nav hide/show on scroll ──
export function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}
