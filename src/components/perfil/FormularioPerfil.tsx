'use client';

import { useState, useEffect } from 'react';
import { PerfilUsuario } from '@/lib/tipos';

interface FormularioPerfilProps {
  perfil: PerfilUsuario;
  onSubmit: (cambios: Partial<PerfilUsuario>) => Promise<void>;
  cargando: boolean;
}

export default function FormularioPerfil({
  perfil,
  onSubmit,
  cargando,
}: FormularioPerfilProps) {
  const [formData, setFormData] = useState(perfil);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(perfil);
    setGuardado(false);
  }, [perfil]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === ''
            ? undefined
            : parseFloat(value)
          : value,
    }));
    setGuardado(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      await onSubmit(formData);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {guardado && (
        <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded">
          ✓ Cambios guardados
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-sm font-semibold mb-2">Nombre *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          required
          className="w-full"
        />
      </div>

      {/* Edad */}
      <div>
        <label className="block text-sm font-semibold mb-2">Edad (años)</label>
        <input
          type="number"
          name="edad"
          value={formData.edad || ''}
          onChange={handleChange}
          placeholder="25"
          min="0"
          max="120"
          className="w-full"
        />
      </div>

      {/* Peso objetivo */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Peso objetivo ({formData.unidades})
        </label>
        <input
          type="number"
          name="peso_objetivo_kg"
          value={formData.peso_objetivo_kg || ''}
          onChange={handleChange}
          placeholder="75"
          step="0.5"
          className="w-full"
        />
      </div>

      {/* Unidades */}
      <div>
        <label className="block text-sm font-semibold mb-2">Unidades</label>
        <select name="unidades" value={formData.unidades} onChange={handleChange} className="w-full">
          <option value="kg">Kilogramos (kg)</option>
          <option value="lbs">Libras (lbs)</option>
        </select>
      </div>

      {/* Idioma */}
      <div>
        <label className="block text-sm font-semibold mb-2">Idioma</label>
        <select name="idioma" value={formData.idioma} onChange={handleChange} className="w-full">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Objetivo semanal */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Objetivo semanal de entrenamientos
        </label>
        <input
          type="number"
          name="objetivo_semanal_entrenamientos"
          value={formData.objetivo_semanal_entrenamientos || ''}
          onChange={handleChange}
          placeholder="4"
          min="1"
          max="7"
          className="w-full"
        />
      </div>

      {/* Notificaciones */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="notificaciones_activas"
          checked={formData.notificaciones_activas}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              notificaciones_activas: e.target.checked,
            }))
          }
          id="notificaciones"
        />
        <label htmlFor="notificaciones" className="text-sm font-semibold cursor-pointer">
          Activar notificaciones
        </label>
      </div>

      {/* Botón guardar */}
      <button
        type="submit"
        disabled={cargando || guardado}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
          guardado
            ? 'bg-green-600 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
        }`}
      >
        {cargando ? 'Guardando...' : guardado ? '✓ Guardado' : 'Guardar cambios'}
      </button>
    </form>
  );
}