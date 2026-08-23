import { v4 as uuidv4 } from 'uuid';
import { MedidaCorporal } from '../tipos';
import { getDB } from './init';

// Crear medida corporal
export async function crearMedida(
  medida: Omit<MedidaCorporal, 'id' | 'creado_en'>
): Promise<MedidaCorporal> {
  const db = await getDB();
  
  const nuevaMedida: MedidaCorporal = {
    ...medida,
    id: uuidv4(),
    creado_en: new Date(),
  };

  await db.add('medidas', nuevaMedida);
  return nuevaMedida;
}

// Obtener una medida
export async function obtenerMedida(id: string): Promise<MedidaCorporal | undefined> {
  const db = await getDB();
  return db.get('medidas', id);
}

// Obtener todas las medidas
export async function obtenerTodasMedidas(): Promise<MedidaCorporal[]> {
  const db = await getDB();
  const todas = await db.getAll('medidas');
  
  // Ordenar por fecha descendente
  return todas.sort((a, b) =>
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

// Obtener última medida
export async function obtenerUltimaMedida(): Promise<MedidaCorporal | undefined> {
  const medidas = await obtenerTodasMedidas();
  return medidas.length > 0 ? medidas[0] : undefined;
}

// Actualizar medida
export async function actualizarMedida(
  id: string,
  actualizaciones: Partial<Omit<MedidaCorporal, 'id' | 'creado_en'>>
): Promise<MedidaCorporal | undefined> {
  const db = await getDB();
  
  const medida = await db.get('medidas', id);
  if (!medida) return undefined;

  const medidaActualizada = {
    ...medida,
    ...actualizaciones,
  };

  await db.put('medidas', medidaActualizada);
  return medidaActualizada;
}

// Eliminar medida
export async function eliminarMedida(id: string): Promise<boolean> {
  const db = await getDB();
  
  const medida = await db.get('medidas', id);
  if (!medida) return false;

  await db.delete('medidas', id);
  return true;
}

// Obtener medidas por rango de fechas
export async function obtenerMedidasPorFecha(
  fechaInicio: Date,
  fechaFin: Date
): Promise<MedidaCorporal[]> {
  const medidas = await obtenerTodasMedidas();
  
  return medidas.filter((m) => {
    const fecha = new Date(m.fecha);
    return fecha >= fechaInicio && fecha <= fechaFin;
  });
}

// Calcular cambio de peso
export async function calcularCambioOfPeso(): Promise<{
  cambio: number;
  porcentaje: number;
  periodoSemanas: number;
} | null> {
  const medidas = await obtenerTodasMedidas();
  
  if (medidas.length < 2) return null;
  
  const ultimaMedida = medidas[0];
  const primeraMedida = medidas[medidas.length - 1];
  
  const cambio = ultimaMedida.peso_kg - primeraMedida.peso_kg;
  const porcentaje = (cambio / primeraMedida.peso_kg) * 100;
  
  const diasTranscurridos = Math.floor(
    (new Date(ultimaMedida.fecha).getTime() - new Date(primeraMedida.fecha).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const periodoSemanas = Math.floor(diasTranscurridos / 7);
  
  return { cambio, porcentaje, periodoSemanas };
}

// Obtener evolución de peso (últimas N medidas)
export async function obtenerEvolucionPeso(ultimas: number = 10): Promise<MedidaCorporal[]> {
  const medidas = await obtenerTodasMedidas();
  return medidas.slice(0, ultimas).reverse(); // Ordenar de más antiguo a más reciente
}