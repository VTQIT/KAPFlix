import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HeroSection from '../sections/HeroSection';
import CarouselSection from '../sections/CarouselSection';
import GalleryRow from '../sections/GalleryRow';
import CTABanner from '../sections/CTABanner';
import { getMoviesByGenre } from '../data/movieData';

export default function HomePage() {
  const actionMovies = getMoviesByGenre('Action');
  const dramaMovies = getMoviesByGenre('Drama');
  const comedyMovies = getMoviesByGenre('Comedy');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <HeroSection />
      <CarouselSection />
      <GalleryRow id="action" title="Action" movies={actionMovies} bgColor="#0a0a0a" />
      <GalleryRow id="drama" title="Drama" movies={dramaMovies} bgColor="#0d0d0d" />
      <GalleryRow id="comedy" title="Comedy" movies={comedyMovies} bgColor="#0a0a0a" />
      <CTABanner />
      <Footer />
    </div>
  );
}
