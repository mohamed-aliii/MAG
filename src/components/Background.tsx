import { useEffect, useRef } from 'react';

interface Star {
  x: number;        // 0–1 normalised
  y: number;        // 0–1 normalised
  r: number;        // radius in px
  baseAlpha: number; // base opacity
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
  drift: number;    // slow horizontal drift speed
}

interface ShootingStar {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  width: number;
  active: boolean;
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Theme palette
    const colors = [
      'rgba(200,214,229,A)',   // silver
      'rgba(200,214,229,A)',   // silver (more)
      'rgba(148,163,184,A)',   // slate-400
      'rgba(16,185,129,A)',    // emerald-500
      'rgba(52,211,153,A)',    // emerald-400
      'rgba(110,231,183,A)',   // emerald-300
    ];

    // Generate stars
    const STAR_COUNT = 280;
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const colorTemplate = colors[Math.floor(Math.random() * colors.length)];
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() < 0.92 ? 0.5 + Math.random() * 1.0 : 1.5 + Math.random() * 1.5,
        baseAlpha: 0.3 + Math.random() * 0.6,
        twinkleSpeed: 0.5 + Math.random() * 2.5,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: colorTemplate,
        drift: (Math.random() - 0.5) * 0.00003,
      });
    }

    // Shooting stars
    const shootingStars: ShootingStar[] = Array.from({ length: 8 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, width: 0, active: false,
    }));

    function spawnShooter(s: ShootingStar) {
      s.x = Math.random() * W * 0.8 + W * 0.1;
      s.y = Math.random() * H * 0.3;
      const angle = Math.PI * 0.6 + Math.random() * 0.5;
      const speed = 600 + Math.random() * 500;
      s.vx = Math.cos(angle) * speed;
      s.vy = Math.sin(angle) * speed;
      s.maxLife = 0.5 + Math.random() * 0.5;
      s.life = 0;
      s.width = 3.5 + Math.random() * 3.5;
      s.active = true;
    }

    let time = 0;
    let shootTimer = 0.5 + Math.random() * 1.5;
    let afId: number;

    function frame() {
      afId = requestAnimationFrame(frame);
      const dt = 0.016;
      time += dt;

      ctx.clearRect(0, 0, W, H);

      // Nebula glow
      const ng = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, W * 0.45);
      ng.addColorStop(0, 'rgba(16,185,129,0.045)');
      ng.addColorStop(0.5, 'rgba(16,185,129,0.015)');
      ng.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ng;
      ctx.fillRect(0, 0, W, H);

      // Second nebula blob
      const ng2 = ctx.createRadialGradient(W * 0.7, H * 0.2, 0, W * 0.7, H * 0.2, W * 0.25);
      ng2.addColorStop(0, 'rgba(110,231,183,0.03)');
      ng2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ng2;
      ctx.fillRect(0, 0, W, H);

      // Draw stars
      for (const s of stars) {
        s.x += s.drift;
        if (s.x > 1.02) s.x -= 1.04;
        if (s.x < -0.02) s.x += 1.04;

        const alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset));
        const colorStr = s.color.replace('A', alpha.toFixed(2));

        const px = s.x * W;
        const py = s.y * H;

        // Glow
        if (s.r > 1.0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = s.color.replace('A', (alpha * 0.15).toFixed(3));
          ctx.fill();
          ctx.restore();
        }

        // Star dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = colorStr;
        ctx.fill();
        ctx.restore();
      }

      // Shooting stars
      shootTimer -= dt;
      if (shootTimer <= 0) {
        shootTimer = 1 + Math.random() * 2;
        const free = shootingStars.find(s => !s.active);
        if (free) spawnShooter(free);
      }

      for (const s of shootingStars) {
        if (!s.active) continue;
        s.life += dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const prog = s.life / s.maxLife;
        const fadeIn  = Math.min(prog * 4, 1);
        const fadeOut = Math.max(0, 1 - (prog - 0.3) * 1.5);
        const alpha = fadeIn * fadeOut * 0.8;

        if (alpha > 0.01) {
          const tailLen = 120 + 60 * alpha;
          const angle = Math.atan2(s.vy, s.vx);
          const tailX = s.x - Math.cos(angle) * tailLen;
          const tailY = s.y - Math.sin(angle) * tailLen;

          const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          grad.addColorStop(0, 'rgba(110,231,183,0)');
          grad.addColorStop(1, `rgba(110,231,183,${alpha.toFixed(2)})`);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.width;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();
        }
        if (s.life >= s.maxLife) s.active = false;
      }
    }

    frame();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(afId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      id="canvas-container"
    />
  );
}
