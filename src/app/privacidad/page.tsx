import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
        Volver
      </Link>

      <div>
        <h1 className="text-4xl font-bold mb-2">Politica de Privacidad</h1>
        <p className="text-slate-400">Ultima actualizacion: {new Date().toLocaleDateString('es-ES')}</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6">
        <section className="card">
          <h2 className="text-2xl font-bold mb-3">1. Introduccion</h2>
          <p className="text-slate-300">
            Fitness Tracker es una aplicacion de registro de entrenamientos que respeta tu privacidad. 
            Esta politica explica como recopilamos, usamos y protegemos tus datos.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">2. Datos que recopilamos</h2>
          <p className="text-slate-300 mb-3">
            Fitness Tracker recopila solo los datos que TU proporcionas:
          </p>
          <ul className="text-slate-300 space-y-2 list-disc list-inside">
            <li>Informacion personal (nombre, edad, objetivos)</li>
            <li>Datos de entrenamientos (ejercicios, peso, repeticiones)</li>
            <li>Medidas corporales (peso, medidas, grasa corporal)</li>
            <li>Preferencias de la aplicacion</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">3. Donde se almacenan tus datos</h2>
          <p className="text-slate-300">
            <strong>TODOS tus datos se guardan localmente en tu dispositivo.</strong> 
            No se envian a ningun servidor externo. Tu privacidad esta completamente bajo tu control.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">4. Seguridad</h2>
          <p className="text-slate-300">
            Como todos tus datos se almacenan localmente, solo tu tienes acceso a ellos. 
            No hay servidores centralizados que puedan ser hackeados.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">5. Derechos del usuario</h2>
          <p className="text-slate-300 mb-3">
            Tienes derecho a:
          </p>
          <ul className="text-slate-300 space-y-2 list-disc list-inside">
            <li>Acceder a todos tus datos (exporta en JSON)</li>
            <li>Modificar o eliminar tus datos cuando quieras</li>
            <li>Eliminar la aplicacion y todos tus datos locales</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">6. Cambios en esta politica</h2>
          <p className="text-slate-300">
            Nos reservamos el derecho de actualizar esta politica. 
            Las actualizaciones se publicaran en esta pagina.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-3">7. Contacto</h2>
          <p className="text-slate-300">
            Si tienes preguntas sobre esta politica, por favor abre un issue en GitHub.
          </p>
        </section>
      </div>
    </div>
  );
}