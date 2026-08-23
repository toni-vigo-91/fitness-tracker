'use client';

import { useState, useEffect } from 'react';
import { MedidaCorporal } from '@/lib/tipos';

interface FormularioMedidasProps {
  medida?: MedidaCorporal | null;
  onSubmit: (datos: Omit<MedidaCorporal, 'id' | 'creado_en'>) => Promise<void>;
  cargando: boolean;
  onCancel: () => void;
}

export default function FormularioMedidas({
  medida,
  onSubmit,
  cargando,
  onCancel,
}: FormularioMedidasProps) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    peso_kg: 0,
    cintura_cm: 0,
    pecho_cm: 0,
    brazo_cm: 0,
    muslo_cm: 0,
    cadera_cm: 0,
    grasa_corporal_pct: 0,
    notas: '',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (medida) {
      setFormData({
        fecha: new Date(medida.fecha).toISOString().split('T')[0],
        peso_kg: medida.peso_kg,
        cintura_cm: medida.cintura_cm || 0,
        pecho_cm: medida.pecho_cm || 0,
        brazo_cm: medida.brazo_cm || 0,
        muslo_cm: medida.muslo_cm || 0,
        cadera_cm: medida.cadera_cm || 0,
        grasa_corporal_pct: medida.grasa_corporal_pct || 0,
        notas: medida.notas || '',
      });
    }
  }, [medida]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'notas' ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.peso_kg || formData.peso_kg <= 0) {
      setError('El peso es obligatorio y debe ser mayor a 0');
      return;
    }

    try {
      await onSubmit({
        fecha: new Date(formData.fecha),
        peso_kg: formData.peso_kg,
        cintura_cm: formData.cintura_cm || undefined,
        pecho_cm: formData.pecho_cm || undefined,
        brazo_cm: formData.brazo_cm || undefined,
        muslo_cm: formData.muslo_cm || undefined,
        cadera_cm: formData.cadera_cm || undefined,
        grasa_corporal_pct: formData.grasa_corporal_pct || undefined,
        notas: formData.notas || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Fecha */}
      <div>
        <label className="block text-sm font-semibold mb-2">Fecha</label>
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>

      {/* Peso (obligatorio) */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Peso (kg) *
        </label>
        <input
          type="number"
          name="peso_kg"
          value={formData.peso_kg || ''}
          onChange={handleChange}
          placeholder="75"
          step="0.1"
          required
          className="w-full"
        />
      </div>

      {/* Medidas opcionales en grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Cintura (cm)
          </label>
          <input
            type="number"
            name="cintura_cm"
            value={formData.cintura_cm || ''}
            onChange={handleChange}
            placeholder="80"
            step="0.1"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Pecho (cm)</label>
          <input
            type="number"
            name="pecho_cm"
            value={formData.pecho_cm || ''}
            onChange={handleChange}
            placeholder="100"
            step="0.1"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Brazo (cm)</label>
          <input
            type="number"
            name="brazo_cm"
            value={formData.brazo_cm || ''}
            onChange={handleChange}
            placeholder="35"
            step="0.1"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Muslo (cm)</label>
          <input
            type="number"
            name="muslo_cm"
            value={formData.muslo_cm || ''}
            onChange={handleChange}
            placeholder="60"
            step="0.1"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Cadera (cm)
          </label>
          <input
            type="number"
            name="cadera_cm"
            value={formData.cadera_cm || ''}
            onChange={handleChange}
            placeholder="95"
            step="0.1"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Grasa corporal (%)
          </label>
          <input
            type="number"
            name="grasa_corporal_pct"
            value={formData.grasa_corporal_pct || ''}
            onChange={handleChange}
            placeholder="15"
            step="0.1"
            className="w-full"
          />
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-semibold mb-2">Notas</label>
        <textarea
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          placeholder="Ej: Medida después de entrenar"
          rows={2}
          className="w-full"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={cargando}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all"
        >
          {cargando ? 'Guardando...' : medida ? 'Actualizar' : 'Guardar medida'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={cargando}
          className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}