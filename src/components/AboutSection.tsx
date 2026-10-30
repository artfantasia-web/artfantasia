import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Quote, MapPin } from 'lucide-react';
import { StandardSectionHeader } from './StandardSectionHeader';
import { useLanguage } from '../context/LanguageContext';

interface AboutSectionProps {
  onOpenInquiry?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenInquiry: _onOpenInquiry }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'history' | 'ci' | 'connect'>('pipeline');

  // Video Showcase Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(40);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement && document.fullscreenElement === videoContainerRef.current));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handlePlayToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const dur = video.duration && !isNaN(video.duration) && video.duration > 0 ? video.duration : (duration || 40);
    const targetTime = ratio * dur;
    video.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        if (volume === 0) {
          setVolume(0.85);
          videoRef.current.volume = 0.85;
        } else {
          videoRef.current.volume = volume;
        }
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleFullscreenToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleMouseMove = () => {
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
        handleMouseMove();
      } else {
        handlePlayToggle(e as React.MouseEvent);
      }
    } else {
      handlePlayToggle(e as React.MouseEvent);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;



  const historyMilestones = [
    { year: '2025', title: 'AI 혁신 시스템 고도화 & 프로덕션 체질 개선', desc: '미디어 패러다임의 변화에 선제적으로 대응하기 위해 AI 엔진 기반의 제작 시스템을 구축, 기획부터 연출·후반작업 전반에 걸친 스마트 프로덕션 체질 개선' },
    { year: '2024', title: '글로벌 프로덕션 브랜드 체계 개편', desc: '글로벌 프로덕션 스튜디오 도약을 위한 브랜드 시스템 고도화' },
    { year: '2019', title: 'SBS미디어크리에이트 방송광고거래 계약 & 영화상영등급필증', desc: '지상파 SBS 방송광고 공식 거래 계약 체결 및 영상물등급위원회 전체관람가 영화상영등급필증 획득' },
    { year: '2018', title: '한국무역협회 공식 회원 등록', desc: '글로벌 프로젝트 및 해외 현지 프로덕션 수출 역량 인증' },
    { year: '2017', title: '인도네시아 대통령 VIP VIEW & 글로벌 로케이션 촬영', desc: '인도네시아 대통령 VIP VIEW 프로젝트, 경기도경제과학진흥원 지원사업, 미국·일본·체코·중국·싱가포르 등 현지 촬영' },
    { year: '2016', title: 'KOBACO 방송광고거래 계약 & 콘텐츠제작센터 완공', desc: '한국방송광고진흥공사 방송광고거래 계약 체결, 대구 북구 학정로 아트판타지아 센터 완공 (자체 편집실, 녹음실, 설비실)' },
    { year: '2015', title: '아트판타지아 법인 설립 (12월)', desc: '세상을 영상과 음악으로 표현하는 하이엔드 크리에이티브 스튜디오 출범' }
  ];

  const pipelineSteps = [
    {
      num: '01',
      title: '크리에이티브 기획 & 컨설팅',
      desc: '단순한 영상 제작을 넘어 브랜드 목표에 부합하는 콘셉트 도출과 시나리오·콘티 기획은 물론, 원활한 송출을 위한 방송광고 심의까지 사전에 완벽히 준비합니다.'
    },
    {
      num: '02',
      title: '시네마토그래피 & 현장 촬영',
      desc: 'ARRI, RED 시네마 카메라와 전문 조명, 특수 그립 장비를 갖추고 베테랑 연출진이 가장 선명한 비주얼을 포착합니다.'
    },
    {
      num: '03',
      title: '사운드 디자인 & 마스터링',
      desc: '자체 사운드 랩에서 전문 성우 녹음, 오리지널 BGM 작곡, 방송 및 라디오 CM 심의 규격 믹싱과 고품질 입체 음향 마스터링을 완성합니다.'
    },
    {
      num: '04',
      title: 'AI혁신',
      desc: '편집(CG, 정밀 색보정, 음향 마스터링) 후반작업 전반과 최신 AI 기술을 유기적으로 융합하여, 감각적이고 다채로운 고품질 영상을 완성하는 혁신적 제작 파이프라인입니다.'
    }
  ];

  return (
    <section id="about" className="pt-6 sm:pt-8 pb-16 sm:pb-24 border-b border-zinc-800 bg-[#09090b] relative font-sans text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <StandardSectionHeader
          title={language === 'ko' ? "회사소개" : "About Us"}
          subtitle={
            language === 'ko' ? (
              <>
                우리에게 최고의 브랜드는{' '}
                <span className="font-black text-amber-300 underline decoration-amber-400/60 underline-offset-4">
                  여러분
                </span>
                입니다.
              </>
            ) : (
              <>
                To us, the greatest brand is{' '}
                <span className="font-black text-amber-300 underline decoration-amber-400/60 underline-offset-4">
                  you
                </span>
                .
              </>
            )
          }
        />

        {/* Cinema Video Showcase: "대한민국에서 세상을 영상과 음악으로 표현합니다" */}
        <div className="w-full max-w-5xl mx-auto my-12 relative group">
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute -inset-2 rounded-2xl bg-white/[0.03] blur-2xl pointer-events-none" />

          {/* Interactive Cinema Video Container - Matching Hero Showreel */}
          <div
            ref={videoContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseMove}
            onTouchStart={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
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
                  00:{formatTime(currentTime)} <span className="text-zinc-500 font-normal">/ 00:00:40:00</span>
                </span>
              </div>
            </div>

            {/* Video Player Screen */}
            <div
              onTouchStart={handleMouseMove}
              onTouchMove={handleMouseMove}
              className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center group"
            >
              <video
                ref={videoRef}
                src="https://res.cloudinary.com/iwcoiohr/video/upload/v1792470332/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%EC%97%90%EC%84%9C_%EC%84%B8%EC%83%81%EC%9D%84_%EC%98%81%EC%83%81%EA%B3%BC_%EC%9D%8C%EC%95%85%EC%9C%BC%EB%A1%9C_%ED%91%9C%ED%98%84%ED%95%A9%EB%8B%88%EB%8B%A4.mp4"
                poster="/assets/aistudio/1_20e10c79.jpg"
                playsInline
                muted={isMuted}
                preload="metadata"
                onClick={handleScreenInteraction}
                className="w-full h-full object-cover block cursor-pointer"
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
                onTimeUpdate={() => {
                  setCurrentTime(videoRef.current?.currentTime || 0);
                }}
                onLoadedMetadata={() => {
                  setDuration(videoRef.current?.duration || 40);
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  setShowControls(true);
                  if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                }}
              />

              {/* Custom Poster Thumbnail (Image 1) */}
              {!isPlaying && currentTime === 0 && (
                <img
                  src="/assets/aistudio/1_20e10c79.jpg"
                  alt="세상을 영상과 음악으로 표현합니다 썸네일"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                />
              )}

              {/* Cinematic Center Overlay & Play Button (Matching Showreel Standard) */}
              {!isPlaying && (
                <div
                  onClick={handleScreenInteraction}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer z-15 bg-black/15 hover:bg-black/25 transition-colors group/overlay"
                >
                  <span
                    className="notranslate text-xs sm:text-sm font-mono tracking-wider font-bold text-amber-400 uppercase mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                    translate="no"
                  >
                    Brand Film · Philosophy · Vision
                  </span>
                  <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mb-6 font-apple">
                    대한민국에서 세상을 영상과 음악으로 표현합니다.
                  </h3>

                  {/* Standard 111 Gradient Play Button */}
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
                  showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayToggle}
                    className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 cursor-pointer"
                    aria-label={isPlaying ? '일시 정지' : '재생'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-zinc-200" /> : <Play className="w-4 h-4 fill-zinc-200" />}
                  </button>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={handleMuteToggle}
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
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button
                  onClick={handleFullscreenToggle}
                  className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 cursor-pointer"
                  aria-label={isFullscreen ? '전체화면 종료' : '전체화면'}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4 text-zinc-300" /> : <Maximize className="w-4 h-4 text-zinc-300" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CEO Message: 사랑하는 세상으로의 나아감에 "예술"이라는 답을 제시합니다 */}
        <div className="w-full max-w-5xl mx-auto my-10 relative group font-apple">
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute -inset-2 rounded-3xl bg-amber-500/[0.04] blur-2xl pointer-events-none" />

          {/* Elegant Editorial Letter Container with Subtle Building Background Artwork */}
          <div className="relative rounded-2xl bg-gradient-to-b from-zinc-950/95 via-zinc-900/80 to-zinc-950 py-7 sm:py-11 md:py-14 px-6 sm:px-10 md:px-12 border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Ambient Background Artwork (Uploaded Transparent Building Cutout PNG) - 300% Enlarged, Softer & Slow Pan Animation */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-2xl flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center animate-slow-pan">
                <img
                  src="/assets/aistudio/build1_023228e9.webp"
                  alt="ArtFantasia Building Artwork"
                  className="w-full h-full min-w-[1020px] sm:min-w-[1320px] md:min-w-[1450px] max-w-none object-cover sm:object-contain object-center opacity-25 sm:opacity-30 filter contrast-110 brightness-105 select-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/build1_023228e9.png';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/75 via-zinc-950/45 to-zinc-950/80 pointer-events-none" />
            </div>

            {/* Background Decorative Large Quote Watermark */}
            <Quote className="w-24 h-24 text-amber-400/[0.04] absolute -top-3 -left-3 pointer-events-none z-0" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-400/[0.03] rounded-full blur-3xl pointer-events-none z-0" />

            {/* Header: CEO Message Tag & Headline (Expanded 5% Spacing) */}
            <div className="relative z-10 mb-7 pb-4.5 border-b border-zinc-800/80 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-xs font-mono text-amber-400 font-semibold tracking-wider mb-2.5 mx-auto">
                <Quote className="w-3.5 h-3.5 text-amber-400" />
                <span>CEO MESSAGE // 대표 인사말</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug text-center">
                여러분이 사랑하는 세상으로의 나아감에 <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  "예술"
                </span>
                이라는 답을 선물하고자 합니다.
              </h3>
            </div>

            {/* Body Letter Text (Vertical Spacing 5% Expanded: space-y-[17px] & leading-[1.8]) */}
            <div className="relative z-10 space-y-[17px] text-center max-w-2xl mx-auto text-sm sm:text-[15px] md:text-base text-zinc-200 leading-[1.8] font-normal tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              <p>
                세상은 빠르게 변화하고 있고<br />
                세상은 새로운 것을 요구할 때가 많습니다.
              </p>

              <p>
                이것은<br />
                세상에 자신의 꿈을 그리고 신념을 펼치기 위해<br />
                하루하루 바쁜 나날을 보내시는<br />
                클라이언트 분들에게는<br />
                큰 고민 중 하나일 것입니다.
              </p>

              <p>
                세상은 빠르게 변화하고 새로운 것을 요구하지만<br />
                변하지 않는 단 하나의 진리가 있습니다.
              </p>

              <p>
                인류가 생긴 이래 지금까지 이어져온<br />
                <span className="text-amber-400 font-bold">"예술"</span>이라는 행위는<br />
                변하지 않았고 앞으로도 변하지 않기 때문입니다.
              </p>

              <p>
                세상의 모든 여성이 자신을 표현하기 위해<br />
                스스로를 가꾸 듯<br />
                <span className="text-amber-400 font-bold">"예술"</span>로<br />
                여러분의 꿈과 신념을 가꾸어 보셨으면 합니다.
              </p>

              <p>
                세상의 변화와 새로움의 요구를<br />
                분명 현명하게 대처하실 수 있을 것 입니다.
              </p>

              <p className="text-sm sm:text-base text-white font-medium pt-1">
                여러분이 사랑하는 세상으로의 나아감에<br />
                <span className="text-amber-400 font-bold">"예술"</span>이라는<br />
                답을 선물하고자 합니다.
              </p>
            </div>

            {/* Closing Brand Text (Expanded 5% Spacing) */}
            <div className="relative z-10 mt-7 pt-5.5 border-t border-zinc-800/80 text-center max-w-2xl mx-auto space-y-2">
              <p className="text-sm sm:text-base text-zinc-300 font-medium leading-relaxed">
                아트판타지아(ArtFantasia)는<br />
                공공기관·기업·교육기관 영상제작과 오리지널 음악을 창조하는
              </p>
              <p className="text-base sm:text-xl font-black text-amber-400 tracking-tight">
                "대한민국 문화컨텐츠 여성기업 브랜드"입니다.
              </p>
              <div className="pt-1.5 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  중소벤처기업부 여성기업 확인 (제 0113-2025-34993 호)
                </span>
              </div>
            </div>

            {/* Bottom Signature Line (Expanded 5% Spacing) */}
            <div className="relative z-10 mt-7 pt-4.5 border-t border-zinc-800/80 text-center">
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                아트판타지아 대표이사 및 크리에이티브 디렉터 드림
              </p>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Architecture: Pipeline & History - Borderless Container */}
        <div className="mt-12 sm:mt-16 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden text-zinc-900">
          {/* Tab Header Controls - Black Background Target */}
          <div className="flex border-b border-zinc-800 bg-black p-2 sm:p-2.5 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'pipeline'
                  ? 'bg-zinc-900 text-amber-400 shadow-md border border-zinc-700 ring-1 ring-amber-400/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'pipeline' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-transparent'}`} />
              01. 올인원 제작 파이프라인
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-zinc-900 text-amber-400 shadow-md border border-zinc-700 ring-1 ring-amber-400/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'history' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-transparent'}`} />
              02. 대표연혁
            </button>
            <button
              onClick={() => setActiveTab('ci')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'ci'
                  ? 'bg-zinc-900 text-amber-400 shadow-md border border-zinc-700 ring-1 ring-amber-400/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'ci' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-transparent'}`} />
              03. 상징(CI)
            </button>
            <button
              onClick={() => setActiveTab('connect')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'connect'
                  ? 'bg-zinc-900 text-amber-400 shadow-md border border-zinc-700 ring-1 ring-amber-400/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'connect' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-transparent'}`} />
              04. 연결
            </button>
          </div>

          {/* Tab 2: Pipeline (White Background Focus Target) */}
          {activeTab === 'pipeline' && (
            <div className="p-7 sm:p-10 lg:p-12 bg-white text-zinc-900">
              <div className="max-w-5xl mb-8">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight font-apple">
                  기획부터 심의·온에어·마케팅까지 단 하나의 창구
                </h4>
                <p className="mt-2.5 text-sm sm:text-base text-zinc-600 leading-relaxed">
                  외주 외주를 거듭하는 번거로움 없이, 전속 크리에이티브 팀이 기획부터 촬영, 편집, 온에어 및 사후관리(A/S)까지 완벽히 책임집니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {pipelineSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-amber-400 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-2xl font-black text-amber-600 font-mono group-hover:scale-105 inline-block transition-transform">
                        {step.num}
                      </span>
                      <h5 className="text-[15px] sm:text-base font-bold text-zinc-900 mt-2.5 mb-2 leading-snug">
                        {step.title}
                      </h5>
                      <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: History (White Background Focus Target) */}
          {activeTab === 'history' && (
            <div className="p-7 sm:p-10 lg:p-12 bg-white text-zinc-900">
              <div className="max-w-3xl mb-8">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight font-apple">
                  꿈을 향해 끊임없이 달려온 시간들.
                </h4>
                <p className="mt-2.5 text-sm sm:text-base text-zinc-600 leading-relaxed">
                  수많은 브랜드와 공공기관의 파트너로서 그리고 대한민국 넘어 넓은 세상을 표현하기 위해 달려왔습니다.
                </p>
              </div>

              <div className="space-y-6">
                {historyMilestones.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-start gap-4 pb-6 border-b border-zinc-200 last:border-0 last:pb-0"
                  >
                    <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono w-24 shrink-0">
                      {h.year}
                    </div>
                    <div>
                      <h5 className="text-base sm:text-lg font-bold text-zinc-900">
                        {h.title}
                      </h5>
                      <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed font-normal">
                        {h.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Corporate Identity (CI) Window */}
          {activeTab === 'ci' && (
            <div className="p-7 sm:p-10 lg:p-12 bg-white text-zinc-900">
              {/* Header */}
              <div className="max-w-4xl mb-6 sm:mb-8">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight font-apple">
                  상징(CI) - 예술과 기술이 융합된 브랜드 아이덴티티
                </h4>
                <p className="mt-2 text-sm sm:text-base text-zinc-600 leading-relaxed">
                  공식 심볼마크와 워드마크는 시각과 청각의 융합, 자유로운 예술성과 단단한 기술력의 완벽한 조화를 상징합니다.
                </p>
              </div>

              {/* Official CI Logo Showcase Panel (Professional Design Sheet Edition) */}
              <div className="mb-8 sm:mb-9 rounded-2xl bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9] border border-zinc-300/80 p-4 sm:p-7 shadow-sm relative overflow-hidden">
                {/* Professional Design Sheet Dual Grid Background */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-85"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(203, 213, 225, 0.55) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(203, 213, 225, 0.55) 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px',
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-45"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(148, 163, 184, 0.5) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(148, 163, 184, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '120px 120px',
                  }}
                />

                {/* Subtle Ambient Radial Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#F37023]/8 to-[#CF1A5A]/8 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  {/* Design Sheet Top Meta Bar */}
                  <div className="flex items-center justify-between w-full max-w-2xl mb-2 text-[10px] sm:text-[11px] font-mono text-zinc-500 font-semibold tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>DESIGN SHEET // CI BRAND SPECIFICATION</span>
                    </div>
                    <span className="hidden sm:inline text-zinc-400">GRID: 24×24px · SCALE 1:1</span>
                  </div>

                  {/* Logo Display Canvas with Isolation Frame & Construction Guide Lines */}
                  <div className="w-full max-w-2xl py-6 sm:py-8 px-6 sm:px-10 flex items-center justify-center bg-white/95 rounded-xl border border-zinc-300 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative group overflow-hidden">
                    {/* Inner Fine Dot Grid */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-25"
                      style={{
                        backgroundImage: `radial-gradient(circle, rgba(100, 116, 139, 0.5) 1px, transparent 1px)`,
                        backgroundSize: '16px 16px',
                      }}
                    />

                    {/* Construction Guide Center Axis Crosshairs */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-zinc-300/80 pointer-events-none" />
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-zinc-300/80 pointer-events-none" />

                    {/* Corner Guides representing Official Clear Space */}
                    <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-zinc-400 pointer-events-none" />
                    <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-zinc-400 pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-zinc-400 pointer-events-none" />
                    <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-zinc-400 pointer-events-none" />

                    {/* Clear Space Indicator Tag */}
                    <div className="absolute top-2 right-3 text-[9px] font-mono text-zinc-400 font-semibold tracking-wider pointer-events-none select-none">
                      CLEAR SPACE 1.0X
                    </div>

                    <img
                      src="/assets/aistudio/_____013e3715.png"
                      alt="아트판타지아 공식 CI 로고"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/LOGO.png';
                      }}
                      className="w-full max-h-16 sm:max-h-20 md:max-h-22 object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.08)] select-none transition-transform duration-300 group-hover:scale-[1.01] relative z-10"
                      loading="eager"
                    />
                  </div>

                  {/* Color Palette Specification Matrix (Compact) */}
                  <div className="mt-4 pt-4 border-t border-zinc-200/90 w-full flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-zinc-200 shadow-2xs">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#F37023] shadow-inner border border-black/10 inline-block" />
                      <div className="text-left">
                        <span className="font-bold text-zinc-900 block leading-tight text-xs">Orange</span>
                        <span className="text-[10px] text-zinc-500 font-semibold">#F37023</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-zinc-200 shadow-2xs">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#CF1A5A] shadow-inner border border-black/10 inline-block" />
                      <div className="text-left">
                        <span className="font-bold text-zinc-900 block leading-tight text-xs">Magenta</span>
                        <span className="text-[10px] text-zinc-500 font-semibold">#CF1A5A</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-zinc-200 shadow-2xs">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#000000] shadow-inner border border-zinc-700 inline-block" />
                      <div className="text-left">
                        <span className="font-bold text-zinc-900 block leading-tight text-xs">Black Bold</span>
                        <span className="text-[10px] text-zinc-500 font-semibold">#000000</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-zinc-200 shadow-2xs">
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-inner border border-zinc-300 inline-block" />
                      <div className="text-left">
                        <span className="font-bold text-zinc-900 block leading-tight text-xs">Pixel White</span>
                        <span className="text-[10px] text-zinc-500 font-semibold">#FFFFFF</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 CI Architecture Detail Cards (Compact Vertical Proportion) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {/* 1. 플레이 버튼 (Play & Forward) */}
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <h5 className="text-sm sm:text-base font-bold text-zinc-900 mb-1.5 leading-snug">
                      <span className="text-[#F37023] font-black mr-1.5">1.</span>
                      플레이 버튼(Play & Forward)
                    </h5>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/60 mb-2">
                      <p className="text-[11.5px] sm:text-xs font-bold text-amber-950 leading-snug">
                        상상을 현실 콘텐츠로 '재생'하고 미래로 나아가는 추진력
                      </p>
                    </div>
                    <p className="text-[11.5px] sm:text-xs text-black leading-normal font-normal">
                      미디어 영상의 핵심 기호인 플레이(Play) 버튼을 형상화하여, 머릿속에 머물던 상상을 생동감 넘치는 영상과 음악으로 구현해내며 미래를 향해 끊임없이 전진(Forward)하는 과감한 추진력을 상징합니다.
                    </p>
                  </div>
                </div>

                {/* 2. 픽셀 블록 (Pixel & Sound) */}
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <h5 className="text-sm sm:text-base font-bold text-zinc-900 mb-1.5 leading-snug">
                      <span className="text-[#F37023] font-black mr-1.5">2.</span>
                      픽셀 블록(Pixel & Sound)
                    </h5>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-100 border border-zinc-200 mb-2">
                      <p className="text-[11.5px] sm:text-xs font-bold text-zinc-900 leading-snug">
                        시각(디지털 픽셀)과 청각(사운드 웨이브)이 융합된 복합 미디어 아트
                      </p>
                    </div>
                    <p className="text-[11.5px] sm:text-xs text-black leading-normal font-normal">
                      심볼 삼각형 내부의 모자이크 블록은 디지털 시각의 기본 구성요소인 '픽셀(Pixel)'이자 음향의 파동을 시각화한 '사운드 이퀄라이저'로서, 영상과 음악을 하나로 완성하는 독보적인 융합 프로덕션 역량을 나타냅니다.
                    </p>
                  </div>
                </div>

                {/* 3. 오렌지·마젠타 그라데이션 */}
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <h5 className="text-sm sm:text-base font-bold text-zinc-900 mb-1.5 leading-snug">
                      <span className="text-[#F37023] font-black mr-1.5">3.</span>
                      오렌지·마젠타 그라데이션
                    </h5>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200/60 mb-2">
                      <p className="text-[11.5px] sm:text-xs font-bold text-zinc-900 leading-snug">
                        Orange (<span className="text-[#F37023] font-mono">#F37023</span>) → Magenta (<span className="text-[#CF1A5A] font-mono">#CF1A5A</span>)<br />
                        영감이 열정적인 창작물로 피어나는 에너지
                      </p>
                    </div>
                    {/* Visual Gradient Swatch */}
                    <div className="w-full h-2 rounded-full bg-gradient-to-r from-[#F37023] via-[#E83441] to-[#CF1A5A] mb-2 shadow-2xs" />
                    <p className="text-[11.5px] sm:text-xs text-black leading-normal font-normal">
                      영감과 창조의 빛을 상징하는 선명한 오렌지에서 예술적 혼과 헌신적인 열정을 품은 마젠타로 확장되는 색채 스펙트럼은, 세상을 감동시키는 창작 에너지의 역동성을 표현합니다.
                    </p>
                  </div>
                </div>

                {/* 4. 블랙 볼드 폰트 (#000000) */}
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <h5 className="text-sm sm:text-base font-bold text-zinc-900 mb-1.5 leading-snug">
                      <span className="text-[#F37023] font-black mr-1.5">4.</span>
                      블랙 볼드 폰트 (#000000)
                    </h5>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-100 border border-zinc-200 mb-2">
                      <p className="text-[11.5px] sm:text-xs font-bold text-zinc-900 leading-snug">
                        자유로운 예술성을 단단하게 뒷받침하는 기술력과 전문적인 신뢰성
                      </p>
                    </div>
                    {/* Visual Font Specimen */}
                    <div className="p-1.5 sm:p-2 rounded-md bg-white border border-zinc-200 text-center mb-2">
                      <span className="text-base font-black tracking-tight text-black font-sans">
                        ArtFantasia
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 ml-2">HEX #000000</span>
                    </div>
                    <p className="text-[11.5px] sm:text-xs text-black leading-normal font-normal">
                      정갈하고 단단한 블랙 볼드 워드마크는 공공기관과 기업 프로젝트를 흔들림 없이 이끄는 방송급 기술력, 철저한 일정 준수와 엄격한 품질 관리를 통한 확고한 프로페셔널 신뢰성을 상징합니다.
                    </p>
                  </div>
                </div>

                {/* 5. 아트판타지아(Art + Fantasia) - Master Heritage Banner (Full Width) */}
                <div className="p-4 sm:p-5 lg:p-6 rounded-xl bg-gradient-to-r from-amber-500/[0.06] via-rose-500/[0.04] to-zinc-50 border border-amber-300/60 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all duration-300 md:col-span-2 group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                    <div className="max-w-2xl">
                      <h5 className="text-base sm:text-lg font-extrabold text-zinc-900 mb-1.5 leading-snug">
                        <span className="text-[#F37023] font-black mr-1.5">5.</span>
                        아트판타지아(Art + Fantasia)
                      </h5>
                      <div className="p-2.5 sm:p-3 rounded-lg bg-white/90 border border-amber-200/80 mb-2 shadow-2xs">
                        <p className="text-[11.5px] sm:text-xs font-bold text-amber-950 leading-snug">
                          정교한 예술적 완성도(Art)와 형식에 얽매이지 않는 환상적 상상력(Fantasia)의 조화로운 결합
                        </p>
                      </div>
                      <p className="text-[11.5px] sm:text-xs text-black leading-normal font-normal">
                        'Art'의 타협 없는 장인정신과 디테일, 그리고 'Fantasia'의 한계를 두지 않는 무한한 상상력이 조화를 이룹니다. 클라이언트가 전하고자 하는 진심 어린 메시지를 세상에서 가장 감동적이고 매력적인 예술 콘텐츠로 완성해내는 아트판타지아의 영원한 핵심 가치입니다.
                      </p>
                    </div>

                    {/* Visual Synergy Feature Pill */}
                    <div className="lg:w-56 shrink-0 flex flex-col gap-1.5 bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs">
                      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100">
                        <span className="text-[10px] font-bold text-zinc-500 font-mono">BRAND FORMULA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-bold text-[11px]">Art</span>
                        <span className="text-[11px] text-zinc-600 font-medium">정교한 예술적 완성도</span>
                      </div>
                      <div className="text-center text-[10px] font-bold text-amber-600 leading-none">+</div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-gradient-to-r from-[#F37023] to-[#CF1A5A] text-white font-bold text-[11px]">Fantasia</span>
                        <span className="text-[11px] text-zinc-600 font-medium">환상적인 상상력</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: 04. 연결 (Connect & Locations) - Clean White Theme */}
          {activeTab === 'connect' && (
            <div className="p-7 sm:p-10 lg:p-12 bg-white text-zinc-900">


              {/* Slogan & Core Philosophy Headline */}
              <div className="max-w-4xl mb-6 sm:mb-7">
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-snug font-apple">
                  여러분의 이야기가 세상에 울려 퍼지도록
                </h4>
                <p className="text-lg sm:text-xl md:text-2xl text-zinc-700 font-semibold tracking-tight mt-2.5">
                  우리는{' '}
                  <span className="text-amber-600 font-black underline decoration-amber-400/60 underline-offset-4">
                    최선
                  </span>
                  을 다할 것입니다.
                </p>

                {/* Description Lines with Compact Spacing */}
                <div className="mt-5 pt-4 border-t border-zinc-200 max-w-2xl space-y-1.5">
                  <p className="text-sm sm:text-base text-zinc-600 font-medium leading-relaxed">
                    예술을 향한 끝없는 열망 · AI라는 혁신 · 진심을 담은 실천
                  </p>
                  <p className="text-sm sm:text-base text-amber-700 font-bold tracking-tight">
                    A클래스를 향해 끝없이 도전하겠습니다.
                  </p>
                </div>
              </div>

              {/* Minimalist Location Cards on White (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-6 border-t border-zinc-200">
                {/* 1. 제작편집사무소 */}
                <div className="p-5 sm:p-7 rounded-xl bg-zinc-50 border border-zinc-200/90 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all duration-300 group">
                  <h5 className="text-base sm:text-lg font-extrabold text-zinc-900 mb-2.5 tracking-tight font-apple">
                    제작편집사무소
                  </h5>

                  <div className="flex items-start gap-2 text-zinc-600 text-xs sm:text-sm leading-relaxed">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-medium">
                      서울특별시 관악구 관악로 943 (이전 준비 中)
                    </span>
                  </div>
                </div>

                {/* 2. 대구콘텐츠제작센터 */}
                <div className="p-5 sm:p-7 rounded-xl bg-zinc-50 border border-zinc-200/90 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all duration-300 group">
                  <h5 className="text-base sm:text-lg font-extrabold text-zinc-900 mb-2.5 tracking-tight font-apple">
                    대구콘텐츠제작센터
                  </h5>

                  <div className="flex items-start gap-2 text-zinc-600 text-xs sm:text-sm leading-relaxed">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-medium">
                      대구광역시 북구 학정로 132-1 아트판타지아 빌딩
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>



      </div>
    </section>
  );
};
