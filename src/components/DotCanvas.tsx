import { useEffect, useRef } from 'react';

/**
 * Animated dot background canvas — ported from the System Core reference design.
 * Respects `prefers-reduced-motion` (CSS hides it via `#dotCanvas` selector) and
 * listens to `data-theme` changes on <html> to swap between light/dark dot colors.
 */
export default function DotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Skip the animation entirely when the user has opted into reduced motion.
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const SPACING = 22;
    const BASE_RADIUS = 0.7;
    const DOT_COLOR_LIGHT: [number, number, number] = [120, 117, 107];
    const DOT_COLOR_DARK: [number, number, number] = [232, 230, 221];
    const ACCENT_COLOR: [number, number, number] = [217, 119, 87];
    const MOUSE_RADIUS = 150;

    let dots: Array<{ baseX: number; baseY: number; x: number; y: number; phase: number }> = [];
    let DOT_COLOR: [number, number, number] = DOT_COLOR_LIGHT;
    let isDark = false;
    let animationFrameId = 0;
    const mouse = { x: -9999, y: -9999 };

    const syncDotColor = () => {
      isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      DOT_COLOR = isDark ? DOT_COLOR_DARK : DOT_COLOR_LIGHT;
    };
    syncDotColor();

    const themeObserver = new MutationObserver(syncDotColor);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const buildDots = () => {
      dots = [];
      const cols = Math.ceil(window.innerWidth / SPACING) + 4;
      const rows = Math.ceil(window.innerHeight / SPACING) + 4;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          dots.push({
            baseX: x * SPACING,
            baseY: y * SPACING,
            x: x * SPACING,
            y: y * SPACING,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      buildDots();
    };

    const tick = (t: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const globalX = Math.sin(t * 0.00008) * 6 + Math.cos(t * 0.00011) * 4;
      const globalY = Math.cos(t * 0.0001) * 5 + Math.sin(t * 0.00013) * 3;

      const baseAlpha = isDark ? 0.08 : 0.45;
      const boostAlpha = isDark ? 0.85 : 0.5;

      for (const d of dots) {
        const wobbleX = Math.sin(t * 0.0004 + d.phase) * 0.6;
        const wobbleY = Math.cos(t * 0.0004 + d.phase * 1.3) * 0.6;

        const targetX = d.baseX + globalX + wobbleX;
        const targetY = d.baseY + globalY + wobbleY;
        const dx = targetX - mouse.x;
        const dy = targetY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let pushX = 0;
        let pushY = 0;
        let boost = 0;
        if (dist < MOUSE_RADIUS) {
          const force = 1 - dist / MOUSE_RADIUS;
          pushX = (dx / (dist || 1)) * force * 10;
          pushY = (dy / (dist || 1)) * force * 10;
          boost = force;
        }

        d.x = targetX + pushX;
        d.y = targetY + pushY;

        const alpha = baseAlpha + boost * boostAlpha;
        const radius = BASE_RADIUS + boost * 1.5;
        const r = Math.round(DOT_COLOR[0] + (ACCENT_COLOR[0] - DOT_COLOR[0]) * boost);
        const g = Math.round(DOT_COLOR[1] + (ACCENT_COLOR[1] - DOT_COLOR[1]) * boost);
        const b = Math.round(DOT_COLOR[2] + (ACCENT_COLOR[2] - DOT_COLOR[2]) * boost);

        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    resize();
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas id="dotCanvas" aria-hidden="true" ref={canvasRef} />;
}
