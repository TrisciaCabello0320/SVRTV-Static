import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 3200);
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
        <img
          className="loader-emblem"
          src="/SVRTV.png"
          alt="SVRTV Logo"
          width="90"
          height="90"
        />
        <div className="loader-name">Shepherd's Voice</div>
        <div className="loader-sub">Radio &amp; Television Foundation Inc.</div>
        <div className="loader-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}
