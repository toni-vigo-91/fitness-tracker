'use client';

import { useState, useCallback, useEffect } from 'react';
import { MedidaCorporal } from '@/lib/tipos';
import {
  crearMedida,
  obtenerTodasMedidas,
  actualizarMedida,
  eliminarMedida,
  obtenerUltimaMedida,
  obtenerProgresoPeso,
} from '@/lib/db/medidas';

export function useMedidas() {
  const [medidas, setMedidas] = useState<MedidaCorporal[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const todas = await obtenerTodasMedidas();
      setMedidas(todas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  }, []);

  const crear = useCallback(
    async (medida: Omit<MedidaCorporal, 'id' | 'creado_en'>) => {
      setCargando(true);
      setError(null);
      try {
        const nueva = await crearMedida(medida);
        setMedidas((prev) => [nueva, ...prev]);
        return nueva;
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error al crear medida';
        setError(mensaje);
        throw err;
      } finally {
        setCargando(false);
      }
    },
    []
  );

  const actualizar = useCallback(
    async (id: string, cambios: Partial<Omit<MedidaCorporal, 'id' | 'creado_en'>>) => {
      setCargando(true);
      setError(null);
      try {
        const actualizada = await actualizarMedida(id, cambios);
        if (actualizada) {
          setMedidas((prev) =>
            prev.map((m) => (m.id === id ? actualizada : m))
          );
        }
        return actualizada;
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error al actualizar';
        setError(mensaje);
        throw err;
      } finally {
        setCargando(false);
      }
    },
    []
  );

  const eliminar = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);
    try {
      const success = await eliminarMedida(id);
      if (success) {
        setMedidas((prev) => prev.filter((m) => m.id !== id));
      }
      return success;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al eliminar';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerUltima = useCallback(async () => {
    try {
      return await obtenerUltimaMedida();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      return undefined;
    }
  }, []);

  const obtenerProgreso = useCallback(async () => {
    try {
      return await obtenerProgresoPeso();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      return { inicial: null, actual: null, diferencia: null };
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    medidas,
    cargando,
    error,
    cargar,
    crear,
    actualizar,
    eliminar,
    obtenerUltima,
    obtenerProgreso,
  };
}