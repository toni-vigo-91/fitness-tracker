'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NuevoEntrenamientoPage() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Crear entrenamiento:', { nombre, fecha });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Nuevo Entrenamiento</h2>
          <p className="text-slate-400">Registra tu sesión</p>
        </div>
        <Link
          href="/entrenamientos"
          className="text-slate-400 hover:text-white transition-colors text-2xl"
        >
          ✕
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Nombre del entrenamiento
          </label>
          <input
            type="text"
            placeholder="Ej: Pecho + Hombro"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-lg text-lg transition-all"
        >
          Continuar
        </button>
      </form>

      <div className="card bg-slate-800/50 border-dashed border-slate-600">
        <p className="text-slate-400 text-sm text-center">
          Después podrás añadir ejercicios y registrar series
        </p>
      </div>
    </div>
  );
}