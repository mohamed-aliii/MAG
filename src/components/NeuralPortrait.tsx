import React, { useEffect, useRef, useCallback, useState } from 'react';

// Internal canvas resolution (always renders at this size for quality)
const CW = 380, CH = 430;

const LAYERS = [
  { name: 'Input noise',  t0: 0.0, t1: 1.2, bs0: 280, bs1: 280, nm0: 1.00, nm1: 1.00 },
  { name: 'Conv Layer 1', t0: 1.2, t1: 2.8, bs0: 280, bs1: 32,  nm0: 1.00, nm1: 0.70 },
  { name: 'Conv Layer 2', t0: 2.8, t1: 4.2, bs0: 32,  bs1: 12,  nm0: 0.70, nm1: 0.40 },
  { name: 'Attention',    t0: 4.2, t1: 5.8, bs0: 12,  bs1: 5,   nm0: 0.40, nm1: 0.18 },
  { name: 'Decoder',      t0: 5.8, t1: 7.4, bs0: 5,   bs1: 2,   nm0: 0.18, nm1: 0.04 },
  { name: 'Output',       t0: 7.4, t1: 9.0, bs0: 2,   bs1: 1,   nm0: 0.04, nm1: 0.00 },
];

const HOTSPOTS = [
  { cx: 140, cy: 132, rx: 70, ry: 82, r: 16, g: 185, b: 129, a0: 0.32, a1: 0.14 },
  { cx: 110, cy: 118, rx: 18, ry: 12, r: 110, g: 231, b: 183, a0: 0.45, a1: 0 },
  { cx: 170, cy: 118, rx: 18, ry: 12, r: 110, g: 231, b: 183, a0: 0.45, a1: 0 },
  { cx: 140, cy: 168, rx: 20, ry: 10, r: 6, g: 214, b: 160, a0: 0.35, a1: 0 },
];

function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

// ── Draw geometric avatar placeholder ─────────────────────────────
function drawTarget(bx: CanvasRenderingContext2D): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = "/me1.jpeg";  // ← your photo path
    img.onload = () => {
      bx.drawImage(img, 0, 0, CW, CH);
      resolve();
    };
  });
}

