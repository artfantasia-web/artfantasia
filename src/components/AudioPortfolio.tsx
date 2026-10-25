import React, { useState, useEffect, useRef } from 'react';
import { AUDIO_TRACKS } from '../data/content';
import { AudioTrack, AudioCategory } from '../types';
import { 
  Play, 
  Pause, 
  Volume1, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  X, 
  Radio, 
  Sparkles, 
  Share2, 
  Check, 
  Mic, 
  Clock, 
  Headphones,
  Maximize,
  Minimize,
  Music,
  ArrowUpRight
} from 'lucide-react';
import { StandardSectionHeader } from './StandardSectionHeader';
import { useLanguage } from '../context/LanguageContext';

interface AudioPortfolioProps {
  onOpenInquiry?: () => void;
}

const RADIO_PRODUCTION_PLANS = [
  {
    id: 'narration',
    title: '나레이션 & 스토리텔링',
    en: 'NARRATION & STORY',
    desc: '신뢰도 높은 성우 독백과 감성 스토리텔링으로 귀를 사로잡는 오디오',
    icon: <Mic className="w-5 h-5 text-amber-300" />,
    badge: 'NARRATIVE',
  },
  {
    id: 'dialogue',
    title: '2인 대화 & 시츄에이션 콩트',
    en: 'SITUATION DRAMA',
    desc: '남녀 전문 성우진의 리얼한 상황극과 위트 넘치는 티키타카 대화',
    icon: <Headphones className="w-5 h-5 text-amber-300" />,
    badge: 'DIALOGUE',
  },
  {
    id: 'jingle',
    title: '브랜드 로고송 & 징글·CM송',
    en: 'JINGLE & CM SONG',
    desc: '기억에 맴도는 멜로디와 독창적 인하우스 작곡·보컬 징글 음원',
    icon: <Music className="w-5 h-5 text-amber-300" />,
    badge: 'JINGLE & SONG',
  },
  {
    id: 'ai_hybrid',
    title: 'AI 사운드 & 하이브리드 FX',
    en: 'AI SOUND & HYBRID',
    desc: '최신 생성형 AI 음성 기술과 고해상도 입체 음향 엔지니어링 결합',
    icon: <Sparkles className="w-5 h-5 text-amber-300" />,
    badge: 'AI SOUND',
  },
  {
    id: 'broadcast',
    title: '지상파 20초 & 공익 캠페인',
    en: '20s SPOT & CAMPAIGN',
    desc: 'KOBACO 정식 방송 심의 통과 및 지상파·교통방송 전국 청약 규격',
    icon: <Radio className="w-5 h-5 text-amber-300" />,
    badge: 'BROADCAST',
  },
];

