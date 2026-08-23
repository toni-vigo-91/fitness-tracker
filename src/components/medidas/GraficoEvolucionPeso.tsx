'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MedidaCorporal } from '@/lib/tipos';

interface GraficoEvolucionPesoProps {
  medidas: MedidaCorporal[];
  medida?: keyof Omit<MedidaCorporal, 'id' | 'creado_en' | 'notas'>;
}

export default function GraficoEvolucionPeso({
  medidas,
  medida = 'peso_kg',
}: GraficoEvolucionPesoProps) {
  if (medidas.length === 0) {
    return (
      <div className="card bg-slate-800/50 border-dashed border-slate-600 py-12 text-center">
        <p className="text-slate-400">Sin datos aún</p>
      </div>
    );
  }

  // Preparar datos para el gráfico
  const datos = medidas
    .reverse()
    .map((m) => ({
      fecha: new Date(m.fecha).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
      }),
      valor: m[medida] || 0,
      fechaCompleta: new Date(m.fecha).toISOString(),
    }));

  const minValue = Math.min(...datos.map((d) => d.valor));
  const maxValue = Math.max(...datos.map((d) => d.valor));

  return (
    <div className="card">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.5)" />
          <XAxis
            dataKey="fecha"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            domain={[minValue - 1, maxValue + 1]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#3b82f6"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name={medida === 'peso_kg' ? 'Peso (kg)' : String(medida)}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Estadísticas */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-slate-400">Inicial</p>
          <p className="text-lg font-bold">{datos[0]?.valor.toFixed(1)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Actual</p>
          <p className="text-lg font-bold">{datos[datos.length - 1]?.valor.toFixed(1)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Cambio</p>
          <p
            className={`text-lg font-bold ${
              (datos[datos.length - 1]?.valor ?? 0) - (datos[0]?.valor ?? 0) > 0
                ? 'text-red-400'
                : 'text-green-400'
            }`}
          >
            {((datos[datos.length - 1]?.valor ?? 0) - (datos[0]?.valor ?? 0)).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}