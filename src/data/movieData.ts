import movieData from './movies.json';
import type { Movie } from '../types/movie';

export const movies: Movie[] = movieData.movies as Movie[];

export function getMovieById(id: number): Movie | undefined {
  return movies.find(m => m.id === id);
}

export function getMoviesByGenre(genre: string): Movie[] {
  return movies.filter(m => m.genre === genre);
}

export function getFeaturedMovies(): Movie[] {
  return movies.filter(m => m.featured);
}

export function getTrendingMovies(): Movie[] {
  return [...movies].sort((a, b) => b.views - a.views).slice(0, 8);
}

// Generate 30 days of mock watch data for the admin chart
export function getWatchActivityData() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: Math.floor(Math.random() * 4000) + 1000,
    });
  }
  return data;
}

export const stats = {
  totalMovies: 1247,
  activeUsers: 8432,
  watchTime: '142K',
  revenue: '$48.2K',
};
