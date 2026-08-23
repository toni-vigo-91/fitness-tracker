'use client';

import { useEffect, useState } from 'react';
import { Rutina } from '@/lib/tipos';
import { obtenerRutinasSeedeatdas } from '@/lib/db/rutinas';

interface SelectorRutinaProps {
  onSelect: (rutina: Rutina) => void;
  cargando: boolean;
  selectedRutinaId?: string;
}

export default function SelectorRutina({
  onSelect,
  cargando,
  selectedRutinaId,
}: SelectorRutinaProps) {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [cargandoRutinas, setCargandoRutinas] = useState(true);

  useEffect(() => {
    const cargarRutinas = async () => {
      try {
        const todasRutinas = await obtenerRutinasSeedeatdas();
        setRutinas(todasRutinas);
        // Seleccionar la primera si no hay selección
        if (todasRutinas.length > 0 && !selectedRutinaId) {
          onSelect(todasRutinas[0]);
        }
      } finally {
        setCargandoRutinas(false);
      }
    };
    cargarRutinas();
  }, [onSelect, selectedRutinaId]);

  if (cargandoRutinas) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-400">Cargando rutinas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">Selecciona una rutina</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rutinas.map((rutina) => (
          <button
            key={rutina.id}
            onClick={() => onSelect(rutina)}
            disabled={cargando}
            className={`p-4 rounded-lg font-semibold transition-all ${
              selectedRutinaId === rutina.id
                ? 'bg-blue-600 text-white border-2 border-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700'
            } ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-lg mb-1">{rutina.nombre}</div>
            <div className="text-xs text-slate-300">{rutina.descripcion}</div>
          </button>
        ))}
      </div>
    </div>
  );
}