/*function drawTarget(bx: CanvasRenderingContext2D) {
  const W = CW, H = CH;
  bx.fillStyle = '#030712';
  bx.fillRect(0, 0, W, H);

  bx.strokeStyle = 'rgba(16,185,129,0.06)'; bx.lineWidth = 1;
  for (let x = 0; x < W; x += 16) { bx.beginPath(); bx.moveTo(x, 0); bx.lineTo(x, H); bx.stroke(); }
  for (let y = 0; y < H; y += 16) { bx.beginPath(); bx.moveTo(0, y); bx.lineTo(W, y); bx.stroke(); }

  const bg = bx.createLinearGradient(0, 220, 0, H);
  bg.addColorStop(0, 'rgba(16,185,129,0.28)'); bg.addColorStop(1, 'rgba(110,231,183,0.09)');
  bx.fillStyle = bg; bx.beginPath();
  bx.moveTo(0, H); bx.lineTo(0, 260);
  bx.bezierCurveTo(30, 230, 90, 220, 140, 222);
  bx.bezierCurveTo(190, 220, 250, 230, W, 260);
  bx.lineTo(W, H); bx.closePath(); bx.fill();

  bx.fillStyle = 'rgba(110,231,183,0.20)'; bx.beginPath();
  bx.moveTo(116, 222); bx.lineTo(108, 192); bx.lineTo(172, 192); bx.lineTo(164, 222);
  bx.closePath(); bx.fill();

  const hg = bx.createRadialGradient(140, 132, 20, 140, 132, 85);
  hg.addColorStop(0, 'rgba(16,185,129,0.20)'); hg.addColorStop(1, 'transparent');
  bx.fillStyle = hg; bx.fillRect(0, 0, W, H);

  bx.save(); bx.beginPath(); bx.translate(140, 132); bx.scale(1, 74 / 62);
  bx.arc(0, 0, 62, 0, Math.PI * 2); bx.restore();
  const eg = bx.createLinearGradient(78, 58, 202, 206);
  eg.addColorStop(0, 'rgba(180,255,220,0.55)');
  eg.addColorStop(0.5, 'rgba(110,231,183,0.40)');
  eg.addColorStop(1, 'rgba(5,150,105,0.30)');
  bx.fillStyle = eg; bx.fill();
  bx.strokeStyle = 'rgba(16,185,129,0.40)'; bx.lineWidth = 1; bx.stroke();

  [[110, 118], [170, 118]].forEach(([ex, ey]) => {
    const eyeG = bx.createRadialGradient(ex, ey, 0, ex, ey, 9);
    eyeG.addColorStop(0, 'rgba(110,231,183,0.95)');
    eyeG.addColorStop(0.5, 'rgba(16,185,129,0.65)');
    eyeG.addColorStop(1, 'transparent');
    bx.save(); bx.beginPath(); bx.translate(ex, ey); bx.scale(1, 5.5 / 9);
    bx.arc(0, 0, 9, 0, Math.PI * 2); bx.restore(); bx.fillStyle = eyeG; bx.fill();
    bx.beginPath(); bx.arc(ex, ey, 2.8, 0, Math.PI * 2);
    bx.fillStyle = 'rgba(110,231,183,0.92)'; bx.fill();
    bx.beginPath(); bx.arc(ex - 0.8, ey - 0.8, 1.1, 0, Math.PI * 2);
    bx.fillStyle = 'rgba(255,255,255,0.88)'; bx.fill();
  });

  const mg = bx.createLinearGradient(124, 168, 156, 168);
  mg.addColorStop(0, '#10b981'); mg.addColorStop(1, '#6ee7b7');
  bx.strokeStyle = mg; bx.lineWidth = 2;
  bx.beginPath(); bx.moveTo(124, 168); bx.quadraticCurveTo(140, 176, 156, 168); bx.stroke();

  bx.lineWidth = 0.8; bx.strokeStyle = 'rgba(110,231,183,0.10)';
  ([[78, 108, 55, 90], [196, 115, 222, 98], [72, 158, 48, 154], [206, 162, 234, 158]] as number[][]).forEach(([x1, y1, x2, y2]) => {
    bx.beginPath(); bx.moveTo(x1, y1); bx.lineTo(x2, y2); bx.stroke();
    bx.beginPath(); bx.arc(x2, y2, 1.8, 0, Math.PI * 2);
    bx.fillStyle = 'rgba(110,231,183,0.18)'; bx.fill();
  });
}*/

