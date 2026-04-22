import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTrendingMovies } from '../data/movieData';

export default function CarouselSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentAngleRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const movies = getTrendingMovies();
  const cardCount = movies.length;
  const angleStep = 360 / cardCount;
  const radius = 380;

  const rotateCarousel = useCallback((angle: number) => {
    currentAngleRef.current = angle;
    if (carouselRef.current) {
      carouselRef.current.style.transform = `rotateY(${angle}deg)`;
    }
    const frontIndex = ((Math.round(-angle / angleStep) % cardCount) + cardCount) % cardCount;
    setActiveIndex(frontIndex);
  }, [angleStep, cardCount]);

  const startAutoRotate = useCallback(() => {
    if (autoRotateRef.current) return;
    autoRotateRef.current = setInterval(() => {
      currentAngleRef.current -= angleStep;
      rotateCarousel(currentAngleRef.current);
    }, 4000);
  }, [angleStep, rotateCarousel]);

  const stopAutoRotate = useCallback(() => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoRotate();
    return () => {
      stopAutoRotate();
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    };
  }, [startAutoRotate, stopAutoRotate]);

  // Drag handlers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      stopAutoRotate();
      startXRef.current = e.pageX;
      currentXRef.current = e.pageX;
      container.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      currentXRef.current = e.pageX;
      const diff = (currentXRef.current - startXRef.current) * 0.3;
      rotateCarousel(currentAngleRef.current + diff);
    };

    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      container.style.cursor = 'grab';
      currentAngleRef.current += (currentXRef.current - startXRef.current) * 0.3;
      currentAngleRef.current = Math.round(currentAngleRef.current / angleStep) * angleStep;
      rotateCarousel(currentAngleRef.current);
      restartTimeoutRef.current = setTimeout(startAutoRotate, 3000);
    };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      stopAutoRotate();
      startXRef.current = e.touches[0].pageX;
      currentXRef.current = e.touches[0].pageX;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      currentXRef.current = e.touches[0].pageX;
      const diff = (currentXRef.current - startXRef.current) * 0.3;
      rotateCarousel(currentAngleRef.current + diff);
    };

    const onTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      currentAngleRef.current += (currentXRef.current - startXRef.current) * 0.3;
      currentAngleRef.current = Math.round(currentAngleRef.current / angleStep) * angleStep;
      rotateCarousel(currentAngleRef.current);
      restartTimeoutRef.current = setTimeout(startAutoRotate, 3000);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [angleStep, rotateCarousel, startAutoRotate, stopAutoRotate]);

  return (
    <section className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center py-20 px-4">
      <h2 className="font-display text-3xl md:text-[42px] font-bold text-[#f5f0e6] text-center mb-12">
        Trending Now
      </h2>

      <div
        ref={containerRef}
        className="w-full max-w-[900px] h-[500px] md:h-[550px] flex items-center justify-center relative cursor-grab select-none"
        style={{ perspective: '1200px' }}
      >
        <div
          ref={carouselRef}
          className="relative w-[220px] h-[330px] md:w-[280px] md:h-[420px]"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          {movies.map((movie, i) => {
            const angle = i * angleStep;
            const isActive = i === activeIndex;
            return (
              <div
                key={movie.id}
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                  transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                  boxShadow: isActive
                    ? '0 30px 80px rgba(226, 177, 60, 0.15)'
                    : '0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                <Link to={`/movie/${movie.id}`} className="block w-full h-full">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Card glow */}
                  {isActive && (
                    <div
                      className="absolute inset-[-10px] pointer-events-none z-[-1]"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(226,177,60,0.15), transparent 70%)',
                      }}
                    />
                  )}
                </Link>
                {/* Title */}
                <p
                  className="absolute -bottom-8 left-0 right-0 text-center text-sm font-medium transition-colors duration-500"
                  style={{ color: isActive ? '#f5f0e6' : '#8a8278' }}
                >
                  {movie.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2 mt-12">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              stopAutoRotate();
              currentAngleRef.current = -i * angleStep;
              rotateCarousel(currentAngleRef.current);
              restartTimeoutRef.current = setTimeout(startAutoRotate, 3000);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'bg-[#e2b13c] w-6' : 'bg-[rgba(255,255,255,0.2)]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
