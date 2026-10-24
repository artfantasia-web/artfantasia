import React, { useState, useRef } from 'react';
import {
  TrendingUp,
  Target,
  Share2,
  Users,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  Lock,
  FileCheck,
  EyeOff,
} from 'lucide-react';
import { StandardSectionHeader } from './StandardSectionHeader';

interface MarketingSectionProps {
  onOpenInquiry: () => void;
}

export const MarketingSection: React.FC<MarketingSectionProps> = ({ onOpenInquiry }) => {
  // Cinema Showcase Video State (Matching VideoPortfolio)
  const showcaseVideoRef = useRef<HTMLVideoElement>(null);
  const showcaseContainerRef = useRef<HTMLDivElement>(null);
  const [isShowcasePlaying, setIsShowcasePlaying] = useState(false);
  const [isShowcaseMuted, setIsShowcaseMuted] = useState(false);
  const [showcaseVolume, setShowcaseVolume] = useState(1);
  const [showcaseTime, setShowcaseTime] = useState(0);
  const [showcaseDuration, setShowcaseDuration] = useState(30);
  const [showControls, setShowControls] = useState(true);
  const [showcaseFullscreen, setShowcaseFullscreen] = useState(false);
  const controlsTimeoutRef = useRef<any>(null);

  const toggleShowcasePlay = () => {
    if (showcaseVideoRef.current) {
      if (isShowcasePlaying) {
        showcaseVideoRef.current.pause();
      } else {
        showcaseVideoRef.current.play();
      }
      setIsShowcasePlaying(!isShowcasePlaying);
    }
  };

  const toggleShowcaseMute = () => {
    if (showcaseVideoRef.current) {
      showcaseVideoRef.current.muted = !isShowcaseMuted;
      setIsShowcaseMuted(!isShowcaseMuted);
    }
  };

  const handleShowcaseVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setShowcaseVolume(val);
    if (showcaseVideoRef.current) {
      showcaseVideoRef.current.volume = val;
      showcaseVideoRef.current.muted = val === 0;
      setIsShowcaseMuted(val === 0);
    }
  };

  const handleShowcaseTimeUpdate = () => {
    if (showcaseVideoRef.current) {
      setShowcaseTime(showcaseVideoRef.current.currentTime);
    }
  };

  const handleShowcaseSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setShowcaseTime(time);
    if (showcaseVideoRef.current) {
      showcaseVideoRef.current.currentTime = time;
    }
  };

  const toggleShowcaseFullscreen = () => {
    if (!showcaseContainerRef.current) return;
    if (!document.fullscreenElement) {
      showcaseContainerRef.current.requestFullscreen().catch(() => {});
      setShowcaseFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setShowcaseFullscreen(false);
    }
  };

  const handleShowcaseMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isShowcasePlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pillars = [
    {
      num: '01',
      title: '통합 디지털 캠페인 (IMC)',
      sub: 'INTEGRATED MARKETING CAMPAIGN',
      desc: '영상, 라디오 CM, 옥외광고, 온라인 퍼포먼스를 단일한 메시지 아키텍처로 설계하여 소비자 동선을 전방위 장악합니다.',
      icon: <Target className="w-4 h-4" />,
      bgImage: '/assets/aistudio/___79e00b45.jpg',
      features: ['브랜드 포지셔닝 전략', '미디어 믹스 최적화', '온·오프라인 크로스 채널 집행']
    },
    {
      num: '02',
      title: '퍼포먼스 & 데이터 마케팅',
      sub: 'ROAS & CONVERSION OPTIMIZATION',
      desc: '정밀 오디언스 타깃팅과 크리에이티브 소재 다변화 A/B 테스트로 고객 획득 비용(CPA)을 낮추고 매출 전환을 극대화합니다.',
      icon: <TrendingUp className="w-4 h-4" />,
      bgImage: '/assets/aistudio/___d02c29fa.jpg',
      features: ['메타 / 구글 / 네이버 SA·DA', '실시간 대시보드 리포팅', '퍼널 단계별 리타깃팅']
    },
    {
      num: '03',
      title: '바이럴 숏폼 & SNS 팩토리',
      sub: 'SHORT-FORM & VIRAL LAB',
      desc: '틱톡, 유튜브 쇼츠, 인스타그램 릴스 알고리즘을 꿰뚫는 후킹 사운드와 비주얼 연출로 자발적인 바이럴 확산을 유도합니다.',
      icon: <Share2 className="w-4 h-4" />,
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      features: ['주간 숏폼 트렌드 분석', '중독성 징글/오디오 챌린지', 'UGC(사용자 제작 콘텐츠) 유도']
    },
    {
      num: '04',
      title: '인플루언서 & 브랜디드 엔터',
      sub: 'CREATOR COLLABORATION',
      desc: '단순 PPL을 넘어 브랜드 철학을 흥미진진한 콘텐츠로 승화시키는 톱 크리에이터 매칭 및 오리지널 웹 예능을 제작합니다.',
      icon: <Users className="w-4 h-4" />,
      bgImage: '/assets/aistudio/______dbdebee7.jpg',
      features: ['카테고리별 검증된 크리에이터 풀', '고감도 영상 연출팀 투입', '커머스 프로모션 연계']
    }
  ];

  return (
    <section id="marketing" className="pt-6 sm:pt-8 pb-16 sm:pb-24 border-b border-zinc-800 bg-[#09090b] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <StandardSectionHeader
          title="마케팅"
          subtitle={
            <>
              최적화된{' '}
              <span className="font-black text-amber-300 underline decoration-amber-400/60 underline-offset-4">
                소통 전략
              </span>
              을 설계하겠습니다.
            </>
          }
        />

        {/* Cinema Video Showcase: Marketing Film (Matching VideoPortfolio Design) */}
        <div className="w-full max-w-5xl mx-auto my-10 sm:my-12 relative group font-google">
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute -inset-2 rounded-2xl bg-amber-500/[0.04] blur-2xl pointer-events-none" />

          {/* Interactive Cinema Video Container */}
          <div
            ref={showcaseContainerRef}
            onMouseMove={handleShowcaseMouseMove}
            onMouseLeave={() => isShowcasePlaying && setShowControls(false)}
            className="relative rounded-lg border border-zinc-700/80 bg-zinc-950 overflow-hidden shadow-2xl select-none"
          >
            {/* Top Panel Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-[#343a42] via-[#21262d] to-[#14171b] border-b border-[#3b434e] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.9)] text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-600 border border-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.8)]" />
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-zinc-400 font-medium tracking-wider notranslate" translate="no">CODEC: H.264 / PRORES</span>
                <span className="text-zinc-100 font-bold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  00:{formatTime(showcaseTime)} <span className="text-zinc-500 font-normal">/ 00:00:30:00</span>
                </span>
              </div>
            </div>

            {/* Video Player Screen */}
            <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center group">
              <video
                ref={showcaseVideoRef}
                src="https://res.cloudinary.com/iwcoiohr/video/upload/v1792743155/ALIN.mp4"
                playsInline
                muted={isShowcaseMuted}
                preload="metadata"
                onClick={toggleShowcasePlay}
                className="w-full h-full object-cover block cursor-pointer"
                onPlay={() => {
                  setIsShowcasePlaying(true);
                  setShowControls(true);
                }}
                onPause={() => {
                  setIsShowcasePlaying(false);
                  setShowControls(true);
                }}
                onTimeUpdate={handleShowcaseTimeUpdate}
                onLoadedMetadata={() => {
                  if (showcaseVideoRef.current?.duration) {
                    setShowcaseDuration(showcaseVideoRef.current.duration);
                  }
                }}
                onEnded={() => {
                  setIsShowcasePlaying(false);
                  setShowControls(true);
                }}
              />

              {/* Cinematic Center Overlay & Play Button (Matching VideoPortfolio Standard) */}
              {!isShowcasePlaying && (
                <div
                  onClick={toggleShowcasePlay}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer z-15 bg-black/25 hover:bg-black/35 transition-colors group/overlay"
                >
                  <span
                    className="notranslate text-xs sm:text-sm font-mono tracking-wider font-bold text-amber-400 uppercase mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                    translate="no"
                  >
                    Integrated Marketing · Growth & Performance
                  </span>
                  <h3
                    className="notranslate text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-wider uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mb-6 font-apple"
                    translate="no"
                  >
                    MARKETING X-FILE
                  </h3>

                  {/* Standard Gradient Play Button */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#F15A29] via-[#E9422F] to-[#DD2426] text-white flex items-center justify-center shadow-[0_0_35px_rgba(233,66,47,0.6)] group-hover/overlay:scale-110 group-hover/overlay:shadow-[0_0_50px_rgba(233,66,47,0.85)] transition-all duration-300">
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white ml-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]" />
                  </div>

                  {/* Standard Play Description */}
                  <span className="text-xs sm:text-sm text-zinc-200 mt-4 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                    재생 버튼 또는 화면을 클릭하시면 영상을 감상하실 수 있습니다
                  </span>
                </div>
              )}

              {/* Player Controls Overlay */}
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute bottom-2 sm:bottom-3 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between gap-4 py-2 px-3.5 bg-gradient-to-b from-[#343a42]/95 via-[#21262d]/95 to-[#14171b]/95 backdrop-blur-md rounded border border-[#3b434e] ring-1 ring-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.9)] z-20 transition-opacity duration-300 ${
                  showControls || !isShowcasePlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleShowcasePlay}
                    className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 cursor-pointer"
                    aria-label={isShowcasePlaying ? '일시 정지' : '재생'}
                  >
                    {isShowcasePlaying ? <Pause className="w-4 h-4 fill-zinc-200" /> : <Play className="w-4 h-4 fill-zinc-200" />}
                  </button>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={toggleShowcaseMute}
                      className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 flex items-center gap-1.5 cursor-pointer"
                      aria-label={isShowcaseMuted ? '음소거 해제' : '음소거'}
                    >
                      {isShowcaseMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-zinc-300" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isShowcaseMuted ? 0 : showcaseVolume}
                      onChange={handleShowcaseVolumeChange}
                      className="w-14 sm:w-20 h-1.5 bg-[#0d0f12] rounded-lg cursor-pointer accent-zinc-200 border border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"
                      aria-label="볼륨 조절"
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono text-zinc-200 font-semibold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {formatTime(showcaseTime)} / {formatTime(showcaseDuration)}
                  </span>
                </div>

                {/* Progress Bar Scrubber */}
                <div className="flex-1 mx-2 sm:mx-4 hidden md:block">
                  <input
                    type="range"
                    min="0"
                    max={showcaseDuration || 100}
                    step="0.1"
                    value={showcaseTime}
                    onChange={handleShowcaseSeek}
                    className="w-full h-1.5 bg-[#0d0f12] rounded-lg cursor-pointer accent-zinc-200 border border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"
                    aria-label="재생 구간 탐색"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleShowcaseFullscreen}
                    className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 cursor-pointer"
                    aria-label={showcaseFullscreen ? '전체화면 종료' : '전체화면'}
                  >
                    {showcaseFullscreen ? <Minimize className="w-4 h-4 text-zinc-300" /> : <Maximize className="w-4 h-4 text-zinc-300" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Production Pipeline & Architecture (Harmonized with VideoPortfolio Design) */}
        <div className="w-full my-8 sm:my-10 pt-6 border-t border-zinc-800/80 font-google">
          {/* Narrative Headline */}
          <div className="mb-6 text-center flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-google text-center">
              아트판타지아의 마케팅플로우는
            </h3>
            <p className="mt-2.5 text-sm sm:text-base font-semibold text-amber-400 font-google text-center flex items-center justify-center gap-2 flex-wrap">
              <span className="text-amber-400 font-bold shrink-0">◉</span>
              <span>
                콘텐츠 제작에서 디지털 퍼포먼스 전환까지 <span className="font-extrabold text-amber-300 underline decoration-amber-400/60 underline-offset-4">최적의 해답</span>을 제공해 드립니다.
              </span>
            </p>
          </div>

          {/* 1. Marketing 4 Pillars Grid (Matching Budget Classes / Process Flow Cards) */}
          <div className="my-6 font-google">
            <div className="flex items-center gap-2.5 mb-3.5 sm:mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
              <span className="text-[15px] sm:text-[17.5px] font-bold font-google text-zinc-100 tracking-normal">
                마케팅 4대 핵심 전략 솔루션
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 relative font-google">
              {pillars.map((p, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl bg-zinc-950/85 border border-zinc-800/80 hover:border-blue-400/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.18)] flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    {/* Top Thumbnail Image Container with Blue Tint & Hover Zoom (Matching VideoPortfolio) */}
                    <div className="h-24 rounded-lg overflow-hidden relative mb-3 bg-zinc-900 border border-zinc-800/50">
                      <img
                        src={p.bgImage}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-blue-900/25 transition-colors duration-300" />
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors leading-snug font-google">
                        {p.title}
                      </h4>
                      <div className="w-7 h-7 rounded-lg bg-blue-950/40 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 ml-2 group-hover:scale-110 transition-transform">
                        {p.icon}
                      </div>
                    </div>

                    <p className="text-[12.5px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal font-google mb-3">
                      {p.desc}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-zinc-800/60 font-google">
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11.5px] text-zinc-400 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Marketing Systems & Strict Confidentiality Principle (철저한 대외비 및 비공개 원칙) */}
          <div className="my-6 pt-5 border-t border-zinc-800/60 font-google">
            {/* Header: 제공 시스템 안내 */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.95)] ring-2 ring-amber-300/40" />
              <span className="text-[15px] sm:text-[17.5px] font-bold font-google text-zinc-100 tracking-normal">
                마케팅 기획 운영 시스템
              </span>
            </div>

            {/* Two Systems Grid: ◉ 통합 시스템, ◉ 맞춤형 시스템 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-5 font-google">
              {/* Card 1: ◉ 통합 시스템 */}
              <div className="group relative p-6 sm:p-7 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 hover:border-amber-400/80 hover:shadow-[0_12px_32px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative z-10">
                  <h4 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-amber-200 transition-colors flex items-center gap-2 mb-3">
                    <span className="text-amber-400">◉</span>
                    <span>통합 시스템</span>
                  </h4>

                  <p className="text-sm sm:text-[14.5px] text-zinc-300 leading-relaxed font-normal">
                    영상 제작, 라디오 CM, 바이럴 숏폼, 퍼포먼스 광고 및 크로스 채널 집행까지 마케팅 전 영역을 유기적으로 연계하여 집행하는 전방위 통합 마케팅 시스템입니다.
                  </p>
                </div>
              </div>

              {/* Card 2: ◉ 맞춤형 시스템 */}
              <div className="group relative p-6 sm:p-7 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 hover:border-amber-400/80 hover:shadow-[0_12px_32px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative z-10">
                  <h4 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-amber-200 transition-colors flex items-center gap-2 mb-3">
                    <span className="text-amber-400">◉</span>
                    <span>맞춤형 시스템</span>
                  </h4>

                  <p className="text-sm sm:text-[14.5px] text-zinc-300 leading-relaxed font-normal">
                    기업의 특정 목표, 한정된 예산 규모, 타깃 시장에 맞춰 최적의 매체와 핵심 전략만을 정밀하게 선별·집중하여 투자 대비 최대 효과를 이끌어내는 고효율 맞춤형 시스템입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Strict Confidentiality Pledge Monument (절대 공개불가 & 신뢰의 원칙) - Compact Red Edition */}
            <div className="relative rounded-2xl bg-gradient-to-br from-zinc-950 via-[#1a0a0d] to-zinc-950 border border-red-500/40 hover:border-red-500/60 px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 shadow-[0_12px_45px_rgba(0,0,0,0.85)] overflow-hidden font-google my-4 transition-all duration-300">
              {/* Ambient Crimson/Red Glow */}
              <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-red-600/[0.08] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-4 right-6 opacity-10 pointer-events-none">
                <Lock className="w-24 h-24 text-red-500" />
              </div>

              <div className="relative z-10 max-w-4xl space-y-2.5">
                <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white tracking-tight leading-snug font-google">
                  아트판타지아의 마케팅기획은<br className="sm:hidden" />
                  <span className="text-red-400 font-black"> 철저한 대외비</span>로 진행되며<br />
                  클라이언트 외에는 <span className="underline decoration-red-500/70 underline-offset-4 text-white">절대 공개불가를 원칙</span>으로 합니다.
                </h3>

                {/* Core Pledge Highlight Box - 30% reduced vertical height */}
                <div className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-red-950/35 border border-red-500/40 shadow-inner">
                  <p className="text-sm sm:text-base md:text-[17px] font-black text-white leading-snug font-google drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    "고객님의 광고전략 비공개는 세상이 무너져도 지켜야 할 약속이기 때문입니다."
                  </p>
                </div>

                {/* Trust Pillars Checklist - Compact vertical padding */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 py-2 px-3 rounded-lg bg-zinc-900/70 border border-red-900/30">
                    <FileCheck className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-apple font-normal text-[13px] sm:text-[14px] text-white tracking-tight">1:1 전담 비밀유지계약(NDA) 체결</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 py-2 px-3 rounded-lg bg-zinc-900/70 border border-red-900/30">
                    <Lock className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-apple font-normal text-[13px] sm:text-[14px] text-white tracking-tight">전략 기획안 및 데이터 철저한 암호화</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 py-2 px-3 rounded-lg bg-zinc-900/70 border border-red-900/30">
                    <EyeOff className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-apple font-normal text-[13px] sm:text-[14px] text-white tracking-tight">경쟁사 및 제3자 포트폴리오 노출 전면 배제</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Inquiry Gateway Banner (Matching VideoPortfolio Minimalist White Edition) */}
          <div
            onClick={onOpenInquiry}
            className="group relative p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md my-6 cursor-pointer font-google transition-all duration-200"
          >
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 text-center lg:text-left">
              <div className="flex-1 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                  <span>비공개 맞춤형 마케팅 전략 상담</span>
                </div>
                
                <h4 className="text-base sm:text-lg lg:text-[20px] font-bold text-zinc-900 tracking-tight leading-snug">
                  영상·오디오 제작과 <span className="font-extrabold text-zinc-950">디지털 퍼포먼스 마케팅</span>의 원스톱 결합 솔루션
                </h4>
                
                <p className="text-xs sm:text-[13.5px] text-zinc-500 leading-relaxed font-normal">
                  최적화된 마케팅 방식을 제안해 드리며, 기획부터 온·오프라인 집행까지 철저한 비밀 유지 하에 <strong className="font-semibold text-zinc-800">100% 책임 진행</strong>해 드립니다.
                </p>
              </div>

              <div className="shrink-0 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenInquiry();
                  }}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-zinc-950 hover:bg-amber-500 hover:text-black rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg group-hover:scale-105 cursor-pointer font-google"
                >
                  <span>비공개 마케팅 제안서 요청</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
