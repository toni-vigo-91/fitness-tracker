'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEntrenamientos } from '@/hooks/useEntrenamientos';
import { Rutina } from '@/lib/tipos';
import { obtenerTodasRutinas } from '@/lib/db/rutinas';

export default function EntrenamientosPage() {
  const { entrenamientos, cargando, eliminar } = useEntrenamientos();
  const [eliminando, setEliminando] = useState(false);
  const [filtroRutina, setFiltroRutina] = useState<string | null>(null);
  const [rutinas, setRutinas] = useState<Rutina[]>([]);

  useEffect(() => {
    const cargarRutinas = async () => {
      const todas = await obtenerTodasRutinas();
      setRutinas(todas);
    };
    cargarRutinas();
  }, []);

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

  const entrenamientosFiltrados = filtroRutina
    ? entrenamientos.filter((e) => e.rutina_id === filtroRutina)
    : entrenamientos;

  const totalEntrenamientos = entrenamientos.length;
  const totalCompletados = entrenamientos.filter((e) => e.completado).length;
  const totalMesActual = entrenamientos.filter((e) => {
    const fecha = new Date(e.fecha);
    const ahora = new Date();
    return (
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getFullYear() === ahora.getFullYear()
    );
  }).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Entrenamientos</h2>
        <p className="text-slate-400">Historial de tus sesiones</p>
      </div>

      {/* Estadísticas */}
      {totalEntrenamientos > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="text-slate-300 text-sm font-semibold mb-2">Total</h3>
            <p className="text-3xl font-bold">{totalEntrenamientos}</p>
            <p className="text-xs text-slate-500">entrenamientos</p>
          </div>

          <div className="card">
            <h3 className="text-slate-300 text-sm font-semibold mb-2">
              Completados
            </h3>
            <p className="text-3xl font-bold text-green-400">{totalCompletados}</p>
            <p className="text-xs text-slate-500">
              {totalEntrenamientos > 0
                ? `${Math.round((totalCompletados / totalEntrenamientos) * 100)}%`
                : '0%'}
            </p>
          </div>

          <div className="card">
            <h3 className="text-slate-300 text-sm font-semibold mb-2">
              Este mes
            </h3>
            <p className="text-3xl font-bold text-blue-400">{totalMesActual}</p>
            <p className="text-xs text-slate-500">sesiones</p>
          </div>
        </div>
      )}

      {/* Botón crear */}
      <Link
        href="/entrenamientos/nuevo"
        className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-lg text-center text-lg transition-all"
      >
        + Nuevo entrenamiento
      </Link>

      {/* Filtro por rutina */}
      {rutinas.length > 0 && totalEntrenamientos > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Filtrar por rutina:</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFiltroRutina(null)}
              className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                filtroRutina === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todas
            </button>
            {rutinas.map((rutina) => (
              <button
                key={rutina.id}
                onClick={() => setFiltroRutina(rutina.id)}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  filtroRutina === rutina.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {rutina.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lista de entrenamientos */}
      <div className="space-y-3">
        {cargando ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Cargando entrenamientos...</p>
          </div>
        ) : entrenamientosFiltrados.length === 0 ? (
          <div className="card bg-slate-800/50 border-dashed border-slate-600 py-12 text-center">
            <p className="text-slate-400 text-lg mb-4">
              {filtroRutina ? 'Sin entrenamientos en esta rutina' : 'Sin entrenamientos aún'}
            </p>
            <p className="text-slate-500 text-sm">
              Crea tu primer entrenamiento para empezar
            </p>
          </div>
        ) : (
          entrenamientosFiltrados.map((entrenamiento) => (
            <Link
              key={entrenamiento.id}
              href={`/entrenamientos/${entrenamiento.id}`}
              className="card hover:bg-slate-700 transition-colors"
            >
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
                <div className="flex items-center gap-4">
                  {entrenamiento.completado && (
                    <div className="bg-green-900/30 border border-green-700 text-green-200 text-xs px-3 py-1 rounded font-semibold">
                      ✓ Completado
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleEliminar(entrenamiento.id);
                    }}
                    disabled={eliminando}
                    className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors text-lg"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}