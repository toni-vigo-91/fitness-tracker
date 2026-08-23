'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NuevaMedidaPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página de medidas
    router.push('/medidas');
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-center">
      <p className="text-slate-400">Redirigiendo...</p>
    </div>
  );
}