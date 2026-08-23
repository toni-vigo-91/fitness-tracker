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

let seedReady = false;

export function isSeedReady(): boolean {
  return seedReady;
}

async function verificarSeed(): Promise<boolean> {
  try {
    console.log('[seed] Verificando seed...');
    const db = await getDB();

    const metadata = await db.get('metadatos_db', 'fitness-db-metadata');
    console.log('[seed] Metadata encontrada:', metadata);
    
    if (!metadata || metadata.seed_version !== CURRENT_SEED_VERSION) {
      console.log('[seed] Metadata no valida, re-ejecutando seed');
      return false;
    }

    const ejercicios = await obtenerTodosEjercicios();
    const rutinas = await obtenerTodasRutinas();

    console.log(`[seed] Verificacion: ${ejercicios.length} ejercicios, ${rutinas.length} rutinas`);

    const ejerciciosOK = ejercicios.length === EXPECTED_EJERCICIOS;
    const rutinasOK = rutinas.length === EXPECTED_RUTINAS;

    if (!ejerciciosOK || !rutinasOK) {
      console.warn(
        `[seed] Datos incompletos. Ejercicios: ${ejercicios.length}/${EXPECTED_EJERCICIOS}, Rutinas: ${rutinas.length}/${EXPECTED_RUTINAS}`
      );
      return false;
    }

    console.log('[seed] Seed valida');
    return true;
  } catch (error) {
    console.log('[seed] Error en verificarSeed:', error);
    return false;
  }
}

async function marcarSeedCompleta(): Promise<void> {
  console.log('[seed] Marcando seed como completa');
  const db = await getDB();

  const metadata: MetadatosDB = {
    id: 'fitness-db-metadata',
    seed_version: CURRENT_SEED_VERSION,
  };

  await db.put('metadatos_db', metadata);
  console.log('[seed] Metadata guardada');
}

async function validarIntegridad(): Promise<boolean> {
  try {
    console.log('[seed] Validando integridad...');
    const ejercicios = await obtenerTodosEjercicios();
    const rutinas = await obtenerTodasRutinas();

    console.log(
      `[seed] Integridad: ${ejercicios.length} ejercicios, ${rutinas.length} rutinas`
    );

    if (ejercicios.length !== EXPECTED_EJERCICIOS) {
      console.error(
        `[seed] Ejercicios incorrectos: ${ejercicios.length}/${EXPECTED_EJERCICIOS}`
      );
      return false;
    }

    if (rutinas.length !== EXPECTED_RUTINAS) {
      console.error(
        `[seed] Rutinas incorrectas: ${rutinas.length}/${EXPECTED_RUTINAS}`
      );
      return false;
    }

    for (const rutina of rutinas) {
      const ejerciciosDeRutina = await obtenerEjerciciosDERutina(rutina.id);
      if (ejerciciosDeRutina.length === 0) {
        console.error(`[seed] Rutina sin ejercicios: ${rutina.nombre}`);
        return false;
      }
    }

    console.log('[seed] Integridad OK');
    return true;
  } catch (error) {
    console.error('[seed] Error en validacion:', error);
    return false;
  }
}

export async function initializeSeed(): Promise<void> {
  console.log('[seed] Iniciando initializeSeed()');
  seedReady = false;

  const yaFueEjecutada = await verificarSeed();
  if (yaFueEjecutada) {
    console.log('[seed] Seed ya ejecutada, saltando');
    seedReady = true;
    return;
  }

  console.log('[seed] Ejecutando seed inicial');

  try {
    console.log('[seed] Paso 1: Procesando ejercicios');
    const ejerciciosMap: Record<string, string> = {};

    for (const ejercicioData of ejerciciosSeed) {
      try {
        const ejercicio = await obtenerOCrearEjercicioPorSeedId(ejercicioData);
        if (ejercicioData.seed_id) {
          ejerciciosMap[ejercicioData.seed_id] = ejercicio.id;
        }
      } catch (err) {
        console.error('[seed] Error procesando ejercicio:', ejercicioData.nombre, err);
        throw err;
      }
    }

    const ejerciciosTotal = await obtenerTodosEjercicios();
    console.log(`[seed] Paso 1 OK: ${ejerciciosTotal.length} ejercicios`);

    console.log('[seed] Paso 2: Procesando rutinas');
    const rutinasMap: Record<string, string> = {};

    for (const rutinaData of rutinasSeed) {
      try {
        const rutina = await obtenerOCrearRutinaPorSeedId(rutinaData);
        if (rutinaData.seed_id) {
          rutinasMap[rutinaData.seed_id] = rutina.id;
        }
      } catch (err) {
        console.error('[seed] Error procesando rutina:', rutinaData.nombre, err);
        throw err;
      }
    }

    const rutinasTotal = await obtenerTodasRutinas();
    console.log(`[seed] Paso 2 OK: ${rutinasTotal.length} rutinas`);

    console.log('[seed] Paso 3: Procesando relaciones');
    let totalEjerciciosRutina = 0;

    for (const [rutinaSeedId, ejerciciosConfig] of Object.entries(
      ejerciciosPorRutina
    )) {
      const rutinaId = rutinasMap[rutinaSeedId];
      if (!rutinaId) {
        throw new Error(`Rutina no encontrada: ${rutinaSeedId}`);
      }

      for (const config of ejerciciosConfig) {
        const ejercicioId = ejerciciosMap[config.ejercicio_seed_id];
        if (!ejercicioId) {
          throw new Error(`Ejercicio no encontrado: ${config.ejercicio_seed_id}`);
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

    console.log(`[seed] Paso 3 OK: ${totalEjerciciosRutina} relaciones`);

    console.log('[seed] Paso 4: Validando integridad');
    const integridadOK = await validarIntegridad();
    if (!integridadOK) {
      throw new Error('Validacion de integridad fallo');
    }

    console.log('[seed] Paso 5: Marcando completa');
    await marcarSeedCompleta();

    console.log('[seed] SEED COMPLETADA EXITOSAMENTE');
    seedReady = true;
  } catch (error) {
    console.error('[seed] ERROR FATAL:', error);
    seedReady = false;
    throw error;
  }
}