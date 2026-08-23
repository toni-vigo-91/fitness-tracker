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

  await db.add('ejercicios', nuevoEjercicio as any);
  return nuevoEjercicio;
}

// Obtener o crear un ejercicio por seed_id
export async function obtenerOCrearEjercicioPorSeedId(
  ejercicioData: Omit<Ejercicio, 'id' | 'creado_en'>
): Promise<Ejercicio> {
  if (!ejercicioData.seed_id) {
    return crearEjercicio(ejercicioData);
  }

  const existente = await obtenerEjercicioPorSeedId(ejercicioData.seed_id);
  if (existente) {
    return existente;
  }

  return crearEjercicio(ejercicioData);
}

// Obtener un ejercicio
export async function obtenerEjercicio(id: string): Promise<Ejercicio | undefined> {
  const db = await getDB();
  return db.get('ejercicios', id) as any;
}

// Obtener ejercicio por seed_id
export async function obtenerEjercicioPorSeedId(
  seedId: string
): Promise<Ejercicio | undefined> {
  const db = await getDB();
  return db.getFromIndex('ejercicios', 'by-seed-id', seedId) as any;
}

// Obtener todos los ejercicios
export async function obtenerTodosEjercicios(): Promise<Ejercicio[]> {
  const db = await getDB();
  const datos = await db.getAll('ejercicios');
  return datos as any[];
}

// Actualizar ejercicio
export async function actualizarEjercicio(
  id: string,
  actualizaciones: Partial<Omit<Ejercicio, 'id' | 'creado_en'>>
): Promise<Ejercicio | undefined> {
  const db = await getDB();

  const ejercicio = await obtenerEjercicio(id);
  if (!ejercicio) return undefined;

  const ejercicioActualizado = {
    ...ejercicio,
    ...actualizaciones,
  };

  await db.put('ejercicios', ejercicioActualizado as any);
  return ejercicioActualizado;
}

// Eliminar ejercicio
export async function eliminarEjercicio(id: string): Promise<boolean> {
  const db = await getDB();

  const ejercicio = await obtenerEjercicio(id);
  if (!ejercicio) return false;

  await db.delete('ejercicios', id);
  return true;
}

// Buscar ejercicios
export async function buscarEjercicios(nombre: string): Promise<Ejercicio[]> {
  const todos = await obtenerTodosEjercicios();
  return todos.filter((e) =>
    e.nombre.toLowerCase().includes(nombre.toLowerCase())
  );
}

// Obtener por grupo muscular
export async function obtenerEjerciciosPorGrupo(grupo: string): Promise<Ejercicio[]> {
  const todos = await obtenerTodosEjercicios();
  return todos.filter((e) => e.grupo_muscular === grupo);
}

// PRs
export async function obtenerPRPorEjercicio(ejercicioId: string): Promise<{ peso: number; fecha: Date } | null> {
  const db = await getDB();
  const todas = await