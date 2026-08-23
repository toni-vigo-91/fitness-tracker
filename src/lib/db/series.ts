import { v4 as uuidv4 } from 'uuid';
import { Serie } from '../tipos';
import { getDB } from './init';

// Crear serie
export async function crearSerie(
  serie: Omit<Serie, 'id' | 'creado_en'>
): Promise<Serie> {
  const db = await getDB();
  
  const nuevaSerie: Serie = {
    ...serie,
    id: uuidv4(),
    creado_en: new Date(),
  };

  await db.add('series', nuevaSerie);
  return nuevaSerie;
}

// Obtener una serie
export async function obtenerSerie(id: string): Promise<Serie | undefined> {
  const db = await getDB();
  return db.get('series', id);
}

// Obtener todas las series
export async function obtenerTodasSeries(): Promise<Serie[]> {
  const db = await getDB();
  return db.getAll('series');
}

// Obtener series de un entrenamiento
export async function obtenerSeriesPorEntrenamiento(
  entrenamientoId: string
): Promise<Serie[]> {
  const db = await getDB();
  return db.getAllFromIndex('series', 'by-entrenamiento', entrenamientoId);
}

// Obtener series de un ejercicio
export async function obtenerSeriesPorEjercicio(ejercicioId: string): Promise<Serie[]> {
  const db = await getDB();
  return db.getAllFromIndex('series', 'by-ejercicio', ejercicioId);
}

// Actualizar serie
export async function actualizarSerie(
  id: string,
  actualizaciones: Partial<Omit<Serie, 'id' | 'creado_en'>>
): Promise<Serie | undefined> {
  const db = await getDB();
  
  const serie = await db.get('series', id);
  if (!serie) return undefined;

  const serieActualizada = {
    ...serie,
    ...actualizaciones,
  };

  await db.put('series', serieActualizada);
  return serieActualizada;
}

// Eliminar serie
export async function eliminarSerie(id: string): Promise<boolean> {
  const db = await getDB();
  
  const serie = await db.get('series', id);
  if (!serie) return false;

  await db.delete('series', id);
  return true;
}

// Obtener última serie de un ejercicio
export async function obtenerUltimaSeriePorEjercicio(
  ejercicioId: string
): Promise<Serie | undefined> {
  const series = await obtenerSeriesPorEjercicio(ejercicioId);
  
  if (series.length === 0) return undefined;
  
  return series.reduce((reciente, actual) =>
    new Date(actual.creado_en) > new Date(reciente.creado_en) ? actual : reciente
  );
}

// Calcular volumen total (peso * repeticiones) de un ejercicio
export async function calcularVolumenEjercicio(ejercicioId: string): Promise<number> {
  const series = await obtenerSeriesPorEjercicio(ejercicioId);
  
  return series.reduce((total, serie) => {
    return total + serie.peso_kg * serie.repeticiones;
  }, 0);
}

// Calcular volumen de un entrenamiento
export async function calcularVolumenEntrenamiento(entrenamientoId: string): Promise<number> {
  const series = await obtenerSeriesPorEntrenamiento(entrenamientoId);
  
  return series.reduce((total, serie) => {
    return total + serie.peso_kg * serie.repeticiones;
  }, 0);
}

// Obtener mejor serie (mayor peso) de un ejercicio
export async function obtenerMejorSeriePorEjercicio(
  ejercicioId: string
): Promise<Serie | undefined> {
  const series = await obtenerSeriesPorEjercicio(ejercicioId);
  
  if (series.length === 0) return undefined;
  
  return series.reduce((mejor, actual) =>
    actual.peso_kg > mejor.peso_kg ? actual : mejor
  );
}