'use client';

import { useState, useEffect } from 'react';
import { obtenerTodosEjercicios } from '@/lib/db/ejercicios';
import { obtenerTodasRutinas } from '@/lib/db/rutinas';
import { obtenerEjerciciosDERutina } from '@/lib/db/ejercicios_de_rutina';
import { useSeedReady } from './SeedInitializer';

export default function VerificacionSeed() {
  const seedReady = useSeedReady();
  const [resultado, setResultado] = useState<string>('');
  const [cargando, setCargando] = useState(true);
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    if (!seedReady) {
      setCargando(true);
      return;
    }

    const verificar = async () => {
      try {
        const ejercicios = await obtenerTodosEjercicios();
        const rutinas = await obtenerTodasRutinas();

        let detalles = `✓ Seed verificada\n\n`;
        detalles += `📚 Ejercicios totales: ${ejercicios.length}\n`;
        detalles += `🗂️ Rutinas totales: ${rutinas.length}\n\n`;

        detalles += `📋 Rutinas:\n`;
        for (const rutina of rutinas) {
          const ejerciciosRutina = await obtenerEjerciciosDERutina(rutina.id);
          detalles += `  • ${rutina.nombre} (${ejerciciosRutina.length} ejercicios)\n`;
        }

        const upperA = rutinas.find((r) => r.seed_id === 'upper-a');
        if (upperA) {
          const ejerciciosUpperA = await obtenerEjerciciosDERutina(upperA.id);
          const conSuperserie = ejerciciosUpperA.filter(
            (e) => e.grupo_superserie === 'ss-1'
          );
          detalles += `\n🔗 Superseries en Upper A: ${conSuperserie.length} ejercicios\n`;
        }

        setResultado(detalles);
      } catch (error) {
        setResultado(
          `❌ Error: ${error instanceof Error ? error.message : 'Desconocido'}`
        );
      } finally {
        setCargando(false);
      }
    };

    verificar();
  }, [seedReady]);

  if (cargando || !seedReady) {
    return null;
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setMostrar(!mostrar)}
        className="text-xs text-slate-500 hover:text-slate-400 transition-colors underline"
      >
        {mostrar ? '▼' : '▶'} Ver estado de seed (desarrollo)
      </button>

      {mostrar && (
        <div className="card bg-green-900/20 border-green-700">
          <p className="text-white text-xs font-mono whitespace-pre-wrap">
            {resultado}
          </p>
        </div>
      )}
    </div>
  );
}