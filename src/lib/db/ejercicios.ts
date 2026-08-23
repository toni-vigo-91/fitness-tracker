import { v4 as uuidv4 } from 'uuid';
import { Ejercicio } from '../tipos';
import { getDB } from './init';

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

export async function obtenerEjercicio(id: string): Promise<Ejercicio | undefined> {
  const db = await getDB();
  return db.get('ejercicios', id) as any;
}

export async function obtenerEjercicioPorSeedId(
  seedId: string
): Promise<Ejercicio | undefined> {
  const db = await getDB();
  return db.getFromIndex('ejercicios', 'by-seed-id', seedId) as any;
}

export async function obtenerTodosEjercicios(): Promise<Ejercicio[]> {
  const db = await getDB();
  const datos = await db.getAll('ejercicios');
  return datos as any[];
}

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

export async function eliminarEjercicio(id: string): Promise<boolean> {
  const db = await getDB();
  const ejercicio = await obtenerEjercicio(id);
  if (!ejercicio) return false;
  await db.delete('ejercicios', id);
  return true;
}

export async function buscarEjercicios(nombre: string): Promise<Ejercicio[]> {
  const todos = await obtenerTodosEjercicios();
  return todos.filter((e) =>
    e.nombre.toLowerCase().includes(nombre.toLowerCase())
  );
}

export async function obtenerEjerciciosPorGrupo(grupo: string): Promise<Ejercicio[]> {
  const todos = await obtenerTodosEjercicios();
  return todos.filter((e) => e.grupo_muscular === grupo);
}

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

export async function obtenerTodosPRs(): Promise<Array<{ ejercicio: Ejercicio; pr: number; fecha: Date }>> {
  const ejercicios = await obtenerTodosEjercicios();
  const db = await getDB();
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

export async function esNuevoPR(ejercicioId: string, peso: number): Promise<boolean> {
  const pr = await obtenerPRPorEjercicio(ejercicioId);
  if (!pr) return true;
  return peso > pr.peso;
}

export async function obtenerHistoriaPRs(ejercicioId: string, limit: number = 10): Promise<Array<{ peso: number; fecha: Date }>> {
  const db = await getDB();
  const todas = await db.getAll('series');
  const seriesDelEjercicio = todas
    .filter((s) => s.ejercicio_id === ejercicioId)
    .sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime());
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