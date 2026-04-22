import { Link } from 'react-router-dom';
import { Home, Film } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(226,177,60,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative text-center">
        <Film size={48} className="text-[rgba(226,177,60,0.3)] mx-auto mb-6" />
        <h1 className="font-display text-7xl md:text-9xl font-bold text-[#f5f0e6]">404</h1>
        <p className="mt-4 text-xl text-[#8a8278]">Page not found</p>
        <p className="mt-2 text-sm text-[#8a8278]/70 max-w-[400px] mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-[#e2b13c] text-[#0a0a0a] font-semibold text-sm px-8 py-3 rounded-md hover:bg-[#f0c04a] transition-colors"
        >
          <Home size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
