import { Link } from 'react-router-dom';
import { Film, HelpCircle, FileText, Shield, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-[rgba(226,177,60,0.06)] pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link to="/" className="font-display text-lg font-bold text-[#e2b13c] tracking-[0.15em]">
            VORTEX
          </Link>
          <p className="mt-3 text-sm text-[#8a8278] leading-relaxed">
            Cinema without limits. Stream thousands of movies across every genre, anytime, anywhere.
          </p>
        </div>

        {/* Browse */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#f5f0e6] mb-4">Browse</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/category/Action" className="text-sm text-[#8a8278] hover:text-[#e2b13c] transition-colors flex items-center gap-2">
                <Film size={14} /> Action
              </Link>
            </li>
            <li>
              <Link to="/category/Drama" className="text-sm text-[#8a8278] hover:text-[#e2b13c] transition-colors flex items-center gap-2">
                <Film size={14} /> Drama
              </Link>
            </li>
            <li>
              <Link to="/category/Comedy" className="text-sm text-[#8a8278] hover:text-[#e2b13c] transition-colors flex items-center gap-2">
                <Film size={14} /> Comedy
              </Link>
            </li>
            <li>
              <Link to="/" className="text-sm text-[#8a8278] hover:text-[#e2b13c] transition-colors flex items-center gap-2">
                <Film size={14} /> New Releases
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#f5f0e6] mb-4">Support</h4>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-sm text-[#8a8278] hover:text-[#e2b13c] transition-colors flex items-center gap-2">
                <HelpCircle size={14} /> Help Center
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-[#8a8278] hover:text-[#e2b13c] transition-colors flex items-center gap-2">
                <FileText size={14} /> Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-[#8a8278] hover:text-[#e2b13c] transition-colors flex items-center gap-2">
                <Shield size={14} /> Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#f5f0e6] mb-4">Connect</h4>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-[#8a8278] hover:text-[#e2b13c] hover:bg-[#1f1f1f] transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-[#8a8278] hover:text-[#e2b13c] hover:bg-[#1f1f1f] transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-[#8a8278] hover:text-[#e2b13c] hover:bg-[#1f1f1f] transition-all">
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto mt-12 pt-6 border-t border-[rgba(255,255,255,0.05)]">
        <p className="text-[13px] text-[#8a8278]">
          &copy; 2024 Vortex Cinema. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
