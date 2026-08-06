import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

interface WeatherData {
  condition: string;
  temperature_celsius: number;
  wind_speed_kmh: number;
  is_safe_to_hike: boolean;
  recommendation: string;
}

interface WeatherWidgetProps {
  mountainId: number;
  mountainName: string;
  onClose: () => void;
}

const conditionIcon: Record<string, string> = {
  'Cerah': '☀️',
  'Berawan': '⛅',
  'Hujan Ringan': '🌧️',
  'Badai': '⛈️',
  'Kabut Tebal': '🌫️',
};

export default function WeatherWidget({ mountainId, mountainName, onClose }: WeatherWidgetProps) {
  const { data, isLoading, isError } = useQuery<WeatherData>({
    queryKey: ['weather', mountainId],
    queryFn: async () => {
      const res = await api.get(`/weather/${mountainId}`);
      return res.data;
    },
    staleTime: 30_000, // cache 30 detik
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card w-full max-w-md p-8 animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Kondisi Cuaca</p>
            <h2 className="text-2xl font-extrabold text-slate-900">{mountainName}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors p-2 rounded-xl"
          >
            ✕
          </button>
        </div>

        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 bg-slate-100 rounded-2xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-slate-500">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="font-semibold">Gagal mengambil data cuaca.</p>
            <p className="text-sm">Pastikan koordinat gunung sudah diset.</p>
          </div>
        )}

        {data && (
          <div className="space-y-5">
            {/* Main Weather Display */}
            <div className={`rounded-2xl p-6 text-center ${data.is_safe_to_hike ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : 'bg-gradient-to-br from-red-400 to-rose-600'}`}>
              <div className="text-5xl mb-2">{conditionIcon[data.condition] ?? '🌡️'}</div>
              <p className="text-white text-2xl font-extrabold">{data.condition}</p>
              <p className="text-white/90 text-4xl font-black mt-1">{data.temperature_celsius}°C</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold mb-1">💨 Kecepatan Angin</p>
                <p className="text-lg font-extrabold text-slate-800">{data.wind_speed_kmh} km/h</p>
              </div>
              <div className={`rounded-xl p-4 ${data.is_safe_to_hike ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <p className="text-xs text-slate-400 font-semibold mb-1">🏔️ Status</p>
                <p className={`text-lg font-extrabold ${data.is_safe_to_hike ? 'text-emerald-700' : 'text-red-700'}`}>
                  {data.is_safe_to_hike ? 'Aman' : 'Berbahaya'}
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div className={`rounded-xl p-4 border-l-4 ${data.is_safe_to_hike ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50'}`}>
              <p className={`text-sm font-semibold ${data.is_safe_to_hike ? 'text-emerald-800' : 'text-red-800'}`}>
                {data.recommendation}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
