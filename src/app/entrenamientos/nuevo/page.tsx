'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Rutina, Serie } from '@/lib/tipos';
import { useEntrenamientos } from '@/hooks/useEntrenamientos';
import {
  obtenerEjerciciosDeRutinaConDetalles,
} from '@/lib/db/ejercicios_de_rutina';
import { obtenerSeriesPorEjercicio, crearSerie } from '@/lib/db/series';
import SelectorRutina from '@/components/entrenamiento/SelectorRutina';
import RegistroSeries from '@/components/entrenamiento/RegistroSeries';
import TemporizadorDescanso from '@/components/entrenamiento/TemporizadorDescanso';

interface EjercicioConDetalles {
  ejercicioDeRutina: any;
  ejercicio: any;
}

export default function NuevoEntrenamientoPage() {
  const router = useRouter();
  const { crear: crearEntrenamiento, cargando } = useEntrenamientos();

  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [nombreEntrenamiento, setNombreEntrenamiento] = useState('');
  const [ejerciciosDeRutina, setEjerciciosDeRutina] = useState<EjercicioConDetalles[]>([]);
  const [cargandoEjercicios, setCargandoEjercicios] = useState(false);
  const [paso, setPaso] = useState<'rutina' | 'ejercicios'>('rutina');
  const [ultimasSeriesMap, setUltimasSeriesMap] = useState<Record<string, Serie[]>>({});
  const [entrenamientoActualId, setEntrenamientoActualId] = useState<string | null>(null);

  const handleRutinaSelect = async (rutinaSeleccionada: Rutina) => {
    setRutina(rutinaSeleccionada);
    setNombreEntrenamiento(rutinaSeleccionada.nombre);

    // Crear el entrenamiento primero
    setCargandoEjercicios(true);
    try {
      const nuevoEntrenamiento = await crearEntrenamiento({
        nombre: rutinaSeleccionada.nombre,
        fecha: new Date(),
        rutina_id: rutinaSeleccionada.id,
        completado: false,
      });
      setEntrenamientoActualId(nuevoEntrenamiento.id);

      // Cargar ejercicios de la rutina con detalles
      const ejercicios = await obtenerEjerciciosDeRutinaConDetalles(
        rutinaSeleccionada.id
      );
      setEjerciciosDeRutina(ejercicios);

      // Cargar últimas series para cada ejercicio
      const ultimasMap: Record<string, Serie[]> = {};
      for (const item of ejercicios) {
        const ultimas = await obtenerSeriesPorEjercicio(item.ejercicioDeRutina.ejercicio_id);
        if (ultimas.length > 0) {
          ultimasMap[item.ejercicioDeRutina.ejercicio_id] = ultimas.slice(-3); // Últimas 3 series
        }
      }
      setUltimasSeriesMap(ultimasMap);

      setPaso('ejercicios');
    } finally {
      setCargandoEjercicios(false);
    }
  };

  const handleGuardarSeries = async (
    ejercicioId: string,
    series: Omit<Serie, 'id' | 'creado_en'>[]
  ) => {
    if (!entrenamientoActualId) return;

    try {
      // Guardar series
      for (const serie of series) {
        await crearSerie({
          ...serie,
          entrenamiento_id: entrenamientoActualId,
          ejercicio_id: ejercicioId,
        });
      }
    } catch (error) {
      console.error('Error guardando series:', error);
      throw error;
    }
  };

  const handleCompletarEntrenamiento = async () => {
    try {
      alert('✓ Entrenamiento guardado correctamente');
      router.push('/entrenamientos');
    } catch (error) {
      console.error('Error completando entrenamiento:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Nuevo Entrenamiento</h2>
          <p className="text-slate-400">Registra tu sesión</p>
        </div>
        <Link
          href="/entrenamientos"
          className="text-slate-400 hover:text-white transition-colors text-2xl"
        >
          ✕
        </Link>
      </div>

      {/* PASO 1: Seleccionar Rutina */}
      {paso === 'rutina' && (
        <SelectorRutina
          onSelect={handleRutinaSelect}
          cargando={cargandoEjercicios}
          selectedRutinaId={rutina?.id}
        />
      )}

      {/* PASO 2: Registrar Series */}
      {paso === 'ejercicios' && rutina && ejerciciosDeRutina.length > 0 && (
        <div className="space-y-6">
          {/* Info de la rutina */}
          <div className="card bg-blue-900/20 border-blue-700">
            <p className="text-blue-200">
              📝 {ejerciciosDeRutina.length} ejercicios en{' '}
              <span className="font-bold">{rutina.nombre}</span>
            </p>
          </div>

          {/* Ejercicios */}
          <div className="space-y-6">
            {ejerciciosDeRutina.map((item, index) => (
              <div key={`${item.ejercicioDeRutina.id}-${index}`}>
                {item.ejercicio && (
                  <>
                    <RegistroSeries
                      ejercicioId={item.ejercicioDeRutina.ejercicio_id}
                      ejercicioNombre={item.ejercicio.nombre}
                      seriesObjetivo={item.ejercicioDeRutina.series_objetivo}
                      repeticionesObjetivo={
                        item.ejercicioDeRutina.repeticiones_objetivo
                      }
                      ultimasSeries={ultimasSeriesMap[item.ejercicioDeRutina.ejercicio_id]}
                      onSave={(series) =>
                        handleGuardarSeries(item.ejercicioDeRutina.ejercicio_id, series)
                      }
                      cargando={cargando}
                    />

                    {/* Temporizador después de cada ejercicio */}
                    {index < ejerciciosDeRutina.length - 1 && (
                      <TemporizadorDescanso segundosInicial={90} />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Botón completar */}
          <button
            onClick={handleCompletarEntrenamiento}
            disabled={cargando}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:opacity-50 text-white font-semibold py-4 px-4 rounded-lg text-lg transition-all"
          >
            ✓ Completar entrenamiento
          </button>
        </div>
      )}

      {/* Cargando */}
      {paso === 'ejercicios' && cargandoEjercicios && (
        <div className="text-center py-12">
          <p className="text-slate-400">Cargando ejercicios...</p>
        </div>
      )}
    </div>
  );
}