'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PerfilUsuario } from '@/lib/tipos';
import { obtenerPerfil, actualizarPerfil } from '@/lib/db/perfil';
import { obtenerTodosEntrenamientos } from '@/lib/db/entrenamientos';
import { obtenerTodasMedidas } from '@/lib/db/medidas';
import FormularioPerfil from '@/components/perfil/FormularioPerfil';

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    totalEntrenamientos: 0,
    totalMedidas: 0,
    streakSemanal: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const perfilData = await obtenerPerfil();
        setPerfil(perfilData);

        const entrenamientos = await obtenerTodosEntrenamientos();
        const medidas = await obtenerTodasMedidas();

        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());

        const entrenamientosEstaSemana = entrenamientos.filter((e) => {
          const fecha = new Date(e.fecha);
          return fecha >= inicioSemana && fecha <= hoy;
        }).length;

        setEstadisticas({
          totalEntrenamientos: entrenamientos.length,
          totalMedidas: medidas.length,
          streakSemanal: entrenamientosEstaSemana,
        });
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const handleGuardar = async (cambios: Partial<PerfilUsuario>) => {
    setGuardando(true);
    try {
      const actualizado = await actualizarPerfil(cambios);
      setPerfil(actualizado);
    } finally {
      setGuardando(false);
    }
  };

  const handleExportarDatos = () => {
    const datosJSON = {
      perfil,
      estadisticas,
      exportado_en: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(datosJSON, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (cargando || !perfil) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-slate-400 text-center">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
          Volver
        </Link>
        <h2 className="text-3xl font-bold mb-2">Mi Perfil</h2>
        <p className="text-slate-400">Gestiona tu informacion y preferencias</p>
      </div>

      <div className="card bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h3 className="text-2xl font-bold">{perfil.nombre}</h3>
              <p className="text-slate-400 text-sm">Miembro desde {new Date(perfil.creado_en).toLocaleDateString('es-ES')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Entrenamientos totales</p>
          <p className="text-3xl font-bold">{estadisticas.totalEntrenamientos}</p>
        </div>

        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Mediciones registradas</p>
          <p className="text-3xl font-bold">{estadisticas.totalMedidas}</p>
        </div>

        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Esta semana</p>
          <p className="text-3xl font-bold text-green-400">{estadisticas.streakSemanal}/{perfil.objetivo_semanal_entrenamientos}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold mb-6">Informacion Personal</h3>
        <FormularioPerfil
          perfil={perfil}
          onSubmit={handleGuardar}
          cargando={guardando}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold">Acciones</h3>

        <button
          onClick={handleExportarDatos}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
        >
          Descargar datos (JSON)
        </button>

        <Link
          href="/"
          className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all text-center"
        >
          Politica de privacidad
        </Link>
      </div>

      <div className="card bg-slate-800/50">
        <h3 className="font-bold mb-3">Acerca de Fitness Tracker</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <p>
            <span className="text-slate-300">Version:</span> 1.0.0
          </p>
          <p>
            <span className="text-slate-300">Ultima actualizacion:</span> {new Date().toLocaleDateString('es-ES')}
          </p>
          <p>
            <span className="text-slate-300">Almacenamiento:</span> IndexedDB (Local)
          </p>
          <p className="mt-4 text-slate-500">
            Todos tus datos se guardan localmente en tu dispositivo. Ningun dato se envia a servidores externos.
          </p>
        </div>
      </div>
    </div>
  );
}