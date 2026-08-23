'use client';

import { useState } from 'react';
import { Serie } from '@/lib/tipos';

interface RegistroSeriesProps {
  ejercicioId: string;
  ejercicioNombre: string;
  seriesObjetivo: number;
  repeticionesObjetivo: number;
  ultimasSeries?: Serie[];
  onSave: (series: Omit<Serie, 'id' | 'creado_en'>[]) => Promise<void>;
  cargando: boolean;
}

export default function RegistroSeries({
  ejercicioId,
  ejercicioNombre,
  seriesObjetivo,
  repeticionesObjetivo,
  ultimasSeries = [],
  onSave,
  cargando,
}: RegistroSeriesProps) {
  const [series, setSeries] = useState<
    Array<{ numero: number; peso: number; reps: number; rir: number }>
  >(
    Array.from({ length: seriesObjetivo }, (_, i) => ({
      numero: i + 1,
      peso: ultimasSeries[i]?.peso_kg || 0,
      reps: ultimasSeries[i]?.repeticiones || repeticionesObjetivo,
      rir: ultimasSeries[i]?.rir || 0,
    }))
  );

  const [guardado, setGuardado] = useState(false);

  const handleSerieChange = (
    numero: number,
    field: 'peso' | 'reps' | 'rir',
    value: number
  ) => {
    setSeries((prev) =>
      prev.map((s) => (s.numero === numero ? { ...s, [field]: value } : s))
    );
    setGuardado(false);
  };

  const handleSave = async () => {
    const datosGuardar: Omit<Serie, 'id' | 'creado_en'>[] = series.map(
      (s) => ({
        entrenamiento_id: '', // Se asigna en el componente padre
        ejercicio_id: ejercicioId,
        numero_serie: s.numero,
        peso_kg: s.peso,
        repeticiones: s.reps,
        rir: s.rir || undefined,
        es_calentamiento: false,
        notas: undefined,
      })
    );

    try {
      await onSave(datosGuardar);
      setGuardado(true);
    } catch (error) {
      console.error('Error guardando series:', error);
    }
  };

  const ultimaSerie =
    ultimasSeries.length > 0 ? ultimasSeries[ultimasSeries.length - 1] : null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-lg">{ejercicioNombre}</h4>
          <p className="text-sm text-slate-400">
            Objetivo: {seriesObjetivo} × {repeticionesObjetivo}
          </p>
        </div>
        {ultimaSerie && (
          <div className="text-right text-sm">
            <p className="text-slate-400">Última vez:</p>
            <p className="font-mono text-blue-400">
              {ultimaSerie.peso_kg}kg × {ultimaSerie.repeticiones}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-4">
        {series.map((serie) => (
          <div key={serie.numero} className="bg-slate-700/50 p-3 rounded">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold w-8">S{serie.numero}</span>
              <span className="text-xs text-slate-400 flex-1">Serie</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Peso */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">kg</label>
                <input
                  type="number"
                  value={serie.peso}
                  onChange={(e) =>
                    handleSerieChange(serie.numero, 'peso', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                  step="0.5"
                  className="w-full"
                />
              </div>

              {/* Repeticiones */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">reps</label>
                <input
                  type="number"
                  value={serie.reps}
                  onChange={(e) =>
                    handleSerieChange(serie.numero, 'reps', parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="w-full"
                />
              </div>

              {/* RIR */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">RIR</label>
                <input
                  type="number"
                  value={serie.rir}
                  onChange={(e) =>
                    handleSerieChange(serie.numero, 'rir', parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  min="0"
                  max="5"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={cargando || guardado}
        className={`w-full py-2 px-3 rounded font-semibold transition-all ${
          guardado
            ? 'bg-green-600 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
        }`}
      >
        {guardado ? '✓ Guardado' : cargando ? 'Guardando...' : 'Guardar serie'}
      </button>
    </div>
  );
}