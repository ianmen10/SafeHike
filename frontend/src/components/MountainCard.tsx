import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight, CloudSun } from 'lucide-react';
import Tilt3DCard from './Tilt3DCard';


interface Trail {
  id: number;
  name: string;
  distance: number;
  estimated_duration: number;
}

interface Mountain {
  id: number;
  name: string;
  location: string;
  elevation: number;
  difficulty: string | null;
  latitude: number | null;
  longitude: number | null;
  trails: Trail[];
}

interface MountainCardProps {
  mountain: Mountain;
  onClick: (mountain: Mountain) => void;
}

const difficultyConfig: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  Mudah: {
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    glow: 'from-emerald-600/30 via-teal-900/20 to-slate-900',
  },
  Sedang: {
    color: 'text-amber-300',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    glow: 'from-amber-600/30 via-orange-900/20 to-slate-900',
  },
  Sulit: {
    color: 'text-rose-300',
    bg: 'bg-rose-500/20',
    border: 'border-rose-500/30',
    glow: 'from-rose-600/30 via-red-900/20 to-slate-900',
  },
  'Sangat Sulit': {
    color: 'text-purple-300',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    glow: 'from-purple-600/30 via-indigo-900/20 to-slate-900',
  },
  Beginner: {
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    glow: 'from-emerald-600/30 via-teal-900/20 to-slate-900',
  },
  Intermediate: {
    color: 'text-amber-300',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    glow: 'from-amber-600/30 via-orange-900/20 to-slate-900',
  },
  Hard: {
    color: 'text-rose-300',
    bg: 'bg-rose-500/20',
    border: 'border-rose-500/30',
    glow: 'from-rose-600/30 via-red-900/20 to-slate-900',
  },
};

export default function MountainCard({ mountain, onClick }: MountainCardProps) {
  const navigate = useNavigate();
  const difficulty = mountain.difficulty || 'Sedang';
  const config = difficultyConfig[difficulty] ?? difficultyConfig['Sedang'];

  return (
    <Tilt3DCard className="h-full">
      <div className="group h-full rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800/90 hover:border-emerald-500/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
        
        {/* Top Header Card */}
        <div className={`h-40 bg-gradient-to-b ${config.glow} relative flex items-end p-5 overflow-hidden`}>
          {/* Ambient 3D Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          
          <div className="relative z-10 w-full space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 text-xs font-mono font-semibold tracking-widest uppercase flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {mountain.location}
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${config.color} ${config.bg} ${config.border}`}>
                {difficulty}
              </span>
            </div>
            <h3 className="text-white text-2xl font-black leading-tight drop-shadow-md tracking-tight group-hover:text-emerald-300 transition-colors">
              {mountain.name}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* 3D Floating Stats Row */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-center backdrop-blur-md">
              <div>
                <p className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  {mountain.elevation.toLocaleString()}
                </p>
                <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">MDPL</p>
              </div>
              <div className="border-x border-slate-800/80 px-1">
                <p className="text-xl font-black text-white">{mountain.trails.length}</p>
                <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">JALUR</p>
              </div>
              <div>
                <p className="text-xs font-extrabold text-amber-400 mt-1">GPS READY</p>
                <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">KOORDINAT</p>
              </div>
            </div>

            {/* Trails Preview */}
            {mountain.trails.length > 0 && (
              <div className="space-y-1.5 text-xs text-slate-300">
                {mountain.trails.slice(0, 2).map((trail) => (
                  <div key={trail.id} className="flex justify-between items-center bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/60 font-mono">
                    <span className="flex items-center gap-2 font-medium text-slate-200">
                      <Navigation className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="truncate max-w-[120px]">{trail.name}</span>
                    </span>
                    <span className="font-bold text-emerald-400">{trail.distance} km</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/60">
            <button 
              onClick={() => onClick(mountain)}
              className="py-2.5 px-3 text-xs font-bold text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/50 flex items-center justify-center gap-1.5"
            >
              <CloudSun className="h-3.5 w-3.5 text-amber-400" /> Cuaca
            </button>
            
            <button 
              onClick={() => navigate(`/mountains/${mountain.id}`)}
              className="py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 transform active:scale-95"
            >
              Peta 3D <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Tilt3DCard>
  );
}
