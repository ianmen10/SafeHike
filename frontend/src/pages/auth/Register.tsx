import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MountainIcon, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', {
        full_name: name,
        email: email,
        password: password
      });
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (error) {
      alert('Registrasi gagal. Email mungkin sudah terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 relative overflow-hidden">
      <div className="absolute top-[30%] left-[-10%] w-96 h-96 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      
      <div className="max-w-md w-full space-y-8 glass-card p-10 z-10 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex p-3 bg-brand-100 rounded-2xl shadow-sm mb-4">
            <MountainIcon className="h-8 w-8 text-brand-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Buat Akun</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">Bergabung dengan SafeHike hari ini.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Nama Lengkap</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-500 transition-all bg-white/60"
                placeholder="Fiersa Besari"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-500 transition-all bg-white/60"
                placeholder="pendaki@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-500 transition-all bg-white/60"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all transform hover:-translate-y-0.5"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Daftar Sekarang'}
          </button>
          
          <p className="text-center text-sm text-slate-600 mt-4">
            Sudah punya akun? <Link to="/login" className="font-bold text-brand-600 hover:text-brand-500">Masuk</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
