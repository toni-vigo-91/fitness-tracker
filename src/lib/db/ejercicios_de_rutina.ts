import { v4 as uuidv4 } from 'uuid';
import { EjercicioDeRutina } from '../tipos';
import { getDB } from './init';

// Crear ejercicio de rutina
export async function crearEjercicioDeRutina(
  ejercicioDeRutina: Omit<EjercicioDeRutina, 'id' | 'creado_en'>
): Promise<EjercicioDeRutina> {
  const db = await getDB();

  const nuevo: EjercicioDeRutina = {
    ...ejercicioDeRutina,
    id: uuidv4(),
    creado_en: new Date(),
  };

  await db.add('ejercicios_de_rutina', nuevo);
  return nuevo;
}

// Verificar si una relación ejercicio-rutina ya existe
export async function existeRelacionEjercicioRutina(
  rutinaId: string,
  ejercicioId: string
): Promise<boolean> {
  const db = await getDB();
  const ejerciciosDeRutina = await db.getAllFromIndex(
    'ejercicios_de_rutina',
    'by-rutina',
    rutinaId
  );

  return ejerciciosDeRutina.some((er) => er.ejercicio_id === ejercicioId);
}

// Obtener o crear una relación (IDEMPOTENTE)
export async function obtenerOCrearEjercicioDeRutina(
  ejercicioDeRutina: Omit<EjercicioDeRutina, 'id' | 'creado_en'>
): Promise<EjercicioDeRutina> {
  // Verificar si ya existe
  const existe = await existeRelacionEjercicioRutina(
    ejercicioDeRutina.rutina_id,
    ejercicioDeRutina.ejercicio_id
  );

  if (existe) {
    // Si existe, obtenerlo
    const db = await getDB();
    const ejerciciosDeRutina = await db.getAllFromIndex(
      'ejercicios_de_rutina',
      'by-rutina',
      ejercicioDeRutina.rutina_id
    );
    const existente = ejerciciosDeRutina.find(
      (er) => er.ejercicio_id === ejercicioDeRutina.ejercicio_id
    );
    if (existente) return existente;
  }

  // Si no existe, crear uno
  return crearEjercicioDeRutina(ejercicioDeRutina);
}

// Obtener un ejercicio de rutina
export async function obtenerEjercicioDeRutina(
  id: string
): Promise<EjercicioDeRutina | undefined> {
  const db = await getDB();
  return db.get('ejercicios_de_rutina', id);
}

// Obtener todos los ejercicios de una rutina (ordenados)
export async function obtenerEjerciciosDERutina(
  rutinaId: string
): Promise<EjercicioDeRutina[]> {
  const db = await getDB();
  const ejercicios = await db.getAllFromIndex(
    'ejercicios_de_rutina',
    'by-rutina',
    rutinaId
  );

  // Ordenar por 'orden'
  return ejercicios.sort((a, b) => a.orden - b.orden);
}

// Obtener todos los ejercicios de una rutina con detalles del ejercicio
export async function obtenerEjerciciosDeRutinaConDetalles(rutinaId: string) {
  const { obtenerEjercicio } = await import('./ejercicios');
  const ejerciciosDeRutina = await obtenerEjerciciosDERutina(rutinaId);

  const ejerciciosConDetalles = await Promise.all(
    ejerciciosDeRutina.map(async (ejdR) => {
      const ejercicio = await obtenerEjercicio(ejdR.ejercicio_id);
      return {
        ejercicioDeRutina: ejdR,
        ejercicio,
      };
    })
  );

  return ejerciciosConDetalles;
}

// Obtener ejercicios de una rutina agrupados por superserie
export async function obtenerEjerciciosConSuperseries(rutinaId: string) {
  const ejerciciosConDetalles = await obtenerEjerciciosDeRutinaConDetalles(
    rutinaId
  );

  // Agrupar por superserie
  const grupos: Record<string, typeof ejerciciosConDetalles> = {};

  ejerciciosConDetalles.forEach((item) => {
    const grupoKey =
      item.ejercicioDeRutina.grupo_superserie ||
      `ej-${item.ejercicioDeRutina.id}`;
    if (!grupos[grupoKey]) {
      grupos[grupoKey] = [];
    }
    grupos[grupoKey].push(item);
  });

  return Object.values(grupos);
}

// Actualizar ejercicio de rutina
export async function actualizarEjercicioDeRutina(
  id: string,
  actualizaciones: Partial<Omit<EjercicioDeRutina, 'id' | 'creado_en'>>
): Promise<EjercicioDeRutina | undefined> {
  const db = await getDB();

  const ejercicioDeRutina = await db.get('ejercicios_de_rutina', id);
  if (!ejercicioDeRutina) return undefined;

  const actualizado = {
    ...ejercicioDeRutina,
    ...actualizaciones,
  };

  await db.put('ejercicios_de_rutina', actualizado);
  return actualizado;
}

// Eliminar ejercicio de rutina
export async function eliminarEjercicioDeRutina(id: string): Promise<boolean> {
  const db = await getDB();

  const ejercicioDeRutina = await db.get('ejercicios_de_rutina', id);
  if (!ejercicioDeRutina) return false;

  await db.delete('ejercicios_de_rutina', id);
  return true;
}

// Eliminar todos los ejercicios de una rutina
export async function eliminarTodosEjerciciosDeRutina(
  rutinaId: string
): Promise<number> {
  const ejercicios = await obtenerEjerciciosDERutina(rutinaId);
  let count = 0;

  for (const ejercicio of ejercicios) {
    const deleted = await eliminarEjercicioDeRutina(ejercicio.id);
    if (deleted) count++;
  }

  return count;
}