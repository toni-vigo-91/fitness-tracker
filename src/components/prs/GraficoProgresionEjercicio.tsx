'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { obtenerSeriesPorEjercicio } from '@/lib/db/series';
import { Ejercicio } from '@/lib/tipos';

interface DatosGrafico {
  fecha: string;
  peso: number;
}

interface GraficoProgresionEjercicioProps {
  ejercicio: Ejercicio;
}

export default function GraficoProgresionEjercicio({ ejercicio }: GraficoProgresionEjercicioProps) {
  const [datos, setDatos] = useState<DatosGrafico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const series = await obtenerSeriesPorEjercicio(ejercicio.id);
        
        // Agrupar por fecha y obtener peso máximo por fecha
        const porFecha: Record<string, number> = {};
        
        series.forEach((serie) => {
          const fecha = new Date(serie.creado_en).toLocaleDateString('es-ES');
          if (!porFecha[fecha]) {
            porFecha[fecha] = serie.peso_kg;
          } else {
            porFecha[fecha] = Math.max(porFecha[fecha], serie.peso_kg);
          }
        });

        const datosGrafico = Object.entries(porFecha)
          .map(([fecha, peso]) => ({
            fecha,
            peso,
          }))
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        setDatos(datosGrafico);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [ejercicio.id]);

  if (cargando) {
    return <div className="card h-80 flex items-center justify-center">
      <p className="text-slate-400">Cargando...</p>
    </div>;
  }

  if (datos.length === 0) {
    return <div className="card h-80 flex items-center justify-center">
      <p className="text-slate-400">Sin datos de progresión</p>
    </div>;
  }

  const minPeso = Math.min(...datos.map((d) => d.peso));
  const maxPeso = Math.max(...datos.map((d) => d.peso));
  const mejora = maxPeso - minPeso;

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Progresión: {ejercicio.nombre}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.5)" />
          <XAxis
            dataKey="fecha"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            interval={Math.max(0, Math.floor(datos.length / 6))}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            domain={[minPeso - 2, maxPeso + 2]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Line
            type="monotone"
            dataKey="peso"
            stroke="#3b82f6"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Peso (kg)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-slate-400">Inicial</p>
          <p className="text-2xl font-bold">{minPeso.toFixed(1)}</p>
          <p className="text-xs text-slate-500">kg</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-400">Actual (PR)</p>
          <p className="text-2xl font-bold text-green-400">{maxPeso.toFixed(1)}</p>
          <p className="text-xs text-slate-500">kg</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-400">Mejora</p>
          <p className="text-2xl font-bold text-blue-400">+{mejora.toFixed(1)}</p>
          <p className="text-xs text-slate-500">kg</p>
        </div>
      </div>
    </div>
  );
}