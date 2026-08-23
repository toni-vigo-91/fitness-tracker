'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ejercicio } from '@/lib/tipos';
import { obtenerTodosEjercicios, buscarEjercicios } from '@/lib/db/ejercicios';

export default function EjerciciosPage() {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [filtrados, setFiltrados] = useState<Ejercicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroGrupo, setFiltroGrupo] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const todos = await obtenerTodosEjercicios();
        setEjercicios(todos);
        setFiltrados(todos);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  useEffect(() => {
    let resultado = ejercicios;

    if (busqueda.trim()) {
      resultado = resultado.filter((e) =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroGrupo) {
      resultado = resultado.filter((e) => e.grupo_muscular === filtroGrupo);
    }

    setFiltrados(resultado);
  }, [busqueda, filtroGrupo, ejercicios]);

  const grupos = [...new Set(ejercicios.map((e) => e.grupo_muscular))].sort();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Ejercicios</h2>
        <p className="text-slate-400">Biblioteca de {ejercicios.length} ejercicios</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full"
        />

        {grupos.length > 0 && (
          <div>
            <label className="text-sm font-semibold block mb-2">Filtrar por grupo muscular:</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFiltroGrupo('')}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  filtroGrupo === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Todos
              </button>
              {grupos.map((grupo) => (
                <button
                  key={grupo}
                  onClick={() => setFiltroGrupo(grupo)}
                  className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                    filtroGrupo === grupo
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {grupo}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {cargando ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Cargando ejercicios...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="card bg-slate-800/50 border-dashed border-slate-600 py-12 text-center">
          <p className="text-slate-400">No se encontraron ejercicios</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((ejercicio) => (
            <div key={ejercicio.id} className="card hover:bg-slate-700 transition-colors">
              <h3 className="font-semibold text-lg mb-2">{ejercicio.nombre}</h3>
              <p className="text-sm text-slate-400 mb-2">{ejercicio.grupo_muscular}</p>
              {ejercicio.grupo_secundario && ejercicio.grupo_secundario.length > 0 && (
                <p className="text-xs text-slate-500 mb-3">
                  Secundario: {ejercicio.grupo_secundario.join(', ')}
                </p>
              )}
              <p className="text-xs text-slate-500">{ejercicio.equipamiento}</p>
            </div>
          ))}
        </div>
      )}

      <div className="text-center pt-6">
        <Link
          href="/entrenamientos/nuevo"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all"
        >
          Usar ejercicios en entrenamiento
        </Link>
      </div>
    </div>
  );
}