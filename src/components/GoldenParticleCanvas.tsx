import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  phase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  colorRgb: string;
  hasGlint: boolean;
}

interface GoldenParticleCanvasProps {
  className?: string;
  particleCount?: number;
  inFront?: boolean;
}

const GOLDEN_PALETTES = [
  '251, 191, 36',   // Amber 400
  '245, 158, 11',   // Amber 500
  '254, 240, 138',  // Yellow 200 (light gold spark)
  '212, 175, 55',   // Classic Metallic Gold
  '253, 230, 138',  // Champagne Gold
  '245, 208, 115',  // Warm Radiant Gold
];

export const GoldenParticleCanvas: React.FC<GoldenParticleCanvasProps> = ({
  className = '',
  particleCount = 65,
  inFront = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles: Particle[] = [];

    const initParticle = (p?: Partial<Particle>, randomY = false): Particle => {
      const palette = GOLDEN_PALETTES[Math.floor(Math.random() * GOLDEN_PALETTES.length)];
      // Refined, smaller particle sizes: delicate sparks and medium accent orbs
      const isBigOrb = Math.random() < 0.18;
      const baseRadius = isBigOrb
        ? 2.2 + Math.random() * 1.4
        : 1.1 + Math.random() * 1.3;

      return {
        x: p?.x ?? Math.random() * (width || 800),
        y: p?.y ?? (randomY ? Math.random() * (height || 300) : (height || 300) + Math.random() * 30),
        // 50% reduced movement speed for calm, elegant drifting
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(0.42 + Math.random() * 0.68),
        baseRadius,
        radius: baseRadius,
        baseAlpha: 0.35 + Math.random() * 0.55,
        alpha: 0.3,
        pulseSpeed: 0.012 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.012 + Math.random() * 0.018,
        wobbleAmp: 0.7 + Math.random() * 1.2,
        colorRgb: palette,
        hasGlint: Math.random() < 0.35,
      };
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 300);
      height = Math.max(rect.height, 120);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      if (particles.length === 0) {
        for (let i = 0; i < particleCount; i++) {
          particles.push(initParticle(undefined, true));
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    handleResize();

    // IntersectionObserver to pause rendering when off-screen
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !animationFrameId) {
          loop();
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const loop = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Dynamic motion: upward floating + natural rhythmic sway
        p.phase += p.pulseSpeed;
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.phase * p.wobbleSpeed) * p.wobbleAmp;

        // Pulsing scale & opacity for lively twinkling
        const pulse = (Math.sin(p.phase) + 1) * 0.5; // 0..1
        p.radius = p.baseRadius * (0.85 + pulse * 0.35);
        p.alpha = p.baseAlpha * (0.45 + pulse * 0.55);

        // Edge fade calculations
        const edgeFadeDist = 30;
        let fadeFactor = 1;
        if (p.y < edgeFadeDist) {
          fadeFactor = Math.max(0, p.y / edgeFadeDist);
        } else if (p.y > height - edgeFadeDist) {
          fadeFactor = Math.max(0, (height - p.y) / edgeFadeDist);
        }
        if (p.x < edgeFadeDist) {
          fadeFactor = Math.min(fadeFactor, Math.max(0, p.x / edgeFadeDist));
        } else if (p.x > width - edgeFadeDist) {
          fadeFactor = Math.min(fadeFactor, Math.max(0, (width - p.x) / edgeFadeDist));
        }

        const finalAlpha = Math.max(0, Math.min(1, p.alpha * fadeFactor));

        if (finalAlpha > 0.01) {
          // 1. Ultra-fast soft outer golden halo glow (no CPU-heavy shadowBlur)
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.colorRgb}, ${finalAlpha * 0.18})`;
          ctx.fill();

          // 2. Main golden orb body
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.colorRgb}, ${finalAlpha})`;
          ctx.fill();

          // 3. Bright luminous core inside larger particles
          if (p.radius > 1.7) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 0.44, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 245, ${Math.min(1, finalAlpha * 1.25)})`;
            ctx.fill();
          }

          // 4. Subtle 4-point golden star flare / glint during peak twinkle
          if (p.hasGlint && pulse > 0.75 && finalAlpha > 0.4) {
            const glintLength = p.radius * (1.6 + (pulse - 0.75) * 3);
            const glintAlpha = (pulse - 0.75) * 4 * finalAlpha * 0.75;
            ctx.strokeStyle = `rgba(255, 250, 220, ${glintAlpha})`;
            ctx.lineWidth = 1.0;

            ctx.beginPath();
            // Horizontal flare line
            ctx.moveTo(p.x - glintLength, p.y);
            ctx.lineTo(p.x + glintLength, p.y);
            // Vertical flare line
            ctx.moveTo(p.x, p.y - glintLength);
            ctx.lineTo(p.x, p.y + glintLength);
            ctx.stroke();
          }
        }

        // Respawn when floated off top or sides
        if (p.y < -25 || p.x < -30 || p.x > width + 30) {
          particles[i] = initParticle({
            x: Math.random() * width,
            y: height + Math.random() * 20,
          });
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [particleCount]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${
        inFront ? 'z-20' : 'z-0'
      } ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
