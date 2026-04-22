import { useParams, Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { getMoviesByGenre } from '../data/movieData';

const bannerMap: Record<string, string> = {
  Action: '/images/banners/banner-action.jpg',
  Drama: '/images/banners/banner-drama.jpg',
  Comedy: '/images/banners/banner-comedy.jpg',
};

export default function CategoryPage() {
  const params = useParams<{ genre: string }>();
  const genre = params.genre || '';
  const movies = getMoviesByGenre(genre);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.category-card');
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.3,
      });
    });
    return () => ctx.revert();
  }, [genre]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />

      {/* Banner */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={bannerMap[genre || ''] || '/images/banners/banner-action.jpg'}
          alt={genre}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.9) 100%)' }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#8a8278] hover:text-[#e2b13c] transition-colors mb-4 text-sm"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-[#f5f0e6]">{genre}</h1>
          <p className="mt-3 text-[#8a8278] text-lg">{movies.length} titles</p>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {movies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="category-card group"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[rgba(10,10,10,0.85)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-xs text-[#e2b13c] uppercase tracking-wider mb-2">{movie.genre}</p>
                  <div className="flex items-center gap-3 text-xs text-[#8a8278]">
                    <span className="flex items-center gap-1"><Star size={12} className="text-[#e2b13c]" /> {movie.rating}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {movie.duration}</span>
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-medium text-[#f5f0e6] group-hover:text-[#e2b13c] transition-colors line-clamp-1">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#8a8278]">{movie.year}</span>
                <span className="text-[#8a8278] text-xs">&middot;</span>
                <span className="text-xs text-[#e2b13c]">{movie.quality}</span>
              </div>
            </Link>
          ))}
        </div>

        {movies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-[#8a8278]">No movies found in this genre.</p>
            <Link to="/" className="mt-4 inline-block text-[#e2b13c] hover:underline">
              Return to Home
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
