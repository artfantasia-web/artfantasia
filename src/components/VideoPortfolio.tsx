import React, { useState, useRef } from 'react';
import { VIDEO_PROJECTS } from '../data/content';
import { VideoProject, VideoCategory } from '../types';
import { Play, Pause, Volume2, VolumeX, Maximize, X, Award, Clock, CheckCircle2, ArrowUpRight, Youtube, Lock, Sparkles, Film, Tv, Clapperboard, Bot, Share2, Check } from 'lucide-react';
import { StandardSectionHeader } from './StandardSectionHeader';
import { useLanguage } from '../context/LanguageContext';

interface VideoPortfolioProps {
  onOpenInquiry?: () => void;
}

const PRODUCTION_FLOW_PLANS = [
  {
    id: 'ai',
    title: 'AI 영상 제작',
    en: 'AI CINEMA & MUSIC',
    desc: '생성형 AI 비주얼과 자체 AI 사운드가 결합된 차세대 혁신 영상',
    icon: <Bot className="w-5 h-5 text-amber-300" />,
    badge: 'INNOVATION',
  },
  {
    id: 'pr',
    title: '홍보영상',
    en: 'CORPORATE PR',
    desc: '기업·공공기관·지자체의 핵심 가치를 담은 공식 홍보영상',
    icon: <Film className="w-5 h-5 text-amber-300" />,
    badge: 'ENTERPRISE',
  },
  {
    id: 'brand',
    title: '브랜드필름',
    en: 'BRAND FILM',
    desc: '감각적 미장센과 독창적 스토리텔링으로 브랜드의 영혼을 담는 필름',
    icon: <Clapperboard className="w-5 h-5 text-amber-300" />,
    badge: 'CINEMATIC',
  },
  {
    id: 'tvc',
    title: 'TVC 광고',
    en: 'TVC BROADCAST',
    desc: '지상파·종편·케이블 방송 송출 규격 및 정식 심의 완료 방송 광고',
    icon: <Tv className="w-5 h-5 text-amber-300" />,
    badge: 'BROADCAST',
  },
  {
    id: 'youtube',
    title: '유튜브 콘텐츠',
    en: 'YOUTUBE & VIRAL',
    desc: 'MZ세대 타깃 알고리즘 최적화 바이럴 및 숏폼·롱폼 영상 콘텐츠',
    icon: <Youtube className="w-5 h-5 text-amber-300" />,
    badge: 'DIGITAL TREND',
  },
];

const BUDGET_CLASSES = [
  {
    key: 'S',
    title: 'S클래스',
    titleEn: 'S-CLASS',
    range: '2억원 이상',
    rangeEn: 'KRW 200M or more',
    badge: 'S-CLASS',
    desc: '대규모 글로벌 캠페인 · 프리미엄 지상파 TVCF · 하이엔드 시네마틱',
    descEn: 'Large-scale global campaigns · Premium TVCF · High-end cinematic',
    bgImage: '/assets/aistudio/s____a8ecfc54.jpg',
  },
  {
    key: 'A',
    title: 'A클래스',
    titleEn: 'A-CLASS',
    range: '2억원 ~ 1억원',
    rangeEn: 'KRW 200M ~ 100M',
    badge: 'A-CLASS',
    desc: '브랜드 메인 캠페인 · 메인 TVCF · 고사양 3D VFX · 대형 프로젝트',
    descEn: 'Brand main campaigns · Main TVCF · High-end 3D VFX · Large projects',
    bgImage: '/assets/aistudio/vfx___7d3c38ab.jpg',
  },
  {
    key: 'B',
    title: 'B클래스',
    titleEn: 'B-CLASS',
    range: '1억원 ~ 5천만원',
    rangeEn: 'KRW 100M ~ 50M',
    badge: 'B-CLASS',
    desc: '기업 메인 필름 · 디지털 캠페인 · 브랜드 영상',
    descEn: 'Corporate main film · Digital campaigns · Brand videos',
    bgImage: '/assets/aistudio/_____a15e6fd6.jpg',
  },
  {
    key: 'C',
    title: 'C클래스',
    titleEn: 'C-CLASS',
    range: '5천만원 ~ 1천만원',
    rangeEn: 'KRW 50M ~ 10M',
    badge: 'C-CLASS',
    desc: '디지털 바이럴 영상 · 브랜드 필름 · 퍼포먼스 광고',
    descEn: 'Digital viral video · Brand film · Performance ads',
    bgImage: '/assets/aistudio/b_1381a5d3.jpg',
  },
  {
    key: 'Custom',
    title: '맞춤형 클래스',
    titleEn: 'CUSTOM CLASS',
    range: '실속형 / 스타트업',
    rangeEn: 'KRW Under 10M / Startup',
    badge: 'CUSTOM CLASS',
    desc: '스타트업 및 실속형 맞춤 기획 · 실무 맞춤형 가성비 패키지',
    descEn: 'Startup & cost-effective package · Practical custom planning',
    bgImage: '/assets/aistudio/____be064755.jpg',
  },
];

