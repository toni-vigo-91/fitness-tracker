import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 px-4">
      <div className="text-center space-y-6">
        <div className="text-8xl font-bold text-slate-700">404</div>
        
        <div>
          <h1 className="text-4xl font-bold mb-2">Pagina no encontrada</h1>
          <p className="text-slate-400 text-lg">
            La pagina que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all"
          >
            Volver al Dashboard
          </Link>
          
          <p className="text-slate-500 text-sm">
            o navega usando los enlaces de la parte inferior
          </p>
        </div>
      </div>
    </div>
  );
}