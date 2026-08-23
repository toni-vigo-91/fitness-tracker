'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Entrenamiento, Serie, Ejercicio } from '@/lib/tipos';
import { obtenerEntrenamiento, actualizarEntrenamiento } from '@/lib/db/entrenamientos';
import { obtenerSeriesPorEntrenamiento } from '@/lib/db/series';
import { obtenerEjercicio } from '@/lib/db/ejercicios';

interface SerieConDetalles {
  serie: Serie;
  ejercicio: Ejercicio | undefined;
}

export default function DetalleEntrenamientoPage() {
  const params = useParams();
  const entrenamientoId = params.id as string;

  const [entrenamiento, setEntrenamiento] = useState<Entrenamiento | null>(null);
  const [series, setSeries] = useState<SerieConDetalles[]>([]);
  const [cargando, setCargando] = useState(true);
  const [marcandoCompletado, setMarcandoCompletado] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const ent = await obtenerEntrenamiento(entrenamientoId);
        setEntrenamiento(ent || null);

        if (ent) {
          const todasLasSeries = await obtenerSeriesPorEntrenamiento(entrenamientoId);
          
          // Cargar detalles de ejercicios
          const seriesConDetalles: SerieConDetalles[] = [];
          for (const serie of todasLasSeries) {
            const ejercicio = await obtenerEjercicio(serie.ejercicio_id);
            seriesConDetalles.push({ serie, ejercicio });
          }

          setSeries(seriesConDetalles);
        }
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [entrenamientoId]);

  const handleMarcarCompletado = async () => {
    if (!entrenamiento) return;
    setMarcandoCompletado(true);
    try {
      const actualizado = await actualizarEntrenamiento(entrenamientoId, {
        completado: !entrenamiento.completado,
      });
      if (actualizado) {
        setEntrenamiento(actualizado);
      }
    } finally {
      setMarcandoCompletado(false);
    }
  };

  if (cargando) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-slate-400 text-center">Cargando...</p>
      </div>
    );
  }

  if (!entrenamiento) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="card bg-slate-800/50 py-12 text-center">
          <p className="text-slate-400 text-lg">Entrenamiento no encontrado</p>
          <Link href="/entrenamientos" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            ← Volver a entrenamientos
          </Link>
        </div>
      </div>
    );
  }

  // Agrupar series por ejercicio
  const seriesPorEjercicio = series.reduce(
    (acc, item) => {
      const key = item.serie.ejercicio_id;
      if (!acc[key]) {
        acc[key] = { ejercicio: item.ejercicio, series: [] };
      }
      acc[key].series.push(item.serie);
      return acc;
    },
    {} as Record<string, { ejercicio: Ejercicio | undefined; series: Serie[] }>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/entrenamientos" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
            ← Volver
          </Link>
          <h2 className="text-3xl font-bold mb-1">{entrenamiento.nombre}</h2>
          <p className="text-slate-400">
            {new Date(entrenamiento.fecha).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-3">
          {entrenamiento.completado && (
            <div className="bg-green-900/30 border border-green-700 text-green-200 px-3 py-2 rounded font-semibold text-sm">
              ✓ Completado
            </div>
          )}
          <button
            onClick={handleMarcarCompletado}
            disabled={marcandoCompletado}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              entrenamiento.completado
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-50`}
          >
            {entrenamiento.completado ? 'Marcar pendiente' : 'Marcar completado'}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Series totales</p>
          <p className="text-2xl font-bold">{series.length}</p>
        </div>

        {entrenamiento.duracion_minutos && (
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Duración</p>
            <p className="text-2xl font-bold">{entrenamiento.duracion_minutos} min</p>
          </div>
        )}

        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Ejercicios</p>
          <p className="text-2xl font-bold">{Object.keys(seriesPorEjercicio).length}</p>
        </div>
      </div>

      {/* Desglose por ejercicio */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Ejercicios</h3>

        {series.length === 0 ? (
          <div className="card bg-slate-800/50 border-dashed border-slate-600 py-8 text-center">
            <p className="text-slate-400">Sin series registradas en este entrenamiento</p>
          </div>
        ) : (
          Object.entries(seriesPorEjercicio).map(([ejercicioId, { ejercicio, series: seriesdel }]) => (
            <div key={ejercicioId} className="card">
              <h4 className="font-semibold text-lg mb-4">
                {ejercicio?.nombre || 'Ejercicio desconocido'}
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-2 px-2">Serie</th>
                      <th className="text-left py-2 px-2">Peso</th>
                      <th className="text-left py-2 px-2">Reps</th>
                      <th className="text-left py-2 px-2">RIR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seriesdel.map((serie) => (
                      <tr key={serie.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-2 px-2 font-semibold">S{serie.numero_serie}</td>
                        <td className="py-2 px-2">{serie.peso_kg} kg</td>
                        <td className="py-2 px-2">{serie.repeticiones}</td>
                        <td className="py-2 px-2">{serie.rir || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {ejercicio?.notas && (
                <p className="text-xs text-slate-500 italic mt-3">
                  Nota: {ejercicio.notas}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Notas del entrenamiento */}
      {entrenamiento.notas && (
        <div className="card bg-blue-900/20 border-blue-700">
          <p className="text-slate-300 text-sm">
            <span className="font-semibold">Notas:</span> {entrenamiento.notas}
          </p>
        </div>
      )}
    </div>
  );
}