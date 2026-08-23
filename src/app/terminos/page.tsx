import Link from 'next/link';

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
        Volver
      </Link>

      <div>
        <h1 className="text-4xl font-bold mb-2">Terminos y Condiciones</h1>
        <p className="text-slate-400">Ultima actualizacion: {new Date().toLocaleDateString('es-ES')}</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6">
        <section className="card">
          <h2 className="text-2xl font-bold mb-3">1. Aceptacion de Terminos</h2>
          <p className="text-slate-300">
            Al usar Fitness Tracker, aceptas estos terminos y condiciones. 
            Si no estus de acuerdo, por favor no uses la aplicacion.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">2. Uso de la Aplicacion</h2>
          <p className="text-slate-300 mb-3">
            Te comprometes a usar Fitness Tracker solo para propositos legales y personales:
          </p>
          <ul className="text-slate-300 space-y-2 list-disc list-inside">
            <li>No copiaras ni modificaras el codigo sin permiso</li>
            <li>No usaras la app para danar a otros usuarios</li>
            <li>No infringiras los derechos de terceros</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">3. Descargo de Responsabilidad</h2>
          <p className="text-slate-300">
            Fitness Tracker se proporciona "tal cual" sin garantias. 
            No somos responsables de:
          </p>
          <ul className="text-slate-300 space-y-2 list-disc list-inside">
            <li>Perdida o corrupcion de datos</li>
            <li>Lesiones resultantes del uso de la app</li>
            <li>Interrupciones del servicio</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">4. Limitacion de Responsabilidad</h2>
          <p className="text-slate-300">
            En ningun caso seremos responsables por daños indirectos, incidentales, especiales o consecuentes 
            resultantes del uso o la imposibilidad de usar Fitness Tracker.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">5. Disclaimer Medico</h2>
          <p className="text-slate-300">
            Fitness Tracker es una herramienta de registro. 
            No es un sustituto de consejo medico profesional. 
            Consulta con un medico antes de cambiar tu rutina de ejercicios o dieta.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">6. Cambios a los Terminos</h2>
          <p className="text-slate-300">
            Nos reservamos el derecho de modificar estos terminos en cualquier momento. 
            Los cambios seran efectivos inmediatamente tras su publicacion.
          </p>
        </section>
      </div>
    </div>
  );
}