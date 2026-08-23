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
      {/* Encabezado */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Fitness Tracker</h1>
        <p className="text-slate-400">Tu evolución hacia tus objetivos</p>
      </div>

      {/* Verificación de Seed (solo en desarrollo) */}
      <VerificacionSeed />

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Último entrenamiento */}
        <Link
          href="/entrenamientos"
          className="card hover:bg-slate-700 transition-colors group cursor-pointer"
        >
          <p className="text-slate-400 text-sm mb-2">📋 Último entrenamiento</p>
          {cargando ? (
            <p className="text-slate-500 text-sm">Cargando...</p>
          ) : ultimoEntrenamiento ? (
            <>
              <p className="text-lg font-bold group-hover:text-blue-400 transition-colors">