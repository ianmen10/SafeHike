import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Compass, 
  CloudSun, 
  Wind, 
  Droplets, 
  ShieldAlert, 
  Sparkles, 
  Navigation, 
  Footprints, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../lib/api';

// Fix Leaflet icon standard URLs
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const customMountainIcon = L.icon({
  iconUrl: iconMarker,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
  difficulty: string;
  latitude: number | null;
  longitude: number | null;
  trails: Trail[];
}

interface WeatherData {
  mountain: string;
  weather: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    description: string;
    icon: string;
  };
}

export default function MountainDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mountain, setMountain] = useState<Mountain | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // AI Modal/Generator state
  const [selectedTrail, setSelectedTrail] = useState<string>('');
  const [experience, setExperience] = useState<'Pemula' | 'Menengah' | 'Hafal Jalur'>('Pemula');
  const [durationDays, setDurationDays] = useState<number>(2);
  const [aiPlan, setAiPlan] = useState<any>(null);
  const [generatingAi, setGeneratingAi] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const mRes = await api.get(`/mountains/${id}`);
        setMountain(mRes.data);
        if (mRes.data.trails && mRes.data.trails.length > 0) {
          setSelectedTrail(mRes.data.trails[0].name);
        }

        // Fetch Weather
        try {
          const wRes = await api.get(`/weather/${id}`);
          setWeather(wRes.data);
        } catch (wErr) {
          console.warn("Weather data unavailable:", wErr);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat informasi gunung. Pastikan koneksi server aktif.");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleGenerateAiPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mountain) return;
    setGeneratingAi(true);
    try {
      const res = await api.post('/trip-planner/recommendations', {
        mountain_name: mountain.name,
        trail_name: selectedTrail || (mountain.trails[0]?.name ?? 'Jalur Utama'),
        user_experience: experience,
        duration_days: durationDays
      });
      setAiPlan(res.data);
    } catch (err) {
      alert("Gagal merancang rencana dengan AI. Coba beberapa saat lagi.");
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-brand-400 mb-4" />
        <p className="text-slate-400 font-medium">Memuat Peta & Detail Gunung...</p>
      </div>
    );
  }

  if (error || !mountain) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <AlertTriangle className="h-12 w-12 text-amber-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Gunung Tidak Ditemukan</h2>
        <p className="text-slate-400 max-w-md mb-6">{error || "Data gunung yang Anda cari tidak tersedia."}</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 font-semibold text-white transition-all shadow-lg shadow-brand-500/20"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const lat = mountain.latitude ?? -7.5;
  const lng = mountain.longitude ?? 110.5;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      {/* Background Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-700/50"
          >
            <ArrowLeft className="h-4 w-4" /> Beranda
          </button>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> Jalur Terverifikasi
            </span>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
              <Compass className="h-3.5 w-3.5" /> Eksplorasi Gunung Indonesia
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {mountain.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>{mountain.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-400" />
                <span className="font-semibold">{mountain.elevation.toLocaleString()} mdpl</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400/10 text-amber-300 text-xs font-bold border border-amber-400/20">
                  Tingkat {mountain.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Weather Quick Card */}
          {weather && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CloudSun className="h-5 w-5 text-amber-400" />
                  <span className="font-semibold text-sm text-slate-200">Cuaca Puncak Hari Ini</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">Real-Time</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-white">
                    {Math.round(weather.weather.temp)}°C
                  </div>
                  <div className="text-xs text-slate-400 mt-1 capitalize">
                    {weather.weather.description} (Terasa {Math.round(weather.weather.feels_like)}°C)
                  </div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl">
                  <Droplets className="h-6 w-6 text-sky-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/60">
                <div className="flex items-center gap-2 text-slate-400">
                  <Wind className="h-4 w-4 text-teal-400" />
                  <span>Kecepatan Angin: <strong className="text-slate-200">{weather.weather.wind_speed} m/s</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span>Kelembapan: <strong className="text-slate-200">{weather.weather.humidity}%</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Map & Trails */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Interactive Leaflet Map Card */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-lg text-white">Peta Topografi & Koordinat GPS</h3>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                {lat.toFixed(4)}°, {lng.toFixed(4)}°
              </span>
            </div>

            {/* Map Container */}
            <div className="h-[420px] w-full relative z-10">
              <MapContainer 
                center={[lat, lng]} 
                zoom={12} 
                scrollWheelZoom={false} 
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} icon={customMountainIcon}>
                  <Popup>
                    <div className="text-slate-900 font-bold p-1">
                      <div className="text-sm">{mountain.name}</div>
                      <div className="text-xs text-slate-600 font-normal">{mountain.elevation} mdpl</div>
                    </div>
                  </Popup>
                </Marker>
                <Circle 
                  center={[lat, lng]} 
                  radius={5000} 
                  pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.15 }} 
                />
              </MapContainer>
            </div>

            <div className="p-4 bg-slate-900/90 text-xs text-slate-400 flex items-center gap-2 border-t border-slate-800">
              <Info className="h-4 w-4 text-brand-400 shrink-0" />
              <span>Gunakan kontrol zoom untuk memperjelas titik elevasi dan area sekitar puncak gunung.</span>
            </div>
          </div>

          {/* Trails Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Footprints className="h-5 w-5 text-brand-400" /> Jalur Pendakian Resmi ({mountain.trails.length})
              </h3>
            </div>

            {mountain.trails.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-sm text-center">
                Belum ada data jalur spesifik untuk gunung ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mountain.trails.map((trail) => (
                  <div 
                    key={trail.id}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-brand-500/50 transition-all hover:shadow-lg space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white group-hover:text-brand-300 transition-colors">
                        {trail.name}
                      </h4>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Jalur Aktif
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Navigation className="h-4 w-4 text-slate-400" />
                        <span>Est. Jarak: <strong className="text-white">{trail.distance} km</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>Est. Durasi: <strong className="text-white">{trail.estimated_duration} jam</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: AI Trip Generator Widget */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-brand-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-32 w-32 text-brand-400" />
            </div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-500/30 text-brand-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">AI Trip Planner</h3>
                  <p className="text-xs text-slate-400">Rekomendasi Rencana Pendakian {mountain.name}</p>
                </div>
              </div>

              <form onSubmit={handleGenerateAiPlan} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Jalur Pendakian</label>
                  <select 
                    value={selectedTrail}
                    onChange={(e) => setSelectedTrail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    {mountain.trails.map((t) => (
                      <option key={t.id} value={t.name}>{t.name} ({t.distance} km)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pengalaman Pendaki</label>
                  <select 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Pemula">Pemula (Butuh Panduan Ekstra)</option>
                    <option value="Menengah">Menengah (Cukup Berpengalaman)</option>
                    <option value="Hafal Jalur">Expert / Hafal Jalur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Durasi Pendakian (Hari)</label>
                  <input 
                    type="number"
                    min="1"
                    max="7"
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={generatingAi}
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 font-bold text-sm text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
                >
                  {generatingAi ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Merancang Rencana AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Buat Rencana Pendakian AI
                    </>
                  )}
                </button>
              </form>

              {/* AI Plan Output Display */}
              {aiPlan && (
                <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-brand-500/40 text-xs space-y-4 animate-fade-in">
                  <div className="font-bold text-sm text-brand-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Hasil Perencanaan AI
                  </div>
                  
                  <div className="text-slate-300 space-y-2 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto pr-1">
                    {aiPlan.recommendations || aiPlan.recommendation || JSON.stringify(aiPlan, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
