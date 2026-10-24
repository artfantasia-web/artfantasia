import React, { useState, useRef, useEffect } from 'react';

interface CountryItem {
  id: string;
  country: string;
  countryKo: string;
  code: string;
  projects: string[];
  highlight: string;
  coords: { x: number; y: number }; // Precise coordinates in 15% top/bottom cropped map (%)
}

// Coordinates calibrated for world map cropped 15% top and 15% bottom (visible vertical span: 15% to 85%)
const GLOBAL_PORTFOLIO_DATA: CountryItem[] = [
  {
    id: 'usa',
    country: 'USA',
    countryKo: '미국',
    code: 'us',
    projects: ['NORTHWESTERN UNIV.', 'KOTRA', 'HYUNDAI HMGMA'],
    highlight: '현대자동차그룹 메타플랜트 아메리카 & 노스웨스턴 대학교 & KOTRA 글로벌 프로젝트',
    coords: { x: 34.5, y: 32.9 }
  },
  {
    id: 'sweden',
    country: 'SWEDEN',
    countryKo: '스웨덴',
    code: 'se',
    projects: ['Keyvalve PR-FILM'],
    highlight: '유럽 산업 밸브 키밸브(Keyvalve) 글로벌 PR 필름',
    coords: { x: 61.2, y: 12.1 }
  },
  {
    id: 'czech',
    country: 'CZECH',
    countryKo: '체코',
    code: 'cz',
    projects: ['Donga ENG PR-Film'],
    highlight: '동아 ENG 유럽 현지 생산설비 홍보영상',
    coords: { x: 60.5, y: 26.9 }
  },
  {
    id: 'russia',
    country: 'RUSSIA',
    countryKo: '러시아',
    code: 'ru',
    projects: ['KOTRA'],
    highlight: 'KOTRA 글로벌 프로젝트',
    coords: { x: 66.2, y: 17.9 }
  },
  {
    id: 'vietnam',
    country: 'VIETNAM',
    countryKo: '베트남',
    code: 'vn',
    projects: ['THEDAM TVCF'],
    highlight: '베트남 현지 지상파 TVCF 제작',
    coords: { x: 77.2, y: 53.6 }
  },
  {
    id: 'china',
    country: 'CHINA',
    countryKo: '중국',
    code: 'cn',
    projects: ['PEKING UNIV.', 'TIDFORE PR-FILM', 'KOTRA'],
    highlight: '북경대학교 & 타이포어(TIDFORE) 글로벌 기업 홍보영상',
    coords: { x: 77.6, y: 31.1 }
  },
  {
    id: 'japan',
    country: 'JAPAN',
    countryKo: '일본',
    code: 'jp',
    projects: ['NGC', 'KOTRA'],
    highlight: 'KOTRA 글로벌 프로젝트 & NGC',
    coords: { x: 86.2, y: 36.0 }
  },
  {
    id: 'singapore',
    country: 'SINGAPORE',
    countryKo: '싱가포르',
    code: 'sg',
    projects: ['NANYANG Technological univ.'],
    highlight: '싱가포르 난양공과대학교(NTU) 글로벌 프로젝트',
    coords: { x: 77.8, y: 65.0 }
  },
  {
    id: 'indonesia',
    country: 'INDONESIA',
    countryKo: '인도네시아',
    code: 'id',
    projects: ['PRESIDENT VIP VIEW'],
    highlight: '인도네시아 대통령 VIP VIEW 프로젝트 시네마틱 영상',
    coords: { x: 80.2, y: 72.6 }
  }
];

const FlagImage: React.FC<{
  code: string;
  name: string;
  className?: string;
}> = ({ code, name, className = 'w-full h-full' }) => {
  return (
    <img
      src={`https://flagcdn.com/w160/${code.toLowerCase()}.png`}
      alt={`${name} 국기`}
      className={`${className} object-contain rounded-[2px] shadow-xs inline-block shrink-0 pointer-events-none select-none`}
      loading="lazy"
    />
  );
};

const SlowGlobalParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setup: subtle, slow-drifting celestial global dust particles
    const count = 38;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.16, // Very slow horizontal drift
      vy: (Math.random() - 0.5) * 0.12, // Very slow vertical drift
      r: Math.random() * 1.4 + 0.7,
      baseAlpha: Math.random() * 0.35 + 0.2,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.006 + 0.003, // Very slow breathing/twinkling
      color: Math.random() > 0.5 ? 'rgba(56, 189, 248,' : 'rgba(96, 165, 250,',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle, whisper-thin threads
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            const alpha = (1 - dist / 60) * 0.12;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.phaseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.baseAlpha + Math.sin(p.phase) * 0.15;
        ctx.fillStyle = `${p.color} ${Math.max(0.06, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
    />
  );
};

/* Dedicated Blue Particle Animation for Container Background */
const BlueParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || 800);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic blue palette: cyan, electric blue, sky blue, sapphire
    const blueColors = [
      'rgba(56, 189, 248,',  // sky-400
      'rgba(96, 165, 250,',  // blue-400
      'rgba(59, 130, 246,',  // blue-500
      'rgba(6, 182, 212,',   // cyan-500
      'rgba(147, 197, 253,', // blue-300
      'rgba(0, 212, 255,',   // bright cyan
    ];

    const count = 55;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 0.8,
      baseAlpha: Math.random() * 0.45 + 0.25,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.015 + 0.006,
      color: blueColors[Math.floor(Math.random() * blueColors.length)],
      pulseFactor: Math.random() * 0.2 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint blue constellation threads between nearby particles
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 85) {
            const alpha = (1 - dist / 85) * 0.16;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing blue particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.phaseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = Math.min(0.9, Math.max(0.12, p.baseAlpha + Math.sin(p.phase) * p.pulseFactor));

        // Soft outer glow halo for larger particles
        if (p.r > 1.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color} ${currentAlpha * 0.25})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${currentAlpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export const InternationalPortfolio: React.FC = () => {
  const [activeCountry, setActiveCountry] = useState<string>('usa');
  const mapBoxRef = useRef<HTMLDivElement>(null);

  const selected =
    GLOBAL_PORTFOLIO_DATA.find((c) => c.id === activeCountry) || GLOBAL_PORTFOLIO_DATA[0];

  return (
    <div className="mt-10 pt-6 border-t border-zinc-800/80">
      {/* Main Interactive Map & Visual Container */}
      <div className="relative rounded-2xl bg-gradient-to-b from-zinc-950 via-[#060c16] to-zinc-950 border border-blue-900/40 overflow-hidden shadow-2xl p-3 sm:p-5">
        {/* Subtle architectural background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none z-0" />

        {/* Ambient Blue Cosmic Glow Orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/12 blur-3xl pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial from-blue-900/15 via-transparent to-transparent pointer-events-none z-0" />

        {/* Animated Blue-Toned Particle Background */}
        <BlueParticleBackground />

        {/* 1. Flag Bar: Compact Width, Natural Aspect Ratio, Full Visibility */}
        <div className="w-full flex justify-center mb-3 sm:mb-4 relative z-20">
          <div className="grid grid-cols-9 gap-1.5 sm:gap-2.5 w-full max-w-[560px] sm:max-w-[620px] px-1">
            {GLOBAL_PORTFOLIO_DATA.map((item) => {
              const isCurrent = activeCountry === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveCountry(item.id)}
                  title={`${item.countryKo} (${item.country})`}
                  aria-label={`${item.countryKo} (${item.country})`}
                  className={`group relative flex items-center justify-center p-0.5 rounded-sm sm:rounded transition-all duration-200 cursor-pointer aspect-[3/2] ${
                    isCurrent
                      ? 'ring-2 ring-amber-400 bg-amber-400/10 shadow-[0_0_12px_rgba(251,191,36,0.5)] scale-105 z-10'
                      : 'opacity-75 hover:opacity-100 hover:scale-102 hover:ring-1 hover:ring-zinc-600'
                  }`}
                >
                  <FlagImage
                    code={item.code}
                    name={item.countryKo}
                    className="w-full h-full object-contain"
                  />
                  {isCurrent && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,1)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. World Map Canvas: Height reduced by 40% as requested (aspect-[1726/515]) */}
        <div
          ref={mapBoxRef}
          className="relative z-10 w-full aspect-[1726/515] min-h-[110px] sm:min-h-[140px] rounded-xl bg-black overflow-hidden border border-zinc-800/80 shadow-inner"
        >
          {/* Map Graphic */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <img
              src="/assets/aistudio/_____707466c5.jpg"
              alt="Art Fantasia International Portfolio World Map"
              className="w-full h-full object-cover select-none opacity-90"
            />
            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/40 pointer-events-none" />
          </div>

          {/* Earth Atmosphere Celestial Glow (Ambient Cosmic Pulse symbolizing Global) */}
          <div className="absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-cyan-400/15 blur-2xl pointer-events-none animate-globe-pulse" />

          {/* Ultra-Slow Moving Particles Across World Map */}
          <SlowGlobalParticles />

          {/* Top Left Watermark */}
          <div className="absolute top-2.5 left-3.5 pointer-events-none z-10 opacity-35 select-none">
            <span className="text-[9px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
              ART FANTASIA® GLOBAL EXPEDITION
            </span>
          </div>

          {/* Centered High-Visibility Country Explanation Card (Enhanced vertical proportion & reduced width) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto w-[85%] sm:w-[72%] max-w-[340px] sm:max-w-[370px] origin-center">
            {/* Popover Card Body: Metallic Frame & Crisp Shadow */}
            <div className="overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-300/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_4px_16px_rgba(0,0,0,0.4)] text-center flex flex-col items-center">
              {/* Flag & Country Header: Solid Dark Blue matching video production style (No Gradient) */}
              <div className="w-full py-2.5 px-4 bg-blue-950 flex items-center justify-center gap-2.5">
                <FlagImage
                  code={selected.code}
                  name={selected.countryKo}
                  className="w-9 h-6 sm:w-10 sm:h-6.5 rounded-xs shadow-sm"
                />
                <span className="font-black text-sm sm:text-base text-white font-['Noto_Sans_KR',sans-serif] tracking-tight">
                  {selected.countryKo}
                </span>
              </div>

              {/* Highlight Sentence in Black with Bright Metallic Silver Background */}
              <p className="py-3 sm:py-3.5 px-4 sm:px-5 text-[12px] sm:text-[13.5px] font-bold text-zinc-950 leading-relaxed font-google font-['Noto_Sans_KR',sans-serif] tracking-tight text-center w-full break-keep antialiased bg-gradient-to-b from-[#ffffff] via-[#e3e8ee] to-[#c9d3df] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.08)] border-t border-white/80">
                {selected.highlight}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
