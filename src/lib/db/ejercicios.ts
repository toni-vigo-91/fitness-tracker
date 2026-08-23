import { v4 as uuidv4 } from 'uuid';
import { Ejercicio } from '../tipos';
import { getDB } from './init';

// Crear ejercicio
export async function crearEjercicio(
  ejercicio: Omit<Ejercicio, 'id' | 'creado_en'>
): Promise<Ejercicio> {
  const db = await getDB();

  const nuevoEjercicio: Ejercicio = {
    ...ejercicio,
    id: uuidv4(),
    creado_en: new Date(),
  };

  await db.add('ejercicios', nuevoEjercicio);
  return nuevoEjercicio;
}

// Obtener o crear un ejercicio por seed_id (IDEMPOTENTE)
export async function obtenerOCrearEjercicioPorSeedId(
  ejercicioData: Omit<Ejercicio, 'id' | 'creado_en'>
): Promise<Ejercicio> {
  if (!ejercicioData.seed_id) {
    // Si no tiene seed_id, crear uno nuevo
    return crearEjercicio(ejercicioData);
  }

  // Buscar si ya existe por seed_id
  const existente = await obtenerEjercicioPorSeedId(ejercicioData.seed_id);
  if (existente) {
    return existente;
  }

  // Si no existe, crear uno
  return crearEjercicio(ejercicioData);
}

// Obtener un ejercicio por ID
export async function obtenerEjercicio(id: string): Promise<Ejercicio | undefined> {
  const db = await getDB();
  return db.get('ejercicios', id);
}

// Obtener ejercicio por seed_id
export async function obtenerEjercicioPorSeedId(
  seedId: string
): Promise<Ejercicio | undefined> {
  const db = await getDB();
  return db.getFromIndex('ejercicios', 'by-seed-id', seedId);
}

// Obtener todos los ejercicios
export async function obtenerTodosEjercicios(): Promise<Ejercicio[]> {
  const db = await getDB();
  return db.getAll('ejercicios');
}

// Actualizar ejercicio
export async function actualizarEjercicio(
  id: string,
  actualizaciones: Partial<Omit<Ejercicio, 'id' | 'creado_en'>>
): Promise<Ejercicio | undefined> {
  const db = await getDB();

  const ejercicio = await db.get('ejercicios', id);
  if (!ejercicio) return undefined;

  const ejercicioActualizado = {
    ...ejercicio,
    ...actualizaciones,
  };

  await db.put('ejercicios', ejercicioActualizado);
  return ejercicioActualizado;
}

// Eliminar ejercicio
export async function eliminarEjercicio(id: string): Promise<boolean> {
  const db = await getDB();

  const ejercicio = await db.get('ejercicios', id);
  if (!ejercicio) return false;

  await db.delete('ejercicios', id);
  return true;
}

// Buscar ejercicios por nombre
export async function buscarEjercicios(nombre: string): Promise<Ejercicio[]> {
  const db = await getDB();
  const todos = await db.getAll('ejercicios');

  return todos.filter((e) =>
    e.nombre.toLowerCase().includes(nombre.toLowerCase())
  );
}

// Obtener ejercicios por grupo muscular
export async function obtenerEjerciciosPorGrupo(
  grupo: string
): Promise<Ejercicio[]> {
  const db = await getDB();
  const todos = await db.getAll('ejercicios');

  return todos.filter((e) => e.grupo_muscular === grupo);
}

// Obtener ejercicios seedeados
export async function obtenerEjerciciosSeedeatdos(): Promise<Ejercicio[]> {
  const db = await getDB();
  const todos = await db.getAll('ejercicios');
  return todos.filter((e) => e.es_seedeado);
}

// Obtener ejercicios custom (creados por el usuario)
export async function obtenerEjerciciosCustom(): Promise<Ejercicio[]> {
  const db = await getDB();
  const todos = await db.getAll('ejercicios');
  return todos.filter((e) => !e.es_seedeado);
}