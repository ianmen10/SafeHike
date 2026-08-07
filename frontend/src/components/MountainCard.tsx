import { useNavigate } from 'react-router-dom';
import { MapPin, Route, ArrowRight, CloudSun } from 'lucide-react';

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

type DifficultyKey = 'Mudah' | 'Sedang' | 'Sulit' | 'Sangat Sulit' | string;

const difficultyMap: Record<DifficultyKey, { label: string; className: string; bgClass: string }> = {
  Mudah:        { label: 'Mudah',        className: 'diff-easy',    bgClass: 'from-emerald-600 to-teal-700' },
  Sedang:       { label: 'Sedang',       className: 'diff-medium',  bgClass: 'from-amber-500 to-orange-600' },
  Sulit:        { label: 'Sulit',        className: 'diff-hard',    bgClass: 'from-rose-600 to-red-700' },
  'Sangat Sulit': { label: 'Sangat Sulit', className: 'diff-extreme', bgClass: 'from-violet-700 to-purple-800' },
};

export default function MountainCard({ mountain, onClick }: MountainCardProps) {
  const navigate = useNavigate();
  const diff = mountain.difficulty ?? 'Sedang';
  const cfg = difficultyMap[diff] ?? difficultyMap['Sedang'];

  return (
    <article className="surface-1 surface-hover rounded-2xl overflow-hidden flex flex-col h-full group cursor-default select-none">

      {/* Card Header — colored gradient band */}
      <div className={`relative bg-gradient-to-br ${cfg.bgClass} px-5 pt-5 pb-6`}>
        {/* Subtle dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}
        />
        <div className="relative">
          <p className="text-white/75 text-xs font-medium flex items-center gap-1.5 mb-2 tracking-wide uppercase">
            <MapPin className="h-3 w-3" /> {mountain.location}
          </p>
          <h3 className="text-white text-xl font-bold leading-snug tracking-tight drop-shadow-sm">
            {mountain.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 px-5 py-4 gap-4 bg-white">

        {/* Key metrics row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[13px] font-bold text-slate-800 tabular-nums">{mountain.elevation.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">mdpl</p>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[13px] font-bold text-slate-800">{mountain.trails.length}</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Jalur</p>
          </div>
          <div className={`text-center p-2.5 rounded-xl border ${cfg.className}`}>
            <p className="text-[11px] font-bold leading-tight mt-0.5">{cfg.label}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5 opacity-70">Level</p>
          </div>
        </div>

        {/* Trails list preview */}
        {mountain.trails.length > 0 && (
          <div className="space-y-1.5">
            {mountain.trails.slice(0, 2).map((trail) => (
              <div
                key={trail.id}
                className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100"
              >
                <span className="flex items-center gap-1.5 font-medium truncate max-w-[150px]">
                  <Route className="h-3 w-3 text-brand-500 shrink-0" />
                  {trail.name}
                </span>
                <span className="font-semibold text-slate-500 shrink-0 ml-2">
                  {trail.distance} km · {trail.estimated_duration}j
                </span>
              </div>
            ))}
            {mountain.trails.length > 2 && (
              <p className="text-[11px] text-slate-400 pl-1 font-medium">
                +{mountain.trails.length - 2} jalur lainnya
              </p>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => onClick(mountain)}
            className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <CloudSun className="h-3.5 w-3.5 text-amber-500" />
            Cek Cuaca
          </button>
          <button
            onClick={() => navigate(`/mountains/${mountain.id}`)}
            className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-all shadow-sm shadow-brand-500/20"
          >
            Peta & Detail
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
