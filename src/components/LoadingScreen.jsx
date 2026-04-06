import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (done) {
      const timer = setTimeout(() => setRemoved(true), 400);
      return () => clearTimeout(timer);
    }
  }, [done]);

  if (removed) return null;

  return (
    <div id="loader" className={done ? 'done' : ''}>
      <div className="loader-bg" />
      <div className="loader-blob lb1" />
      <div className="loader-blob lb2" />
      <div className="loader-blob lb3" />
      <div className="loader-blob lb4" />
      <div className="loader-blob lb5" />
      <div className="loader-logo">
        <svg
          className="loader-emblem"
          width="90"
          height="90"
          viewBox="0 0 90 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="90" height="90" rx="20" fill="white" fillOpacity="0.15" />
          <text
            x="45"
            y="58"
            textAnchor="middle"
            fontSize="36"
            fontWeight="900"
            fill="white"
            fontFamily="Montserrat,sans-serif"
          >
            SV
          </text>
        </svg>
        <div className="loader-name">Shepherd's Voice</div>
        <div className="loader-sub">Radio &amp; Television Foundation Inc.</div>
        <div className="loader-dots"> 
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}
