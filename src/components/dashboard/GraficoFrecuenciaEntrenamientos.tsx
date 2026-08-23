'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { obtenerTodosEntrenamientos } from '@/lib/db/entrenamientos';

interface DatosGrafico {
  semana: string;
  entrenamientos: number;
}

export default function GraficoFrecuenciaEntrenamientos() {
  const [datos, setDatos] = useState<DatosGrafico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const entrenamientos = await obtenerTodosEntrenamientos();
        
        // Calcular últimas 12 semanas
        const hoy = new Date();
        const hace12Semanas = new Date(hoy.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);

        const porSemana: Record<string, number> = {};

        for (let i = 0; i < 12; i++) {
          const fecha = new Date(hace12Semanas.getTime() + i * 7 * 24 * 60 * 60 * 1000);
          const semanaKey = `S${i + 1}`;
          porSemana[semanaKey] = 0;
        }

        entrenamientos.forEach((ent) => {
          const fecha = new Date(ent.fecha);
          if (fecha >= hace12Semanas && fecha <= hoy) {
            const semanasDiff = Math.floor(
              (fecha.getTime() - hace12Semanas.getTime()) / (7 * 24 * 60 * 60 * 1000)
            );
            const semanaKey = `S${semanasDiff + 1}`;
            if (semanaKey in porSemana) {
              porSemana[semanaKey]++;
            }
          }
        });

        const datosGrafico = Object.entries(porSemana).map(([semana, cantidad]) => ({
          semana,
          entrenamientos: cantidad,
        }));

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

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Entrenamientos últimas 12 semanas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.5)" />
          <XAxis dataKey="semana" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="entrenamientos" fill="#3b82f6" name="Entrenamientos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}