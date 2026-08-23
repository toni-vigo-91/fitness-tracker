import Link from 'next/link';

export default function EjerciciosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Biblioteca de Ejercicios</h2>
        <p className="text-slate-400">Crea y gestiona tus ejercicios</p>
      </div>

      <Link
        href="/ejercicios/nuevo"
        className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-lg text-center text-lg mb-6 transition-all"
      >
        + Nuevo ejercicio
      </Link>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold mb-4">Tus ejercicios</h3>
        
        <div className="card bg-slate-800/50 border-dashed border-slate-600 py-12 text-center">
          <p className="text-slate-400 text-lg mb-4">Sin ejercicios aún</p>
          <p className="text-slate-500 text-sm">
            Crea tu primer ejercicio. Podrás usarlos en tus entrenamientos
          </p>
        </div>
      </div>
    </div>
  );
}