import { v4 as uuidv4 } from 'uuid';
import { Rutina } from '../tipos';
import { getDB } from './init';

// Crear rutina
export async function crearRutina(
  rutina: Omit<Rutina, 'id' | 'creado_en'>
): Promise<Rutina> {
  const db = await getDB();

  const nuevaRutina: Rutina = {
    ...rutina,
    id: uuidv4(),
    creado_en: new Date(),
  };

  await db.add('rutinas', nuevaRutina);
  return nuevaRutina;
}

// Obtener o crear una rutina por seed_id (IDEMPOTENTE)
export async function obtenerOCrearRutinaPorSeedId(
  rutinaData: Omit<Rutina, 'id' | 'creado_en'>
): Promise<Rutina> {
  if (!rutinaData.seed_id) {
    // Si no tiene seed_id, crear una nueva
    return crearRutina(rutinaData);
  }

  // Buscar si ya existe por seed_id
  const existente = await obtenerRutinaPorSeedId(rutinaData.seed_id);
  if (existente) {
    return existente;
  }

  // Si no existe, crear una
  return crearRutina(rutinaData);
}

// Obtener una rutina
export async function obtenerRutina(id: string): Promise<Rutina | undefined> {
  const db = await getDB();
  return db.get('rutinas', id);
}

// Obtener todas las rutinas
export async function obtenerTodasRutinas(): Promise<Rutina[]> {
  const db = await getDB();
  return db.getAll('rutinas');
}

// Obtener rutina por seed_id
export async function obtenerRutinaPorSeedId(
  seedId: string
): Promise<Rutina | undefined> {
  const db = await getDB();
  return db.getFromIndex('rutinas', 'by-seed-id', seedId);
}

// Actualizar rutina
export async function actualizarRutina(
  id: string,
  actualizaciones: Partial<Omit<Rutina, 'id' | 'creado_en'>>
): Promise<Rutina | undefined> {
  const db = await getDB();

  const rutina = await db.get('rutinas', id);
  if (!rutina) return undefined;

  const rutinaActualizada = {
    ...rutina,
    ...actualizaciones,
  };

  await db.put('rutinas', rutinaActualizada);
  return rutinaActualizada;
}

// Eliminar rutina
export async function eliminarRutina(id: string): Promise<boolean> {
  const db = await getDB();

  const rutina = await db.get('rutinas', id);
  if (!rutina) return false;

  await db.delete('rutinas', id);
  return true;
}

// Obtener rutinas seedeadas
export async function obtenerRutinasSeedeatdas(): Promise<Rutina[]> {
  const db = await getDB();
  const todas = await db.getAll('rutinas');
  return todas.filter((r) => r.tipo === 'seed');
}

// Obtener rutinas custom
export async function obtenerRutinasCustom(): Promise<Rutina[]> {
  const db = await getDB();
  const todas = await db.getAll('rutinas');
  return todas.filter((r) => r.tipo === 'custom');
}