import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from 'lucide-react';

export const PassionVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(33);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
  }, []);

  // Track fullscreen state change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Video playback controls with robust promise handling & bubbling prevention
  const handlePlayToggle = (e?: React.MouseEvent) => {
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
            setShowControls(true);
          })
          .catch((error) => {
            console.warn('Playback error or blocked by browser policy, attempting muted fallback:', error);
            video.muted = true;
            setIsMuted(true);
            video
              .play()
              .then(() => {
                setIsPlaying(true);
                setShowControls(true);
              })
              .catch((err) => {
                console.error('Video playback failed:', err);
              });
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const dur = video.duration && !isNaN(video.duration) && video.duration > 0 ? video.duration : (duration || 33);
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
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
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
      }, 3000);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-8 sm:mt-10 w-full relative">
      {/* Cinema Video Showcase: Reduced to match exact size of VideoPortfolio video (max-w-5xl mx-auto) */}
      <div className="w-full max-w-5xl mx-auto relative group">
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute -inset-2 rounded-2xl bg-amber-500/[0.04] blur-2xl pointer-events-none" />

        {/* Interactive Cinema Video Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
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
                00:{formatTime(currentTime)} <span className="text-zinc-500 font-normal">/ 00:00:33:00</span>
              </span>
            </div>
          </div>

          {/* Video Player Screen */}
          <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center group">
            <video
              ref={videoRef}
              src="https://res.cloudinary.com/iwcoiohr/video/upload/v1792117574/AMBIITION.mp4"
              poster="/assets/aistudio/568_004ffe0d.jpg"
              playsInline
              muted={isMuted}
              preload="metadata"
              onClick={handlePlayToggle}
              className="w-full h-full object-cover block cursor-pointer"
              onPlay={() => {
                setIsPlaying(true);
                setShowControls(true);
              }}
              onPause={() => {
                setIsPlaying(false);
                setShowControls(true);
              }}
              onTimeUpdate={() => {
                setCurrentTime(videoRef.current?.currentTime || 0);
              }}
              onLoadedMetadata={() => {
                setDuration(videoRef.current?.duration || 33);
              }}
              onEnded={() => {
                setIsPlaying(false);
                setShowControls(true);
              }}
            />

            {/* Custom Poster Thumbnail (568 - Volcanic Caldera Eruption) */}
            {!isPlaying && currentTime === 0 && (
              <img
                src="/assets/aistudio/568_004ffe0d.jpg"
                alt="기업 철학 영상 썸네일 (568)"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
              />
            )}

            {/* Cinematic Center Overlay & Play Button */}
            {!isPlaying && (
              <div
                onClick={handlePlayToggle}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer z-15 bg-black/15 hover:bg-black/25 transition-colors group/overlay"
              >
                <span
                  className="notranslate text-xs sm:text-sm font-mono tracking-wider font-bold text-amber-400 uppercase mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                  translate="no"
                >
                  Brand Film · Passion · Vision
                </span>
                <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mb-6 font-apple">
                  열정은 세상에 알려져야 하니까!
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

            {/* Player Controls Overlay */}
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
    </div>
  );
};
