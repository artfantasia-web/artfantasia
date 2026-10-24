import React, { useState } from 'react';

interface MosaicLogo3DProps {
  className?: string;
  size?: number;
}

export const MosaicLogo3D: React.FC<MosaicLogo3DProps> = ({ className = '', size = 204 }) => {
  const [replayKey, setReplayKey] = useState(0);
  const [showTiles, setShowTiles] = useState(true);

  React.useEffect(() => {
    setShowTiles(true);
    const timer = setTimeout(() => {
      setShowTiles(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, [replayKey]);

  // Generate 24 mosaic particle tiles that fly in from surrounding space
  const mosaicParticles = [
    // White block highlights
    { x: '12%', y: '48%', w: '14%', h: '8%', color: '#ffffff', tx: -80, ty: -60, rot: -25, delay: 60 },
    { x: '29%', y: '48%', w: '14%', h: '8%', color: '#ffffff', tx: -40, ty: -85, rot: 30, delay: 120 },
    { x: '46%', y: '48%', w: '14%', h: '8%', color: '#ffffff', tx: 30, ty: -90, rot: -15, delay: 180 },
    { x: '63%', y: '48%', w: '14%', h: '8%', color: '#ffffff', tx: 70, ty: -60, rot: 40, delay: 240 },
    { x: '80%', y: '48%', w: '13%', h: '8%', color: '#ffffff', tx: 110, ty: -30, rot: -30, delay: 300 },
    // Row 2
    { x: '12%', y: '58%', w: '14%', h: '8%', color: '#ffffff', tx: -95, ty: -20, rot: 20, delay: 140 },
    { x: '29%', y: '58%', w: '14%', h: '8%', color: '#ffffff', tx: -50, ty: -30, rot: -20, delay: 200 },
    { x: '46%', y: '58%', w: '14%', h: '8%', color: '#ffffff', tx: 40, ty: -25, rot: 25, delay: 260 },
    { x: '63%', y: '58%', w: '14%', h: '8%', color: '#ffffff', tx: 90, ty: 20, rot: -35, delay: 320 },
    // Row 3
    { x: '12%', y: '68%', w: '14%', h: '8%', color: '#ffffff', tx: -85, ty: 40, rot: -40, delay: 220 },
    { x: '29%', y: '68%', w: '14%', h: '8%', color: '#ffffff', tx: -30, ty: 35, rot: 15, delay: 280 },
    { x: '46%', y: '68%', w: '14%', h: '8%', color: '#ffffff', tx: 50, ty: 50, rot: -20, delay: 340 },
    // Row 4
    { x: '12%', y: '78%', w: '14%', h: '8%', color: '#ffffff', tx: -70, ty: 80, rot: 30, delay: 300 },
    { x: '29%', y: '78%', w: '14%', h: '8%', color: '#ffffff', tx: -15, ty: 95, rot: -25, delay: 360 },
    // Row 5
    { x: '12%', y: '88%', w: '14%', h: '8%', color: '#ffffff', tx: -50, ty: 120, rot: 45, delay: 380 },
    // Surrounding chromatic gradient mosaic shards
    { x: '5%', y: '10%', w: '18%', h: '12%', color: '#f97316', tx: -110, ty: -110, rot: -45, delay: 40 },
    { x: '25%', y: '18%', w: '20%', h: '14%', color: '#ea580c', tx: -50, ty: -130, rot: 35, delay: 100 },
    { x: '45%', y: '26%', w: '22%', h: '15%', color: '#ef4444', tx: 20, ty: -140, rot: -30, delay: 160 },
    { x: '65%', y: '34%', w: '20%', h: '14%', color: '#e11d48', tx: 90, ty: -110, rot: 50, delay: 220 },
    { x: '82%', y: '42%', w: '15%', h: '14%', color: '#be123c', tx: 130, ty: -70, rot: -40, delay: 280 },
    { x: '6%', y: '30%', w: '15%', h: '14%', color: '#fb923c', tx: -120, ty: -40, rot: 25, delay: 80 },
    { x: '55%', y: '70%', w: '18%', h: '14%', color: '#c026d3', tx: 100, ty: 90, rot: 60, delay: 360 },
    { x: '72%', y: '60%', w: '16%', h: '12%', color: '#be185d', tx: 120, ty: 40, rot: -50, delay: 320 },
  ];

  const handleReplay = () => {
    setShowTiles(true);
    setReplayKey((k) => k + 1);
  };

  return (
    <div
      key={replayKey}
      onClick={handleReplay}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group max-w-[85vw] aspect-square ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Radiant Ambient Radial Glow */}
      {showTiles && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/35 via-rose-500/30 to-fuchsia-600/35 blur-2xl pointer-events-none animate-mosaic-glow" />
      )}

      {/* Dazzling Flying Mosaic Fragments Layer */}
      {showTiles && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
        {mosaicParticles.map((p, idx) => (
          <div
            key={idx}
            className="absolute rounded-sm sm:rounded-md shadow-lg animate-mosaic-tile"
            style={
              {
                left: p.x,
                top: p.y,
                width: p.w,
                height: p.h,
                backgroundColor: p.color,
                boxShadow: `0 0 16px ${p.color}88, 0 0 6px ${p.color}`,
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                '--rot': `${p.rot}deg`,
                animationDelay: `${p.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      )}

      {/* Core Official LOGO.png with Dazzling Mosaic Reveal */}
      <div className="relative w-full h-full z-10 animate-dazzling-logo">
        <img
          src="/LOGO.png"
          alt="Art Fantasia Official Logo"
          width={876}
          height={895}
          className="w-full h-full object-contain drop-shadow-[0_16px_36px_rgba(244,63,94,0.45)] transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback to GitHub raw stream URL
            (e.currentTarget as HTMLImageElement).src =
              'https://github.com/artfantasia-web/new1/blob/main/LOGO.png?raw=true';
          }}
        />
      </div>

      {/* Sparkling Accent Glimmer */}
      <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#ffffff] animate-ping opacity-75 pointer-events-none" />
      <div className="absolute bottom-4 left-6 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_#f26b3b] animate-pulse opacity-80 pointer-events-none" />
    </div>
  );
};
