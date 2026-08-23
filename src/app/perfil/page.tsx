'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PerfilUsuario } from '@/lib/tipos';
import { obtenerPerfil, actualizarPerfil } from '@/lib/db/perfil';
import FormularioPerfil from '@/components/perfil/FormularioPerfil';

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const perfilData = await obtenerPerfil();
        setPerfil(perfilData);
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
        <p className="text-slate-400">Gestiona tu información y preferencias</p>
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

      <div className="card">
        <h3 className="text-xl font-bold mb-6">Información Personal</h3>
        <FormularioPerfil
          perfil={perfil}
          onSubmit={handleGuardar}
          cargando={guardando}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold">Acciones</h3>

        <Link
          href="/privacidad"
          className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all text-center"
        >
          Política de privacidad
        </Link>

        <Link
          href="/terminos"
          className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all text-center"
        >
          Términos y Condiciones
        </Link>
      </div>

      <div className="card bg-slate-800/50">
        <h3 className="font-bold mb-3">Acerca de Fitness Tracker</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <p>
            <span className="text-slate-300">Version:</span> 1.0.0
          </p>
          <p>
            <span className="text-slate-300">Almacenamiento:</span> IndexedDB (Local)
          </p>
          <p className="mt-4 text-slate-500">
            Todos tus datos se guardan localmente en tu dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
}