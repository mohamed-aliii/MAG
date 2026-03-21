import { useEffect, useRef, useCallback } from 'react';

// Canvas logical resolution (kept the same — only effects are amplified)
const W = 680;
const H = 200;
const LETTER_Y = H / 2;

const REST = [
  { x: 160, y: LETTER_Y },
  { x: 340, y: LETTER_Y },
  { x: 520, y: LETTER_Y },
];
const LETTERS = ['M', 'A', 'G'];

// Portfolio theme colours
const C_GREEN   = '#10b981'; // emerald-500
const C_DKGREEN = '#059669'; // emerald-600
const C_WHITE   = '#f8fafc'; // slate-50
const C_DIM     = '#34d399'; // emerald-400
const C_BRIGHT  = '#6ee7b7'; // emerald-300 — extra bright accent

const REPULSE_RADIUS = 170;
const SPRING_K       = 12;
const DAMPING        = 0.80;
const REPULSE_FORCE  = 700;

function elasticOut(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return Math.pow(2, -10 * x) * Math.sin((x - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

interface LetterState { x: number; y: number; vx: number; vy: number; }
interface Particle {
  letterIdx: number; angle: number; radius: number; speed: number;
  size: number; color: string; opacity: number;
}

export default function MagneticLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startAnim = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')!;
    let animId = 0;
    let lastTime = performance.now();
    let globalT  = 0;
    let dashOffset = 0;
    let phase: 'snapping' | 'idle' = 'snapping';
    let snapProgress = 0;

    const STARTS = [
      { x: 20,      y: LETTER_Y },
      { x: W / 2,   y: LETTER_Y },
      { x: W - 20,  y: LETTER_Y },
    ];

    const letters: LetterState[] = STARTS.map(s => ({ x: s.x, y: s.y, vx: 0, vy: 0 }));

    // More particles (42) for denser effect, bigger sizes
    const particles: Particle[] = Array.from({ length: 42 }, (_, i) => ({
      letterIdx: i % 3,
      angle:     Math.random() * Math.PI * 2,
      radius:    30 + Math.random() * 55,
      speed:     (0.4 + Math.random() * 0.7) * (Math.random() < 0.5 ? 1 : -1),
      size:      1.2 + Math.random() * 2.5,  // bigger
      color:     i % 3 === 0 ? C_BRIGHT : i % 3 === 1 ? C_GREEN : C_DIM,
      opacity:   0.35 + Math.random() * 0.45, // brighter
    }));

    let mouseX = -999, mouseY = -999, mouseIn = false;

    const toCanvas = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseX = (e.clientX - r.left) * (W / r.width);
      mouseY = (e.clientY - r.top)  * (H / r.height);
    };
    const onEnter  = () => { mouseIn = true; };
    const onLeave  = () => { mouseIn = false; mouseX = -999; mouseY = -999; };
    const onClick  = () => {
      phase = 'snapping'; snapProgress = 0;
      letters.forEach((l, i) => { l.x = STARTS[i].x; l.y = STARTS[i].y; l.vx = 0; l.vy = 0; });
    };

    canvas.addEventListener('mousemove', toCanvas);
    canvas.addEventListener('mouseenter', onEnter);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    // ── Draw one letter with INTENSE glow passes ──────────────────
    function drawGlyph(x: number, y: number, letter: string, alpha: number) {
      const fs = 96;
      ctx.font = `bold ${fs}px 'Space Grotesk', sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      // 5 deep glow layers — much stronger bloom
      const glows: [number, string, number][] = [
        [120, C_GREEN,   0.12],
        [80,  C_DKGREEN, 0.18],
        [50,  C_DIM,     0.25],
        [28,  C_BRIGHT,  0.20],
        [12,  C_WHITE,   0.15],
      ];
      for (const [blur, col, a] of glows) {
        ctx.save();
        ctx.shadowBlur  = blur;
        ctx.shadowColor = col;
        ctx.globalAlpha = a * alpha;
        ctx.fillStyle   = col;
        ctx.fillText(letter, x, y);
        ctx.restore();
      }

      // Main gradient letter — brighter stops
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur  = 22;
      ctx.shadowColor = C_GREEN;
      const g = ctx.createLinearGradient(x - fs / 2, y - fs / 2, x + fs / 2, y + fs / 2);
      g.addColorStop(0,    C_WHITE);
      g.addColorStop(0.35, C_BRIGHT);
      g.addColorStop(0.7,  C_DIM);
      g.addColorStop(1,    C_GREEN);
      ctx.fillStyle = g;
      ctx.fillText(letter, x, y);
      ctx.restore();
    }

    // ── Draw field lines between two letter centres ──────────────────
    function drawFieldLines(x1: number, y1: number, x2: number, y2: number, fa: number) {
      const offsets = [-0.55, -0.28, 0, 0.28, 0.55];
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const px = -dy / len, py = dx / len;

      offsets.forEach((off, i) => {
        const isCenter = i === 2;
        const cpx      = mx + px * off * dist;
        const cpy      = my + py * off * dist;
        const arcAlpha = fa * (isCenter ? 1.0 : Math.max(0, 1 - Math.abs(off) * 1.2));
        const dir      = i % 2 === 0 ? 1 : -1;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
        ctx.strokeStyle  = isCenter ? C_BRIGHT : C_DIM;
        ctx.lineWidth    = isCenter ? 2.4 : 1.2;     // thicker
        ctx.globalAlpha  = Math.max(0, arcAlpha);
        ctx.shadowBlur   = isCenter ? 12 : 6;        // glow on lines
        ctx.shadowColor  = C_GREEN;
        ctx.setLineDash([8, 5]);
        ctx.lineDashOffset = dashOffset * dir;
        ctx.stroke();
        ctx.restore();
      });
    }

    // ── Main animation loop ──────────────────────────────────────────
    function frame(ts: number) {
      let dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;
      globalT  += dt;
      dashOffset -= 1.8; // slightly faster dash scroll

      ctx.clearRect(0, 0, W, H);

      // Stronger centred ambient glow
      const rg = ctx.createRadialGradient(W / 2, LETTER_Y, 0, W / 2, LETTER_Y, 300);
      rg.addColorStop(0, 'rgba(16,185,129,0.14)');
      rg.addColorStop(0.5, 'rgba(16,185,129,0.04)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);

      let fieldAlpha = 0;

      if (phase === 'snapping') {
        snapProgress = Math.min(snapProgress + dt * 0.65, 1);
        const eased = elasticOut(snapProgress);
        letters.forEach((l, i) => {
          l.x = STARTS[i].x + (REST[i].x - STARTS[i].x) * eased;
          l.y = STARTS[i].y + (REST[i].y - STARTS[i].y) * eased;
        });
        fieldAlpha = Math.max(0, Math.min(1, (snapProgress - 0.25) / 0.75));
        if (snapProgress >= 1) phase = 'idle';
      } else {
        fieldAlpha = 0.55 + 0.45 * Math.sin(globalT * 1.4);

        letters.forEach((l, i) => {
          l.vx = (l.vx - (l.x - REST[i].x) * SPRING_K * dt) * DAMPING;
          l.vy = (l.vy - (l.y - REST[i].y) * SPRING_K * dt) * DAMPING;

          if (mouseIn) {
            const d = Math.hypot(l.x - mouseX, l.y - mouseY);
            if (d < REPULSE_RADIUS && d > 0) {
              const s = Math.pow(1 - d / REPULSE_RADIUS, 2) * REPULSE_FORCE;
              l.vx += ((l.x - mouseX) / d) * s * dt;
              l.vy += ((l.y - mouseY) / d) * s * dt;
            }
          }

          l.x = Math.max(55, Math.min(W - 55, l.x + l.vx * dt));
          l.y = Math.max(35, Math.min(H - 35, l.y + l.vy * dt));
        });
      }

      // Particles — now with glow
      const pOpacity = phase === 'idle' ? fieldAlpha : Math.max(0, (snapProgress - 0.25) / 0.75);
      if (pOpacity > 0) {
        particles.forEach(p => {
          p.angle += p.speed * 0.016;
          const lx = letters[p.letterIdx].x;
          const ly = letters[p.letterIdx].y;
          const px2 = lx + Math.cos(p.angle) * p.radius;
          const py2 = ly + Math.sin(p.angle) * p.radius * 0.38;
          ctx.save();
          ctx.beginPath();
          ctx.arc(px2, py2, p.size, 0, Math.PI * 2);
          ctx.fillStyle   = p.color;
          ctx.globalAlpha = p.opacity * pOpacity;
          ctx.shadowBlur  = 8;             // particle glow!
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        });
      }

      // Field lines
      drawFieldLines(letters[0].x, letters[0].y, letters[1].x, letters[1].y, fieldAlpha);
      drawFieldLines(letters[1].x, letters[1].y, letters[2].x, letters[2].y, fieldAlpha);

      // Letters — stronger pulse range
      letters.forEach((l, i) => {
        const pulse = 0.70 + 0.30 * Math.sin(globalT * 2.1 + i * 1.2);
        drawGlyph(l.x, l.y, LETTERS[i], pulse);
      });

      // Pole dots — bigger, brighter, with bloom
      const dp = (0.5 + 0.5 * Math.sin(globalT * 2.1)) * fieldAlpha;
      letters.forEach(l => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(l.x, l.y + 56, 3.5, 0, Math.PI * 2);
        ctx.fillStyle   = C_BRIGHT;
        ctx.globalAlpha = 0.8 * dp;
        ctx.shadowBlur  = 14;
        ctx.shadowColor = C_GREEN;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', toCanvas);
      canvas.removeEventListener('mouseenter', onEnter);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startAnim(canvas);
  }, [startAnim]);

  return (
    <a href="#" className="block" aria-label="MAG home" style={{ lineHeight: 0 }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          display: 'block',
          width: 'clamp(120px, 22vw, 200px)',
          height: 'auto',
          cursor: 'crosshair',
        }}
      />
    </a>
  );
}
