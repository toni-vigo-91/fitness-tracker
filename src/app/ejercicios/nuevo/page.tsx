'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GRUPOS_MUSCULARES, TIPOS_EJERCICIO, EQUIPAMIENTO } from '@/config/constants';

export default function NuevoEjercicioPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    grupo_muscular: '',
    grupo_secundario: [] as string[],
    tipo_ejercicio: '',
    equipamiento: '',
    notas: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Crear ejercicio:', formData);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Nuevo Ejercicio</h2>
          <p className="text-slate-400">Añade un ejercicio a tu biblioteca</p>
        </div>
        <Link
          href="/ejercicios"
          className="text-slate-400 hover:text-white transition-colors text-2xl"
        >
          ✕
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Nombre del ejercicio *
          </label>
          <input
            type="text"
            name="nombre"
            placeholder="Ej: Press banca"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Grupo muscular principal *
          </label>
          <select
            name="grupo_muscular"
            value={formData.grupo_muscular}
            onChange={handleChange}
            required
            className="w-full"
          >
            <option value="">Selecciona un grupo</option>
            {GRUPOS_MUSCULARES.map((grupo) => (
              <option key={grupo} value={grupo}>
                {grupo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Tipo de ejercicio
          </label>
          <select
            name="tipo_ejercicio"
            value={formData.tipo_ejercicio}
            onChange={handleChange}
            className="w-full"
          >
            <option value="">Selecciona tipo</option>
            {TIPOS_EJERCICIO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Equipamiento
          </label>
          <select
            name="equipamiento"
            value={formData.equipamiento}
            onChange={handleChange}
            className="w-full"
          >
            <option value="">Selecciona equipamiento</option>
            {EQUIPAMIENTO.map((equip) => (
              <option key={equip} value={equip}>
                {equip}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Notas</label>
          <textarea
            name="notas"
            placeholder="Notas adicionales..."
            value={formData.notas}
            onChange={handleChange}
            rows={3}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-lg text-lg transition-all"
        >
          Crear Ejercicio
        </button>
      </form>
    </div>
  );
}