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

const difficultyConfig: Record<string, { color: string; bg: string; gradient: string }> = {
  Beginner: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
    gradient: 'from-emerald-400 to-teal-500',
  },
  Intermediate: {
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    gradient: 'from-amber-400 to-orange-500',
  },
  Hard: {
    color: 'text-red-700',
    bg: 'bg-red-100',
    gradient: 'from-red-400 to-rose-600',
  },
};

export default function MountainCard({ mountain, onClick }: MountainCardProps) {
  const difficulty = mountain.difficulty || 'Beginner';
  const config = difficultyConfig[difficulty] ?? difficultyConfig['Beginner'];

  return (
    <div
      onClick={() => onClick(mountain)}
      className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-slate-100"
    >
      {/* Header Gradient */}
      <div className={`h-36 bg-gradient-to-br ${config.gradient} relative flex items-end p-5`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        <div className="relative z-10">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
            {mountain.location}
          </p>
          <h3 className="text-white text-xl font-extrabold leading-tight drop-shadow">
            {mountain.name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-slate-900">
              {mountain.elevation.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 font-medium">Meter MDPL</p>
          </div>
          <div className="h-10 w-px bg-slate-100" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-slate-900">{mountain.trails.length}</p>
            <p className="text-xs text-slate-400 font-medium">Jalur</p>
          </div>
          <div className="h-10 w-px bg-slate-100" />
          <div className="text-center">
            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${config.color} ${config.bg}`}>
              {difficulty}
            </span>
            <p className="text-xs text-slate-400 font-medium mt-1">Kesulitan</p>
          </div>
        </div>

        {/* Trails Preview */}
        {mountain.trails.length > 0 && (
          <div className="border-t border-slate-100 pt-3 space-y-1.5">
            {mountain.trails.slice(0, 2).map((trail) => (
              <div key={trail.id} className="flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block" />
                  {trail.name}
                </span>
                <span className="font-semibold">{trail.distance} km · {trail.estimated_duration} jam</span>
              </div>
            ))}
            {mountain.trails.length > 2 && (
              <p className="text-xs text-brand-500 font-semibold">+{mountain.trails.length - 2} jalur lainnya</p>
            )}
          </div>
        )}

        {/* CTA */}
        <button className="w-full py-2.5 text-sm font-bold text-brand-600 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white">
          Cek Cuaca & Rencanakan →
        </button>
      </div>
    </div>
  );
}