export const VideoPortfolio: React.FC<VideoPortfolioProps> = ({ onOpenInquiry }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('all');
  const [activeProject, setActiveProject] = useState<VideoProject | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyProjectLink = (project: VideoProject, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}#video-${project.id}`);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Showcase Cinema Video states (Exact playback style matching AboutSection)
  const showcaseVideoRef = useRef<HTMLVideoElement | null>(null);
  const showcaseContainerRef = useRef<HTMLDivElement | null>(null);
  const [isShowcasePlaying, setIsShowcasePlaying] = useState<boolean>(false);
  const [isShowcaseMuted, setIsShowcaseMuted] = useState<boolean>(false);
  const [showcaseVolume, setShowcaseVolume] = useState<number>(0.85);
  const [showcaseProgress, setShowcaseProgress] = useState<number>(0);
  const [showcaseTime, setShowcaseTime] = useState<number>(0);
  const [showcaseDuration, setShowcaseDuration] = useState<number>(90);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShowcaseTimeUpdate = () => {
    const v = showcaseVideoRef.current;
    if (!v) return;
    setShowcaseTime(v.currentTime);
    const dur = v.duration || 0;
    setShowcaseDuration(dur);
    if (dur > 0) {
      setShowcaseProgress((v.currentTime / dur) * 100);
    }
  };

  const toggleShowcasePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const v = showcaseVideoRef.current;
    if (!v) return;
    if (isShowcasePlaying) {
      v.pause();
      setIsShowcasePlaying(false);
    } else {
      v.muted = isShowcaseMuted;
      v.play().then(() => setIsShowcasePlaying(true)).catch(() => {});
    }
  };

  const toggleShowcaseMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = showcaseVideoRef.current;
    if (!v) return;
    const nextMuted = !isShowcaseMuted;
    v.muted = nextMuted;
    setIsShowcaseMuted(nextMuted);
    if (!nextMuted) {
      if (showcaseVolume === 0) {
        setShowcaseVolume(0.85);
        v.volume = 0.85;
      } else {
        v.volume = showcaseVolume;
      }
    }
  };

  const handleShowcaseVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setShowcaseVolume(val);
    const v = showcaseVideoRef.current;
    if (v) {
      v.volume = val;
      if (val === 0) {
        v.muted = true;
        setIsShowcaseMuted(true);
      } else if (isShowcaseMuted) {
        v.muted = false;
        setIsShowcaseMuted(false);
      }
    }
  };

  const handleShowcaseScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const v = showcaseVideoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const dur = v.duration && !isNaN(v.duration) && v.duration > 0 ? v.duration : (showcaseDuration || 90);
    const target = ratio * dur;
    v.currentTime = target;
    setShowcaseTime(target);
  };

  const handleShowcaseMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isShowcasePlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleScreenInteraction = (e?: React.MouseEvent | React.TouchEvent) => {
    if (isShowcasePlaying) {
      if (!showControls) {
        if (e) e.stopPropagation();
        handleShowcaseMouseMove();
      } else {
        toggleShowcasePlay(e as React.MouseEvent);
      }
    } else {
      toggleShowcasePlay(e as React.MouseEvent);
    }
  };

  const handleShowcaseFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showcaseContainerRef.current) return;
    if (!document.fullscreenElement) {
      showcaseContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const categories: { id: VideoCategory; label: string; count: number }[] = [
    { id: 'all', label: '전체 (ALL)', count: VIDEO_PROJECTS.length },
    { id: 'commercial', label: 'TVCF / 광고영상', count: VIDEO_PROJECTS.filter(p => p.category === 'commercial').length },
    { id: 'corporate', label: '기업 & 공공홍보', count: VIDEO_PROJECTS.filter(p => p.category === 'corporate').length },
    { id: 'viral', label: '캠페인 / 바이럴', count: VIDEO_PROJECTS.filter(p => p.category === 'viral').length }
  ];

  const filteredProjects = selectedCategory === 'all'
    ? VIDEO_PROJECTS
    : VIDEO_PROJECTS.filter(p => p.category === selectedCategory);

  return (
    <section id="video" className="pt-6 sm:pt-8 pb-16 sm:pb-24 border-b border-zinc-800 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <StandardSectionHeader
          title={language === 'ko' ? "영상제작" : "Film & Video"}
          subtitle={
            language === 'ko' ? (
              <>
                기획, 제작, A/S까지...{' '}
                <span className="font-black text-amber-300 underline decoration-amber-400/60 underline-offset-4">
                  100% 책임 진행
                </span>
              </>
            ) : (
              "Planning, production, to after-care... 100% guaranteed delivery"
            )
          }
        />

        {/* Cinema Video Showcase: "Change the Game" */}
        <div className="w-full max-w-5xl mx-auto my-12 relative group">
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute -inset-2 rounded-2xl bg-amber-500/[0.04] blur-2xl pointer-events-none" />

          {/* Interactive Cinema Video Container - Matching AboutSection */}
          <div
            ref={showcaseContainerRef}
            onMouseMove={handleShowcaseMouseMove}
            onMouseEnter={handleShowcaseMouseMove}
            onTouchStart={handleShowcaseMouseMove}
            onTouchMove={handleShowcaseMouseMove}
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
                  00:{formatTime(showcaseTime)} <span className="text-zinc-500 font-normal">/ 00:01:30:00</span>
                </span>
              </div>
            </div>

            {/* Video Player Screen */}
            <div
              onTouchStart={handleShowcaseMouseMove}
              onTouchMove={handleShowcaseMouseMove}
              className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center group"
            >
              <video
                ref={showcaseVideoRef}
                src="https://res.cloudinary.com/iwcoiohr/video/upload/v1792118039/Change_the_Game.mp4"
                poster="/assets/aistudio/3_e44164a5.jpg"
                playsInline
                muted={isShowcaseMuted}
                preload="metadata"
                onClick={handleScreenInteraction}
                className="w-full h-full object-cover block cursor-pointer"
                onPlay={() => {
                  setIsShowcasePlaying(true);
                  setShowControls(true);
                  if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                  controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
                }}
                onPause={() => {
                  setIsShowcasePlaying(false);
                  setShowControls(true);
                  if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
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
                  if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                }}
              />

              {/* Custom Poster Thumbnail (when paused & at 0s) */}
              {!isShowcasePlaying && showcaseTime === 0 && (
                <img
                  src="/assets/aistudio/3_e44164a5.jpg"
                  alt="CHANGE THE GAME 썸네일"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                />
              )}

              {/* Cinematic Center Overlay & Play Button (Matching AboutSection Showreel Standard) */}
              {!isShowcasePlaying && (
                <div
                  onClick={handleScreenInteraction}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer z-15 bg-black/15 hover:bg-black/25 transition-colors group/overlay"
                >
                  <span
                    className="notranslate text-xs sm:text-sm font-mono tracking-wider font-bold text-amber-400 uppercase mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                    translate="no"
                  >
                    Brand Film · Innovation · Change the Game
                  </span>
                  <h3
                    className="notranslate text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-wider uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mb-6 font-apple"
                    translate="no"
                  >
                    CHANGE THE GAME
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

              {/* Player Controls Overlay - Matching Showreel */}
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
                      aria-label={isShowcaseMuted || showcaseVolume === 0 ? '음소거 해제' : '음소거'}
                    >
                      {isShowcaseMuted || showcaseVolume === 0 ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-zinc-300" />}
                      <span className="text-[11px] font-mono text-zinc-300 font-semibold hidden sm:inline">
                        {isShowcaseMuted || showcaseVolume === 0 ? 'MUTE' : 'AUDIO ON'}
                      </span>
                    </button>

                    {/* Volume Slider right after AUDIO ON */}
                    <div className="flex items-center gap-1.5 pl-0.5">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isShowcaseMuted ? 0 : showcaseVolume}
                        onChange={handleShowcaseVolumeChange}
                        onClick={(e) => e.stopPropagation()}
                        className="w-14 sm:w-20 h-1.5 bg-[#0d0f12] rounded-lg cursor-pointer accent-zinc-200 border border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"
                        title={`볼륨: ${Math.round((isShowcaseMuted ? 0 : showcaseVolume) * 100)}%`}
                      />
                      <span className="text-[10px] font-mono text-zinc-300 font-bold w-6 sm:w-7 text-right tabular-nums hidden xs:inline">
                        {isShowcaseMuted ? '0%' : `${Math.round(showcaseVolume * 100)}%`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Time Scrubber */}
                <div className="flex-1 mx-2 flex items-center gap-3">
                  <div
                    className="flex-1 h-1.5 bg-[#0d0f12] rounded overflow-hidden cursor-pointer relative border border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"
                    onClick={handleShowcaseScrub}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-zinc-400 via-zinc-200 to-white shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-75"
                      style={{ width: `${showcaseProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-200 font-semibold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {formatTime(showcaseTime)} / {formatTime(showcaseDuration)}
                  </span>
                </div>

                <button
                  onClick={handleShowcaseFullscreen}
                  className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 cursor-pointer"
                  aria-label="전체화면"
                >
                  <Maximize className="w-4 h-4 text-zinc-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Production Pipeline & 5 Example Plan Boxes */}
        <div className="w-full my-8 sm:my-10 pt-6 border-t border-zinc-800/80">
          {/* Narrative Headline */}
          <div className="mb-6 text-center flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-google text-center">
              {isEn ? "ArtFantasia's Video Production Flow" : "아트판타지아의 영상제작플로우는"}
            </h3>
            <p className="mt-2.5 text-sm sm:text-base font-semibold text-amber-400 font-google text-center flex items-center justify-center gap-2 flex-wrap">
              <span className="text-amber-400 font-bold shrink-0">◉</span>
              <span>
                {isEn ? (
                  <>We provide the <span className="font-extrabold text-amber-300 underline decoration-amber-400/60 underline-offset-4">optimal solution</span> tailored to a reasonable budget and your desired format.</>
                ) : (
                  <>합리적 예산과 원하시는 형태에 맞춰 <span className="font-extrabold text-amber-300 underline decoration-amber-400/60 underline-offset-4">최적의 답</span>을 제공해 드립니다.</>
                )}
              </span>
            </p>
          </div>

          {/* 1. Budget Classes Box Grid (제작 문의 예상 예산 범위 선택의 클래스들) */}
          <div className="my-6 font-google">
            <div className="flex items-center gap-2.5 mb-3.5 sm:mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
              <span className="text-[15px] sm:text-[17.5px] font-bold font-google text-zinc-100 tracking-normal">
                {isEn ? 'Estimated Budget Range Classes (KRW)' : '예상 예산 범위 선택 클래스'}
              </span>
            </div>

            <div key={`budget-grid-${language}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 relative font-google">
              {BUDGET_CLASSES.map((b) => (
                <div
                  key={`${b.key}-${language}`}
                  className="relative rounded-xl bg-zinc-950/85 border border-zinc-800/80 hover:border-blue-400/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.18)] flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    {/* Top Thumbnail Image Container with Blue Tint & Hover Zoom */}
                    <div className="h-24 rounded-lg overflow-hidden relative mb-3 bg-zinc-900 border border-zinc-800/50">
                      <img
                        src={b.bgImage}
                        alt={b.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-blue-900/25 transition-colors duration-300" />
                    </div>

                    {/* Class Title with Box */}
                    <div className="mb-2">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-blue-500/20 border border-blue-400/40 text-[13.5px] sm:text-[14.5px] font-bold text-blue-300 font-google tracking-normal shadow-sm group-hover:border-blue-300 group-hover:bg-blue-500/25 transition-all">
                        <span className="notranslate" translate="no">
                          {isEn ? (b.titleEn || b.badge) : b.title}
                        </span>
                      </span>
                    </div>

                    {/* Price Range without Box (Displays KRW instead of WON upon English translation) */}
                    <h4 className="text-[16px] sm:text-[17.5px] font-bold text-white group-hover:text-blue-200 transition-colors tracking-tight font-google mb-2">
                      <span key={`range-${b.key}-${language}`} className="notranslate" translate="no">
                        {isEn ? b.rangeEn : b.range}
                      </span>
                    </h4>
                    <p className="text-[12.5px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal font-google">
                      {isEn && b.descEn ? b.descEn : b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Format & Style Plans Box Grid (5개 제작 포맷 예시안) */}
          <div className="my-6 pt-5 border-t border-zinc-800/60 font-google">
            <div className="flex items-center gap-2.5 mb-3.5 sm:mb-4">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.95)] ring-2 ring-amber-300/40" />
              <span className="text-[15px] sm:text-[17.5px] font-bold font-google text-zinc-100 tracking-normal">
                제작 스타일 & 포맷 예시안
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5 font-google">
              {PRODUCTION_FLOW_PLANS.map((plan, idx) => (
                <div
                  key={plan.id}
                  className="group relative p-4 sm:p-4.5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 hover:border-amber-300 hover:shadow-[0_12px_32px_rgba(245,158,11,0.3)] hover:bg-zinc-900/90 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between font-google overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2 rounded-lg bg-amber-950/40 border border-amber-400/40 text-amber-300 group-hover:scale-110 group-hover:text-amber-100 group-hover:border-amber-300 group-hover:bg-amber-900/60 group-hover:shadow-[0_0_14px_rgba(245,158,11,0.5)] transition-all">
                        {plan.icon}
                      </span>
                      <span className="text-[10px] font-google font-extrabold text-amber-200 px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 backdrop-blur-sm shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                        PLAN 0{idx + 1}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-medium text-zinc-100 group-hover:text-amber-200 transition-colors tracking-[-0.05em] leading-snug">
                      {plan.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Production Inquiry Banner & Gateway - Minimalist White Edition */}
          <div
            onClick={onOpenInquiry}
            className="group relative p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md my-6 cursor-pointer font-google transition-all duration-200"
          >
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 text-center lg:text-left">
              <div className="flex-1 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{isEn ? 'Budget-Tailored & Style Consulting' : '예산 맞춤 & 스타일별 견적 상담'}</span>
                </div>
                
                <h4 className="text-base sm:text-lg lg:text-[20px] font-bold text-zinc-900 tracking-tight leading-snug">
                  {isEn ? (
                    'Optimal video solutions tailored to your Budget Class and Production Style'
                  ) : (
                    '예상하시는 예산 클래스와 원하시는 제작 스타일에 맞춘 최적의 영상 솔루션'
                  )}
                </h4>
                
                <p className="text-xs sm:text-[13.5px] text-zinc-500 leading-relaxed font-normal">
                  {isEn ? (
                    <>Based on the 5 budget classes and styles, we take <strong className="font-semibold text-zinc-800">100% full responsibility</strong> from planning, casting, filming, AI editing to warranty service.</>
                  ) : (
                    <>위 5개 예산 클래스와 제작 스타일을 바탕으로, 기획부터 섭외·촬영·AI편집·사후관리(A/S)까지 <strong className="font-semibold text-zinc-800">100% 책임 진행</strong>해 드립니다.</>
                  )}
                </p>
              </div>

              <div className="shrink-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenInquiry) onOpenInquiry();
                  }}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-zinc-950 hover:bg-amber-500 hover:text-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg group-hover:scale-105 cursor-pointer font-google whitespace-nowrap"
                >
                  <span>{isEn ? 'Video Inquiry / Estimate Request' : '영상 제작 문의 / 견적 요청'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Showcase Header & Category Tabs */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-zinc-800/80">
          {/* Subtitle & Description Header */}
          <div className="mb-6 sm:mb-8 text-center flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-google text-center">
              영상제작 포트폴리오
            </h3>
            <p className="mt-2 text-sm sm:text-base font-medium text-amber-400 flex items-center justify-center gap-2 flex-wrap font-google text-center">
              <span className="text-amber-400 font-bold shrink-0 text-sm sm:text-base">◉</span>
              <span className="text-amber-400 font-semibold text-sm sm:text-base">
                기획,연출,촬영,섭외,편집,AI 등 <span className="font-black text-amber-300 underline decoration-amber-400/60 underline-offset-4">100% 책임 제작</span> 영상만 표기됩니다.
              </span>
            </p>
          </div>

          {/* Category Tabs - Matching AudioPortfolio pill design */}
          <div className="flex flex-wrap items-center gap-2 mt-4 font-google">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-bold'
                      : 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-black/20 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modular Grid of Project Cards with Black Background & White Cards (No Borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mt-8 p-5 sm:p-7 md:p-8 rounded-2xl bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)] font-google">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group cursor-pointer rounded-xl bg-white transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] shadow-md"
            >
              {/* Media Card Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={project.thumbnailUrl || (project.youtubeId ? `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg` : '')}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:from-black/40 transition-colors" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  {project.badge ? (
                    <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-amber-300 flex items-center gap-1.5 shadow-sm">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{project.badge}</span>
                    </div>
                  ) : <div />}

                  {project.duration && (
                    <div className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-zinc-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-300" />
                      <span>{project.duration}</span>
                    </div>
                  )}
                </div>

                {/* Center Hover Play/Lock Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    {project.youtubeId ? (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    ) : (
                      <Lock className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body - Crisp White Lower Description Area */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  {/* Metadata Row */}
                  <div className="flex items-center gap-2 text-xs mb-2.5 flex-wrap">
                    <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded text-[11px]">
                      {project.client}
                    </span>
                    <span className="text-amber-900 bg-amber-100/90 font-bold px-2 py-0.5 rounded text-[11px] font-mono ml-auto">
                      {project.year}년
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1 tracking-tight leading-snug mt-2.5">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>

                {/* Roles and Action */}
                <div className="mt-5 pt-1 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 truncate max-w-[62%] font-medium">
                    {project.role.slice(0, 3).join(' · ')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-medium text-xs group-hover:bg-amber-500 group-hover:text-black transition-all shadow-sm">
                    <span>{project.youtubeId ? '영상 재생' : '상세 안내'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Reel Modal / YouTube Embed Screening */}
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-zinc-900 border-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-100 bg-white sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-2.5 truncate mr-4">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-[11px] font-mono text-amber-700 uppercase font-bold shrink-0">
                    SCREENING
                  </span>
                  <span className="text-xs font-mono text-zinc-500 shrink-0">{activeProject.client}</span>
                  <span className="text-zinc-300 shrink-0">|</span>
                  <span className="text-sm font-bold text-zinc-900 truncate">{activeProject.title}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => copyProjectLink(activeProject, e)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                    title={copiedId === activeProject.id ? "링크 복사 완료!" : "공유하기"}
                    aria-label="공유하기"
                  >
                    {copiedId === activeProject.id ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProject(null)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                    aria-label="닫기"
                    title="닫기"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Real YouTube Video Player Screen or Confidential Notice Screen */}
              <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
                {activeProject.youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeProject.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={activeProject.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 bg-zinc-950 text-center relative overflow-hidden">
                    {activeProject.thumbnailUrl && (
                      <img
                        src={activeProject.thumbnailUrl}
                        alt={activeProject.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-sm scale-105"
                      />
                    )}
                    <div className="relative z-10 max-w-lg p-6 sm:p-7 rounded-2xl bg-black/85 backdrop-blur-md shadow-2xl text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 flex items-center justify-center">
                        <Lock className="w-6 h-6" />
                      </div>
                      <span className="inline-block px-2.5 py-0.5 mb-2.5 rounded-full bg-amber-400/10 text-amber-300 font-mono text-[11px] font-bold">
                        기관 보안 비공개 영상
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold text-white mb-2">{activeProject.title}</h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                        {activeProject.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Metadata & Actions */}
              <div className="p-6 sm:p-8 space-y-6 bg-white">
                {/* Title */}
                <div className="pb-5 border-b border-zinc-100">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mb-1.5">
                      <span className="text-amber-600 font-bold">{activeProject.client}</span>
                      <span>·</span>
                      <span>{activeProject.year}년 제작</span>
                      {activeProject.duration && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-zinc-600">
                            <Clock className="w-3 h-3 text-amber-500" />
                            {activeProject.duration}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900">{activeProject.title}</h3>
                    {activeProject.badge && (
                      <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded bg-amber-50 text-xs font-mono text-amber-800 font-medium">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        {activeProject.badge}
                      </span>
                    )}
                  </div>
                </div>


                {/* Key Highlights */}
                <div>
                  <h4 className="text-xs font-mono text-zinc-900 font-bold uppercase tracking-wider mb-3">KEY HIGHLIGHTS</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeProject.keyHighlights.map((h, i) => (
                      <div key={i} className="p-3.5 bg-zinc-50 rounded-xl text-xs text-zinc-800 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-tight font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Production Scope & Roles */}
                <div>
                  <h4 className="text-xs font-mono text-zinc-900 font-bold uppercase tracking-wider mb-3">PRODUCTION SCOPE</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.role.map((r, i) => (
                      <span key={i} className="px-3 py-1.5 bg-zinc-100 rounded-lg text-xs font-mono text-zinc-700 font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
