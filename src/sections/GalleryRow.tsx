import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Movie } from '../types/movie';

gsap.registerPlugin(ScrollTrigger);

interface GalleryRowProps {
  id?: string;
  title: string;
  movies: Movie[];
  bgColor?: string;
}

export default function GalleryRow({ id, title, movies, bgColor = '#0a0a0a' }: GalleryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    // Drag to scroll
    const onMouseDown = (e: MouseEvent) => {
      isDownRef.current = true;
      row.classList.add('active');
      startXRef.current = e.pageX - row.offsetLeft;
      scrollLeftRef.current = row.scrollLeft;
    };

    const onMouseLeave = () => {
      isDownRef.current = false;
      row.classList.remove('active');
    };

    const onMouseUp = () => {
      isDownRef.current = false;
      row.classList.remove('active');
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDownRef.current) return;
      e.preventDefault();
      const x = e.pageX - row.offsetLeft;
      const walk = (x - startXRef.current) * 2;
      row.scrollLeft = scrollLeftRef.current - walk;
    };

    // Wheel horizontal scroll
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        row.scrollLeft += e.deltaY;
      }
    };

    row.addEventListener('mousedown', onMouseDown);
    row.addEventListener('mouseleave', onMouseLeave);
    row.addEventListener('mouseup', onMouseUp);
    row.addEventListener('mousemove', onMouseMove);
    row.addEventListener('wheel', onWheel, { passive: false });

    // GSAP scroll-triggered entrance animation
    const cards = row.querySelectorAll('.movie-card');
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      });
    });

    return () => {
      row.removeEventListener('mousedown', onMouseDown);
      row.removeEventListener('mouseleave', onMouseLeave);
      row.removeEventListener('mouseup', onMouseUp);
      row.removeEventListener('mousemove', onMouseMove);
      row.removeEventListener('wheel', onWheel);
      ctx.revert();
    };
  }, []);

  return (
    <section id={id} className="py-16 md:py-20" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 mb-8">
        <h2 className="font-display text-2xl md:text-4xl font-bold text-[#f5f0e6]">{title}</h2>
        <Link
          to={`/category/${title}`}
          className="text-sm text-[#e2b13c] hover:opacity-70 transition-opacity"
        >
          View All &rarr;
        </Link>
      </div>

      {/* Gallery Wrapper with gradient edges */}
      <div className="relative overflow-hidden">
        {/* Left gradient edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 md:w-20 z-[5] pointer-events-none"
          style={{ background: `linear-gradient(to right, ${bgColor}, transparent)` }}
        />
        {/* Right gradient edge */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 md:w-20 z-[5] pointer-events-none"
          style={{ background: `linear-gradient(to left, ${bgColor}, transparent)` }}
        />

        {/* Scrollable Row */}
        <div
          ref={rowRef}
          className="flex gap-5 px-6 md:px-12 overflow-x-auto scroll-smooth scrollbar-hide cursor-grab active:cursor-grabbing"
        >
          {movies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="movie-card flex-shrink-0 w-[280px] md:w-[320px] h-[158px] md:h-[180px] rounded-lg overflow-hidden relative group"
              style={{
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover Overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(transparent 40%, rgba(10,10,10,0.9))',
                }}
              >
                <h3 className="text-base font-semibold text-[#f5f0e6]">{movie.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[13px] text-[#e2b13c] font-medium">{movie.rating}&#9733;</span>
                  <span className="text-xs text-[#8a8278]">{movie.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
