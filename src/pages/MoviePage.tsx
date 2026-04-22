import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, Plus, ArrowLeft, Star, Clock, Calendar,
  Volume2, VolumeX, Maximize, SkipBack, SkipForward,
  Heart, Share2
} from 'lucide-react';
import { getMovieById, getMoviesByGenre } from '../data/movieData';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movie = getMovieById(Number(id));
  const relatedMovies = movie ? getMoviesByGenre(movie.genre).filter(m => m.id !== movie.id).slice(0, 4) : [];

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [inList, setInList] = useState(false);
  const [liked, setLiked] = useState(false);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const video = videoRef.current;
    if (!bar || !video || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        video.currentTime -= 10;
      } else if (e.code === 'ArrowRight') {
        video.currentTime += 10;
      } else if (e.code === 'KeyF') {
        video.parentElement?.requestFullscreen();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [togglePlay]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-[#f5f0e6] mb-4">Movie Not Found</h1>
          <Link to="/" className="text-[#e2b13c] hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />

      {/* Video Player Area */}
      <div className="relative pt-16 bg-black">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#8a8278] hover:text-[#e2b13c] transition-colors mb-4 text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Main Player */}
        <div className="relative w-full aspect-video bg-black max-h-[70vh]">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src="/videos/hero-video.mp4"
            poster={movie.poster}
            playsInline
            preload="metadata"
            aria-label={`${movie.title} - Full movie player`}
          />

          {/* Big Play Button Overlay */}
          {!playing && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] cursor-pointer"
              onClick={togglePlay}
            >
              <div className="w-20 h-20 rounded-full bg-[rgba(226,177,60,0.9)] flex items-center justify-center hover:scale-110 transition-transform">
                <Play size={32} fill="#0a0a0a" className="text-[#0a0a0a] ml-1" />
              </div>
            </div>
          )}

          {/* Controls */}
          <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}
          >
            {/* Progress */}
            <div
              ref={progressRef}
              className="w-full h-1.5 bg-[rgba(255,255,255,0.2)] rounded-full cursor-pointer relative mb-3 group"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-[#e2b13c] rounded-full relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(226,177,60,0.5)]" />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} className="text-white hover:text-[#e2b13c] transition-colors p-1">
                  {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                <button
                  onClick={() => { if (videoRef.current) videoRef.current.currentTime -= 10; }}
                  className="text-white hover:text-[#e2b13c] transition-colors p-1"
                >
                  <SkipBack size={18} />
                </button>
                <button
                  onClick={() => { if (videoRef.current) videoRef.current.currentTime += 10; }}
                  className="text-white hover:text-[#e2b13c] transition-colors p-1"
                >
                  <SkipForward size={18} />
                </button>
                <span className="text-xs text-[rgba(255,255,255,0.8)] ml-2 font-mono">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !videoRef.current.muted;
                      setMuted(videoRef.current.muted);
                    }
                  }}
                  className="text-white hover:text-[#e2b13c] transition-colors p-1"
                >
                  {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button
                  onClick={() => videoRef.current?.parentElement?.requestFullscreen()}
                  className="text-white hover:text-[#e2b13c] transition-colors p-1"
                >
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left - Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 text-xs uppercase tracking-wider text-[#e2b13c] border border-[rgba(226,177,60,0.4)] rounded-full">
                {movie.genre}
              </span>
              <span className="text-xs text-[#8a8278]">{movie.year}</span>
              <span className="text-xs text-[#e2b13c] font-medium">{movie.quality}</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-[#f5f0e6]">{movie.title}</h1>

            <div className="flex items-center gap-5 mt-4 text-sm text-[#8a8278]">
              <span className="flex items-center gap-1.5">
                <Star size={16} className="text-[#e2b13c]" /> {movie.rating}/10
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} /> {movie.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} /> {movie.year}
              </span>
            </div>

            <p className="mt-6 text-base text-[rgba(245,240,230,0.8)] leading-relaxed max-w-[700px]">
              {movie.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={togglePlay}
                className="inline-flex items-center gap-2 bg-[#e2b13c] text-[#0a0a0a] text-sm font-semibold px-8 py-3 rounded-md hover:bg-[#f0c04a] transition-colors"
              >
                <Play size={16} fill="currentColor" /> {playing ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={() => setInList(!inList)}
                className={`inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-md transition-colors ${
                  inList
                    ? 'bg-[#e2b13c] text-[#0a0a0a]'
                    : 'bg-[rgba(255,255,255,0.12)] text-[#f5f0e6] hover:bg-[rgba(255,255,255,0.2)]'
                }`}
              >
                <Plus size={16} /> {inList ? 'In List' : 'My List'}
              </button>
              <button
                onClick={() => setLiked(!liked)}
                className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                  liked ? 'bg-red-500/20 text-red-500' : 'bg-[rgba(255,255,255,0.12)] text-[#f5f0e6] hover:bg-[rgba(255,255,255,0.2)]'
                }`}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
              </button>
              <button className="w-10 h-10 rounded-md flex items-center justify-center bg-[rgba(255,255,255,0.12)] text-[#f5f0e6] hover:bg-[rgba(255,255,255,0.2)] transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Right - Poster */}
          <div className="lg:w-[300px] flex-shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-lg"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            />
          </div>
        </div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-[#f5f0e6] mb-6">More in {movie.genre}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {relatedMovies.map((m) => (
                <Link to={`/movie/${m.id}`} key={m.id} className="group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                    <img
                      src={m.poster}
                      alt={m.title}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-[#f5f0e6] group-hover:text-[#e2b13c] transition-colors line-clamp-1">
                    {m.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
