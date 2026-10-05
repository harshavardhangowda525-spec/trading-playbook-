import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../lib/hooks';

/**
 * Obsidian atmosphere: radial light, slow aurora ribbons, faint architectural
 * lines, drifting dust and film grain. Calm by design.
 */
export function Background() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = cursor.current;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el?.style.setProperty('--mx', `${e.clientX}px`);
        el?.style.setProperty('--my', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Dust motes: very slow, warm, softly twinkling.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; t: number };
    let parts: P[] = [];
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, (w * h) / 26000));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.05,
        vy: -0.02 - Math.random() * 0.06,
        r: Math.random() * 1.1 + 0.25,
        a: Math.random() * 0.35 + 0.08,
        t: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        const tw = 0.6 + 0.4 * Math.sin(time / 2400 + p.t);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238, 228, 210, ${p.a * tw})`;
        ctx.fill();
      }
    };

    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(50, t - last) / 16.67;
      last = t;
      for (const p of parts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y < -4) {
          p.y = h + 4;
          p.x = Math.random() * w;
        }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
      }
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };
    if (reduced) draw(0);
    else raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

  return (
    <>
      <div className="bg-layer bg-base" />
      <div className="bg-layer bg-aurora" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="bg-layer bg-lines" aria-hidden>
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          <circle cx="1120" cy="360" r="420" />
          <circle cx="1120" cy="360" r="560" />
          <path d="M -40 760 C 400 620, 900 900, 1640 640" />
          <line x1="0" y1="180" x2="1600" y2="120" />
          <line x1="260" y1="0" x2="200" y2="1000" />
        </svg>
      </div>
      <canvas ref={canvas} className="bg-particles" aria-hidden />
      <div ref={cursor} className="bg-layer bg-cursor" />
      <div className="bg-layer bg-vignette" />
      <div className="bg-layer bg-grain" />
    </>
  );
}
