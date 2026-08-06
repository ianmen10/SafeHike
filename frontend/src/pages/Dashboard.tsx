import Navbar from '../components/layout/Navbar';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
        <div className="glass-card p-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Pendakian
            </h1>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              Selamat datang kembali di SafeHike! Anda telah berhasil melewati fase Autentikasi.
              Pada sprint berikutnya, area ini akan dipenuhi dengan katalog Gunung, UI interaktif untuk Trip Planner, 
              serta Chatbot AI asisten keselamatan.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
