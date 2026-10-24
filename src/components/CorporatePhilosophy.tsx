import React, { useState, useEffect } from 'react';
import {
  Zap,
  Cpu,
  Compass,
} from 'lucide-react';
import { SectionEditorialHeader } from './SectionEditorialHeader';

interface Pillar {
  key: string;
  prefix: string; // 'A'
  rest: string;   // 'RT', 'CTION', 'I', 'MBITION'
  korean: string;
  enSub: string;
  icon: React.ReactNode;
}

export const CorporatePhilosophy: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const pillars: Pillar[] = [
    {
      key: 'art',
      prefix: 'A',
      rest: 'RT',
      korean: '진심을 담은 영상과 음악 제작',
      enSub: 'CINEMATIC ARTISTRY',
      icon: (
        <svg
          className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Dual Film Reels */}
          <circle cx="7" cy="5" r="2.5" />
          <circle cx="14" cy="5" r="2.5" />
          {/* Movie Camera Body */}
          <rect x="3" y="9" width="13" height="11" rx="2" />
          {/* Movie Camera Lens */}
          <polygon points="16 12 22 8.5 22 17.5 16 14" />
        </svg>
      ),
    },
    {
      key: 'action',
      prefix: 'A',
      rest: 'CTION',
      korean: '100% 책임 실행',
      enSub: 'RESPONSIBLE ACTION',
      icon: <Zap className="w-4 h-4 text-zinc-300 group-hover:text-white" />,
    },
    {
      key: 'ai',
      prefix: 'A',
      rest: 'I',
      korean: 'AI 기술 혁신',
      enSub: 'AI TECHNOLOGIES',
      icon: <Cpu className="w-4 h-4 text-zinc-300 group-hover:text-white" />,
    },
    {
      key: 'ambition',
      prefix: 'A',
      rest: 'MBITION',
      korean: '원대한 글로벌 비전',
      enSub: 'GLOBAL AMBITION',
      icon: <Compass className="w-4 h-4 text-zinc-300 group-hover:text-white" />,
    },
  ];

  // Automatic gentle rotation between active pillars
  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pillars.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [autoRotate, pillars.length]);

  return (
    <div className="mt-16 pt-10 border-t-2 border-zinc-800/80 font-apple relative selection:bg-white selection:text-black overflow-hidden">
      {/* Top Editorial Label - Art Fantasia Mission */}
      <SectionEditorialHeader
        title="아트판타지아의 미션"
        subtitle="PHILOSOPHY & 4 CORE PILLARS"
      />

      {/* 1. Subtle Global Latitude/Longitude Ambient Orbit Animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1100px] h-[600px] sm:h-[750px] pointer-events-none overflow-hidden opacity-30 select-none">
        <svg viewBox="0 0 1000 800" className="w-full h-full animate-globe-pulse" fill="none">
          {/* Rotating Globe Orbital Coordinates Ring */}
          <g className="animate-globe-orbit origin-center">
            {/* Concentric Longitude & Latitude Arcs */}
            <ellipse cx="500" cy="400" rx="460" ry="280" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" strokeDasharray="4 8" />
            <ellipse cx="500" cy="400" rx="380" ry="220" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
            <ellipse cx="500" cy="400" rx="290" ry="160" stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="6 10" />
            <ellipse cx="500" cy="400" rx="190" ry="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <ellipse cx="500" cy="400" rx="90" ry="45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 4" />

            {/* Meridian Cross-Axes */}
            <line x1="40" y1="400" x2="960" y2="400" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="8 12" />
            <line x1="500" y1="50" x2="500" y2="750" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="8 12" />

            {/* Orbital Satellite Node Dots */}
            <circle cx="500" cy="120" r="3" fill="rgba(255,255,255,0.6)" />
            <circle cx="880" cy="400" r="3.5" fill="rgba(255,255,255,0.7)" />
            <circle cx="500" cy="680" r="3" fill="rgba(255,255,255,0.6)" />
            <circle cx="120" cy="400" r="3.5" fill="rgba(255,255,255,0.7)" />
            <circle cx="770" cy="240" r="2.5" fill="rgba(255,255,255,0.5)" />
            <circle cx="230" cy="560" r="2.5" fill="rgba(255,255,255,0.5)" />
          </g>

          {/* Central Atmospheric Radial Vignette */}
          <circle cx="500" cy="400" r="320" fill="url(#global-glow)" />
          <defs>
            <radialGradient id="global-glow" cx="500" cy="400" r="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.01" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">

        {/* 1. Monumental Typographic 'A CLASS' Stage (Refined Luxury Silver, +8% Scale) */}
        <div className="relative mb-3 flex flex-col items-center">
          {/* Subtle Concentric Orbital Hairlines */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-72 sm:h-80 rounded-full border border-white/[0.08] pointer-events-none animate-spin-slow"
            style={{ animationDuration: '45s' }}
          />

          {/* Luxury 'A CLASS' Monogram Container */}
          <div
            onClick={() => {
              setAutoRotate(false);
              setActiveIndex((prev) => (prev + 1) % pillars.length);
            }}
            className="relative group cursor-pointer select-none flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Soft Ambient Gold/Silver Halo */}
            <div className="absolute -inset-4 rounded-3xl bg-amber-400/[0.08] blur-2xl group-hover:bg-amber-400/[0.14] transition-all duration-500" />

            {/* Architectural Monogram Plaque */}
            <div className="relative px-10 sm:px-16 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-zinc-900/95 to-zinc-950/98 border-2 border-zinc-700/80 hover:border-amber-400/60 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(251,191,36,0.1)] flex flex-col items-center justify-center transition-all duration-300">
              <span className="inline-flex items-baseline gap-3 sm:gap-4 leading-none notranslate" translate="no">
                {/* Radiant Pale Gold Accent 'A' */}
                <span className="text-[58px] sm:text-[72px] md:text-[84px] font-black font-apple tracking-tight leading-none bg-gradient-to-b from-[#FFFDF5] via-[#F5E6BF] to-[#D4B77D] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(245,230,191,0.45)] notranslate" translate="no">
                  A
                </span>
                {/* Pure White / Lustrous Silver 'CLASS' */}
                <span className="text-[26px] sm:text-[32px] md:text-[38px] font-black font-apple tracking-wider leading-none text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.3)] notranslate" translate="no">
                  CLASS
                </span>
              </span>

              {/* Official ArtFantasia Brand Logo Image */}
              <img
                src="/01lo.png"
                alt="ArtFantasia"
                className="h-5 sm:h-5.5 md:h-6 w-auto object-contain mt-1.5 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://github.com/artfantasia-web/new1/blob/main/01lo.png?raw=true';
                }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Branching Optical Lines (A CLASS -> 4 Pillars) */}
        {/* Thicker 2px conduit wires with bright silver light pulses */}
        <div className="w-full max-w-5xl px-4 sm:px-8 -my-1 hidden sm:block relative z-0 pointer-events-none">
          <svg viewBox="0 0 1000 70" className="w-full h-14 md:h-18 overflow-visible" fill="none">
            {/* Base Outline Tracks (Thicker 1.8px) */}
            <path d="M 500 0 C 500 42, 125 32, 125 70" stroke="rgba(255,255,255,0.14)" strokeWidth="1.8" />
            <path d="M 500 0 C 500 38, 375 28, 375 70" stroke="rgba(255,255,255,0.14)" strokeWidth="1.8" />
            <path d="M 500 0 C 500 38, 625 28, 625 70" stroke="rgba(255,255,255,0.14)" strokeWidth="1.8" />
            <path d="M 500 0 C 500 42, 875 32, 875 70" stroke="rgba(255,255,255,0.14)" strokeWidth="1.8" />

            {/* Glowing Silver/Amber Filament Flow */}
            <path
              d="M 500 0 C 500 42, 125 32, 125 70"
              stroke={activeIndex === 0 ? '#fbbf24' : '#ffffff'}
              strokeWidth={activeIndex === 0 ? '2.8' : '1.8'}
              strokeDasharray="6 10"
              className={`animate-energy-flow transition-all duration-300 ${
                activeIndex === 0 ? 'opacity-90 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'opacity-25'
              }`}
            />
            <path
              d="M 500 0 C 500 38, 375 28, 375 70"
              stroke={activeIndex === 1 ? '#fbbf24' : '#ffffff'}
              strokeWidth={activeIndex === 1 ? '2.8' : '1.8'}
              strokeDasharray="6 10"
              className={`animate-energy-flow transition-all duration-300 ${
                activeIndex === 1 ? 'opacity-90 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'opacity-25'
              }`}
            />
            <path
              d="M 500 0 C 500 38, 625 28, 625 70"
              stroke={activeIndex === 2 ? '#fbbf24' : '#ffffff'}
              strokeWidth={activeIndex === 2 ? '2.8' : '1.8'}
              strokeDasharray="6 10"
              className={`animate-energy-flow transition-all duration-300 ${
                activeIndex === 2 ? 'opacity-90 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'opacity-25'
              }`}
            />
            <path
              d="M 500 0 C 500 42, 875 32, 875 70"
              stroke={activeIndex === 3 ? '#fbbf24' : '#ffffff'}
              strokeWidth={activeIndex === 3 ? '2.8' : '1.8'}
              strokeDasharray="6 10"
              className={`animate-energy-flow transition-all duration-300 ${
                activeIndex === 3 ? 'opacity-90 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'opacity-25'
              }`}
            />

            {/* Center Origin Node */}
            <circle cx="500" cy="2" r="3" fill="#ffffff" />
            {/* Terminal Indicators */}
            <circle cx="125" cy="68" r={activeIndex === 0 ? '4' : '2.5'} fill={activeIndex === 0 ? '#fbbf24' : '#ffffff'} className="transition-all" />
            <circle cx="375" cy="68" r={activeIndex === 1 ? '4' : '2.5'} fill={activeIndex === 1 ? '#fbbf24' : '#ffffff'} className="transition-all" />
            <circle cx="625" cy="68" r={activeIndex === 2 ? '4' : '2.5'} fill={activeIndex === 2 ? '#fbbf24' : '#ffffff'} className="transition-all" />
            <circle cx="875" cy="68" r={activeIndex === 3 ? '4' : '2.5'} fill={activeIndex === 3 ? '#fbbf24' : '#ffffff'} className="transition-all" />
          </svg>
        </div>

        {/* 2. Typographic 4 Pillars Grid (High Readability & Luxury Aesthetics) */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5 relative z-10">
          {pillars.map((pillar, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={pillar.key}
                onClick={() => {
                  setAutoRotate(false);
                  setActiveIndex(idx);
                }}
                onMouseEnter={() => {
                  setActiveIndex(idx);
                }}
                className={`relative px-5 sm:px-6 py-4 sm:py-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between text-left overflow-hidden backdrop-blur-md group ${
                  isActive
                    ? 'bg-zinc-900/98 border-2 border-amber-400/90 shadow-[0_0_35px_rgba(251,191,36,0.18)] scale-[1.02] z-10'
                    : 'bg-zinc-950/85 border-2 border-zinc-700/80 hover:border-amber-400/50 hover:bg-zinc-900/60'
                }`}
              >
                {/* Active Top Hairline Indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[3px] transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 opacity-100 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'opacity-0'
                  }`}
                />

                {/* Numbering & Icon Badge */}
                <div className="relative z-10 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm notranslate" translate="no">
                    <span className={isActive ? 'text-amber-400 font-bold' : 'text-zinc-400 font-medium'}>
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono">/ 04</span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                      isActive
                        ? 'bg-amber-400/15 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                        : 'bg-zinc-900/90 border-zinc-700 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-500'
                    }`}
                  >
                    {pillar.icon}
                  </div>
                </div>

                {/* Typographic Title with Soft Pale Gold Accent 'A' */}
                <div className="relative z-10 my-1">
                  <div className="flex items-baseline font-apple tracking-tight leading-none mb-2 notranslate" translate="no">
                    <span className="text-[36px] sm:text-[44px] font-black bg-gradient-to-b from-[#FFFDF5] via-[#F5E6BF] to-[#D4B77D] bg-clip-text text-transparent leading-none drop-shadow-[0_0_14px_rgba(245,230,191,0.4)] notranslate" translate="no">
                      {pillar.prefix}
                    </span>
                    <span
                      className={`text-[28px] sm:text-[34px] font-bold tracking-tight transition-colors duration-300 leading-none notranslate ${
                        isActive
                          ? 'text-white'
                          : 'text-zinc-400 group-hover:text-zinc-200'
                      }`}
                      translate="no"
                    >
                      {pillar.rest}
                    </span>
                  </div>

                  {/* Clean Korean Subtitle - High Readability */}
                  <div className={`text-[13.5px] sm:text-[15px] font-bold tracking-tight leading-snug transition-colors duration-300 font-['Noto_Sans_KR',sans-serif] ${
                    isActive ? 'text-white drop-shadow-sm' : 'text-zinc-200 group-hover:text-white'
                  }`}>
                    {pillar.korean}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Convergence Conduits (4 Pillars -> Slogan Banner) */}
        <div className="w-full max-w-5xl px-4 sm:px-8 -my-1 hidden sm:block relative z-0 pointer-events-none">
          <svg viewBox="0 0 1000 50" className="w-full h-10 md:h-14 overflow-visible" fill="none">
            {/* Base Wire Tracks (Thicker 1.8px) */}
            <path d="M 125 0 C 125 28, 500 22, 500 50" stroke="rgba(255,255,255,0.14)" strokeWidth="1.8" />
            <path d="M 375 0 C 375 22, 500 22, 500 50" stroke="rgba(255,255,255,0.14)" strokeWidth="1.8" />
            <path d="M 625 0 C 625 22, 500 22, 500 50" stroke="rgba(255,255,255,0.14)" strokeWidth="1.8" />
            <path d="M 875 0 C 875 28, 500 22, 500 50" stroke="rgba(255,255,255,0.14)" strokeWidth="1.8" />

            {/* Glowing Silver/Amber Live Beams */}
            <path
              d="M 125 0 C 125 28, 500 22, 500 50"
              stroke={activeIndex === 0 ? '#fbbf24' : '#ffffff'}
              strokeWidth={activeIndex === 0 ? '2.8' : '1.8'}
              strokeDasharray="6 10"
              className={`animate-energy-flow ${activeIndex === 0 ? 'opacity-90 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'opacity-25'}`}
            />
            <path
              d="M 375 0 C 375 22, 500 22, 500 50"
              stroke={activeIndex === 1 ? '#fbbf24' : '#ffffff'}
              strokeWidth={activeIndex === 1 ? '2.8' : '1.8'}
              strokeDasharray="6 10"
              className={`animate-energy-flow ${activeIndex === 1 ? 'opacity-90 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'opacity-25'}`}
            />
            <path
              d="M 625 0 C 625 22, 500 22, 500 50"
              stroke={activeIndex === 2 ? '#fbbf24' : '#ffffff'}
              strokeWidth={activeIndex === 2 ? '2.8' : '1.8'}
              strokeDasharray="6 10"
              className={`animate-energy-flow ${activeIndex === 2 ? 'opacity-90 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'opacity-25'}`}
            />
            <path
              d="M 875 0 C 875 28, 500 22, 500 50"
              stroke={activeIndex === 3 ? '#fbbf24' : '#ffffff'}
              strokeWidth={activeIndex === 3 ? '2.8' : '1.8'}
              strokeDasharray="6 10"
              className={`animate-energy-flow ${activeIndex === 3 ? 'opacity-90 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'opacity-25'}`}
            />

            {/* Target Central Convergence Node */}
            <circle cx="500" cy="48" r="3.5" fill={activeIndex !== -1 ? '#fbbf24' : '#ffffff'} />
          </svg>
        </div>

        {/* 3. Refined Slogan Banner - High Readability & Luxury Aesthetics */}
        <div className="w-full mt-2 py-4.5 sm:py-5 px-6 sm:px-10 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/98 border border-zinc-700/80 hover:border-amber-400/50 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(251,191,36,0.06)] relative overflow-hidden group transition-all duration-300">
          {/* Subtle Golden Hairline Top Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

          {/* Subtitle: High contrast and crystal-clear readability */}
          <p className="relative z-10 text-[13.5px] sm:text-[15.5px] md:text-[17px] font-medium text-zinc-200 tracking-tight leading-relaxed max-w-2xl mx-auto drop-shadow-sm font-['Noto_Sans_KR',sans-serif]">
            예술을 향한 끝없는 열망 <span className="text-amber-400 mx-1.5 font-bold">·</span> AI라는 혁신 <span className="text-amber-400 mx-1.5 font-bold">·</span> 진심을 담은 실천
          </p>

          {/* Core Headline: Striking White & Radiant Amber A-Class */}
          <h2 className="relative z-10 text-[18px] sm:text-[22px] md:text-[25px] font-black tracking-tight text-white mt-1.5 sm:mt-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] font-['Noto_Sans_KR',sans-serif]">
            <span className="bg-gradient-to-r from-[#FFFDF5] via-[#F5E6BF] to-[#D4B77D] bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(245,230,191,0.4)] mr-1.5">
              A클래스
            </span>
            를 향한 끝없는 도전
          </h2>
        </div>
      </div>
    </div>
  );
};
