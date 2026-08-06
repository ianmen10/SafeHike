import { MountainIcon, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';


export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl group-hover:bg-emerald-500/30 transition-all shadow-lg shadow-emerald-500/10">
              <MountainIcon className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                SafeHike
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-bold">
                3D PLATFORM
              </span>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-slate-400 hover:text-rose-400 transition-all px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-xs font-bold"
          >
            <span>Keluar</span>
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
