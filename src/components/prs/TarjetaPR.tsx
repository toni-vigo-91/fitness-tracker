'use client';

import { Ejercicio } from '@/lib/tipos';

interface TarjetaPRProps {
  ejercicio: Ejercicio;
  pr: number;
  fecha: Date;
  puesto: number;
  esNuevo?: boolean;
}

export default function TarjetaPR({
  ejercicio,
  pr,
  fecha,
  puesto,
  esNuevo = false,
}: TarjetaPRProps) {
  return (
    <div className={`card ${esNuevo ? 'bg-yellow-900/20 border-yellow-700' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold text-slate-400">#{puesto}</div>
          <div>
            <h3 className="font-semibold text-lg">{ejercicio.nombre}</h3>
            <p className="text-xs text-slate-500">{ejercicio.grupo_muscular}</p>
          </div>
        </div>
        {esNuevo && (
          <div className="bg-yellow-600 text-white text-xs px-3 py-1 rounded font-bold">
            🏆 NUEVO
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-slate-400 text-xs mb-1">Peso</p>
          <p className="text-3xl font-bold">{pr.toFixed(1)}</p>
          <p className="text-xs text-slate-500">kg</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-1">Fecha</p>
          <p className="text-sm font-semibold">
            {fecha.toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {ejercicio.notas && (
        <p className="text-xs text-slate-500 italic mt-3 pt-3 border-t border-slate-700">
          {ejercicio.notas}
        </p>
      )}
    </div>
  );
}