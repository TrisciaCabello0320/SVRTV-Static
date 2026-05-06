import { useScrollY } from '../hooks/useScroll';

const VISIBILITY_THRESHOLD = 300;

export default function BackToTop() {
  const scrollY = useScrollY();
  const visible = scrollY > VISIBILITY_THRESHOLD;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={`fab-wrap${visible ? ' vis' : ''}`}>
      <button className="to-top" onClick={scrollTop} title="Back to top" aria-label="Back to top">
        <svg className="fab-arrow" viewBox="0 0 24 24">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}
