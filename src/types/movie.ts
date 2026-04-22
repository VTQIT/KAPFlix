export interface Movie {
  id: number;
  title: string;
  genre: 'Action' | 'Drama' | 'Comedy';
  year: number;
  rating: number;
  duration: string;
  quality: string;
  poster: string;
  banner: string;
  description: string;
  featured: boolean;
  status: 'Published' | 'Draft';
  addedDate: string;
  views: number;
}
