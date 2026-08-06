import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MountainSnow, Plus } from 'lucide-react';
import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import MountainCard from '../components/MountainCard';
import WeatherWidget from '../components/WeatherWidget';

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

// Loading Skeleton Component
function MountainSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100 animate-pulse">
      <div className="h-36 bg-gradient-to-br from-slate-200 to-slate-300" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <div className="h-8 w-16 bg-slate-100 rounded-lg" />
          <div className="h-8 w-16 bg-slate-100 rounded-lg" />
          <div className="h-8 w-16 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-10 bg-slate-100 rounded-xl" />
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Hero Header */}
        <div className="mb-10 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-100 rounded-xl">
              <MountainSnow className="h-6 w-6 text-brand-600" />
            </div>
            <p className="text-brand-600 font-semibold text-sm tracking-wide uppercase">Katalog Gunung</p>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Eksplorasi Gunung Indonesia
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            Pilih gunung, cek cuaca real-time, dan rencanakan pendakian yang aman bersama AI.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 animate-fade-in">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari gunung atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-slate-700 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Error State */}
        {isError && (
          <div className="glass-card p-10 text-center">
            <p className="text-5xl mb-4">🔌</p>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak dapat terhubung ke server</h3>
            <p className="text-slate-500 text-sm">Pastikan backend berjalan di <code className="bg-slate-100 px-2 py-1 rounded-lg text-brand-600 font-mono">http://localhost:8000</code></p>
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
          <div className="glass-card p-16 text-center animate-fade-in">
            <p className="text-6xl mb-4">🏔️</p>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {search ? 'Gunung tidak ditemukan' : 'Belum ada data gunung'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {search
                ? `Tidak ada hasil untuk "${search}". Coba kata kunci lain.`
                : 'Tambahkan data gunung pertama melalui API atau Swagger UI.'}
            </p>
            {!search && (
              <a
                href="http://localhost:8000/docs#/mountains/create_mountain_api_v1_mountains__post"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-500 text-white rounded-xl font-bold text-sm hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200"
              >
                <Plus className="h-4 w-4" /> Tambah Gunung via Swagger
              </a>
            )}
          </div>
        )}

        {/* Mountain Grid */}
        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <p className="text-sm text-slate-400 font-medium mb-5">
              Menampilkan <span className="text-brand-600 font-bold">{filtered.length}</span> gunung
              {search && ` untuk "${search}"`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filtered.map((mountain) => (
                <MountainCard
                  key={mountain.id}
                  mountain={mountain}
                  onClick={setSelectedMountain}
                />
              ))}
            </div>
          </>
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
