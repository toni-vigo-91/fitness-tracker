'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEntrenamientos } from '@/hooks/useEntrenamientos';

export default function EntrenamientosPage() {
  const { entrenamientos, cargando, eliminar } = useEntrenamientos();
  const [eliminando, setEliminando] = useState(false);

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Eliminar este entrenamiento?')) {
      setEliminando(true);
      try {
        await eliminar(id);
      } finally {
        setEliminando(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Entrenamientos</h2>
        <p className="text-slate-400">Historial de tus sesiones</p>
      </div>

      {/* Botón crear */}
      <Link
        href="/entrenamientos/nuevo"
        className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-lg text-center text-lg mb-6 transition-all"
      >
        + Nuevo entrenamiento
      </Link>

      {/* Lista de entrenamientos */}
      <div className="space-y-3">
        {cargando ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Cargando entrenamientos...</p>
          </div>
        ) : entrenamientos.length === 0 ? (
          <div className="card bg-slate-800/50 border-dashed border-slate-600 py-12 text-center">
            <p className="text-slate-400 text-lg mb-4">Sin entrenamientos aún</p>
            <p className="text-slate-500 text-sm">
              Crea tu primer entrenamiento para empezar
            </p>
          </div>
        ) : (
          entrenamientos.map((entrenamiento) => (
            <div key={entrenamiento.id} className="card hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{entrenamiento.nombre}</h3>
                  <p className="text-sm text-slate-400">
                    {new Date(entrenamiento.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {entrenamiento.duracion_minutos && (
                    <p className="text-xs text-slate-500">
                      ⏱️ {entrenamiento.duracion_minutos} minutos
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/entrenamientos/${entrenamiento.id}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-lg"
                    title="Ver detalles"
                  >
                    👁️
                  </Link>
                  <button
                    onClick={() => handleEliminar(entrenamiento.id)}
                    disabled={eliminando}
                    className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors text-lg"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              {entrenamiento.completado && (
                <div className="mt-2 inline-block bg-green-900/30 border border-green-700 text-green-200 text-xs px-2 py-1 rounded">
                  ✓ Completado
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}