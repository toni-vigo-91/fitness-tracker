'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/entrenamientos', label: 'Entrenamientos', icon: '🏋️' },
  { href: '/ejercicios', label: 'Ejercicios', icon: '📋' },
  { href: '/medidas', label: 'Medidas', icon: '📏' },
  { href: '/prs', label: 'PRs', icon: '🏆' },
  { href: '/perfil', label: 'Perfil', icon: '⚙️' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-2">
      <div className="max-w-6xl mx-auto flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-4 px-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-blue-400 border-t-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="hidden sm:inline text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}