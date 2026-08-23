import { getDB } from './init';
import {
  obtenerOCrearEjercicioPorSeedId,
  obtenerTodosEjercicios,
} from './ejercicios';
import {
  obtenerOCrearRutinaPorSeedId,
  obtenerTodasRutinas,
} from './rutinas';
import {
  obtenerOCrearEjercicioDeRutina,
  obtenerEjerciciosDERutina,
} from './ejercicios_de_rutina';
import { ejerciciosSeed } from '@/config/seeds/ejercicios-seed';
import { rutinasSeed, ejerciciosPorRutina } from '@/config/seeds/rutinas-seed';
import { MetadatosDB } from '../tipos';

const CURRENT_SEED_VERSION = 1;
const EXPECTED_EJERCICIOS = 32;
const EXPECTED_RUTINAS = 4;

// Variable global para rastrear si la seed está lista
let seedReady = false;

export function isSeedReady(): boolean {
  return seedReady;
}

// Verificar si la seed fue ejecutada Y validar que los datos existan
async function verificarSeed(): Promise<boolean> {
  try {
    const db = await getDB();

    // Paso 1: Comprobar metadatos
    const metadata = await db.get('metadatos_db', 'fitness-db-metadata');
    if (!metadata || metadata.seed_version !== CURRENT_SEED_VERSION) {
      return false;
    }

    // Paso 2: Validar que existen los datos esperados
    const ejercicios = await obtenerTodosEjercicios();
    const rutinas = await obtenerTodasRutinas();

    const ejerciciosOK = ejercicios.length === EXPECTED_EJERCICIOS;
    const rutinasOK = rutinas.length === EXPECTED_RUTINAS;

    if (!ejerciciosOK || !rutinasOK) {
      console.warn(
        `⚠ Datos incompletos detectados. Ejercicios: ${ejercicios.length}/${EXPECTED_EJERCICIOS}, Rutinas: ${rutinas.length}/${EXPECTED_RUTINAS}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.log('Seed no encontrada o incompleta, ejecutando...');
    return false;
  }
}

// Registrar que la seed fue ejecutada
async function marcarSeedCompleta(): Promise<void> {
  const db = await getDB();

  const metadata: MetadatosDB = {
    id: 'fitness-db-metadata',
    seed_version: CURRENT_SEED_VERSION,
  };

  await db.put('metadatos_db', metadata);
}

// Validar integridad de la seed después de crear
async function validarIntegridad(): Promise<boolean> {
  try {
    const ejercicios = await obtenerTodosEjercicios();
    const rutinas = await obtenerTodasRutinas();

    console.log(
      `Validando: ${ejercicios.length} ejercicios, ${rutinas.length} rutinas`
    );

    if (ejercicios.length !== EXPECTED_EJERCICIOS) {
      console.error(
        `✗ Número incorrecto de ejercicios: ${ejercicios.length}/${EXPECTED_EJERCICIOS}`
      );
      return false;
    }

    if (rutinas.length !== EXPECTED_RUTINAS) {
      console.error(
        `✗ Número incorrecto de rutinas: ${rutinas.length}/${EXPECTED_RUTINAS}`
      );
      return false;
    }

    // Validar ejercicios de rutina
    for (const rutina of rutinas) {
      const ejerciciosDeRutina = await obtenerEjerciciosDERutina(rutina.id);
      if (ejerciciosDeRutina.length === 0) {
        console.error(`✗ Rutina sin ejercicios: ${rutina.nombre}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('✗ Error en validación de integridad:', error);
    return false;
  }
}

// FUNCIÓN PRINCIPAL DE SEED (BLOQUEANTE E IDEMPOTENTE)
export async function initializeSeed(): Promise<void> {
  seedReady = false;

  // Verificar si ya fue ejecutada correctamente
  const yaFueEjecutada = await verificarSeed();
  if (yaFueEjecutada) {
    console.log('✓ Seed ya fue ejecutada correctamente. Saltando...');
    seedReady = true;
    return;
  }

  console.log('→ Ejecutando seed inicial...');

  try {
    // PASO 1: Obtener o crear ejercicios seedeados (IDEMPOTENTE)
    console.log('→ Procesando ejercicios...');
    const ejerciciosMap: Record<string, string> = {}; // seed_id -> id real

    for (const ejercicioData of ejerciciosSeed) {
      const ejercicio = await obtenerOCrearEjercicioPorSeedId(ejercicioData);
      if (ejercicioData.seed_id) {
        ejerciciosMap[ejercicioData.seed_id] = ejercicio.id;
      }
    }

    const ejerciciosTotal = await obtenerTodosEjercicios();
    console.log(`✓ ${ejerciciosTotal.length} ejercicios (creados o reutilizados)`);

    // PASO 2: Obtener o crear rutinas seedeadas (IDEMPOTENTE)
    console.log('→ Procesando rutinas...');
    const rutinasMap: Record<string, string> = {}; // seed_id -> id real

    for (const rutinaData of rutinasSeed) {
      const rutina = await obtenerOCrearRutinaPorSeedId(rutinaData);
      if (rutinaData.seed_id) {
        rutinasMap[rutinaData.seed_id] = rutina.id;
      }
    }

    const rutinasTotal = await obtenerTodasRutinas();
    console.log(`✓ ${rutinasTotal.length} rutinas (creadas o reutilizadas)`);

    // PASO 3: Obtener o crear ejercicios de rutina (vincular ejercicios con rutinas) (IDEMPOTENTE)
    console.log('→ Procesando relaciones ejercicio-rutina...');
    let totalEjerciciosRutina = 0;

    for (const [rutinaSeedId, ejerciciosConfig] of Object.entries(
      ejerciciosPorRutina
    )) {
      const rutinaId = rutinasMap[rutinaSeedId];
      if (!rutinaId) {
        throw new Error(`Rutina no encontrada en map: ${rutinaSeedId}`);
      }

      for (const config of ejerciciosConfig) {
        const ejercicioId = ejerciciosMap[config.ejercicio_seed_id];
        if (!ejercicioId) {
          throw new Error(
            `Ejercicio no encontrado en map: ${config.ejercicio_seed_id}`
          );
        }

        await obtenerOCrearEjercicioDeRutina({
          rutina_id: rutinaId,
          ejercicio_id: ejercicioId,
          orden: config.orden,
          series_objetivo: config.series_objetivo,
          repeticiones_objetivo: config.repeticiones_objetivo,
          grupo_superserie: config.grupo_superserie,
          notas: config.notas,
        });

        totalEjerciciosRutina++;
      }
    }

    console.log(
      `✓ ${totalEjerciciosRutina} relaciones procesadas (creadas o reutilizadas)`
    );

    // PASO 4: Validar que todo se creó correctamente
    console.log('→ Validando integridad de datos...');
    const integridadOK = await validarIntegridad();
    if (!integridadOK) {
      throw new Error('Falló la validación de integridad');
    }

    // PASO 5: Marcar seed como completa
    await marcarSeedCompleta();

    console.log('✓ Seed completada exitosamente');
    seedReady = true;
  } catch (error) {
    console.error('✗ Error durante seed:', error);
    seedReady = false; // Marcar como no lista si falla
    throw error;
  }
}