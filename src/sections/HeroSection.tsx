import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Plus, ChevronDown, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
      setMuted(v === 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const video = videoRef.current;
    if (!bar || !video || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoaded = () => setDuration(video.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    // Keyboard shortcuts
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        video.currentTime -= 10;
      } else if (e.code === 'ArrowRight') {
        video.currentTime += 10;
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        toggleMute();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      document.removeEventListener('keydown', onKeyDown);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [togglePlay, toggleFullscreen, toggleMute]);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <div
        ref={containerRef}
        className="relative w-full h-full"
        onMouseMove={showControls}
        onMouseLeave={() => setControlsVisible(false)}
      >
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/videos/hero-video.mp4"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          aria-label="Shadow Protocol - Hero movie preview"
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.85) 80%)',
          }}
        />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
          <div className="max-w-[1400px] mx-auto">
            {/* Genre Tag */}
            <div className="inline-block mb-4">
              <span className="inline-block px-4 py-1.5 text-xs uppercase tracking-[0.08em] text-[#e2b13c] border border-[rgba(226,177,60,0.4)] rounded-full">
                Action &middot; 2024
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#f5f0e6] leading-tight"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}>
              Shadow Protocol
            </h1>

            {/* Meta Row */}
            <div className="flex items-center gap-4 mt-3 text-sm text-[#8a8278]">
              <span>2h 14m</span>
              <span>&middot;</span>
              <span>HD</span>
              <span>&middot;</span>
              <span className="text-[#e2b13c]">8.4&#9733;</span>
            </div>

            {/* Description */}
            <p className="mt-3 text-base text-[rgba(245,240,230,0.8)] max-w-[520px] leading-relaxed hidden md:block">
              An elite operative must navigate a web of betrayal when a classified mission goes wrong, exposing a conspiracy that reaches the highest levels of power.
            </p>

            {/* CTA Row */}
            <div className="flex items-center gap-3 mt-6">
              <Link
                to="/movie/1"
                className="inline-flex items-center gap-2 bg-[#e2b13c] text-[#0a0a0a] text-sm font-semibold px-8 py-3.5 rounded-md hover:bg-[#f0c04a] transition-colors duration-300"
              >
                <Play size={16} fill="currentColor" /> Watch Now
              </Link>
              <button className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.12)] text-[#f5f0e6] text-sm font-semibold px-8 py-3.5 rounded-md hover:bg-[rgba(255,255,255,0.2)] transition-colors duration-300">
                <Plus size={16} /> My List
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={24} className="text-[#8a8278] opacity-60" />
        </div>

        {/* Video Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 px-6 pb-5 pt-10 transition-opacity duration-400 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          }}
        >
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="w-full h-1 bg-[rgba(255,255,255,0.2)] rounded-full cursor-pointer relative mb-3 group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-[#e2b13c] rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(226,177,60,0.5)]" />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-[#e2b13c] transition-colors p-1"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>

              {/* Time Display */}
              <span className="text-[13px] text-[rgba(255,255,255,0.8)] ml-2 font-mono">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Volume */}
              <div className="flex items-center gap-2 group">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-[#e2b13c] transition-colors p-1"
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-0 opacity-0 group-hover:w-20 group-hover:opacity-100 transition-all duration-300 h-1 accent-[#e2b13c] cursor-pointer"
                />
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-[#e2b13c] transition-colors p-1"
                aria-label="Toggle fullscreen"
              >
                {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
