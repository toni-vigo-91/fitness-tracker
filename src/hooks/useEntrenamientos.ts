'use client';

import { useState, useCallback, useEffect } from 'react';
import { Entrenamiento } from '@/lib/tipos';
import {
  crearEntrenamiento,
  obtenerTodosEntrenamientos,
  actualizarEntrenamiento,
  eliminarEntrenamiento,
  obtenerUltimoEntrenamiento,
  obtenerEntrenamientosSemanales,
  obtenerEntrenamientosMensuales,
  obtenerEntrenamientosPorRutina,
} from '@/lib/db/entrenamientos';

export function useEntrenamientos() {
  const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const todos = await obtenerTodosEntrenamientos();
      setEntrenamientos(todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  }, []);

  const crear = useCallback(
    async (entrenamiento: Omit<Entrenamiento, 'id' | 'creado_en'>) => {
      setCargando(true);
      setError(null);
      try {
        const nuevo = await crearEntrenamiento(entrenamiento);
        setEntrenamientos((prev) => [nuevo, ...prev]);
        return nuevo;
      } catch (err) {
        const mensaje =
          err instanceof Error ? err.message : 'Error al crear entrenamiento';
        setError(mensaje);
        throw err;
      } finally {
        setCargando(false);
      }
    },
    []
  );

  const actualizar = useCallback(
    async (
      id: string,
      cambios: Partial<Omit<Entrenamiento, 'id' | 'creado_en'>>
    ) => {
      setCargando(true);
      setError(null);
      try {
        const actualizado = await actualizarEntrenamiento(id, cambios);
        if (actualizado) {
          setEntrenamientos((prev) =>
            prev.map((e) => (e.id === id ? actualizado : e))
          );
        }
        return actualizado;
      } catch (err) {
        const mensaje =
          err instanceof Error ? err.message : 'Error al actualizar';
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
      const success = await eliminarEntrenamiento(id);
      if (success) {
        setEntrenamientos((prev) => prev.filter((e) => e.id !== id));
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

  const obtenerSemanales = useCallback(async () => {
    try {
      return await obtenerEntrenamientosSemanales();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      return [];
    }
  }, []);

  const obtenerMensuales = useCallback(async () => {
    try {
      return await obtenerEntrenamientosMensuales();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      return [];
    }
  }, []);

  const obtenerUltimo = useCallback(async () => {
    try {
      return await obtenerUltimoEntrenamiento();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      return undefined;
    }
  }, []);

  const obtenerPorRutina = useCallback(async (rutinaId: string) => {
    try {
      return await obtenerEntrenamientosPorRutina(rutinaId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      return [];
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    entrenamientos,
    cargando,
    error,
    cargar,
    crear,
    actualizar,
    eliminar,
    obtenerSemanales,
    obtenerMensuales,
    obtenerUltimo,
    obtenerPorRutina,
  };
}