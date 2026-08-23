import { v4 as uuidv4 } from 'uuid';
import { MedidaCorporal } from '../tipos';
import { getDB } from './init';

export async function crearMedida(
  medida: Omit<MedidaCorporal, 'id' | 'creado_en'>
): Promise<MedidaCorporal> {
  const db = await getDB();

  const nuevaMedida: MedidaCorporal = {
    ...medida,
    id: uuidv4(),
    creado_en: new Date(),
  };

  await db.add('medidas', nuevaMedida as any);
  return nuevaMedida;
}

export async function obtenerMedida(id: string): Promise<MedidaCorporal | undefined> {
  const db = await getDB();
  return db.get('medidas', id) as any;
}

export async function obtenerTodasMedidas(): Promise<MedidaCorporal[]> {
  const db = await getDB();
  return db.getAll('medidas') as any[];
}

export async function obtenerMedidasPorFecha(): Promise<MedidaCorporal[]> {
  const db = await getDB();
  const todas = await db.getAllFromIndex('medidas', 'by-fecha');
  return todas as any[];
}

export async function actualizarMedida(
  id: string,
  actualizaciones: Partial<Omit<MedidaCorporal, 'id' | 'creado_en'>>
): Promise<MedidaCorporal | undefined> {
  const db = await getDB();

  const medida = await obtenerMedida(id);
  if (!medida) return undefined;

  const medidaActualizada = {
    ...medida,
    ...actualizaciones,
  };

  await db.put('medidas', medidaActualizada as any);
  return medidaActualizada;
}

export async function eliminarMedida(id: string): Promise<boolean> {
  const db = await getDB();

  const medida = await obtenerMedida(id);
  if (!medida) return false;

  await db.delete('medidas', id);
  return true;
}

export async function obtenerUltimaMedida(): Promise<MedidaCorporal | undefined> {
  const todas = await obtenerTodasMedidas();

  if (todas.length === 0) return undefined;

  return todas.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )[0];
}

export async function obtenerProgresoPeso(): Promise<{
  inicial: number | null;
  actual: number | null;
  diferencia: number | null;
}> {
  const todas = await obtenerTodasMedidas();

  if (todas.length === 0) {
    return { inicial: null, actual: null, diferencia: null };
  }

  const ordenadasPorFecha = todas.sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  const primeraMedida = ordenadasPorFecha[0];
  const ultimaMedida = ordenadasPorFecha[ordenadasPorFecha.length - 1];

  if (!primeraMedida || !ultimaMedida) {
    return { inicial: null, actual: null, diferencia: null };
  }

  return {
    inicial: primeraMedida.peso_kg,
    actual: ultimaMedida.peso_kg,
    diferencia: ultimaMedida.peso_kg - primeraMedida.peso_kg,
  };
}

export async function obtenerSeriesPorFecha(fecha: Date): Promise<MedidaCorporal[]> {
  const todas = await obtenerTodasMedidas();
  const fechaStr = fecha.toISOString().split('T')[0];

  return todas.filter((m) => {
    const medidaFechaStr = new Date(m.fecha).toISOString().split('T')[0];
    return medidaFechaStr === fechaStr;
  });
}