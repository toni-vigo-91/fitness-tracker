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
  await db.add('rutinas', nuevaRutina as unknown as any);
  return nuevaRutina;
}

// Obtener o crear una rutina por seed_id (IDEMPOTENTE)
export async function obtenerOCrearRutinaPorSeedId(
  rutinaData: Omit<Rutina, 'id' | 'creado_en'>
): Promise<Rutina> {
  if (!rutinaData.seed_id) {
    return crearRutina(rutinaData);
  }

  const existente = await obtenerRutinaPorSeedId(rutinaData.seed_id);
  if (existente) {
    return existente;
  }

  return crearRutina(rutinaData);
}

// Obtener una rutina
export async function obtenerRutina(id: string): Promise<Rutina | undefined> {
  const db = await getDB();
  const data = await db.get('rutinas', id);
  return data as Rutina | undefined;
}

// Obtener todas las rutinas
export async function obtenerTodasRutinas(): Promise<Rutina[]> {
  const db = await getDB();
  const datos = await db.getAll('rutinas');
  return datos as Rutina[];
}

// Obtener rutina por seed_id
export async function obtenerRutinaPorSeedId(
  seedId: string
): Promise<Rutina | undefined> {
  const db = await getDB();
  const data = await db.getFromIndex('rutinas', 'by-seed-id', seedId);
  return data as Rutina | undefined;
}

// Actualizar rutina
export async function actualizarRutina(
  id: string,
  actualizaciones: Partial<Omit<Rutina, 'id' | 'creado_en'>>
): Promise<Rutina | undefined> {
  const db = await getDB();
  const rutina = await obtenerRutina(id);
  if (!rutina) return undefined;

  const rutinaActualizada = {
    ...rutina,
    ...actualizaciones,
  };

  await db.put('rutinas', rutinaActualizada as unknown as any);
  return rutinaActualizada;
}

// Eliminar rutina
export async function eliminarRutina(id: string): Promise<boolean> {
  const db = await getDB();
  const rutina = await obtenerRutina(id);
  if (!rutina) return false;

  await db.delete('rutinas', id);
  return true;
}

// Obtener rutinas seedeadas
export async function obtenerRutinasSeedeatdas(): Promise<Rutina[]> {
  const todas = await obtenerTodasRutinas();
  return todas.filter((r) => r.tipo === 'seed');
}

// Obtener rutinas custom
export async function obtenerRutinasCustom(): Promise<Rutina[]> {
  const todas = await obtenerTodasRutinas();
  return todas.filter((r) => r.tipo === 'custom');
}