export const AudioPortfolio: React.FC<AudioPortfolioProps> = ({ onOpenInquiry }) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<AudioCategory>('all');
  
  // Dedicated Screening Window Modal State (Matching VideoPortfolio.tsx activeProject style)
  const [screeningTrack, setScreeningTrack] = useState<AudioTrack | null>(null);
  const [isModalPlaying, setIsModalPlaying] = useState<boolean>(true);
  const [modalTime, setModalTime] = useState<number>(0);
  const [modalDuration, setModalDuration] = useState<number>(20);
  const [modalVolume, setModalVolume] = useState<number>(0.85);
  const [isModalMuted, setIsModalMuted] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const modalAudioRef = useRef<HTMLAudioElement | null>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const categories: { id: AudioCategory; label: string }[] = [
    { id: 'all', label: `전체 (${AUDIO_TRACKS.length})` },
    { id: 'radio_cm', label: '나레이션 & 스토리' },
    { id: 'logo_song', label: '브랜드 & 징글' },
    { id: 'public_cm', label: '공익 & 지자체' },
    { id: 'lifestyle', label: '로컬 & 라이프스타일' }
  ];

  const filteredTracks = selectedCategory === 'all'
    ? AUDIO_TRACKS
    : AUDIO_TRACKS.filter(t => t.category === selectedCategory);



  // Open screening window modal with a selected audio track
  const handleOpenScreening = (track: AudioTrack) => {
    setScreeningTrack(track);
    setIsModalPlaying(true);
    setModalTime(0);
    setModalDuration(track.durationSeconds || 20);
  };

  // Close screening window modal and pause audio
  const handleCloseScreening = () => {
    if (modalAudioRef.current) {
      modalAudioRef.current.pause();
    }
    setIsModalPlaying(false);
    setScreeningTrack(null);
  };

  // Handle track switch inside modal or when modal opens
  useEffect(() => {
    if (screeningTrack) {
      setIsModalPlaying(true);
      setModalTime(0);
      setModalDuration(screeningTrack.durationSeconds || 20);

      // Attempt autoplay after audio element is mounted
      const timer = setTimeout(() => {
        if (modalAudioRef.current) {
          modalAudioRef.current.currentTime = 0;
          modalAudioRef.current.volume = isModalMuted ? 0 : modalVolume;
          modalAudioRef.current.play().catch(() => {
            setIsModalPlaying(false);
          });
        }
      }, 50);

      return () => clearTimeout(timer);
    } else {
      if (modalAudioRef.current) {
        modalAudioRef.current.pause();
      }
      setIsModalPlaying(false);
    }
  }, [screeningTrack]);

  // Audio Canvas visualizer loop for screening modal
  useEffect(() => {
    const canvas = modalCanvasRef.current;
    if (!canvas || !screeningTrack) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      phase += 0.08;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = 56;
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        const x = i * (barWidth + 2);
        // Harmonic height formula based on playing state
        let heightMultiplier = isModalPlaying
          ? Math.sin(phase + i * 0.28) * 0.42 + Math.cos(phase * 1.6 + i * 0.12) * 0.32 + 0.52
          : 0.08;

        if (heightMultiplier < 0.05) heightMultiplier = 0.05;
        const barHeight = Math.min(canvas.height, heightMultiplier * (canvas.height - 8));
        const y = canvas.height - barHeight;

        // Rich vibrant gradient matching ArtFantasia orange-red broadcast aesthetic
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, '#fbbf24'); // Amber 400
        grad.addColorStop(0.5, '#f59e0b'); // Amber 500
        grad.addColorStop(1, '#ef4444'); // Red 500

        ctx.fillStyle = isModalPlaying ? grad : '#3f3f46';
        // Rounded bar top
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]) : ctx.rect(x, y, barWidth, barHeight);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isModalPlaying, screeningTrack]);

  // Toggle modal play/pause
  const toggleModalPlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!modalAudioRef.current) return;
    if (isModalPlaying) {
      modalAudioRef.current.pause();
      setIsModalPlaying(false);
    } else {
      modalAudioRef.current.play().catch(() => {});
      setIsModalPlaying(true);
    }
  };

  // Replay modal audio from 0
  const handleModalReplay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!modalAudioRef.current) return;
    modalAudioRef.current.currentTime = 0;
    setModalTime(0);
    modalAudioRef.current.play().catch(() => {});
    setIsModalPlaying(true);
  };

  // Handle seek / scrub on progress bar
  const handleModalSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetDuration = modalDuration || screeningTrack?.durationSeconds || 20;
    const newTime = ratio * targetDuration;
    if (modalAudioRef.current) {
      modalAudioRef.current.currentTime = newTime;
      setModalTime(newTime);
    }
  };

  // Volume slider & mute
  const handleModalVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setModalVolume(clamped);
    setIsModalMuted(clamped === 0);
    if (modalAudioRef.current) {
      modalAudioRef.current.volume = clamped;
      modalAudioRef.current.muted = clamped === 0;
    }
  };

  const handleVolumeBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    handleModalVolumeChange(Math.round(ratio * 100) / 100);
  };

  const toggleModalMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMute = !isModalMuted;
    setIsModalMuted(nextMute);
    if (modalAudioRef.current) {
      modalAudioRef.current.muted = nextMute;
      if (!nextMute && modalVolume === 0) {
        modalAudioRef.current.volume = 0.85;
        setModalVolume(0.85);
      }
    }
  };

  const copyTrackLink = (track: AudioTrack, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}#audio-${track.id}`);
    setCopiedId(track.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatAudioTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const modalProgressPercent = modalDuration > 0 ? (modalTime / modalDuration) * 100 : 0;

  // Cinema Video Showcase player states (Matching VideoPortfolio / CorporatePhilosophy)
  const showcaseVideoRef = useRef<HTMLVideoElement | null>(null);
  const showcaseContainerRef = useRef<HTMLDivElement | null>(null);
  const [isShowcasePlaying, setIsShowcasePlaying] = useState<boolean>(false);
  const [isShowcaseMuted, setIsShowcaseMuted] = useState<boolean>(false);
  const [showcaseVolume, setShowcaseVolume] = useState<number>(0.85);
  const [showcaseProgress, setShowcaseProgress] = useState<number>(0);
  const [showcaseTime, setShowcaseTime] = useState<number>(0);
  const [showcaseDuration, setShowcaseDuration] = useState<number>(154);
  const [showcaseFullscreen, setShowcaseFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showcaseVideoRef.current) {
      showcaseVideoRef.current.muted = false;
    }
    const handleFsChange = () => {
      setShowcaseFullscreen(Boolean(document.fullscreenElement && document.fullscreenElement === showcaseContainerRef.current));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const formatShowcaseTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShowcaseTimeUpdate = () => {
    const v = showcaseVideoRef.current;
    if (!v) return;
    setShowcaseTime(v.currentTime);
    const dur = v.duration || 33;
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
    const dur = v.duration && !isNaN(v.duration) && v.duration > 0 ? v.duration : (showcaseDuration || 33);
    const targetTime = ratio * dur;
    v.currentTime = targetTime;
    setShowcaseTime(targetTime);
  };

  const handleShowcaseFullscreenToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showcaseContainerRef.current) return;
    if (!document.fullscreenElement) {
      showcaseContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
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

  return (
    <section id="audio" className="pt-6 sm:pt-8 pb-16 sm:pb-24 border-b border-zinc-800 bg-[#09090b] relative font-sans text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <StandardSectionHeader
          title={language === 'ko' ? "라디오광고" : "Radio CM"}
          subtitle={
            language === 'ko' ? (
              <>
                기획, 제작, 방송 심의까지...{' '}
                <span className="font-black text-amber-300 underline decoration-amber-400/60 underline-offset-4">
                  100% 책임 진행
                </span>
              </>
            ) : (
              "Planning, production, to broadcast review... 100% guaranteed delivery"
            )
          }
        />

        {/* Cinema Video Showcase: "세상을 영상과 음악으로 표현합니다" // 00:33 - Matching VideoPortfolio */}
        <div className="w-full max-w-5xl mx-auto my-12 relative group">
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute -inset-2 rounded-2xl bg-amber-500/[0.04] blur-2xl pointer-events-none" />

          {/* Interactive Cinema Video Container */}
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
                  00:{formatShowcaseTime(showcaseTime)} <span className="text-zinc-500 font-normal">/ 00:02:34:00</span>
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
                src="https://res.cloudinary.com/iwcoiohr/video/upload/v1792471213/%EB%8B%B9%EC%8B%A0%EC%9D%80_%EC%A3%BC%EC%9D%B8%EA%B3%B5_%EC%B5%9C%EA%B3%A0%EC%9D%98_%EB%B8%8C%EB%9E%9C%EB%93%9C_%EC%9E%85%EB%8B%88%EB%8B%A4.mp4"
                poster="/assets/aistudio/2_19c8f5de.jpg"
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

              {/* Custom Poster Thumbnail (Image 2 - Moving Forward) */}
              {!isShowcasePlaying && showcaseTime === 0 && (
                <img
                  src="/assets/aistudio/2_19c8f5de.jpg"
                  alt="당신은 주인공 최고의 브랜드 입니다 썸네일 (Moving Forward)"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                />
              )}

              {/* Cinematic Center Overlay & Play Button */}
              {!isShowcasePlaying && (
                <div
                  onClick={handleScreenInteraction}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer z-15 bg-black/15 hover:bg-black/25 transition-colors group/overlay"
                >
                  <span
                    className="notranslate text-xs sm:text-sm font-mono tracking-wider font-bold text-amber-400 uppercase mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                    translate="no"
                  >
                    Brand Film · Special Campaign · Vision
                  </span>
                  <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mb-6 font-apple">
                    당신은 주인공 최고의 브랜드 입니다
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
                      aria-label={isShowcaseMuted || showcaseVolume === 0 ? '음소거 해제' : '음소거'}
                    >
                      {isShowcaseMuted || showcaseVolume === 0 ? (
                        <VolumeX className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-zinc-300" />
                      )}
                      <span className="text-[11px] font-mono text-zinc-300 font-semibold hidden sm:inline">
                        {isShowcaseMuted || showcaseVolume === 0 ? 'MUTE' : 'AUDIO ON'}
                      </span>
                    </button>

                    {/* Volume Slider */}
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
                    00:{formatShowcaseTime(showcaseTime)} <span className="text-zinc-500 font-normal">/ 00:02:34:00</span>
                  </span>
                </div>

                <button
                  onClick={handleShowcaseFullscreenToggle}
                  className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 cursor-pointer"
                  aria-label={showcaseFullscreen ? '전체화면 종료' : '전체화면'}
                >
                  {showcaseFullscreen ? <Minimize className="w-4 h-4 text-zinc-300" /> : <Maximize className="w-4 h-4 text-zinc-300" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Radio Production Pipeline & Style Example Plans */}
        <div className="w-full my-8 sm:my-10 pt-6 border-t border-zinc-800/80 font-google">
          {/* Narrative Headline */}
          <div className="mb-6 text-center flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-google text-center">
              아트판타지아의 라디오광고제작플로우는
            </h3>
            <p className="mt-2.5 text-sm sm:text-base font-semibold text-amber-400 font-google text-center flex items-center justify-center gap-2 flex-wrap">
              <span className="text-amber-400 font-bold shrink-0">◉</span>
              <span>
                원하시는 형태에 맞춰 <span className="font-extrabold text-amber-300 underline decoration-amber-400/60 underline-offset-4">최적의 해답</span>을 제공해 드립니다.
              </span>
            </p>
          </div>

          {/* 1. Process Flow Pipeline (광고제작에서 방송송출까지) */}
          <div className="my-6 font-google">
            <div className="flex items-center gap-2.5 mb-3.5 sm:mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
              <span className="text-[15px] sm:text-[17.5px] font-bold font-google text-zinc-100 tracking-normal">
                광고제작에서 방송송출까지
              </span>
            </div>

            {/* Process Flow Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {/* Step 1: 광고 소재 기획 & AI 작곡·음원 제작 */}
              <div className="relative rounded-xl bg-zinc-950/85 border border-zinc-800/80 hover:border-blue-400/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.18)] flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="h-24 rounded-lg overflow-hidden relative mb-3 bg-zinc-900 border border-zinc-800/50">
                    <img
                      src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop"
                      alt="라디오 광고 소재 직접 기획 및 AI 음원 제작"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-blue-900/25 transition-colors duration-300" />
                  </div>

                  <div className="mb-2">
                    <span className="inline-block text-[11px] font-google font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 backdrop-blur-sm shadow-sm">
                      1단계
                    </span>
                  </div>

                  <h4 className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5 leading-snug font-google">
                    광고 소재 기획 & AI 작곡·음원 제작
                  </h4>
                  <p className="text-[12.5px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal font-google">
                    카피, 로고송·징글 작곡, AI 사운드를 접목한 음원 등. 모두 직접 기획·제작합니다.
                  </p>
                </div>
              </div>

              {/* Step 2: 전문 성우 보이스 캐스팅 & AI 보이스 연출 */}
              <div className="relative rounded-xl bg-zinc-950/85 border border-zinc-800/80 hover:border-blue-400/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.18)] flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="h-24 rounded-lg overflow-hidden relative mb-3 bg-zinc-900 border border-zinc-800/50">
                    <img
                      src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop"
                      alt="전문 스튜디오 성우 보이스 레코딩 및 AI 음성 연출"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-blue-900/25 transition-colors duration-300" />
                  </div>

                  <div className="mb-2">
                    <span className="inline-block text-[11px] font-google font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 backdrop-blur-sm shadow-sm">
                      2단계
                    </span>
                  </div>

                  <h4 className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5 leading-snug font-google">
                    전문 성우 캐스팅 & AI 보이스 연출
                  </h4>
                  <p className="text-[12.5px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal font-google">
                    EBS, KBS, 투니버스, 대원 출신 공채 전문 성우 & 글로벌 성우 매칭, AI 음성 튜닝 등 최적의 톤앤매너를 완성합니다.
                  </p>
                </div>
              </div>

              {/* Step 3: KOBACO 심의 원스톱 대행 */}
              <div className="relative rounded-xl bg-zinc-950/85 border border-zinc-800/80 hover:border-blue-400/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.18)] flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="h-24 rounded-lg overflow-hidden relative mb-3 bg-white border border-zinc-700/60 flex items-center justify-center p-2.5">
                    <img
                      src="/assets/aistudio/images_31cf2bb4.png"
                      alt="KOBACO 한국방송광고진흥공사 심의 원스톱 대행"
                      className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  <div className="mb-2">
                    <span className="inline-block text-[11px] font-google font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 backdrop-blur-sm shadow-sm">
                      3단계
                    </span>
                  </div>

                  <h4 className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5 leading-snug font-google">
                    KOBACO 심의 원스톱 대행
                  </h4>
                  <p className="text-[12.5px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal font-google">
                    한국방송광고진흥공사 방송 심의 규격(-24 LKFS) 기준 음향 마스터링 및 심의 신청을 전담 대행합니다.
                  </p>
                </div>
              </div>

              {/* Step 4: 방송사 송출 청약 연계 */}
              <div className="relative rounded-xl bg-zinc-950/85 border border-zinc-800/80 hover:border-blue-400/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.18)] flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="h-24 rounded-lg overflow-hidden relative mb-3 bg-zinc-900 border border-zinc-800/50">
                    <img
                      src="/assets/aistudio/____342d415d.jpg"
                      alt="자동차에서 라디오를 청취 중인 부부 - 방송사 송출 청약 연계"
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-blue-900/25 transition-colors duration-300" />
                  </div>

                  <div className="mb-2">
                    <span className="inline-block text-[11px] font-google font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 backdrop-blur-sm shadow-sm">
                      4단계
                    </span>
                  </div>

                  <h4 className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5 leading-snug font-google">
                    방송사 송출 청약 연계
                  </h4>
                  <p className="text-[12.5px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal font-google">
                    음원 완성 즉시 라디오 프로그램 청약으로 온에어를 완성합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* 2. Format & Style Plans Box Grid (5개 라디오광고 제작스타일 예시안) */}
          <div className="my-6 pt-5 border-t border-zinc-800/60 font-google">
            <div className="flex items-center gap-2.5 mb-3.5 sm:mb-4">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.95)] ring-2 ring-amber-300/40" />
              <span className="text-[15px] sm:text-[17.5px] font-bold font-google text-zinc-100 tracking-normal">
                제작 스타일 & 포맷 예시안
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5 font-google">
              {RADIO_PRODUCTION_PLANS.map((plan, idx) => (
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

          {/* Radio Ad Production Inquiry Banner & Gateway - Minimalist White Edition */}
          <div
            onClick={onOpenInquiry}
            className="group relative p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md my-6 cursor-pointer font-google transition-all duration-200"
          >
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 text-center lg:text-left">
              <div className="flex-1 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                  <span>원스톱 라디오광고 & 맞춤 견적 상담</span>
                </div>
                
                <h4 className="text-base sm:text-lg lg:text-[20px] font-bold text-zinc-900 tracking-tight leading-snug">
                  원하시는 제작 스타일과 방송 송출 플랜에 맞춘 최적의 라디오 사운드 솔루션
                </h4>
                
                <p className="text-xs sm:text-[13.5px] text-zinc-500 leading-relaxed font-normal">
                  위 5개 제작 스타일을 바탕으로, 기획부터 성우 섭외·작곡·KOBACO 심의·방송사 청약까지 <strong className="font-semibold text-zinc-800">100% 책임 진행</strong>해 드립니다.
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
                  <span>라디오광고 제작 문의 / 견적 요청</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* Portfolio Showcase Header & Subtitle - Unified with VideoPortfolio */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-zinc-800/80">
          <div className="mb-6 sm:mb-8 text-center flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-apple text-center">
              라디오광고제작 포트폴리오
            </h3>
            <p className="mt-2 text-sm sm:text-base font-medium text-amber-400 flex items-center justify-center gap-2 flex-wrap font-apple text-center">
              <span className="text-amber-400 font-bold shrink-0 text-sm sm:text-base">◉</span>
              <span className="text-amber-400 font-semibold text-sm sm:text-base">
                기획,성우섭외,작곡,사운드디자인,심의 등 <span className="font-black text-amber-300 underline decoration-amber-400/60 underline-offset-4">100% 책임 제작</span> 음원만 표기됩니다.
              </span>
            </p>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-4 font-apple">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-bold'
                    : 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Track Playlist Table (Studio Master Tracklist) */}
        <div className="mt-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden font-google shadow-2xl">
          {/* Table Column Headers (상단 색 유지) */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3.5 bg-zinc-900/90 border-b border-zinc-800 text-xs font-mono text-zinc-400 tracking-wider">
            <div className="col-span-12 sm:col-span-9 flex items-center gap-4">
              <span className="w-8 text-center text-zinc-500">#</span>
              <span>클라이언트 / 작품명 & 작품설명</span>
            </div>
          </div>

          {/* Track Rows (하단 작품설명 영역 - 선명한 구분선 및 한 줄 요약 표현) */}
          <div className="bg-zinc-100 divide-y-2 divide-zinc-300">
            {filteredTracks.map((track) => {
              const isSelected = screeningTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => handleOpenScreening(track)}
                  className={`px-4 sm:px-6 py-4 sm:py-4.5 flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 sm:items-center transition-all cursor-pointer group bg-zinc-100 ${
                    isSelected
                      ? 'bg-amber-100/90 border-l-4 border-l-amber-500'
                      : 'hover:bg-zinc-200/70 border-l-4 border-l-transparent'
                  }`}
                >
                  {/* Left: Play Icon / Client & Title & Description */}
                  <div className="sm:col-span-9 flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                    {/* Index / Play Button */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all bg-white group-hover:bg-amber-400 text-zinc-800 group-hover:text-black border border-zinc-300 group-hover:border-amber-400 shadow-sm mt-0.5 sm:mt-0">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>

                    {/* Client, Title & Description (한 줄 요약) */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-zinc-800 bg-white px-2.5 py-0.5 rounded border border-zinc-300 font-google tracking-tight shadow-2xs">
                          {track.client}
                        </span>
                        {track.broadcastChannel ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-950 bg-amber-300/40 px-2.5 py-0.5 rounded-full border border-amber-400/70 shadow-2xs tracking-tight">
                            <Radio className="w-3 h-3 text-amber-700 shrink-0" />
                            <span>{track.broadcastChannel}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-950 bg-amber-300/40 px-2.5 py-0.5 rounded-full border border-amber-400/70 shadow-2xs tracking-tight">
                            <Radio className="w-3 h-3 text-amber-700 shrink-0" />
                            <span>{track.categoryLabel}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-base sm:text-[17px] font-extrabold text-zinc-900 group-hover:text-amber-700 transition-colors tracking-tight leading-snug mt-1 font-google truncate">
                        {track.title}
                      </h4>
                      <p className="mt-0.5 text-xs sm:text-[13px] text-zinc-600 font-normal font-google truncate" title={track.description}>
                        {track.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Duration & Actions */}
                  <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-3 text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200">
                    <span className="font-mono text-amber-950 font-bold tabular-nums text-xs sm:text-[13px] px-2.5 py-1 rounded-md bg-amber-200/60 border border-amber-300/80">
                      {track.duration}
                    </span>

                    {/* Direct Screening Window Trigger Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenScreening(track);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-amber-400 text-white hover:text-black font-bold text-xs transition-all flex items-center gap-1.5 border border-zinc-800 hover:border-amber-400 cursor-pointer shadow-sm group-hover:scale-[1.02]"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>듣기</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dedicated Audio Screening Window Modal (새로운 창으로 재생 - Matching VideoPortfolio modal design) */}
        {screeningTrack && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={handleCloseScreening}
          >
            <div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-zinc-900 border-0 flex flex-col font-apple animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header Bar */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-100 bg-white sticky top-0 z-20 backdrop-blur-md">
                <div className="flex items-center gap-2.5 truncate mr-4">
                  <span className="px-2.5 py-0.5 rounded bg-amber-50 text-[11px] font-mono text-amber-700 uppercase font-bold shrink-0 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    AUDIO SCREENING
                  </span>
                  <span className="text-xs font-mono text-zinc-500 shrink-0">{screeningTrack.client}</span>
                  <span className="text-zinc-300 shrink-0">|</span>
                  <span className="text-sm font-bold text-zinc-900 truncate">{screeningTrack.title}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => copyTrackLink(screeningTrack, e)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                    title={copiedId === screeningTrack.id ? "링크 복사 완료!" : "공유하기"}
                    aria-label="공유하기"
                  >
                    {copiedId === screeningTrack.id ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseScreening}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                    aria-label="닫기"
                    title="닫기"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Real Audio Player Screen / Studio Broadcast Console - Fully Responsive on Mobile & Desktop */}
              <div className="relative bg-zinc-950 text-white rounded-xl sm:rounded-2xl p-3 sm:p-5 mx-2.5 sm:mx-5 my-2.5 sm:my-4 shadow-2xl border border-zinc-800 overflow-hidden select-none flex flex-col justify-center items-center gap-2 sm:gap-2.5 w-[calc(100%-1.25rem)] sm:w-[calc(100%-2.5rem)]">
                {/* Hidden HTML5 Audio Element connected to uploaded file */}
                {screeningTrack.audioUrl && (
                  <audio
                    ref={modalAudioRef}
                    src={screeningTrack.audioUrl}
                    preload="auto"
                    onTimeUpdate={(e) => {
                      setModalTime(e.currentTarget.currentTime);
                    }}
                    onLoadedMetadata={(e) => {
                      const dur = e.currentTarget.duration;
                      if (dur && !isNaN(dur) && dur > 0) {
                        setModalDuration(dur);
                      }
                    }}
                    onEnded={() => {
                      setIsModalPlaying(false);
                      setModalTime(0);
                    }}
                    onPlay={() => setIsModalPlaying(true)}
                    onPause={() => setIsModalPlaying(false)}
                  />
                )}

                {/* Subtle Studio Lighting Glow Accents */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Deck Info Ribbon - Centered */}
                <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 pb-2 border-b border-zinc-800/80 text-[10.5px] sm:text-xs font-mono text-zinc-400 w-full text-center">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>KOBACO -24 LKFS 방송 표준 마스터링</span>
                  </span>
                  <span className="text-zinc-600 hidden xs:inline">·</span>
                  <span className="hidden xs:inline">STEREO 48kHz / 24bit</span>
                </div>

                {/* Center Audio Visualizer Screen - Slim Compact Height & Centered */}
                <div className="my-1 sm:my-1.5 relative z-10 w-full">
                  {/* Dynamic Frequency Waveform Canvas */}
                  <div 
                    onClick={handleModalSeek}
                    className="h-8 sm:h-9 bg-zinc-900/90 rounded-lg sm:rounded-xl border border-zinc-800 p-1 sm:p-1.5 overflow-hidden relative cursor-pointer hover:border-amber-400/50 transition-colors group/wave shadow-inner w-full"
                    title="클릭하여 원하는 구간으로 이동"
                  >
                    <canvas
                      ref={modalCanvasRef}
                      width={900}
                      height={36}
                      className="w-full h-full object-cover"
                    />

                    {/* Glowing Playback Progress Cursor Line */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_8px_#f59e0b] pointer-events-none transition-all duration-75"
                      style={{ left: `${modalProgressPercent}%` }}
                    />

                    {/* Hover Seek Hint */}
                    <div className="absolute bottom-1 right-2 px-1.5 py-0.2 rounded bg-black/70 text-[9px] font-mono text-zinc-400 pointer-events-none opacity-0 group-hover/wave:opacity-100 transition-opacity">
                      구간 이동
                    </div>
                  </div>

                  {/* Scrubber Time Bar */}
                  <div 
                    onClick={handleModalSeek}
                    className="mt-1.5 w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden cursor-pointer relative hover:h-2 transition-all"
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-full shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                      style={{ width: `${modalProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Deck Controls Cluster - Mobile Optimized & Fully Visible */}
                <div className="relative z-10 pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between sm:justify-center gap-2 sm:gap-6 font-apple w-full">
                  {/* Playback Controls (Play/Pause, Replay, Time Readout) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={toggleModalPlay}
                      className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-amber-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
                    >
                      {isModalPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-black" />
                          <span>일시 정지</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                          <span>재생하기</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleModalReplay}
                      className="w-7 h-7 sm:w-7.5 sm:h-7.5 p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="처음부터 다시 재생"
                      aria-label="처음부터 다시 재생"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1 text-[11px] sm:text-xs font-mono px-1 text-zinc-400 shrink-0">
                      <span className="text-amber-400 font-bold tabular-nums">{formatAudioTime(modalTime)}</span>
                      <span className="text-zinc-600">/</span>
                      <span className="tabular-nums">{formatAudioTime(modalDuration)}</span>
                    </div>
                  </div>

                  <span className="text-zinc-700 hidden md:inline">|</span>

                  {/* Volume Control - Responsive Width for Mobile Screens */}
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900/90 px-2 sm:px-2.5 py-1 rounded-lg border border-zinc-800/90 shadow-inner shrink-0">
                    <button
                      type="button"
                      onClick={toggleModalMute}
                      className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-700 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                      title={isModalMuted ? '음소거 해제' : '음소거'}
                      aria-label="음소거 토글"
                    >
                      {isModalMuted || modalVolume === 0 ? (
                        <VolumeX className="w-3.5 h-3.5 text-red-400" />
                      ) : modalVolume < 0.4 ? (
                        <Volume1 className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>

                    <div className="relative flex items-center group/vol">
                      <div
                        onClick={handleVolumeBarClick}
                        className="w-14 sm:w-20 md:w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative hover:h-2 transition-all border border-zinc-700/60"
                        title="클릭하여 볼륨 조절"
                      >
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-75 shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                          style={{ width: `${isModalMuted ? 0 : Math.round(modalVolume * 100)}%` }}
                        />
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isModalMuted ? 0 : modalVolume}
                        onChange={(e) => handleModalVolumeChange(parseFloat(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="볼륨 조절 슬라이더"
                      />
                    </div>

                    <span className="text-[10px] font-mono tabular-nums font-bold text-amber-400 w-6 text-right">
                      {isModalMuted || modalVolume === 0 ? (
                        <span className="text-red-400">OFF</span>
                      ) : (
                        `${Math.round(modalVolume * 100)}%`
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Metadata Header - Clean & Streamlined across all radio tracks */}
              <div className="p-5 sm:p-6 bg-white">
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 font-mono mb-1.5">
                  <span className="text-amber-600 font-bold">{screeningTrack.client}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-zinc-600">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {screeningTrack.duration} (-24 LKFS 방송 규격)
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 leading-tight">
                  {screeningTrack.title}
                </h3>

                {/* 하단: 송출 채널 & 기획 의도 한 줄 표현 div */}
                {(screeningTrack.broadcastChannel || screeningTrack.description) && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-100 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
                    {screeningTrack.broadcastChannel && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Radio className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-bold text-zinc-900">송출 채널:</span>
                        <span className="text-zinc-700 font-medium">{screeningTrack.broadcastChannel}</span>
                      </div>
                    )}
                    {screeningTrack.broadcastChannel && screeningTrack.description && (
                      <span className="text-zinc-300 hidden sm:inline">·</span>
                    )}
                    {screeningTrack.description && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-zinc-900 shrink-0">기획 의도:</span>
                        <span className="text-zinc-700 font-medium truncate" title={screeningTrack.description}>
                          {screeningTrack.description}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
