import { getDB } from './init';
import { PerfilUsuario } from '../tipos';

const PROFILE_ID = 'profile';

// Interfaz interna para IndexedDB (con fechas como strings)
interface PerfilUsuarioDB {
  id: string;
  nombre: string;
  edad?: number;
  peso_objetivo_kg?: number;
  unidades: 'kg' | 'lbs';
  idioma: 'es' | 'en';
  notificaciones_activas: boolean;
  tema: 'dark' | 'light';
  objetivo_semanal_entrenamientos?: number;
  foto_url?: string;
  creado_en: string; // ISO string
  actualizado_en: string; // ISO string
}

// Convertir de DB a Usuario
function fromDB(data: PerfilUsuarioDB): PerfilUsuario {
  return {
    ...data,
    creado_en: new Date(data.creado_en),
    actualizado_en: new Date(data.actualizado_en),
  };
}

// Convertir de Usuario a DB
function toDB(data: PerfilUsuario): PerfilUsuarioDB {
  return {
    ...data,
    creado_en: data.creado_en.toISOString(),
    actualizado_en: data.actualizado_en.toISOString(),
  };
}

// Obtener o crear perfil predeterminado
export async function obtenerPerfil(): Promise<PerfilUsuario> {
  console.log('[perfil.ts] Iniciando obtenerPerfil()');
  const db = await getDB();
  console.log('[perfil.ts] DB obtenida:', db);

  try {
    console.log('[perfil.ts] Intentando get de metadatos_db con ID:', PROFILE_ID);
    const perfilDB = await db.get('metadatos_db', PROFILE_ID);
    console.log('[perfil.ts] Resultado de get:', perfilDB);
    
    if (perfilDB) {
      console.log('[perfil.ts] Perfil encontrado, convirtiendo...');
      return fromDB(perfilDB as PerfilUsuarioDB);
    }
  } catch (error) {
    console.error('[perfil.ts] Error al obtener perfil:', error);
  }

  // Crear perfil predeterminado
  console.log('[perfil.ts] Creando perfil predeterminado');
  const perfilPredeterminado: PerfilUsuario = {
    id: PROFILE_ID,
    nombre: 'Usuario',
    unidades: 'kg',
    idioma: 'es',
    notificaciones_activas: true,
    tema: 'dark',
    objetivo_semanal_entrenamientos: 4,
    creado_en: new Date(),
    actualizado_en: new Date(),
  };

  const guardado = await guardarPerfil(perfilPredeterminado);
  console.log('[perfil.ts] Perfil guardado:', guardado);
  return guardado;
}

// Guardar perfil
export async function guardarPerfil(perfil: PerfilUsuario): Promise<PerfilUsuario> {
  console.log('[perfil.ts] Guardando perfil:', perfil);
  const db = await getDB();

  const actualizado: PerfilUsuario = {
    ...perfil,
    actualizado_en: new Date(),
  };

  const perfilDB = toDB(actualizado);
  console.log('[perfil.ts] Datos para DB:', perfilDB);
  
  await db.put('metadatos_db', perfilDB);
  console.log('[perfil.ts] Perfil guardado en DB');
  return actualizado;
}

// Actualizar perfil parcialmente
export async function actualizarPerfil(
  cambios: Partial<Omit<PerfilUsuario, 'id' | 'creado_en'>>
): Promise<PerfilUsuario> {
  console.log('[perfil.ts] Actualizando perfil con cambios:', cambios);
  const perfilActual = await obtenerPerfil();

  const perfilActualizado: PerfilUsuario = {
    ...perfilActual,
    ...cambios,
    actualizado_en: new Date(),
  };

  return guardarPerfil(perfilActualizado);
}

// Resetear perfil a valores predeterminados
export async function resetearPerfil(): Promise<PerfilUsuario> {
  console.log('[perfil.ts] Reseteando perfil');
  const perfilPredeterminado: PerfilUsuario = {
    id: PROFILE_ID,
    nombre: 'Usuario',
    unidades: 'kg',
    idioma: 'es',
    notificaciones_activas: true,
    tema: 'dark',
    objetivo_semanal_entrenamientos: 4,
    creado_en: new Date(),
    actualizado_en: new Date(),
  };

  return guardarPerfil(perfilPredeterminado);
}