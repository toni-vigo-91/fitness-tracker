import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/layout/Header';
import NavigationWrapper from '@/components/layout/NavigationWrapper';
import SeedInitializer from '@/components/ui/SeedInitializer';
import PWAInstaller from '@/components/pwa/PWAInstaller';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fitness Tracker - Tu evolución en entrenamientos',
  description: 'Aplicación gratuita para registrar entrenamientos, medidas corporales y seguir tu progreso. Funciona completamente offline con datos almacenados localmente.',
  keywords: ['fitness', 'entrenamientos', 'progreso', 'pesas', 'gym', 'ejercicios'],
  authors: [{ name: 'Toni' }],
  creator: 'Toni',
  manifest: '/manifest.json',
  robots: 'index, follow',
  openGraph: {
    title: 'Fitness Tracker',
    description: 'Tu asistente personal para entrenamientos y seguimiento de progreso',
    type: 'website',
    locale: 'es_ES',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fitness Tracker',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Fitness Tracker" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-200 min-h-screen flex flex-col`}>
        <SeedInitializer />
        <PWAInstaller />
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <NavigationWrapper />
      </body>
    </html>
  );
}