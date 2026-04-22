import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Film, Users, Clock, DollarSign,
  LayoutDashboard, BarChart3, Settings, LogOut,
  Search, Edit2, Trash2, Plus, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, TrendingUp, Eye, Star
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { movies, getWatchActivityData, stats } from '../data/movieData';

const watchData = getWatchActivityData();

const genreData = [
  { name: 'Action', value: 4, color: '#e2b13c' },
  { name: 'Drama', value: 4, color: '#60a5fa' },
  { name: 'Comedy', value: 2, color: '#4ade80' },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Film, label: 'Movies', active: false },
  { icon: Users, label: 'Users', active: false },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const itemsPerPage = 5;

  // Filter movies
  const filteredMovies = movies.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLogout = () => {
    navigate('/admin');
  };

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-[260px] min-h-screen bg-[#0f0f0f] border-r border-[rgba(226,177,60,0.08)] flex flex-col fixed left-0 top-0 bottom-0 z-50">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[rgba(255,255,255,0.04)]">
          <Link to="/" className="font-display text-lg font-bold text-[#e2b13c] tracking-[0.15em]">
            VORTEX
          </Link>
          <span className="ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-[rgba(226,177,60,0.15)] text-[#e2b13c] rounded-full font-medium">
            Admin
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-[rgba(226,177,60,0.1)] text-[#e2b13c] border-l-[3px] border-[#e2b13c]'
                  : 'text-[#8a8278] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f5f0e6]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-3">
            <img
              src="/images/admin-avatar.jpg"
              alt="Admin"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#f5f0e6] truncate">Admin User</p>
              <p className="text-xs text-[#8a8278]">admin@vortex.com</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#8a8278] hover:text-red-400 transition-colors p-1"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px] p-8 md:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#f5f0e6]">Dashboard</h1>
            <p className="text-sm text-[#8a8278] mt-1">Welcome back, Admin</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#8a8278]">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon={Film}
            label="Total Movies"
            value={stats.totalMovies.toLocaleString()}
            color="#e2b13c"
            trend="+12%"
          />
          <StatCard
            icon={Users}
            label="Active Users"
            value={stats.activeUsers.toLocaleString()}
            color="#4ade80"
            trend="+8%"
          />
          <StatCard
            icon={Clock}
            label="Watch Time"
            value={`${stats.watchTime} hrs`}
            color="#60a5fa"
            trend="+24%"
          />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={stats.revenue}
            color="#f472b6"
            trend="+18%"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Area Chart */}
          <div className="lg:col-span-2 bg-[#141414] rounded-xl p-6 border border-[rgba(255,255,255,0.04)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-[#f5f0e6]">Watch Activity</h3>
              <span className="text-xs text-[#8a8278]">Last 30 days</span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={watchData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e2b13c" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#e2b13c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="date"
                    stroke="#8a8278"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#8a8278"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f1f1f',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#f5f0e6',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#e2b13c"
                    strokeWidth={2}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-[#141414] rounded-xl p-6 border border-[rgba(255,255,255,0.04)]">
            <h3 className="text-base font-semibold text-[#f5f0e6] mb-6">Movies by Genre</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f1f1f',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#f5f0e6',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              {genreData.map((g) => (
                <div key={g.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="text-xs text-[#8a8278]">{g.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Movies Table */}
        <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.04)] overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.04)]">
            <h3 className="text-base font-semibold text-[#f5f0e6]">Recent Movies</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8278]" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="h-9 w-[200px] bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg pl-9 pr-4 text-sm text-[#f5f0e6] placeholder:text-[#8a8278]/50 focus:outline-none focus:border-[#e2b13c]/40 transition-colors"
                />
              </div>
              <button className="h-9 inline-flex items-center gap-2 bg-[#e2b13c] text-[#0a0a0a] text-sm font-medium px-4 rounded-lg hover:bg-[#f0c04a] transition-colors">
                <Plus size={14} /> Add Movie
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.04)]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#8a8278] uppercase tracking-wider">Movie</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#8a8278] uppercase tracking-wider">Genre</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#8a8278] uppercase tracking-wider">Rating</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#8a8278] uppercase tracking-wider">Duration</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#8a8278] uppercase tracking-wider">Views</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#8a8278] uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#8a8278] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMovies.map((movie) => (
                  <tr
                    key={movie.id}
                    className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[#1a1a1a] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-10 h-14 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#f5f0e6]">{movie.title}</p>
                          <p className="text-xs text-[#8a8278]">{movie.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#8a8278]">{movie.genre}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm text-[#e2b13c]">
                        <Star size={12} fill="currentColor" /> {movie.rating}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#8a8278]">{movie.duration}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm text-[#8a8278]">
                        <Eye size={12} /> {(movie.views / 1000).toFixed(1)}k
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        movie.status === 'Published'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {movie.status === 'Published' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {movie.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-[#8a8278] hover:text-[#e2b13c] transition-colors rounded-md hover:bg-[rgba(226,177,60,0.1)]">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className={`p-1.5 rounded-md transition-colors ${
                            deleteConfirm === movie.id
                              ? 'text-red-400 bg-red-500/10'
                              : 'text-[#8a8278] hover:text-red-400 hover:bg-red-500/10'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[rgba(255,255,255,0.04)]">
            <p className="text-xs text-[#8a8278]">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredMovies.length)} of {filteredMovies.length} movies
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 text-[#8a8278] hover:text-[#f5f0e6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-[#e2b13c] text-[#0a0a0a]'
                      : 'text-[#8a8278] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f5f0e6]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 text-[#8a8278] hover:text-[#f5f0e6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  trend: string;
}) {
  return (
    <div className="bg-[#141414] rounded-xl p-6 border border-[rgba(255,255,255,0.04)]">
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
          <TrendingUp size={12} /> {trend}
        </span>
      </div>
      <p className="mt-4 text-[28px] font-bold text-[#f5f0e6] leading-none">{value}</p>
      <p className="mt-1.5 text-[13px] text-[#8a8278]">{label}</p>
    </div>
  );
}
