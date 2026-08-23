'use client';

import { useState, useEffect } from 'react';
import { obtenerSeriesPorEjercicio } from '@/lib/db/series';
import { obtenerEjercicio } from '@/lib/db/ejercicios';
import { obtenerTodosEntrenamientos } from '@/lib/db/entrenamientos';

interface EjercicioFreq {
  ejercicioId: string;
  nombre: string;
  veces: number;
}

export default function EjerciciosMasFrecuentes() {
  const [ejercicios, setEjercicios] = useState<EjercicioFreq[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const entrenamientos = await obtenerTodosEntrenamientos();
        const frecuencia: Record<string, { nombre: string; veces: number }> = {};

        for (const ent of entrenamientos) {
          const series = await obtenerSeriesPorEjercicio(ent.id);
          
          for (const serie of series) {
            if (!frecuencia[serie.ejercicio_id]) {
              const ejercicio = await obtenerEjercicio(serie.ejercicio_id);
              frecuencia[serie.ejercicio_id] = {
                nombre: ejercicio?.nombre || 'Desconocido',
                veces: 0,
              };
            }
            frecuencia[serie.ejercicio_id].veces++;
          }
        }

        const top = Object.entries(frecuencia)
          .map(([id, data]) => ({
            ejercicioId: id,
            nombre: data.nombre,
            veces: data.veces,
          }))
          .sort((a, b) => b.veces - a.veces)
          .slice(0, 5);

        setEjercicios(top);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return <div className="card">
      <p className="text-slate-400 text-sm">Cargando...</p>
    </div>;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Ejercicios más frecuentes</h3>
      
      {ejercicios.length === 0 ? (
        <p className="text-slate-400 text-sm">Sin datos</p>
      ) : (
        <div className="space-y-3">
          {ejercicios.map((ej) => (
            <div key={ej.ejercicioId} className="flex items-center justify-between pb-3 border-b border-slate-700 last:border-b-0">
              <p className="font-semibold">{ej.nombre}</p>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{ej.veces}</p>
                <p className="text-xs text-slate-500">series</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}