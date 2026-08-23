import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import SeedInitializer from '@/components/ui/SeedInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fitness Tracker',
  description: 'Registra tus entrenamientos y evolución física',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-950 text-white min-h-screen flex flex-col`}>
        <SeedInitializer />
        <Header />
        <main className="flex-1 pb-20">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}