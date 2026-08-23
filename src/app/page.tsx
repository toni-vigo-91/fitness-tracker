'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Entrenamiento, MedidaCorporal } from '@/lib/tipos';
import { obtenerUltimoEntrenamiento } from '@/lib/db/entrenamientos';
import { obtenerUltimaMedida } from '@/lib/db/medidas';
import VerificacionSeed from '@/components/ui/VerificacionSeed';

export default function Dashboard() {
  const [ultimoEntrenamiento, setUltimoEntrenamiento] = useState<Entrenamiento | null>(null);
  const [ultimaMedida, setUltimaMedida] = useState<MedidaCorporal | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const entrenamiento = await obtenerUltimoEntrenamiento();
        const medida = await obtenerUltimaMedida();
        setUltimoEntrenamiento(entrenamiento || null);
        setUltimaMedida(medida || null);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Fitness Tracker</h1>
        <p className="text-slate-400">Tu evolucion hacia tus objetivos</p>
      </div>

      <VerificacionSeed />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/entrenamientos" className="card hover:bg-slate-700 transition-colors group cursor-pointer">
          <p className="text-slate-400 text-sm mb-2">Ultimo entrenamiento</p>
          {cargando ? (
            <p className="text-slate-500 text-sm">Cargando...</p>
          ) : ultimoEntrenamiento ? (
            <>
              <p className="text-lg font-bold group-hover:text-blue-400 transition-colors">
                {ultimoEntrenamiento.nombre}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(ultimoEntrenamiento.fecha).toLocaleDateString("es-ES")}
              </p>
            </>
          ) : (
            <p className="text-slate-500 text-sm">Sin entrenamientos</p>
          )}
        </Link>

        <Link href="/medidas" className="card hover:bg-slate-700 transition-colors group cursor-pointer">
          <p className="text-slate-400 text-sm mb-2">Peso actual</p>
          {cargando ? (
            <p className="text-slate-500 text-sm">Cargando...</p>
          ) : ultimaMedida ? (
            <>
              <p className="text-lg font-bold group-hover:text-blue-400 transition-colors">
                {ultimaMedida.peso_kg.toFixed(1)} kg
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(ultimaMedida.fecha).toLocaleDateString("es-ES")}
              </p>
            </>
          ) : (
            <p className="text-slate-500 text-sm">Sin mediciones</p>
          )}
        </Link>

        <Link href="/ejercicios" className="card hover:bg-slate-700 transition-colors group cursor-pointer">
          <p className="text-slate-400 text-sm mb-2">Ejercicios</p>
          <p className="text-lg font-bold group-hover:text-blue-400 transition-colors">
            Biblioteca
          </p>
          <p className="text-xs text-slate-500 mt-1">32 ejercicios</p>
        </Link>

        <Link href="/entrenamientos/nuevo" className="card hover:bg-slate-700 transition-colors group cursor-pointer">
          <p className="text-slate-400 text-sm mb-2">Rutinas</p>
          <p className="text-lg font-bold group-hover:text-blue-400 transition-colors">
            Empezar
          </p>
          <p className="text-xs text-slate-500 mt-1">4 rutinas disponibles</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/entrenamientos/nuevo" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-all">
          Nuevo entrenamiento
        </Link>

        <Link href="/medidas" className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-all">
          Nueva medicion
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-slate-800/50">
          <p className="text-slate-400 text-xs mb-2">DATOS RAPIDOS</p>
          <p className="text-sm text-slate-300">
            Sigue tu progreso registrando entrenamientos y medidas corporales
          </p>
        </div>

        <div className="card bg-slate-800/50">
          <p className="text-slate-400 text-xs mb-2">RUTINAS</p>
          <p className="text-sm text-slate-300">
            4 rutinas pre-diseñadas: Upper A/B, Lower A/B
          </p>
        </div>

        <div className="card bg-slate-800/50">
          <p className="text-slate-400 text-xs mb-2">GRAFICOS</p>
          <p className="text-sm text-slate-300">
            Visualiza tu evolucion de peso y medidas
          </p>
        </div>
      </div>
    </div>
  );
}