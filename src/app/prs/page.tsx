'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { obtenerTodosPRs, obtenerHistoriaPRs } from '@/lib/db/ejercicios';
import { Ejercicio } from '@/lib/tipos';
import TarjetaPR from '@/components/prs/TarjetaPR';
import GraficoProgresionEjercicio from '@/components/prs/GraficoProgresionEjercicio';

interface PRData {
  ejercicio: Ejercicio;
  pr: number;
  fecha: Date;
}

export default function PRsPage() {
  const [prs, setPRs] = useState<PRData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<Ejercicio | null>(null);

  useEffect(() => {
    const cargarPRs = async () => {
      try {
        const todosPRs = await obtenerTodosPRs();
        setPRs(todosPRs);
        if (todosPRs.length > 0) {
          setEjercicioSeleccionado(todosPRs[0].ejercicio);
        }
      } finally {
        setCargando(false);
      }
    };

    cargarPRs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Personal Records</h2>
        <p className="text-slate-400">Tus mejores marcas por ejercicio</p>
      </div>

      {cargando ? (
        <div className="card text-center py-12">
          <p className="text-slate-400">Cargando PRs...</p>
        </div>
      ) : prs.length === 0 ? (
        <div className="card bg-slate-800/50 border-dashed border-slate-600 py-12 text-center">
          <p className="text-slate-400 text-lg mb-4">Sin PRs registrados</p>
          <p className="text-slate-500 text-sm mb-6">
            Registra entrenamientos para empezar a rastrear tus mejores marcas
          </p>
          <Link
            href="/entrenamientos/nuevo"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            Iniciar entrenamiento
          </Link>
        </div>
      ) : (
        <>
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card">
              <p className="text-slate-400 text-sm mb-2">Total de PRs</p>
              <p className="text-3xl font-bold">{prs.length}</p>
            </div>

            <div className="card">
              <p className="text-slate-400 text-sm mb-2">Mejor PR</p>
              <p className="text-3xl font-bold text-green-400">
                {prs[0]?.pr.toFixed(1)} kg
              </p>
              <p className="text-xs text-slate-500">{prs[0]?.ejercicio.nombre}</p>
            </div>

            <div className="card">
              <p className="text-slate-400 text-sm mb-2">PRs este mes</p>
              <p className="text-3xl font-bold text-blue-400">
                {prs.filter((pr) => {
                  const ahora = new Date();
                  const hace30 = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
                  return pr.fecha >= hace30;
                }).length}
              </p>
            </div>
          </div>

          {/* Gráfico del ejercicio seleccionado */}
          {ejercicioSeleccionado && (
            <GraficoProgresionEjercicio ejercicio={ejercicioSeleccionado} />
          )}

          {/* Selector de ejercicio */}
          {prs.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Ver progresión de otro ejercicio</h3>
              <div className="flex gap-2 flex-wrap">
                {prs.map((pr) => (
                  <button
                    key={pr.ejercicio.id}
                    onClick={() => setEjercicioSeleccionado(pr.ejercicio)}
                    className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                      ejercicioSeleccionado?.id === pr.ejercicio.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {pr.ejercicio.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lista de PRs */}
          <div>
            <h3 className="text-xl font-bold mb-4">Top 10 PRs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {prs.slice(0, 10).map((pr, index) => (
                <TarjetaPR
                  key={pr.ejercicio.id}
                  ejercicio={pr.ejercicio}
                  pr={pr.pr}
                  fecha={pr.fecha}
                  puesto={index + 1}
                />
              ))}
            </div>
          </div>

          {/* Todos los PRs */}
          {prs.length > 10 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Todos los PRs ({prs.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {prs.slice(10).map((pr, index) => (
                  <TarjetaPR
                    key={pr.ejercicio.id}
                    ejercicio={pr.ejercicio}
                    pr={pr.pr}
                    fecha={pr.fecha}
                    puesto={index + 11}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}