export default function NeuralPortrait() {
  const baseRef  = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const heatRef  = useRef<HTMLCanvasElement>(null);

  const [layerStates, setLayerStates] = useState(
    LAYERS.map(() => ({ progress: 0, state: 'idle' as 'idle' | 'active' | 'done' }))
  );
  const [epoch, setEpoch] = useState('000');
  const [loss, setLoss]   = useState('2.4831');
  const [step, setStep]   = useState('0/512');

  const startAnim = useCallback(() => {
    const baseCv = baseRef.current!;
    const noiseCv = noiseRef.current!;
    const heatCv = heatRef.current!;
    const bx = baseCv.getContext('2d')!;
    const nx = noiseCv.getContext('2d')!;
    const hx = heatCv.getContext('2d')!;

    let cancelled = false;
    let afId = 0;

    drawTarget(bx).then(() => {
    if (cancelled) return;
    const cleanData = bx.getImageData(0, 0, CW, CH);

    let rngState = 42;
    function lcg() { rngState = (rngState * 1664525 + 1013904223) & 0xFFFFFFFF; return (rngState >>> 0) / 4294967296; }
    const noiseField = new Uint8Array(CW * CH * 3);
    rngState = 42;
    for (let i = 0; i < CW * CH; i++) {
      noiseField[i * 3] = Math.floor(lcg() * 256);
      noiseField[i * 3 + 1] = Math.floor(lcg() * 256);
      noiseField[i * 3 + 2] = Math.floor(lcg() * 256);
    }

    const compImg = nx.createImageData(CW, CH);

    function compose(noiseMix: number, blockSize: number) {
      const cd = cleanData.data;
      const d = compImg.data;
      const bs = Math.max(1, Math.round(blockSize));
      const half = Math.floor(bs / 2);
      for (let y = 0; y < CH; y++) {
        const sy = Math.min(Math.floor(y / bs) * bs + half, CH - 1);
        for (let x = 0; x < CW; x++) {
          const sx = Math.min(Math.floor(x / bs) * bs + half, CW - 1);
          const si = (sy * CW + sx) * 4;
          const di = y * CW + x;
          const ni = di * 3;
          const pi = di * 4;
          d[pi]     = Math.round(noiseField[ni] * noiseMix + cd[si] * (1 - noiseMix));
          d[pi + 1] = Math.round(noiseField[ni + 1] * noiseMix + cd[si + 1] * (1 - noiseMix));
          d[pi + 2] = Math.round(noiseField[ni + 2] * noiseMix + cd[si + 2] * (1 - noiseMix));
          d[pi + 3] = 255;
        }
      }
      nx.putImageData(compImg, 0, 0);
    }

    function getSchedule(elapsed: number) {
      for (let i = LAYERS.length - 1; i >= 0; i--) {
        const l = LAYERS[i];
        if (elapsed >= l.t0) {
          const p = Math.min((elapsed - l.t0) / (l.t1 - l.t0), 1);
          const e = easeInOut(p);
          return { blockSize: l.bs0 + (l.bs1 - l.bs0) * e, noiseMix: l.nm0 + (l.nm1 - l.nm0) * e, layerIdx: i, layerProgress: p };
        }
      }
      return { blockSize: 280, noiseMix: 1, layerIdx: 0, layerProgress: 0 };
    }

    function drawHeatmap(elapsed: number, globalT: number) {
      hx.clearRect(0, 0, CW, CH);
      if (elapsed < 4.2) return;
      const intensity = elapsed < 9.0 ? Math.min((elapsed - 4.2) / 1.5, 1) * 0.8 : 0.5 + 0.2 * Math.sin(globalT * 2);
      HOTSPOTS.forEach(h => {
        const pulse = 0.7 + 0.3 * Math.sin(globalT * 3 + h.cx * 0.05);
        const a0i = intensity * h.a0 * pulse;
        const a1i = intensity * (h.a1 || 0) * pulse;
        hx.save(); hx.translate(h.cx, h.cy); hx.scale(1, h.ry / h.rx);
        const g = hx.createRadialGradient(0, 0, 0, 0, 0, h.rx);
        g.addColorStop(0, `rgba(${h.r},${h.g},${h.b},${a0i.toFixed(3)})`);
        if (h.a1 > 0) g.addColorStop(0.6, `rgba(${h.r},${h.g},${h.b},${a1i.toFixed(3)})`);
        g.addColorStop(1, 'transparent');
        hx.fillStyle = g; hx.beginPath(); hx.arc(0, 0, h.rx, 0, Math.PI * 2); hx.fill();
        hx.restore();
      });
    }

    let elapsed = 0, globalT = 0, lastTs = 0;

    function frame(ts: number) {
      if (!lastTs) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts; elapsed += dt; globalT += dt;

      if (elapsed <= 10.5) {
        const s = getSchedule(Math.min(elapsed, 9.0));
        compose(s.noiseMix, s.blockSize);
        drawHeatmap(elapsed, globalT);

        setLayerStates(LAYERS.map((_, i) => {
          if (i < s.layerIdx) return { progress: 100, state: 'done' as const };
          if (i === s.layerIdx) return { progress: Math.round(Math.min(s.layerProgress, 1) * 100), state: 'active' as const };
          return { progress: 0, state: 'idle' as const };
        }));

        const curElapsed = Math.min(elapsed, 9.0);
        const stepVal = Math.min(Math.floor(curElapsed / 9.0 * 512), 512);
        const epochVal = Math.floor(stepVal / 64);
        const lossVal = Math.max(0.0012, 2.4831 * Math.exp(-curElapsed * 0.55) + 0.001 * (Math.random() - 0.5));
        setEpoch(String(epochVal).padStart(3, '0'));
        setLoss(lossVal.toFixed(4));
        setStep(`${stepVal}/512`);
      } else {
        drawHeatmap(elapsed, globalT);
      }
      afId = requestAnimationFrame(frame);
    }
    afId = requestAnimationFrame(frame);
    }); // end drawTarget().then()

    return () => { cancelled = true; cancelAnimationFrame(afId); };
  }, []);

  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    cleanupRef.current = startAnim();
    return () => { cleanupRef.current?.(); };
  }, [startAnim]);

  const retrain = () => {
    cleanupRef.current?.();
    const nx = noiseRef.current!.getContext('2d')!;
    const hx = heatRef.current!.getContext('2d')!;
    nx.clearRect(0, 0, CW, CH);
    hx.clearRect(0, 0, CW, CH);
    setLayerStates(LAYERS.map(() => ({ progress: 0, state: 'idle' as const })));
    setEpoch('000'); setLoss('2.4831'); setStep('0/512');
    cleanupRef.current = startAnim();
  };

  /* Shared CSS-scaled canvas style — renders at CW×CH but displays responsively */
  const canvasStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    borderRadius: '6px',
    border: '1px solid rgba(16,185,129,0.15)',
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[380px]">
      {/* Canvas stack — aspect-ratio keeps it proportional on any screen */}
      <div className="relative w-full" style={{ aspectRatio: `${CW} / ${CH}` }}>
        <canvas ref={baseRef}  width={CW} height={CH} style={{ ...canvasStyle, zIndex: 1 }} />
        <canvas ref={noiseRef} width={CW} height={CH} style={{ ...canvasStyle, zIndex: 2 }} />
        <canvas ref={heatRef}  width={CW} height={CH} style={{ ...canvasStyle, zIndex: 3, mixBlendMode: 'screen' }} />
      </div>

      {/* Layer panel */}
      <div className="w-full rounded-[10px] p-3 flex flex-col gap-[7px]"
        style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)' }}>
        {LAYERS.map((l, i) => {
          const s = layerStates[i];
          const color = s.state === 'active' ? '#6ee7b7' : s.state === 'done' ? '#10b981' : '#94a3b8';
          return (
            <div key={l.name} className="flex items-center gap-2" style={{ fontFamily: "'Space Mono', monospace", fontSize: '9.5px', letterSpacing: '0.05em' }}>
              <span className="w-[90px] sm:w-[110px] shrink-0 transition-colors truncate" style={{ color }}>{l.name}</span>
              <div className="flex-1 h-[3px] rounded-sm overflow-hidden" style={{ background: 'rgba(16,185,129,0.10)' }}>
                <div className="h-full rounded-sm transition-all duration-[600ms]"
                  style={{
                    width: `${s.progress}%`,
                    background: 'linear-gradient(90deg, #10b981, #6ee7b7)',
                    boxShadow: s.state === 'active' ? '0 0 8px #6ee7b7' : 'none',
                  }} />
              </div>
              <span className="w-8 text-right transition-colors" style={{ color, fontSize: '9px' }}>{s.progress}%</span>
            </div>
          );
        })}
      </div>

      {/* Readout */}
      <div className="flex gap-3 sm:gap-4 items-center flex-wrap justify-center" style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.08em', color: '#94a3b8' }}>
        <span>EPOCH <span style={{ color: '#6ee7b7' }}>{epoch}</span></span>
        <span>LOSS <span style={{ color: '#10b981' }}>{loss}</span></span>
        <span>STEP <span style={{ color: '#6ee7b7' }}>{step}</span></span>
      </div>

      {/* Retrain button */}
      <button
        onClick={retrain}
        className="transition-all duration-300 cursor-pointer"
        style={{
          background: 'transparent',
          border: '1px solid rgba(16,185,129,0.35)',
          color: '#10b981',
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.14em',
          padding: '6px 16px',
          borderRadius: '6px',
        }}
        onMouseEnter={e => {
          const b = e.currentTarget;
          b.style.background = 'rgba(16,185,129,0.10)';
          b.style.borderColor = '#10b981';
          b.style.color = '#6ee7b7';
          b.style.boxShadow = '0 0 12px rgba(16,185,129,0.25)';
        }}
        onMouseLeave={e => {
          const b = e.currentTarget;
          b.style.background = 'transparent';
          b.style.borderColor = 'rgba(16,185,129,0.35)';
          b.style.color = '#10b981';
          b.style.boxShadow = 'none';
        }}
      >
        ↺  RETRAIN
      </button>
    </div>
  );
}
