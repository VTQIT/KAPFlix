import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (email && password) {
        navigate('/admin/dashboard');
      } else {
        setError('Please fill in all fields');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(226,177,60,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative w-full max-w-[420px]">
        {/* Back to site link */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-[#8a8278] hover:text-[#e2b13c] transition-colors text-sm">
            <ArrowRight size={14} className="rotate-180" /> Back to Vortex
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-[#141414] border border-[rgba(255,255,255,0.04)] rounded-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[rgba(226,177,60,0.1)] mb-4">
              <Film size={28} className="text-[#e2b13c]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#f5f0e6]">Admin Login</h1>
            <p className="mt-1 text-sm text-[#8a8278]">Sign in to access the dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8a8278] uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8278]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vortex.com"
                  className="w-full h-11 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg pl-10 pr-4 text-sm text-[#f5f0e6] placeholder:text-[#8a8278]/50 focus:outline-none focus:border-[#e2b13c]/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8a8278] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8278]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg pl-10 pr-4 text-sm text-[#f5f0e6] placeholder:text-[#8a8278]/50 focus:outline-none focus:border-[#e2b13c]/40 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#e2b13c] text-[#0a0a0a] font-semibold text-sm rounded-lg hover:bg-[#f0c04a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#8a8278]">
            Use any email and password to sign in (demo mode)
          </p>
        </div>
      </div>
    </div>
  );
}
