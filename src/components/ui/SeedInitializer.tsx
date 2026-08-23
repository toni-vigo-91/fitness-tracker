'use client';
import { useEffect, useState } from 'react';
import { initializeSeed } from '@/lib/db/seed';

let seedInitialized = false;
let seedPromise: Promise<void> | null = null;

export function useSeedReady(): boolean {
  const [ready, setReady] = useState(seedInitialized);
  useEffect(() => {
    if (seedInitialized) {
      setReady(true);
      return;
    }
    if (seedPromise) {
      seedPromise
        .then(() => {
          seedInitialized = true;
          setReady(true);
        })
        .catch((error) => {
          console.error('Seed initialization failed:', error);
          seedInitialized = false;
          setReady(false);
        });
    }
  }, []);
  return ready;
}

export default function SeedInitializer() {
  console.log('[SeedInitializer] Componente montado');
  
  useEffect(() => {
    console.log('[SeedInitializer] useEffect ejecutado');
    console.log('[SeedInitializer] seedInitialized:', seedInitialized);
    console.log('[SeedInitializer] seedPromise:', seedPromise);
    
    if (!seedInitialized && !seedPromise) {
      console.log('[SeedInitializer] Iniciando seed...');
      seedPromise = initializeSeed()
        .then(() => {
          console.log('[SeedInitializer] Seed completada');
          seedInitialized = true;
        })
        .catch((error) => {
          console.error('[SeedInitializer] Error en seed:', error);
          seedInitialized = false;
        });
    } else {
      console.log('[SeedInitializer] Seed ya en progreso o completada');
    }
  }, []);
  
  return null;
}