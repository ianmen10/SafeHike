import { MountainIcon, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-brand-100 rounded-xl group-hover:bg-brand-200 transition-colors shadow-sm">
              <MountainIcon className="h-5 w-5 text-brand-600" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">SafeHike</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-slate-500 hover:text-red-600 transition-colors px-4 py-2 rounded-xl hover:bg-red-50"
          >
            <span className="text-sm font-semibold">Logout</span>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
