import Link from 'next/link';
import VerificacionSeed from '@/components/ui/VerificacionSeed';

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Hola</h2>
        <p className="text-slate-400">Bienvenido a tu tracker de fitness</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-slate-300 text-sm font-semibold mb-3">
            Último entrenamiento
          </h3>
          <p className="text-2xl font-bold mb-2">—</p>
          <p className="text-slate-500 text-xs">Sin datos aún</p>
        </div>

        <div className="card">
          <h3 className="text-slate-300 text-sm font-semibold mb-3">
            Peso actual
          </h3>
          <p className="text-2xl font-bold mb-2">—</p>
          <p className="text-slate-500 text-xs">Registra tu peso</p>
        </div>

        <div className="card">
          <h3 className="text-slate-300 text-sm font-semibold mb-3">
            Esta semana
          </h3>
          <p className="text-2xl font-bold mb-2">0</p>
          <p className="text-slate-500 text-xs">entrenamientos</p>
        </div>

        <div className="card">
          <h3 className="text-slate-300 text-sm font-semibold mb-3">
            Volumen semanal
          </h3>
          <p className="text-2xl font-bold mb-2">0</p>
          <p className="text-slate-500 text-xs">kg × reps</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold">Acciones rápidas</h3>

        <Link
          href="/entrenamientos/nuevo"
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-lg text-center text-lg transition-all"
        >
          + Nuevo entrenamiento
        </Link>

        <Link
          href="/medidas"
          className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-all"
        >
          Registrar medidas
        </Link>

        <Link
          href="/ejercicios"
          className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-all"
        >
          Ver biblioteca de ejercicios
        </Link>
      </div>

      <div className="card bg-slate-800/50 border-dashed border-slate-600">
        <p className="text-slate-400 text-sm text-center">
          Los datos aparecerán aquí cuando registres entrenamientos y medidas
        </p>
      </div>

      {/* Verificación de Seed (eliminar después de probar) */}
      <div className="card bg-slate-800/50 border-dashed border-slate-600">
        <div className="mt-8 border-t border-slate-700 pt-6">
          <h3 className="text-lg font-bold mb-4">🧪 Estado de la Seed</h3>
          <VerificacionSeed />
        </div>
      </div>
    </div>
  );
}