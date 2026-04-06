import { useScrollY } from '../hooks/useScroll';

export default function BackToTop() {
  const scrollY = useScrollY();
  const visible = scrollY > 300;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={`fab-wrap${visible ? ' vis' : ''}`}>
      <button className="fab-totop" onClick={scrollTop} title="Back to top" aria-label="Back to top">
        <svg className="fab-arrow" viewBox="0 0 24 24">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}
