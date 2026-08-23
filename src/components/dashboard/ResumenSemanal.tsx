'use client';

import { useState, useEffect } from 'react';
import { obtenerTodosEntrenamientos } from '@/lib/db/entrenamientos';

interface ResumenData {
  sesionesEstaSemana: number;
  sesionesCompletadas: number;
  mejorSesion: { nombre: string; fecha: Date } | null;
  promedioDuracion: number;
}

export default function ResumenSemanal() {
  const [resumen, setResumen] = useState<ResumenData>({
    sesionesEstaSemana: 0,
    sesionesCompletadas: 0,
    mejorSesion: null,
    promedioDuracion: 0,
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const entrenamientos = await obtenerTodosEntrenamientos();
        
        // Obtener fecha de inicio de semana (lunes)
        const hoy = new Date();
        const diasDesdeMonday = (hoy.getDay() + 6) % 7;
        const inicioSemana = new Date(hoy.getTime() - diasDesdeMonday * 24 * 60 * 60 * 1000);
        inicioSemana.setHours(0, 0, 0, 0);

        const estaSemana = entrenamientos.filter((e) => {
          const fecha = new Date(e.fecha);
          return fecha >= inicioSemana && fecha <= hoy;
        });

        const completadas = estaSemana.filter((e) => e.completado).length;
        
        const duraciones = estaSemana
          .filter((e) => e.duracion_minutos)
          .map((e) => e.duracion_minutos || 0);
        
        const promedio = duraciones.length > 0
          ? Math.round(duraciones.reduce((a, b) => a + b, 0) / duraciones.length)
          : 0;

        const mejorSesion = estaSemana.length > 0 ? estaSemana[0] : null;

        setResumen({
          sesionesEstaSemana: estaSemana.length,
          sesionesCompletadas: completadas,
          mejorSesion: mejorSesion ? { nombre: mejorSesion.nombre, fecha: new Date(mejorSesion.fecha) } : null,
          promedioDuracion: promedio,
        });
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
    <div className="card bg-blue-900/20 border-blue-700">
      <h3 className="text-lg font-bold mb-4">Esta semana</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-slate-400 text-xs mb-1">Sesiones</p>
          <p className="text-3xl font-bold text-blue-400">{resumen.sesionesEstaSemana}</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-1">Completadas</p>
          <p className="text-3xl font-bold text-green-400">{resumen.sesionesCompletadas}</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-1">Duración promedio</p>
          <p className="text-3xl font-bold">{resumen.promedioDuracion} min</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-1">Última sesión</p>
          <p className="text-lg font-semibold">
            {resumen.mejorSesion ? resumen.mejorSesion.nombre : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}