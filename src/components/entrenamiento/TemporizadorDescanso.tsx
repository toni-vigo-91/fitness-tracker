'use client';

import { useState, useEffect } from 'react';

interface TemporizadorDescansoProps {
  segundosInicial?: number;
}

export default function TemporizadorDescanso({
  segundosInicial = 90,
}: TemporizadorDescansoProps) {
  const [segundos, setSegundos] = useState(segundosInicial);
  const [activo, setActivo] = useState(false);
  const [completado, setCompletado] = useState(false);

  useEffect(() => {
    if (!activo || segundos <= 0) return;

    const intervalo = setInterval(() => {
      setSegundos((prev) => {
        if (prev <= 1) {
          setActivo(false);
          setCompletado(true);
          // Reproducir sonido si está disponible
          if (typeof window !== 'undefined' && 'AudioContext' in window) {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscilador = audioContext.createOscillator();
            const ganancia = audioContext.createGain();
            oscilador.connect(ganancia);
            ganancia.connect(audioContext.destination);
            oscilador.frequency.value = 1000;
            ganancia.gain.setValueAtTime(0.3, audioContext.currentTime);
            ganancia.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.5
            );
            oscilador.start(audioContext.currentTime);
            oscilador.stop(audioContext.currentTime + 0.5);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [activo, segundos]);

  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  const porcentaje = ((segundosInicial - segundos) / segundosInicial) * 100;

  return (
    <div className="card bg-slate-700/50">
      <h3 className="font-semibold text-center mb-4">Descanso</h3>

      {/* Visualización circular */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Círculo de fondo */}
          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(71, 85, 105, 0.3)"
              strokeWidth="8"
            />
            {/* Círculo de progreso */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeDasharray={`${(porcentaje / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              strokeLinecap="round"
            />
          </svg>

          {/* Texto del tiempo */}
          <div className="text-center z-10">
            <div className="text-4xl font-bold">
              {String(minutos).padStart(2, '0')}:{String(segs).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setActivo(!activo);
            setCompletado(false);
          }}
          className={`flex-1 py-3 px-4 rounded font-semibold transition-all ${
            activo
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {activo ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          onClick={() => {
            setSegundos(segundosInicial);
            setActivo(false);
            setCompletado(false);
          }}
          className="flex-1 py-3 px-4 rounded font-semibold bg-slate-600 hover:bg-slate-700 text-white transition-all"
        >
          Reiniciar
        </button>
      </div>

      {completado && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded text-green-200 text-center font-semibold">
          ✓ ¡Descanso completado!
        </div>
      )}
    </div>
  );
}