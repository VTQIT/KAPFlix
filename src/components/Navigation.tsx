import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isAdminRoute) return null;

  const navBg = scrolled || !isHome
    ? 'bg-[rgba(10,10,10,0.85)] backdrop-blur-xl border-b border-[rgba(226,177,60,0.08)]'
    : 'bg-transparent';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] h-16 flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${navBg}`}
    >
      {/* Logo */}
      <Link
        to="/"
        className="font-display text-xl font-bold text-[#e2b13c] tracking-[0.15em] hover:opacity-80 transition-opacity"
      >
        VORTEX
      </Link>

      {/* Center Nav Links - Desktop */}
      <div className="hidden md:flex items-center gap-8">
        {isHome ? (
          <>
            <a
              href="#action"
              className="text-sm font-medium uppercase tracking-[0.08em] text-[#8a8278] hover:text-[#e2b13c] transition-colors duration-300"
            >
              Action
            </a>
            <a
              href="#drama"
              className="text-sm font-medium uppercase tracking-[0.08em] text-[#8a8278] hover:text-[#e2b13c] transition-colors duration-300"
            >
              Drama
            </a>
            <a
              href="#comedy"
              className="text-sm font-medium uppercase tracking-[0.08em] text-[#8a8278] hover:text-[#e2b13c] transition-colors duration-300"
            >
              Comedy
            </a>
          </>
        ) : (
          <>
            <Link
              to="/category/Action"
              className="text-sm font-medium uppercase tracking-[0.08em] text-[#8a8278] hover:text-[#e2b13c] transition-colors duration-300"
            >
              Action
            </Link>
            <Link
              to="/category/Drama"
              className="text-sm font-medium uppercase tracking-[0.08em] text-[#8a8278] hover:text-[#e2b13c] transition-colors duration-300"
            >
              Drama
            </Link>
            <Link
              to="/category/Comedy"
              className="text-sm font-medium uppercase tracking-[0.08em] text-[#8a8278] hover:text-[#e2b13c] transition-colors duration-300"
            >
              Comedy
            </Link>
          </>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin"
          className="hidden md:block text-sm font-medium uppercase tracking-[0.08em] text-[#8a8278] hover:text-[#e2b13c] transition-colors duration-300"
        >
          Dashboard
        </Link>
        <button className="text-[#8a8278] hover:text-[#e2b13c] transition-colors">
          <Search size={20} />
        </button>
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#8a8278] hover:text-[#e2b13c] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-b border-[rgba(226,177,60,0.08)] py-6 px-6 md:hidden">
          <div className="flex flex-col gap-4">
            {isHome ? (
              <>
                <a href="#action" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-[#8a8278] hover:text-[#e2b13c] transition-colors">Action</a>
                <a href="#drama" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-[#8a8278] hover:text-[#e2b13c] transition-colors">Drama</a>
                <a href="#comedy" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-[#8a8278] hover:text-[#e2b13c] transition-colors">Comedy</a>
              </>
            ) : (
              <>
                <Link to="/category/Action" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-[#8a8278] hover:text-[#e2b13c] transition-colors">Action</Link>
                <Link to="/category/Drama" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-[#8a8278] hover:text-[#e2b13c] transition-colors">Drama</Link>
                <Link to="/category/Comedy" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-[#8a8278] hover:text-[#e2b13c] transition-colors">Comedy</Link>
              </>
            )}
            <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-[#8a8278] hover:text-[#e2b13c] transition-colors">Dashboard</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
