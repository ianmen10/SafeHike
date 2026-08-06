import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Sparkles, Compass, Activity } from 'lucide-react';
import api from '../lib/api';

import Navbar from '../components/layout/Navbar';
import MountainCard from '../components/MountainCard';
import WeatherWidget from '../components/WeatherWidget';
import MountainGlobe3D from '../components/MountainGlobe3D';

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

function MountainSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl bg-slate-900/60 border border-slate-800 animate-pulse h-[340px] flex flex-col justify-between p-5">
      <div className="h-32 bg-slate-800 rounded-xl" />
      <div className="space-y-3">
        <div className="h-10 bg-slate-800 rounded-xl" />
        <div className="h-10 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [selectedMountain, setSelectedMountain] = useState<Mountain | null>(null);

  const { data: mountains = [], isLoading, isError } = useQuery<Mountain[]>({
    queryKey: ['mountains'],
    queryFn: async () => {
      const res = await api.get('/mountains/');
      return res.data;
    },
  });

  const filtered = mountains.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalTrails = mountains.reduce((acc, m) => acc + (m.trails?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white pb-20">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* 3D Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column Text & Call to Action */}
          <div className="lg:col-span-6 space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-spin" /> PLATFORM PENDAKIAN 3D & AI
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Jelajahi Gunung <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                Dalam Dimensi 3D.
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
              Eksplorasi katalog gunung Indonesia dengan pemetaan topografi 3D, prakiraan cuaca real-time, dan pembuat rencana keselamatan pintar berbasis AI.
            </p>

            {/* 3D Floating Stats Widgets */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <p className="text-2xl sm:text-3xl font-black text-white">{mountains.length}</p>
                <p className="text-[10px] text-slate-400 font-mono uppercase font-bold mt-0.5">Gunung Terdaftar</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">{totalTrails}</p>
                <p className="text-[10px] text-slate-400 font-mono uppercase font-bold mt-0.5">Jalur Pendakian</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <p className="text-2xl sm:text-3xl font-black text-sky-400 flex items-center gap-1">
                  <Activity className="h-5 w-5 text-emerald-400 animate-pulse" /> 100%
                </p>
                <p className="text-[10px] text-slate-400 font-mono uppercase font-bold mt-0.5">SISTEM ONLINE</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Three.js Mountain Globe */}
          <div className="lg:col-span-6">
            <MountainGlobe3D />
          </div>
        </div>

        {/* 3D Search & Filter Bar */}
        <div className="relative z-20">
          <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
              <input
                type="text"
                placeholder="Cari nama gunung, provinsi, atau lokasi GPS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto px-2">
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap hidden md:inline-block">
                Menampilkan: <strong className="text-emerald-400">{filtered.length}</strong> gunung
              </span>
            </div>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="p-12 rounded-3xl bg-slate-900/80 border border-rose-500/30 text-center space-y-4 backdrop-blur-xl">
            <p className="text-5xl">🔌</p>
            <h3 className="text-2xl font-black text-white">Gagal Terhubung ke Backend Server</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Pastikan FastAPI server berjalan di <code className="bg-slate-950 px-2.5 py-1 rounded-lg text-emerald-400 font-mono border border-slate-800">http://localhost:8000</code>.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <MountainSkeleton key={i} />)}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="p-16 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 backdrop-blur-xl">
            <p className="text-6xl">🏔️</p>
            <h3 className="text-xl font-bold text-white">
              {search ? 'Gunung tidak ditemukan' : 'Belum ada data gunung'}
            </h3>
            <p className="text-slate-400 text-sm">
              {search
                ? `Tidak ada hasil pencarian untuk "${search}".`
                : 'Tambahkan data gunung pertama melalui Swagger UI.'}
            </p>
          </div>
        )}

        {/* 3D Mountain Grid Catalog */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Compass className="h-6 w-6 text-emerald-400" /> Katalog Gunung Indonesia
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((mountain) => (
                <MountainCard
                  key={mountain.id}
                  mountain={mountain}
                  onClick={setSelectedMountain}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Weather Modal */}
      {selectedMountain && (
        <WeatherWidget
          mountainId={selectedMountain.id}
          mountainName={selectedMountain.name}
          onClose={() => setSelectedMountain(null)}
        />
      )}
    </div>
  );
}
