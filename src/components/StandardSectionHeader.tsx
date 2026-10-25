import React, { useState, useRef, useEffect } from 'react';

interface StandardSectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
  children?: React.ReactNode;
}

export const StandardSectionHeader: React.FC<StandardSectionHeaderProps> = ({
  title,
  subtitle,
  description,
  as = 'h2',
  className = '',
  children,
}) => {
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const [logoRevealed, setLogoRevealed] = useState<boolean>(false);
  const [logoAnimationKey, setLogoAnimationKey] = useState<number>(0);

  useEffect(() => {
    const el = logoContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setLogoRevealed(true);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLogoRevealed(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const HeadingTag = as;

  return (
    <div
      className={`pb-4 sm:pb-8 border-b border-zinc-800 animate-header-reveal flex flex-row items-center sm:items-end justify-between gap-3 sm:gap-4 font-sans ${className}`}
    >
      <div className="flex-1 min-w-0 font-sans">
        <HeadingTag className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-sans capitalize [&_*]:capitalize [&_font]:capitalize">
          {title}
        </HeadingTag>

        {subtitle && (
          <p className="mt-1.5 sm:mt-3 text-xs sm:text-base font-medium text-zinc-300 flex items-center gap-1.5 sm:gap-2 flex-wrap font-sans">
            <span className="text-amber-400 font-bold shrink-0 text-xs sm:text-base">◉</span>
            <span className="text-amber-400 font-semibold text-xs sm:text-base font-sans">
              {subtitle}
            </span>
          </p>
        )}

        {description && (
          <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}

        {children}
      </div>

      {/* Right Side: Standard Mosaic Animated Logo */}
      <div
        ref={logoContainerRef}
        onClick={() => {
          setLogoRevealed(true);
          setLogoAnimationKey((k) => k + 1);
        }}
        className="shrink-0 flex items-center self-center sm:self-end pb-0 sm:pb-1 relative group cursor-pointer"
      >
        {/* Ambient Mosaic Radial Glow Burst */}
        {logoRevealed && (
          <div
            key={`glow-${logoAnimationKey}`}
            className="absolute -inset-1 sm:-inset-3 rounded-full bg-gradient-to-tr from-amber-500/25 via-rose-500/20 to-fuchsia-600/25 blur-lg sm:blur-xl pointer-events-none animate-mosaic-glow"
          />
        )}

        {/* Flying Mosaic Tile Fragments */}
        {logoRevealed && (
          <div
            key={`tiles-${logoAnimationKey}`}
            className="hidden sm:block absolute inset-0 pointer-events-none overflow-visible z-10"
          >
            {[
              { x: '-15%', y: '-10%', w: '18px', h: '12px', color: '#f97316', tx: -35, ty: -25, rot: -20, delay: 50 },
              { x: '95%', y: '-5%', w: '16px', h: '10px', color: '#fb923c', tx: 30, ty: -20, rot: 30, delay: 100 },
              { x: '-10%', y: '85%', w: '14px', h: '14px', color: '#ef4444', tx: -25, ty: 25, rot: 25, delay: 150 },
              { x: '90%', y: '80%', w: '16px', h: '12px', color: '#e11d48', tx: 35, ty: 30, rot: -30, delay: 200 },
              { x: '45%', y: '-20%', w: '20px', h: '10px', color: '#ffffff', tx: 10, ty: -30, rot: 15, delay: 80 },
              { x: '45%', y: '100%', w: '18px', h: '10px', color: '#f59e0b', tx: -10, ty: 30, rot: -15, delay: 220 },
            ].map((tile, i) => (
              <div
                key={i}
                className="absolute rounded-sm animate-mosaic-tile shadow-sm"
                style={{
                  left: tile.x,
                  top: tile.y,
                  width: tile.w,
                  height: tile.h,
                  backgroundColor: tile.color,
                  boxShadow: `0 0 10px ${tile.color}88`,
                  '--tx': `${tile.tx}px`,
                  '--ty': `${tile.ty}px`,
                  '--rot': `${tile.rot}deg`,
                  animationDelay: `${tile.delay}ms`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        <img
          key={`logo-img-${logoAnimationKey}`}
          src="/LOGO.png"
          alt="Art Fantasia"
          className={`h-8 sm:h-16 md:h-20 w-auto object-contain transition-all duration-300 ${
            logoRevealed
              ? 'animate-mosaic-entrance opacity-90 hover:opacity-100 hover:scale-105'
              : 'opacity-0'
          }`}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (!target.src.includes('01lo.png')) {
              target.src = '/01lo.png';
            }
          }}
        />
      </div>
    </div>
  );
};
