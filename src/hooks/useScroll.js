import { useEffect, useState, useCallback } from 'react';

const SECTION_PREFIX = 'sec-';
const FOOTER_ID = 'sec-contact-us';
const SCROLL_THRESHOLD = 20;

export function useScrollTo() {
  return useCallback((sectionId) => {
    const el = document.getElementById(SECTION_PREFIX + sectionId);
    if (!el) return;
    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav') || '66'
    );
    const y = el.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);
}

export function useScrollToFooter() {
  return useCallback(() => {
    const footer = document.getElementById(FOOTER_ID);
    if (!footer) return;
    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav') || '66'
    );
    const y = footer.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);
}

export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let isMounted = true;
    const onScroll = () => { if (isMounted) setScrollY(window.scrollY); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      isMounted = false;
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return scrollY;
}

export function useReveal(deps = null) {
  useEffect(() => {
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
    return () => io.disconnect();
  }, [deps]);
}

export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(null);

  // Serialize array to avoid recreating the observer on every render 
  // since the array might be passed inline like ['home', 'about']
  const idsJoined = sectionIds.join(',');

  useEffect(() => {
    let isMounted = true;
    const ids = idsJoined ? idsJoined.split(',') : [];
    if (!ids.length) return;

    const visibilityMap = {};

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.section;
          visibilityMap[id] = entry.intersectionRatio;
        });

        let mostVisibleSection = null;
        let maxVisibility = 0;

        Object.entries(visibilityMap).forEach(([id, ratio]) => {
          if (ratio > maxVisibility) {
            maxVisibility = ratio;
            mostVisibleSection = id;
          }
        });

        if (mostVisibleSection && isMounted) {
          // Special case: if we are at the very top, always prefer 'home'
          if (window.scrollY < 100 && ids.includes('home')) {
            setActive('home');
          } else {
            setActive(mostVisibleSection);
          }
        }
      },
      { threshold: [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1], rootMargin: '-20% 0px -20% 0px' }
    );

    ids.forEach((id) => {
      const el = document.getElementById(SECTION_PREFIX + id);
      if (el) { el.dataset.section = id; io.observe(el); }
    });

    return () => {
      isMounted = false;
      io.disconnect();
    };
  }, [idsJoined]);
  return active;
}

export function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let isMounted = true;
    const onScroll = () => { if (isMounted) setScrolled(window.scrollY > SCROLL_THRESHOLD); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      isMounted = false;
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return scrolled;
}

export function useFooterVisible() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  useEffect(() => {
    let isMounted = true;
    const footer = document.getElementById(FOOTER_ID);
    if (!footer) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (isMounted) {
            setIsFooterVisible(e.isIntersecting && e.intersectionRatio > 0.1);
          }
        });
      },
      { threshold: [0, 0.1, 0.25, 0.5] }
    );

    io.observe(footer);
    return () => {
      isMounted = false;
      io.disconnect();
    };
  }, []);
  return isFooterVisible;
}
