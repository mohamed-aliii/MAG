import { useEffect, useRef, useCallback } from 'react';

const W = 680;
const H = 280;
const LETTER_Y = H / 2;
const REST = [
  { x: 190, y: LETTER_Y },
  { x: 340, y: LETTER_Y },
  { x: 490, y: LETTER_Y },
];
const LETTERS = ['M', 'A', 'G'];
const REPULSE_RADIUS = 170;
const SPRING_K = 12;
const DAMPING = 0.80;
const REPULSE_FORCE = 700;

function elasticOut(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return Math.pow(2, -10 * x) * Math.sin((x - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

interface LetterState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Particle {
  letterIdx: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
  opacity: number;
}

export default function MagneticLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startAnim = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')!;
    let animId = 0;
    let lastTime = performance.now();
    let globalT = 0;
    let dashOffset = 0;
    let phase: 'snapping' | 'idle' = 'snapping';
    let snapProgress = 0;

    const STARTS = [
      { x: 40, y: LETTER_Y },
      { x: W / 2, y: LETTER_Y },
      { x: W - 40, y: LETTER_Y },
    ];

    const letters: LetterState[] = REST.map((r, i) => ({
      x: STARTS[i].x,
      y: r.y,
      vx: 0,
      vy: 0,
    }));

    // Particles
    const particles: Particle[] = Array.from({ length: 28 }, (_, i) => ({
      letterIdx: i % 3,
      angle: Math.random() * Math.PI * 2,
      radius: 55 + Math.random() * 45,
      speed: (0.3 + Math.random() * 0.5) * (Math.random() < 0.5 ? 1 : -1),
      size: 0.8 + Math.random() * 1.2,
      color: i % 2 === 0 ? '#7B5CFA' : '#00D4FF',
      opacity: 0.2 + Math.random() * 0.35,
    }));

    let mouseX = -999;
    let mouseY = -999;
    let mouseInCanvas = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      mouseX = (e.clientX - rect.left) * scaleX;
      mouseY = (e.clientY - rect.top) * scaleY;
    };
    const onMouseEnter = () => { mouseInCanvas = true; };
    const onMouseLeave = () => { mouseInCanvas = false; mouseX = -999; mouseY = -999; };
    const onClick = () => {
      phase = 'snapping';
      snapProgress = 0;
      letters.forEach((l, i) => {
        l.x = STARTS[i].x;
        l.y = STARTS[i].y;
        l.vx = 0;
        l.vy = 0;
      });
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseenter', onMouseEnter);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);

    function drawGlyph(ctx: CanvasRenderingContext2D, letter: string, x: number, y: number, gAlpha: number) {
      const fontSize = 128;
      ctx.font = `bold ${fontSize}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Glow passes
      const glowPasses = [
        { blur: 84, color: '#00D4FF', a: 0.18 * gAlpha },
        { blur: 56, color: '#7B5CFA', a: 0.18 * gAlpha },
        { blur: 28, color: '#00D4FF', a: 0.18 * gAlpha },
      ];
      for (const gp of glowPasses) {
        ctx.save();
        ctx.shadowBlur = gp.blur;
        ctx.shadowColor = gp.color;
        ctx.globalAlpha = gp.a;
        ctx.fillStyle = gp.color;
        ctx.fillText(letter, x, y);
        ctx.restore();
      }

      // Main letter
      ctx.save();
      ctx.globalAlpha = gAlpha;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#7B5CFA';
      const grad = ctx.createLinearGradient(x - fontSize / 2, y - fontSize / 2, x + fontSize / 2, y + fontSize / 2);
      grad.addColorStop(0, '#7B5CFA');
      grad.addColorStop(0.5, '#A98BFF');
      grad.addColorStop(1, '#00D4FF');
      ctx.fillStyle = grad;
      ctx.fillText(letter, x, y);
      ctx.restore();
    }

    function drawFieldLines(
      ctx: CanvasRenderingContext2D,
      x1: number, y1: number,
      x2: number, y2: number,
      fieldAlpha: number
    ) {
      const offsets = [-0.52, -0.26, 0, 0.26, 0.52];
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      // Perpendicular direction
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const px = -dy / len;
      const py = dx / len;

      offsets.forEach((off, i) => {
        const isCenter = i === 2;
        const cpx = mx + px * off * dist;
        const cpy = my + py * off * dist;
        const arcOpacity = isCenter ? fieldAlpha : fieldAlpha * (1 - Math.abs(off));
        const dir = i % 2 === 0 ? 1 : -1;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
        ctx.strokeStyle = isCenter ? '#00D4FF' : '#7B5CFA';
        ctx.lineWidth = isCenter ? 1.6 : 0.8;
        ctx.globalAlpha = arcOpacity;
        ctx.setLineDash([7, 6]);
        ctx.lineDashOffset = dashOffset * dir;
        ctx.stroke();
        ctx.restore();
      });
    }

    function frame(ts: number) {
      let dt = (ts - lastTime) / 1000;
      lastTime = ts;
      if (dt > 0.05) dt = 0.05;
      globalT += dt;
      dashOffset -= 1.4;

      ctx.clearRect(0, 0, W, H);

      // Background glow
      const radGrad = ctx.createRadialGradient(W / 2, LETTER_Y, 0, W / 2, LETTER_Y, 260);
      radGrad.addColorStop(0, 'rgba(123,92,250,0.05)');
      radGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, W, H);

      let fieldAlpha = 0;

      if (phase === 'snapping') {
        snapProgress += dt * 0.65;
        if (snapProgress >= 1) {
          snapProgress = 1;
          phase = 'idle';
        }
        const eased = elasticOut(Math.min(snapProgress, 1));
        letters.forEach((l, i) => {
          l.x = STARTS[i].x + (REST[i].x - STARTS[i].x) * eased;
          l.y = STARTS[i].y + (REST[i].y - STARTS[i].y) * eased;
        });
        // Field alpha: lerp from 0 to 1 as snapProgress 0.25→1.0
        fieldAlpha = Math.max(0, Math.min(1, (snapProgress - 0.25) / 0.75));
      } else {
        // Idle pulse
        fieldAlpha = 0.55 + 0.45 * Math.sin(globalT * 1.4);

        // Physics: spring + repulsion
        letters.forEach((l, i) => {
          // Spring
          const forceX = -(l.x - REST[i].x) * SPRING_K;
          const forceY = -(l.y - REST[i].y) * SPRING_K;
          l.vx = (l.vx + forceX * dt) * DAMPING;
          l.vy = (l.vy + forceY * dt) * DAMPING;

          // Repulsion
          if (mouseInCanvas) {
            const dist = Math.hypot(l.x - mouseX, l.y - mouseY);
            if (dist < REPULSE_RADIUS && dist > 0) {
              const strength = Math.pow(1 - dist / REPULSE_RADIUS, 2) * REPULSE_FORCE;
              l.vx += ((l.x - mouseX) / dist) * strength * dt;
              l.vy += ((l.y - mouseY) / dist) * strength * dt;
            }
          }

          l.x += l.vx * dt;
          l.y += l.vy * dt;
          // Clamp
          l.x = Math.max(60, Math.min(W - 60, l.x));
          l.y = Math.max(50, Math.min(H - 50, l.y));
        });
      }

      // Particles
      if (phase === 'idle' || snapProgress > 0.25) {
        const pAlpha = phase === 'idle' ? fieldAlpha : Math.max(0, (snapProgress - 0.25) / 0.75);
        particles.forEach(p => {
          p.angle += p.speed * 0.016;
          const lx = letters[p.letterIdx].x;
          const ly = letters[p.letterIdx].y;
          const px2 = lx + Math.cos(p.angle) * p.radius;
          const py2 = ly + Math.sin(p.angle) * p.radius * 0.4;
          ctx.save();
          ctx.beginPath();
          ctx.arc(px2, py2, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * pAlpha;
          ctx.fill();
          ctx.restore();
        });
      }

      // Field lines
      drawFieldLines(ctx, letters[0].x, letters[0].y, letters[1].x, letters[1].y, fieldAlpha);
      drawFieldLines(ctx, letters[1].x, letters[1].y, letters[2].x, letters[2].y, fieldAlpha);

      // Letters
      const t_pulse = globalT;
      letters.forEach((l, i) => {
        const glowPulse = 0.75 + 0.25 * Math.sin(t_pulse * 2.1 + i * 1.2);
        drawGlyph(ctx, LETTERS[i], l.x, l.y, glowPulse);
      });

      // Pole dots
      const dotPulse = 0.5 + 0.5 * Math.sin(globalT * 2.1);
      letters.forEach(l => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(l.x, l.y + 72, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#7B5CFA';
        ctx.globalAlpha = 0.5 * dotPulse * fieldAlpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#7B5CFA';
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseenter', onMouseEnter);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cleanup = startAnim(canvas);
    return cleanup;
  }, [startAnim]);

  return (
    <a href="#" className="block" style={{ lineHeight: 0 }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          display: 'block',
          width: '100px',
          height: 'auto',
          cursor: 'crosshair',
        }}
      />
    </a>
  );
}
