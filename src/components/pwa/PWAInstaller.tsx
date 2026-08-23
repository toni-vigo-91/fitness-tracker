'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const [instalado, setInstalado] = useState(false);

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }

    // Escuchar evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setMostrarBoton(true);
    });

    // Detectar si ya está instalado
    window.addEventListener('appinstalled', () => {
      setInstalado(true);
      setMostrarBoton(false);
    });

    // Detectar si se abre desde PWA instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalado(true);
      setMostrarBoton(false);
    }
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setInstalado(true);
      setMostrarBoton(false);
    }

    setInstallPrompt(null);
  };

  if (!mostrarBoton || instalado) {
    return null;
  }

  return (
    <div className="fixed bottom-24 md:bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 shadow-lg z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Instalar Fitness Tracker</p>
          <p className="text-sm text-blue-100">Accede desde tu pantalla de inicio</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-blue-50 transition-colors"
          >
            Instalar
          </button>
          <button
            onClick={() => setMostrarBoton(false)}
            className="text-white hover:text-blue-100 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}