import { v4 as uuidv4 } from 'uuid';
import { Entrenamiento } from '../tipos';
import { getDB } from './init';

// Crear entrenamiento
export async function crearEntrenamiento(
  entrenamiento: Omit<Entrenamiento, 'id' | 'creado_en'>
): Promise<Entrenamiento> {
  const db = await getDB();

  const nuevoEntrenamiento: Entrenamiento = {
    ...entrenamiento,
    id: uuidv4(),
    creado_en: new Date(),
  };

  await db.add('entrenamientos', nuevoEntrenamiento);
  return nuevoEntrenamiento;
}

// Obtener un entrenamiento
export async function obtenerEntrenamiento(
  id: string
): Promise<Entrenamiento | undefined> {
  const db = await getDB();
  return db.get('entrenamientos', id);
}

// Obtener todos los entrenamientos
export async function obtenerTodosEntrenamientos(): Promise<Entrenamiento[]> {
  const db = await getDB();
  const todos = await db.getAll('entrenamientos');

  // Ordenar por fecha descendente
  return todos.sort((a, b) =>
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

// Obtener último entrenamiento
export async function obtenerUltimoEntrenamiento(): Promise<
  Entrenamiento | undefined
> {
  const db = await getDB();
  const todos = await db.getAll('entrenamientos');

  if (todos.length === 0) return undefined;

  return todos.reduce((reciente, actual) =>
    new Date(actual.fecha) > new Date(reciente.fecha) ? actual : reciente
  );
}

// Actualizar entrenamiento
export async function actualizarEntrenamiento(
  id: string,
  actualizaciones: Partial<Omit<Entrenamiento, 'id' | 'creado_en'>>
): Promise<Entrenamiento | undefined> {
  const db = await getDB();

  const entrenamiento = await db.get('entrenamientos', id);
  if (!entrenamiento) return undefined;

  const entrenamientoActualizado = {
    ...entrenamiento,
    ...actualizaciones,
  };

  await db.put('entrenamientos', entrenamientoActualizado);
  return entrenamientoActualizado;
}

// Eliminar entrenamiento
export async function eliminarEntrenamiento(id: string): Promise<boolean> {
  const db = await getDB();

  const entrenamiento = await db.get('entrenamientos', id);
  if (!entrenamiento) return false;

  await db.delete('entrenamientos', id);
  return true;
}

// Obtener entrenamientos por rango de fechas
export async function obtenerEntrenamientosPorFecha(
  fechaInicio: Date,
  fechaFin: Date
): Promise<Entrenamiento[]> {
  const db = await getDB();
  const todos = await db.getAll('entrenamientos');

  return todos.filter((e) => {
    const fecha = new Date(e.fecha);
    return fecha >= fechaInicio && fecha <= fechaFin;
  });
}

// Obtener entrenamientos de esta semana
export async function obtenerEntrenamientosSemanales(): Promise<Entrenamiento[]> {
  const ahora = new Date();
  const inicioSemana = new Date(ahora);
  inicioSemana.setDate(ahora.getDate() - ahora.getDay());

  return obtenerEntrenamientosPorFecha(inicioSemana, ahora);
}

// Obtener entrenamientos del mes actual
export async function obtenerEntrenamientosMensuales(): Promise<Entrenamiento[]> {
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

  return obtenerEntrenamientosPorFecha(inicioMes, finMes);
}

// Obtener entrenamientos de una rutina específica
export async function obtenerEntrenamientosPorRutina(
  rutinaId: string
): Promise<Entrenamiento[]> {
  const db = await getDB();
  return db.getAllFromIndex('entrenamientos', 'by-rutina', rutinaId);
}