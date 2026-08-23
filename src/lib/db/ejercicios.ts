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

// Al final del archivo, agregar:

// Obtener PR (peso máximo) de un ejercicio
export async function obtenerPRPorEjercicio(ejercicioId: string): Promise<{ peso: number; fecha: Date } | null> {
  const db = await getDB();
  const todas = await db.getAll('series');
  
  const seriesDelEjercicio = todas.filter((s) => s.ejercicio_id === ejercicioId);
  
  if (seriesDelEjercicio.length === 0) return null;
  
  const conMayorPeso = seriesDelEjercicio.reduce((prev, current) =>
    current.peso_kg > prev.peso_kg ? current : prev
  );
  
  return {
    peso: conMayorPeso.peso_kg,
    fecha: new Date(conMayorPeso.creado_en),
  };
}

// Obtener todos los PRs del usuario
export async function obtenerTodosPRs(): Promise<Array<{ ejercicio: Ejercicio; pr: number; fecha: Date }>> {
  const db = await getDB();
  const ejercicios = await db.getAll('ejercicios');
  const series = await db.getAll('series');
  
  const prs: Array<{ ejercicio: Ejercicio; pr: number; fecha: Date }> = [];
  
  for (const ejercicio of ejercicios) {
    const seriesDelEjercicio = series.filter((s) => s.ejercicio_id === ejercicio.id);
    
    if (seriesDelEjercicio.length > 0) {
      const conMayorPeso = seriesDelEjercicio.reduce((prev, current) =>
        current.peso_kg > prev.peso_kg ? current : prev
      );
      
      prs.push({
        ejercicio,
        pr: conMayorPeso.peso_kg,
        fecha: new Date(conMayorPeso.creado_en),
      });
    }
  }
  
  return prs.sort((a, b) => b.pr - a.pr);
}

// Detectar si una serie es un nuevo PR
export async function esNuevoPR(ejercicioId: string, peso: number): Promise<boolean> {
  const pr = await obtenerPRPorEjercicio(ejercicioId);
  
  if (!pr) return true; // Primera serie del ejercicio
  
  return peso > pr.peso;
}

// Obtener historia de PRs de un ejercicio (últimas 10 mejoras)
export async function obtenerHistoriaPRs(ejercicioId: string, limit: number = 10): Promise<Array<{ peso: number; fecha: Date }>> {
  const db = await getDB();
  const todas = await db.getAll('series');
  
  const seriesDelEjercicio = todas
    .filter((s) => s.ejercicio_id === ejercicioId)
    .sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime());
  
  // Filtrar para obtener solo los máximos por período
  const prs: Array<{ peso: number; fecha: Date }> = [];
  let pesoMaximo = 0;
  
  for (const serie of seriesDelEjercicio) {
    if (serie.peso_kg > pesoMaximo) {
      pesoMaximo = serie.peso_kg;
      prs.push({
        peso: serie.peso_kg,
        fecha: new Date(serie.creado_en),
      });
      
      if (prs.length >= limit) break;
    }
  }
  
  return prs.reverse();
}