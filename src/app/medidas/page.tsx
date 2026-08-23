'use client';

import { useState } from 'react';
import { useMedidas } from '@/hooks/useMedidas';
import { MedidaCorporal } from '@/lib/tipos';
import FormularioMedidas from '@/components/medidas/FormularioMedidas';
import TarjetaMedida from '@/components/medidas/TarjetaMedida';
import GraficoEvolucionPeso from '@/components/medidas/GraficoEvolucionPeso';

export default function MedidasPage() {
  const { medidas, cargando, crear, actualizar, eliminar } = useMedidas();
  const [editando, setEditando] = useState<MedidaCorporal | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const handleCrear = async (datos: Omit<MedidaCorporal, 'id' | 'creado_en'>) => {
    await crear(datos);
    setMostrarFormulario(false);
  };

  const handleActualizar = async (
    datos: Omit<MedidaCorporal, 'id' | 'creado_en'>
  ) => {
    if (editando) {
      await actualizar(editando.id, datos);
      setEditando(null);
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Eliminar esta medida?')) {
      setEliminando(true);
      try {
        await eliminar(id);
      } finally {
        setEliminando(false);
      }
    }
  };

  const ultimaMedida = medidas.length > 0 ? medidas[0] : null;
  const cambio = medidas.length > 1 ? medidas[0].peso_kg - medidas[medidas.length - 1].peso_kg : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Medidas Corporales</h2>
        <p className="text-slate-400">Registra y sigue tu evolución física</p>
      </div>

      {ultimaMedida && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="text-slate-300 text-sm font-semibold mb-2">
              Peso actual
            </h3>
            <p className="text-3xl font-bold">{ultimaMedida.peso_kg.toFixed(1)}</p>
            <p className="text-xs text-slate-500">kg</p>
          </div>

          {cambio !== null && (
            <div className="card">
              <h3 className="text-slate-300 text-sm font-semibold mb-2">
                Cambio total
              </h3>
              <p
                className={`text-3xl font-bold ${
                  cambio > 0 ? 'text-red-400' : 'text-green-400'
                }`}
              >
                {cambio > 0 ? '+' : ''}{cambio.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500">kg</p>
            </div>
          )}

          <div className="card">
            <h3 className="text-slate-300 text-sm font-semibold mb-2">
              Mediciones
            </h3>
            <p className="text-3xl font-bold">{medidas.length}</p>
            <p className="text-xs text-slate-500">registros</p>
          </div>
        </div>
      )}

      {!mostrarFormulario && !editando && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-lg text-center text-lg transition-all"
        >
          + Nueva medición
        </button>
      )}

      {mostrarFormulario && !editando && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Nueva medición</h3>
          <FormularioMedidas
            onSubmit={handleCrear}
            cargando={cargando}
            onCancel={() => setMostrarFormulario(false)}
          />
        </div>
      )}

      {editando && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Editar medida</h3>
          <FormularioMedidas
            medida={editando}
            onSubmit={handleActualizar}
            cargando={cargando}
            onCancel={() => setEditando(null)}
          />
        </div>
      )}

      {medidas.length > 0 && !mostrarFormulario && !editando && (
        <div>
          <h3 className="text-lg font-bold mb-4">Evolución de peso</h3>
          <GraficoEvolucionPeso medidas={medidas} medida="peso_kg" />
        </div>
      )}

      {medidas.length > 0 && !mostrarFormulario && !editando && (
        <div>
          <h3 className="text-lg font-bold mb-4">Historial</h3>
          <div className="space-y-3">
            {medidas.map((medida, index) => (
              <TarjetaMedida
                key={medida.id}
                medida={medida}
                medidaAnterior={index < medidas.length - 1 ? medidas[index + 1] : undefined}
                onEditar={setEditando}
                onEliminar={handleEliminar}
                eliminando={eliminando}
              />
            ))}
          </div>
        </div>
      )}

      {medidas.length === 0 && !mostrarFormulario && !editando && (
        <div className="card bg-slate-800/50 border-dashed border-slate-600 py-12 text-center">
          <p className="text-slate-400 text-lg mb-4">Sin mediciones aún</p>
          <p className="text-slate-500 text-sm">
            Registra tu primer medición para empezar a seguir tu evolución
          </p>
        </div>
      )}
    </div>
  );
}