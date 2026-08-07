import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Sparkles, Compass } from 'lucide-react';
import api from '../lib/api';

import Navbar from '../components/layout/Navbar';
import MountainCard from '../components/MountainCard';
import WeatherWidget from '../components/WeatherWidget';
// import MountainGlobe3D from '../components/MountainGlobe3D'; // Removed heavy 3D globe

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
  const [selectedRegion, setSelectedRegion] = useState('All');

  const { data: mountains = [], isLoading, isError } = useQuery<Mountain[]>({
    queryKey: ['mountains'],
    queryFn: async () => {
      const res = await api.get('/mountains/');
      return res.data;
    },
  });

  const filtered = mountains.filter((m) =>
    (selectedRegion === 'All' || m.location.includes(selectedRegion)) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.location.toLowerCase().includes(search.toLowerCase()))
  );



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white pb-20">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Refined Hero Section */}
        <section className="text-center py-12 md:py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-mono font-bold uppercase tracking-wider mb-4 mx-auto">
            <Sparkles className="h-4 w-4 animate-pulse" /> AI-POWERED MOUNTAINEERING PLATFORM
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            Perencanaan Pendakian <span className="text-brand-500">Cerdas, Aman, & Terintegrasi</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mb-6">
            Jelajahi seluruh katalog gunung Indonesia dengan peta interaktif, cuaca real‑time, dan rekomendasi AI yang dipersonalisasi.
          </p>
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
              <input
                type="text"
                placeholder="Cari gunung, provinsi, atau lokasi GPS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            {/* Region Filter Tabs */}
            <div className="flex gap-2">
              {['All', 'Jawa', 'Sumatra', 'NTB', 'Bali'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${selectedRegion === region ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'} transition-colors`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Search and Region Filter (already moved to hero) */}
        {/* Placeholder kept for possible future expansions */}

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
