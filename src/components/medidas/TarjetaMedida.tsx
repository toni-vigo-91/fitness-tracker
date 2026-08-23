'use client';

import { MedidaCorporal } from '@/lib/tipos';

interface TarjetaMedidaProps {
  medida: MedidaCorporal;
  medidaAnterior?: MedidaCorporal;
  onEditar: (medida: MedidaCorporal) => void;
  onEliminar: (id: string) => void;
  eliminando: boolean;
}

export default function TarjetaMedida({
  medida,
  medidaAnterior,
  onEditar,
  onEliminar,
  eliminando,
}: TarjetaMedidaProps) {
  const cambio = medidaAnterior
    ? medida.peso_kg - medidaAnterior.peso_kg
    : null;

  const cambioColor = cambio === null ? '' : cambio > 0 ? 'text-red-400' : 'text-green-400';

  return (
    <div className="card hover:bg-slate-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-slate-400">
            {new Date(medida.fecha).toLocaleDateString('es-ES', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-2xl font-bold">{medida.peso_kg.toFixed(1)} kg</p>
          {cambio !== null && (
            <p className={`text-sm font-semibold ${cambioColor}`}>
              {cambio > 0 ? '+' : ''}{cambio.toFixed(1)} kg
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEditar(medida)}
            className="text-blue-400 hover:text-blue-300 transition-colors text-lg"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onEliminar(medida.id)}
            disabled={eliminando}
            className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors text-lg"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Medidas adicionales */}
      <div className="space-y-1 text-xs text-slate-400">
        {medida.cintura_cm && <p>📏 Cintura: {medida.cintura_cm.toFixed(1)} cm</p>}
        {medida.pecho_cm && <p>📏 Pecho: {medida.pecho_cm.toFixed(1)} cm</p>}
        {medida.brazo_cm && <p>💪 Brazo: {medida.brazo_cm.toFixed(1)} cm</p>}
        {medida.grasa_corporal_pct && (
          <p>⚖️ Grasa: {medida.grasa_corporal_pct.toFixed(1)}%</p>
        )}
        {medida.notas && <p className="text-slate-500 italic mt-2">"{medida.notas}"</p>}
      </div>
    </div>
  );
}