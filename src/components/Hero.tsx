import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Film, Sparkles, Radio, ArrowRight, Building2, Tv, Music2, Headphones } from 'lucide-react';
import { MosaicLogo3D } from './MosaicLogo3D';
import { InternationalPortfolio } from './InternationalPortfolio';
import { PassionVideoSection } from './PassionVideoSection';
import { CorporatePhilosophy } from './CorporatePhilosophy';
import { SectionEditorialHeader } from './SectionEditorialHeader';
import { GoldenParticleCanvas } from './GoldenParticleCanvas';
import { NavCategory } from '../types';
import { useAdminData, DEFAULT_INTERNATIONAL_LOGOS } from '../context/AdminDataContext';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onExploreVideo: () => void;
  onExploreAudio?: () => void;
  onOpenInquiry?: () => void;
  onNavigate?: (section: NavCategory) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreVideo,
  onExploreAudio,
  onNavigate,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [progress, setProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const TOTAL_DURATION_SEC = 102; // 1분 42초

  const triggerControlsAutoHide = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleScreenInteraction = (e?: React.MouseEvent | React.TouchEvent) => {
    if (isPlaying) {
      if (!showControls) {
        if (e) e.stopPropagation();
        triggerControlsAutoHide();
      } else {
        togglePlay(e as React.MouseEvent);
      }
    } else {
      togglePlay(e as React.MouseEvent);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
  }, []);

  // Ensure hero background video is cleanly connected and pauses when scrolled offscreen
  useEffect(() => {
    const bgVid = bgVideoRef.current;
    if (!bgVid) return;

    bgVid.defaultMuted = true;
    bgVid.muted = true;

    const playBg = () => {
      bgVid.play().catch(() => {});
    };
    playBg();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bgVid.play().catch(() => {});
        } else {
          bgVid.pause();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(bgVid);

    return () => {
      observer.disconnect();
    };
  }, []);

  const { language } = useLanguage();
  const isTranslatedToEn = language === 'en';

  // Video time update handler
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const cur = video.currentTime;
    setCurrentTimeSec(cur);
    const dur = video.duration && !isNaN(video.duration) && video.duration > 0 ? video.duration : TOTAL_DURATION_SEC;
    setProgress((cur / dur) * 100);

    const m = Math.floor(cur / 60);
    const s = Math.floor(cur % 60);
    const f = Math.floor((cur % 1) * 30);
    const pad = (n: number) => n.toString().padStart(2, '0');
    setTimecode(`00:${pad(m)}:${pad(s)}:${pad(f)}`);
  };

  // Toggle video playback
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      setIsMuted(false);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Hero video play prevented, attempting fallback:', err);
            video.muted = true;
            setIsMuted(true);
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Toggle video mute/audio
  // Toggle video mute/audio
  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      if (volume === 0) {
        setVolume(0.85);
        video.volume = 0.85;
      } else {
        video.volume = volume;
      }
      if (video.paused) {
        video.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    const video = videoRef.current;
    if (video) {
      video.volume = val;
      if (val === 0) {
        video.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        video.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Scrubber click handler
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const dur = video.duration && !isNaN(video.duration) && video.duration > 0 ? video.duration : TOTAL_DURATION_SEC;
    const targetTime = ratio * dur;
    video.currentTime = targetTime;
    setCurrentTimeSec(targetTime);
    setProgress(ratio * 100);
  };

  const { logos } = useAdminData();
  // 관리자에서 링크를 걸거나 업로드한 로고 파일(logoUrl)만 필터링하여 노출 (비로그인자도 항상 로고 확인 가능)
  const candidateLogos = (logos && logos.length > 0) ? logos : DEFAULT_INTERNATIONAL_LOGOS;
  const validLogos = candidateLogos.filter(
    (l) => l.active !== false && typeof l.logoUrl === 'string' && l.logoUrl.trim().length > 0
  );

  const basePool = validLogos.length > 0
    ? validLogos
    : DEFAULT_INTERNATIONAL_LOGOS.filter((l) => typeof l.logoUrl === 'string' && l.logoUrl.trim().length > 0);

  // 4개 행에 고르게 분할
  const quarter = Math.max(1, Math.ceil(basePool.length / 4));
  const row1Base = basePool.slice(0, quarter);
  const row2Base = basePool.slice(quarter, quarter * 2);
  const row3Base = basePool.slice(quarter * 2, quarter * 3);
  const row4Base = basePool.slice(quarter * 3);

  // 무한 롤링 티커 트랙 구성 (실제 로고 파일이 있는 경우에만 연속 루프 형성)
  const getFullRowLogos = (rowList: typeof basePool) => {
    if (rowList.length === 0) return [];
    let set = [...rowList];
    while (set.length < 16) {
      set = [...set, ...rowList];
    }
    return set;
  };

  const row1 = getFullRowLogos(row1Base);
  const row2 = getFullRowLogos(row2Base);
  const row3 = getFullRowLogos(row3Base);
  const row4 = getFullRowLogos(row4Base);

  // 롤링티커 아이템 렌더링: 관리자에서 링크하거나 업로드한 로고 파일만 출력
  const renderMarqueeLogoItem = (logo: any, key: string | number) => {
    const rawSrc = logo.logoUrl?.trim();
    if (!rawSrc) return null;
    let imageSrc = rawSrc;
    if (imageSrc.startsWith('<svg')) {
      imageSrc = `data:image/svg+xml;utf8,${encodeURIComponent(imageSrc)}`;
    }

    return (
      <div
        key={key}
        className="group/lbox h-[44px] sm:h-[48px] min-w-[130px] sm:min-w-[155px] max-w-[210px] px-3 py-1 rounded-lg bg-white hover:bg-[#fafafa] border border-[#cbd5e1] shadow-xs hover:shadow-md shrink-0 select-none flex items-center justify-center transition-all cursor-default overflow-hidden"
        style={{
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      >
        <img
          src={imageSrc}
          alt={logo.name || 'Partner Logo'}
          loading="eager"
          decoding="sync"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
          className="h-6 sm:h-[26px] max-w-[115px] sm:max-w-[135px] w-auto object-contain transition-transform duration-300 group-hover/lbox:scale-105"
          style={{
            imageRendering: '-webkit-optimize-contrast',
            transform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    );
  };

  return (
    <section className="relative pt-3 sm:pt-4 pb-16 overflow-hidden border-b border-zinc-800 bg-[#09090b]">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">

        {/* Main Headline & Value Proposition Container with 16:9 Aspect Ratio & Seamless Video */}
        <div className="relative w-full aspect-video min-h-[420px] sm:min-h-[480px] md:min-h-0 py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center text-center overflow-hidden rounded-2xl bg-zinc-950 my-2 sm:my-3 shadow-2xl">
          {/* Background Autoplay Video (30% transparency) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <video
              ref={bgVideoRef}
              src="https://res.cloudinary.com/iwcoiohr/video/upload/v1792834401/HERO2.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover scale-[1.04] opacity-30"
            >
              <source
                src="https://res.cloudinary.com/iwcoiohr/video/upload/v1792834401/HERO2.mp4"
                type="video/mp4"
              />
            </video>
            {/* Soft, translucent contrast gradient allowing video to shine through */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
          </div>

          {/* Subtle Accent Grid */}
          <div className="absolute inset-0 hero-animated-grid opacity-15 pointer-events-none" />

          {/* Gentle Scanning Shimmer Beam */}
          <div className="absolute inset-x-0 h-44 bg-gradient-to-b from-transparent via-amber-400/10 to-transparent pointer-events-none animate-scanbeam" />

          <div className="relative z-10 max-w-6xl w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 my-auto">
            {/* Dazzling Mosaic Animated Logo */}
            <div className="mb-6 sm:mb-8 flex justify-center">
              <MosaicLogo3D size={240} />
            </div>

            <div
              className="inline-flex items-center text-xs sm:text-[13px] md:text-[14.5px] text-zinc-100 mb-4 sm:mb-5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-zinc-950/75 border border-amber-400/40 shadow-2xl opacity-0 animate-hero-reveal backdrop-blur-md"
              style={{ animationDelay: '100ms' }}
            >
              <span className="font-['Noto_Sans_KR',sans-serif] font-bold tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                AI시대에 영상과 음악으로 만들어지는 여러분의 이야기
              </span>
            </div>
            <h1
              className="text-[21px] sm:text-[26px] md:text-[34px] lg:text-[40px] font-extrabold tracking-tight text-white leading-tight text-center opacity-0 animate-hero-reveal drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
              style={{ animationDelay: '250ms' }}
            >
              여러분의 이야기는 <span className="text-amber-400 drop-shadow-[0_2px_12px_rgba(251,191,36,0.6)]">특별</span>해야 합니다.
            </h1>
          </div>
        </div>

        {/* Nitex-style Interactive Showreel Container with Real Video */}
        <div className="relative rounded-lg border border-zinc-700/80 bg-zinc-950 overflow-hidden shadow-2xl">
          {/* Top Panel Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-[#343a42] via-[#21262d] to-[#14171b] border-b border-[#3b434e] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.9)] text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-600 border border-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.8)]" />
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-zinc-400 font-medium tracking-wider">CODEC: H.264 / PRORES</span>
              <span className="text-zinc-100 font-bold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {timecode} <span className="text-zinc-500 font-normal">/ 00:01:42:00</span>
              </span>
            </div>
          </div>

          {/* Video Player Screen */}
          <div
            onMouseMove={triggerControlsAutoHide}
            onMouseEnter={triggerControlsAutoHide}
            onTouchStart={triggerControlsAutoHide}
            onTouchMove={triggerControlsAutoHide}
            onMouseLeave={() => {
              if (isPlaying) {
                setShowControls(false);
              }
            }}
            className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center group"
          >
            <video
              ref={videoRef}
              src="https://res.cloudinary.com/iwcoiohr/video/upload/v1791867916/showreel.mp4"
              poster="/showreel_frame0.jpg?v=2"
              className="w-full h-full object-cover cursor-pointer"
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              onClick={handleScreenInteraction}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => {
                setIsPlaying(true);
                setShowControls(true);
                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
              }}
              onPause={() => {
                setIsPlaying(false);
                setShowControls(true);
                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
              }}
              onEnded={() => {
                setIsPlaying(false);
                setShowControls(true);
                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
              }}
              onError={(e) => {
                // Fallback to primary CDN stream
                (e.currentTarget as HTMLVideoElement).src = 'https://res.cloudinary.com/iwcoiohr/video/upload/v1791867916/showreel.mp4';
              }}
            />

            {/* Cinematic Center Overlay - Title moves smoothly to the exact center when playing */}
            <div
              onClick={handleScreenInteraction}
              className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer z-15 transition-colors duration-500 group/overlay ${
                isPlaying ? 'bg-transparent' : 'bg-black/25 hover:bg-black/35'
              }`}
            >
              {/* Category Badge & Title Block - Smoothly transitions to exact dead center when playing */}
              <div
                className={`flex flex-col items-center text-center transition-all duration-500 ease-out pointer-events-none select-none ${
                  isPlaying ? 'mb-0 translate-y-0' : 'mb-6'
                }`}
              >
                <span
                  className="notranslate text-xs sm:text-sm font-mono tracking-wider font-bold text-amber-400 uppercase mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                  translate="no"
                >
                  Brand Film · TVC · Campaign Film · PSA · etc
                </span>
                <h2
                  className="notranslate text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] uppercase"
                  translate="no"
                >
                  ART FANTASIA OFFICIAL SHOWREEL
                </h2>
              </div>

              {/* Play Mark and Guide Description - Fades and collapses when playing so title smoothly centers */}
              <div
                className={`flex flex-col items-center transition-all duration-500 ease-out overflow-hidden ${
                  isPlaying
                    ? 'opacity-0 max-h-0 pointer-events-none -translate-y-2'
                    : 'opacity-100 max-h-48 pointer-events-auto translate-y-0'
                }`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#F15A29] via-[#E9422F] to-[#DD2426] text-white flex items-center justify-center shadow-[0_0_35px_rgba(233,66,47,0.6)] group-hover/overlay:shadow-[0_0_50px_rgba(233,66,47,0.85)] transition-all duration-300">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white ml-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]" />
                </div>

                <span className="text-xs sm:text-sm text-zinc-200 mt-4 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  재생 버튼 또는 화면을 클릭하시면 영상을 감상하실 수 있습니다
                </span>
              </div>
            </div>

            {/* Player Controls Overlay - Auto-hides when playing, reappears on mouse move */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute bottom-2 sm:bottom-3 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between gap-4 py-2 px-3.5 bg-gradient-to-b from-[#343a42]/95 via-[#21262d]/95 to-[#14171b]/95 backdrop-blur-md rounded border border-[#3b434e] ring-1 ring-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.9)] z-20 transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 cursor-pointer"
                  aria-label={isPlaying ? '일시 정지' : '재생'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-zinc-200" /> : <Play className="w-4 h-4 fill-zinc-200" />}
                </button>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={toggleSound}
                    className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 flex items-center gap-1.5 cursor-pointer"
                    aria-label={isMuted || volume === 0 ? '음소거 해제' : '음소거'}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-zinc-300" />}
                    <span className="text-[11px] font-mono text-zinc-300 font-semibold hidden sm:inline">
                      {isMuted || volume === 0 ? 'MUTE' : 'AUDIO ON'}
                    </span>
                  </button>

                  {/* Volume Slider right after AUDIO ON */}
                  <div className="flex items-center gap-1.5 pl-0.5">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-14 sm:w-20 h-1.5 bg-[#0d0f12] rounded-lg cursor-pointer accent-zinc-200 border border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"
                      title={`볼륨: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                    />
                    <span className="text-[10px] font-mono text-zinc-300 font-bold w-6 sm:w-7 text-right tabular-nums hidden xs:inline">
                      {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Time Scrubber */}
              <div className="flex-1 mx-2 flex items-center gap-3">
                <div
                  className="flex-1 h-1.5 bg-[#0d0f12] rounded overflow-hidden cursor-pointer relative border border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"
                  onClick={handleScrub}
                >
                  <div
                    className="h-full bg-gradient-to-r from-zinc-400 via-zinc-200 to-white shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-zinc-200 font-semibold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {Math.floor(currentTimeSec / 60).toString().padStart(2, '0')}:
                  {Math.floor(currentTimeSec % 60).toString().padStart(2, '0')} / 01:42
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Divisions Section - 아트판타지아가 걸어가는 길. */}
        <div className="mt-10 pt-8 border-t border-zinc-800/80">
          {/* Top Editorial Label - Art Fantasia Divisions */}
          <SectionEditorialHeader
            title="아트판타지아가 걸어가는 길."
            subtitle="사업영역 // BUSINESS DIVISIONS"
          />

          {/* Sophisticated Text-Centric Core Philosophy Quote */}
          <div className="my-10 sm:my-14 max-w-4xl mx-auto text-center px-4 select-none">
            <p className="font-['Noto_Sans_KR',sans-serif] text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-black text-white tracking-tight leading-snug sm:leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              “최고의 브랜드는 바로 <span className="text-amber-300 font-black">여러분의 이야기</span>”
            </p>
            <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-normal mt-2.5 max-w-2xl mx-auto font-normal font-['Noto_Sans_KR',sans-serif]">
              진정성 있는 스토리텔링과 타협 없는 오디오·비주얼 크래프트맨십으로
              <br />
              <span className="block mt-1 sm:mt-1 text-white font-bold drop-shadow-sm">
                여러분의 이야기를 <span className="text-amber-300 font-bold">A클래스 시네마틱</span> 경험으로 완성하겠습니다.
              </span>
            </p>
          </div>

          {/* 2 Divisions: 영상영역 & 음악영역 (가로형 와이드 레이아웃) */}
          <div className="space-y-6 sm:space-y-7">
            {/* 1. 영상영역 (FILM & VIDEO PRODUCTION) */}
            <div className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 hover:border-zinc-700/80 transition-all duration-300 shadow-xl group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                {/* Left Header Column */}
                <div className="relative lg:col-span-5 p-5 sm:p-6 rounded-xl bg-zinc-950 overflow-hidden shadow-xl group/box">
                  {/* DIREC.jpg Background Image */}
                  <div className="absolute inset-0 pointer-events-none">
                    <img
                      src="/DIREC.jpg"
                      alt="Film Direction"
                      className="w-full h-full object-cover object-center opacity-80 group-hover/box:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl sm:text-5xl font-black font-mono text-zinc-300 group-hover:text-amber-300 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        01
                      </span>
                      <div className="h-6 w-px bg-zinc-600/80" />
                      <span className="text-[11px] sm:text-xs font-mono tracking-widest text-amber-300 uppercase font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] notranslate" translate="no">
                        FILM & VIDEO PRODUCTION
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-['Noto_Sans_KR',sans-serif] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                      영상영역
                    </h3>
                  </div>
                </div>

                {/* Right Description & Action Button Column */}
                <div className="lg:col-span-7 space-y-4 lg:pl-6">
                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-white tracking-tight font-['Noto_Sans_KR',sans-serif] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      기획, 제작, A/S까지. 100% 책임 진행
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-3.5 font-normal font-['Noto_Sans_KR',sans-serif]">
                      아이디어 기획과 시나리오, 콘티, 연출, 4K/8K 시네마토그래피 촬영부터 편집 전반(CG, 색보정, 사운드 믹싱)까지... 대부분의 공정을 직영 인하우스 파이프라인을 통해 외주 최소화를 실현합니다.
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-between flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => (onNavigate ? onNavigate('video') : onExploreVideo())}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md shadow-amber-400/20 hover:shadow-amber-400/35 hover:scale-[1.02] active:scale-95 group/btn"
                    >
                      <Film className="w-4 h-4 text-zinc-950 shrink-0" />
                      <span>영상제작 바로가기</span>
                      <ArrowRight className="w-4 h-4 text-zinc-950 shrink-0 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 하단으로 이동한 주요 제작 영역 5개 박스 (화면에 꽉 찬 5열 그리드) */}
              <div className="mt-8 pt-6 border-t border-zinc-800/80">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 w-full">
                  {[
                    {
                      num: '01',
                      title: 'AI 영상 제작',
                      sub: 'AI FILM & GEN-AI',
                      desc: '생성형 AI 워크플로우 & 가상 연출',
                      icon: Sparkles,
                    },
                    {
                      num: '02',
                      title: '홍보영상',
                      sub: 'CORPORATE & PR',
                      desc: '기업 · 정부 · 공공기관 공식 홍보',
                      icon: Building2,
                    },
                    {
                      num: '03',
                      title: '브랜드필름',
                      sub: 'BRAND CINEMA',
                      desc: '시네마틱 감성 스토리텔링',
                      icon: Film,
                    },
                    {
                      num: '04',
                      title: 'TVC 광고',
                      sub: 'TV COMMERCIAL',
                      desc: '지상파 & 케이블 온에어 심의 제작',
                      icon: Tv,
                    },
                    {
                      num: '05',
                      title: '유튜브 콘텐츠',
                      sub: 'YOUTUBE & WEB',
                      desc: '디지털 오리지널 & 브랜디드 영상',
                      icon: Play,
                    },
                  ].map((box, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#eceef1] via-[#e2e5e8] to-[#d7dbe0] hover:from-[#f1f3f6] hover:to-[#dde1e6] border border-zinc-300/80 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group/box min-h-[118px] text-zinc-950"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-mono font-black text-zinc-600 group-hover/box:text-zinc-950 transition-colors">
                          {box.num}
                        </span>
                        <box.icon className="w-4.5 h-4.5 text-zinc-700 group-hover/box:text-zinc-950 transition-colors" />
                      </div>
                      <div className="mt-3">
                        <div className="text-[19.5px] sm:text-[23px] font-black text-zinc-950 tracking-tight font-['Noto_Sans_KR',sans-serif] group-hover/box:text-black transition-colors leading-tight">
                          {box.title}
                        </div>
                        <div className="text-[12.6px] sm:text-[13px] text-zinc-700 mt-1 font-semibold leading-snug font-['Pretendard','Noto_Sans_KR',sans-serif] tracking-[-0.01em]">
                          {box.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. 음악영역 (MUSIC & AUDIO PRODUCTION) */}
            <div className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 hover:border-zinc-700/80 transition-all duration-300 shadow-xl group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                {/* Left Header Column */}
                <div className="relative lg:col-span-5 p-5 sm:p-6 rounded-xl bg-zinc-950 overflow-hidden shadow-xl group/box">
                  {/* REC.jpg Background Image */}
                  <div className="absolute inset-0 pointer-events-none">
                    <img
                      src="/REC.jpg"
                      alt="Sound Recording"
                      className="w-full h-full object-cover object-center opacity-80 -scale-x-100 group-hover/box:-scale-x-105 group-hover/box:scale-y-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl sm:text-5xl font-black font-mono text-zinc-300 group-hover:text-amber-300 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        02
                      </span>
                      <div className="h-6 w-px bg-zinc-600/80" />
                      <span className="text-[11px] sm:text-xs font-mono tracking-widest text-amber-300 uppercase font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] notranslate" translate="no">
                        MUSIC & AUDIO PRODUCTION
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-['Noto_Sans_KR',sans-serif] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                      음악영역
                    </h3>
                  </div>
                </div>

                {/* Right Description & Action Buttons Column */}
                <div className="lg:col-span-7 space-y-4 lg:pl-6">
                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-white tracking-tight font-['Noto_Sans_KR',sans-serif] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      기획, 제작, 방송 심의까지. 100% 책임 진행
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-3.5 font-normal font-['Noto_Sans_KR',sans-serif]">
                      사운드 콘셉트 기획부터 작사·작곡, 편곡, 전문 성우·보컬 디렉팅 및 레코딩, 오디오 믹싱, 음향 마스터링까지 100% 직영 책임제작을 실현합니다.
                    </p>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => (onNavigate ? onNavigate('audio') : (onExploreAudio ? onExploreAudio() : undefined))}
                      className="inline-flex items-center gap-2 px-4.5 sm:px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md shadow-amber-400/20 hover:shadow-amber-400/35 hover:scale-[1.02] active:scale-95 group/btn"
                    >
                      <Radio className="w-4 h-4 text-zinc-950 shrink-0" />
                      <span>라디오광고 바로가기</span>
                      <ArrowRight className="w-4 h-4 text-zinc-950 shrink-0 transition-transform group-hover/btn:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => (onNavigate ? onNavigate('afanmusic') : (onExploreAudio ? onExploreAudio() : undefined))}
                      className="inline-flex items-center gap-2 px-4.5 sm:px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md shadow-amber-400/20 hover:shadow-amber-400/35 hover:scale-[1.02] active:scale-95 group/btn"
                    >
                      <Sparkles className="w-4 h-4 text-zinc-950 shrink-0" />
                      <span>아판뮤직 바로가기</span>
                      <ArrowRight className="w-4 h-4 text-zinc-950 shrink-0 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 하단으로 이동한 음악 주요 제작 영역 4개 박스 (화면에 꽉 찬 4열 그리드) */}
              <div className="mt-8 pt-6 border-t border-zinc-800/80">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full">
                  {[
                    {
                      num: '01',
                      title: '라디오광고',
                      sub: 'RADIO COMMERCIAL',
                      desc: '지상파 온에어 CM송 & 내레이션',
                      icon: Radio,
                    },
                    {
                      num: '02',
                      title: '오리지널 BGM',
                      sub: 'ORIGINAL SCORE',
                      desc: '방송 · 영상 전용 맞춤 배경음악',
                      icon: Music2,
                    },
                    {
                      num: '03',
                      title: '대중음악 & OST',
                      sub: 'POP ALBUM & OST',
                      desc: '음반 기획 · 작곡 · 편곡 · 레코딩',
                      icon: Headphones,
                    },
                    {
                      num: '04',
                      title: '브랜드 사운드',
                      sub: 'SIGNATURE JINGLE',
                      desc: '시그니처 징글 & 기업 로고송',
                      icon: Sparkles,
                    },
                  ].map((box, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#eceef1] via-[#e2e5e8] to-[#d7dbe0] hover:from-[#f1f3f6] hover:to-[#dde1e6] border border-zinc-300/80 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group/box min-h-[118px] text-zinc-950"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-mono font-black text-zinc-600 group-hover/box:text-zinc-950 transition-colors">
                          {box.num}
                        </span>
                        <box.icon className="w-4.5 h-4.5 text-zinc-700 group-hover/box:text-zinc-950 transition-colors" />
                      </div>
                      <div className="mt-3">
                        <div className="text-[19.5px] sm:text-[23px] font-black text-zinc-950 tracking-tight font-['Noto_Sans_KR',sans-serif] group-hover/box:text-black transition-colors leading-tight">
                          {box.title}
                        </div>
                        <div className="text-[12.6px] sm:text-[13px] text-zinc-700 mt-1 font-semibold leading-snug font-['Pretendard','Noto_Sans_KR',sans-serif] tracking-[-0.01em]">
                          {box.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Official Clients & Partners Showcase - 3-Row Infinite Left-to-Right Moving Ticker with sleek minimal boxes */}
        <div className="mt-16 pt-12 border-t border-zinc-800/80 w-full">
          {/* Top Editorial Label - Art Fantasia Portfolio / 걸어온 길 */}
          <SectionEditorialHeader
            title={
              isTranslatedToEn ? (
                <span className="notranslate" translate="no">PORTFOLIO</span>
              ) : (
                <>
                  <span className="portfolio-lang-ko">아트판타지아가 걸어온 길.</span>
                  <span className="portfolio-lang-en hidden notranslate" translate="no">PORTFOLIO</span>
                </>
              )
            }
            subtitle="CLIENTS & INTERNATIONAL PORTFOLIO"
          />

          <div className="relative overflow-hidden w-full space-y-2 sm:space-y-2.5 py-2 rounded-xl">
            {/* Subtle warm golden ambient backdrop behind logos */}
            <div
              className="absolute inset-0 pointer-events-none opacity-60 z-0"
              style={{
                background:
                  'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(245, 158, 11, 0.08) 0%, rgba(212, 175, 55, 0.03) 45%, transparent 75%)',
              }}
              aria-hidden="true"
            />

            {/* Row 1: Left to Right Continuous Moving Track */}
            <div className="overflow-hidden w-full relative z-10">
              <div className="animate-marquee-ltr flex gap-2.5 sm:gap-3">
                {row1.map((l, idx) =>
                  renderMarqueeLogoItem(l, `r1-a-${l.id || idx}-${idx}`)
                )}
                {row1.map((l, idx) =>
                  renderMarqueeLogoItem(l, `r1-b-${l.id || idx}-${idx}`)
                )}
              </div>
            </div>

            {/* Row 2: Left to Right Continuous Moving Track */}
            <div className="overflow-hidden w-full relative z-10">
              <div className="animate-marquee-ltr-slow flex gap-2.5 sm:gap-3">
                {row2.map((l, idx) =>
                  renderMarqueeLogoItem(l, `r2-a-${l.id || idx}-${idx}`)
                )}
                {row2.map((l, idx) =>
                  renderMarqueeLogoItem(l, `r2-b-${l.id || idx}-${idx}`)
                )}
              </div>
            </div>

            {/* Row 3: Left to Right Continuous Moving Track */}
            <div className="overflow-hidden w-full relative z-10">
              <div className="animate-marquee-ltr-slower flex gap-2.5 sm:gap-3">
                {row3.map((l, idx) =>
                  renderMarqueeLogoItem(l, `r3-a-${l.id || idx}-${idx}`)
                )}
                {row3.map((l, idx) =>
                  renderMarqueeLogoItem(l, `r3-b-${l.id || idx}-${idx}`)
                )}
              </div>
            </div>

            {/* Row 4: Left to Right Continuous Moving Track */}
            <div className="overflow-hidden w-full relative z-10">
              <div className="animate-marquee-ltr-offset flex gap-2.5 sm:gap-3">
                {row4.map((l, idx) =>
                  renderMarqueeLogoItem(l, `r4-a-${l.id || idx}-${idx}`)
                )}
                {row4.map((l, idx) =>
                  renderMarqueeLogoItem(l, `r4-b-${l.id || idx}-${idx}`)
                )}
              </div>
            </div>

            {/* Subtle Golden Particle Animation in front of the logos */}
            <GoldenParticleCanvas particleCount={70} inFront={true} className="z-20 pointer-events-none" />
          </div>
        </div>

        {/* International Global Portfolio: 국기와 지도 그림 */}
        <InternationalPortfolio />

        {/* 열정은 세상에 알려져야 하니까 영상 (국기와 지도 그림 밑으로 위치 변경) */}
        <PassionVideoSection />

        {/* Corporate Philosophy: 아트판타지아의 미션 (제일 밑으로 이동) */}
        <CorporatePhilosophy />

      </div>
    </section>
  );
};
