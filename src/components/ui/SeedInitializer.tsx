'use client';

import { useEffect, useState } from 'react';
import { initializeSeed } from '@/lib/db/seed';

// Context para rastrear estado de seed (simple implementación)
let seedInitialized = false;
let seedPromise: Promise<void> | null = null;

export function useSeedReady(): boolean {
  const [ready, setReady] = useState(seedInitialized);

  useEffect(() => {
    if (seedInitialized) {
      setReady(true);
      return;
    }

    // Esperar a que termine
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
  useEffect(() => {
    // Solo ejecutar una vez, globalmente
    if (!seedInitialized && !seedPromise) {
      seedPromise = initializeSeed()
        .then(() => {
          seedInitialized = true;
        })
        .catch((error) => {
          console.error('Seed initialization failed:', error);
          seedInitialized = false;
        });
    }
  }, []);

  // No renderiza nada visualmente
  return null;
}