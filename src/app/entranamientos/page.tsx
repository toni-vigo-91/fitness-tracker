import Link from 'next/link';

export default function EntrenamientosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Entrenamientos</h2>
        <p className="text-slate-400">Gestiona tus sesiones de entrenamiento</p>
      </div>

      <Link
        href="/entrenamientos/nuevo"
        className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-lg text-center text-lg mb-6 transition-all"
      >
        + Nuevo entrenamiento
      </Link>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold mb-4">Entrenamientos registrados</h3>
        
        <div className="card bg-slate-800/50 border-dashed border-slate-600 py-12 text-center">
          <p className="text-slate-400 text-lg mb-4">Sin entrenamientos aún</p>
          <p className="text-slate-500 text-sm">Crea tu primer entrenamiento para empezar</p>
        </div>
      </div>
    </div>
  );
}