import Link from 'next/link';

export default function MedidasPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Medidas Corporales</h2>
        <p className="text-slate-400">Registra tu evolución física</p>
      </div>

      <Link
        href="/medidas/nuevo"
        className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-lg text-center text-lg mb-6 transition-all"
      >
        + Nueva medición
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Peso corporal</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Cintura</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Pecho</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Brazo</p>
          <p className="text-2xl font-bold">—</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold mb-4">Historial de mediciones</h3>
        
        <div className="card bg-slate-800/50 border-dashed border-slate-600 py-12 text-center">
          <p className="text-slate-400 text-lg mb-4">Sin mediciones aún</p>
          <p className="text-slate-500 text-sm">Registra tu primer medición para ver tu evolución</p>
        </div>
      </div>
    </div>
  );
}