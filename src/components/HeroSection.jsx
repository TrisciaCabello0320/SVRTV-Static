"use client"

import * as React from "react"
import { useEffect, useRef } from 'react';
import { motion } from "motion/react"
import { useScrollTo } from '../hooks/useScroll';
import { DB } from '../data/database';
import { cn } from "@/lib/utils"

// ─── Animation Components (Provided Code converted to JS) ──────────────────────

const SPRING_TRANSITION_CONFIG = {
  type: "spring",
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
}

const filterVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
  },
}

const areaClasses = [
  "col-start-2 col-end-3 row-start-1 row-end-3",
  "col-start-1 col-end-2 row-start-2 row-end-4",
  "col-start-1 col-end-2 row-start-4 row-end-6",
  "col-start-2 col-end-3 row-start-3 row-end-5",
]

const ContainerStagger = React.forwardRef(({ transition, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView={"visible"}
      viewport={{ once: true }}
      transition={{
        staggerChildren: transition?.staggerChildren ?? 0.2,
        delayChildren: transition?.delayChildren ?? 0.2,
        duration: 0.3,
        ...transition,
      }}
      {...props}
    />
  )
})
ContainerStagger.displayName = "ContainerStagger"

const ContainerAnimated = React.forwardRef(({ transition, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={filterVariants}
      transition={{
        ...SPRING_TRANSITION_CONFIG,
        duration: 0.3,
        ...transition,
      }}
      {...props}
    />
  )
})
ContainerAnimated.displayName = "ContainerAnimated"

const GalleryGrid = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-2 grid-rows-[50px_150px_50px_150px_50px] gap-4",
        className
      )}
      {...props}
    />
  )
})
GalleryGrid.displayName = "GalleryGrid"

const GalleryGridCell = React.forwardRef(({ className, transition, index, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.3,
        delay: index * 0.2,
        delayChildren: transition?.delayChildren ?? 0.2,
      }}
      className={cn("relative overflow-hidden rounded-xl shadow-xl", areaClasses[index], className)}
      {...props}
    />
  )
})
GalleryGridCell.displayName = "GalleryGridCell"

// ─── Data & Helpers ──────────────────────────────────────────────────────────

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=900&auto=format&fit=crop&q=80',
    cap: 'Morning Prayer & Adoration',
  },
  {
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80',
    cap: 'Community Outreach',
  },
  {
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
    cap: 'Youth Faith Formation',
  },
  {
    url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&auto=format&fit=crop&q=80',
    cap: 'Radio & TV Broadcast',
  },
];



function useCountUp(target, duration = 1400) {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
        if (isNaN(numericTarget)) { setCount(target); return; }

        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * numericTarget));
          if (progress < 1) requestAnimationFrame(step);
          else setCount(target);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { count, ref };
}



// ─── Main Hero component ─────────────────────────────────────────────────────

export default function HeroSection({ hero = {} }) {
  const scrollTo = useScrollTo();

  const title = hero.hero_title || DB.general.org_name;
  const subtitle = hero.hero_subtitle || DB.general.org_short;
  const tagline = hero.hero_tagline || DB.general.org_tagline;
  const description = hero.hero_description ||
    'An all-media, non-profit organization producing world-class inspirational and spiritually enriching programs — reaching souls for Jesus Christ through radio, television, and digital media.';

  const primaryLabel = hero.cta_primary_label || "What We Are";
  const primaryLink = hero.cta_primary_link || "#sec-who";
  const secondaryLabel = hero.cta_secondary_label || "Programs & Events";
  const secondaryLink = hero.cta_secondary_link || "#sec-programs";

  const textAlign = 'left';
  const bgColor = hero.hero_bg_color || '#ffffff';
  const bgImage = hero.hero_bg_image_url || '';
  const bgOverlay = hero.hero_bg_overlay || 'rgba(255,71,79,0.06)';

  const sectionStyle = {
    backgroundColor: bgColor,
    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: bgOverlay,
    pointerEvents: 'none',
  };

  const contentClass = cn(
    "hero-cta-content",
    textAlign === 'left' ? "text-left items-start" : "text-center items-center"
  );

  return (
    <section id="sec-home" className="hero-cta" style={sectionStyle}>
      {bgOverlay !== 'none' && <div style={overlayStyle} />}
      
      <div className={contentClass} style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-cta-eye">
          <span className="hero-cta-dot" aria-hidden="true" />
          {tagline}
        </div>

        <h1 className="hero-cta-h1">
          {title}<br />
          <span className="hero-cta-accent">{subtitle}</span>
        </h1>

        <p className="hero-cta-desc">{description}</p>

        <div className="hero-cta-btns">
          <button
            id="hero-btn-who"
            className="btn btn-n"
            onClick={() => {
              if (primaryLink.startsWith('#')) scrollTo(primaryLink.substring(1));
              else window.open(primaryLink, '_blank');
            }}
          >
            {primaryLabel}
          </button>
          <button
            id="hero-btn-programs"
            className="btn btn-out"
            onClick={() => {
              if (secondaryLink.startsWith('#')) scrollTo(secondaryLink.substring(1));
              else window.open(secondaryLink, '_blank');
            }}
          >
            {secondaryLabel}
          </button>
        </div>

      </div>

      {/* Right: Animated Gallery Grid Column */}
      <div className="hero-gallery-wrap">
        <ContainerStagger>
          <GalleryGrid>
            {HERO_IMAGES.map((img, i) => (
              <GalleryGridCell key={img.url} index={i}>
                <ContainerAnimated className="h-full w-full overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.cap}
                    width="600"
                    height="800"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    loading={i < 2 ? "eager" : "lazy"}
                  />
                </ContainerAnimated>
              </GalleryGridCell>
            ))}
          </GalleryGrid>
        </ContainerStagger>


      </div>
    </section>
  );
}
