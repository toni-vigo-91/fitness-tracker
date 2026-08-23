'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { obtenerTodasMedidas } from '@/lib/db/medidas';

interface DatosGrafico {
  fecha: string;
  peso: number;
}

export default function GraficoEvolucionPeso(props?: any) {
  const [datos, setDatos] = useState<DatosGrafico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const medidas = await obtenerTodasMedidas();
        
        const datosMap: Record<string, number> = {};
        medidas.forEach((m: any) => {
          const fecha = new Date(m.fecha).toLocaleDateString('es-ES');
          datosMap[fecha] = m.peso_kg;
        });

        const datosGrafico = Object.entries(datosMap)
          .map(([fecha, peso]) => ({ fecha, peso: peso as number }))
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        setDatos(datosGrafico);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return <div className="card h-80 flex items-center justify-center">
      <p className="text-slate-400">Cargando...</p>
    </div>;
  }

  if (datos.length === 0) {
    return <div className="card h-80 flex items-center justify-center">
      <p className="text-slate-400">Sin datos</p>
    </div>;
  }

  const minPeso = Math.min(...datos.map((d) => d.peso));
  const maxPeso = Math.max(...datos.map((d) => d.peso));

  return (
    <div className="card">
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
    </div>
  );
}