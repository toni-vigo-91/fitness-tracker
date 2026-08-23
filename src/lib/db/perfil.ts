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
  const db = await getDB();

  try {
    const perfilDB = await db.get('metadatos_db', PROFILE_ID);
    if (perfilDB && 'nombre' in perfilDB) {
      return fromDB(perfilDB as PerfilUsuarioDB);
    }
  } catch {
    // Ignorar si no existe
  }

  // Crear perfil predeterminado
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

  await guardarPerfil(perfilPredeterminado);
  return perfilPredeterminado;
}

// Guardar perfil
export async function guardarPerfil(perfil: PerfilUsuario): Promise<PerfilUsuario> {
  const db = await getDB();

  const actualizado: PerfilUsuario = {
    ...perfil,
    actualizado_en: new Date(),
  };

  const perfilDB = toDB(actualizado);
  await db.put('metadatos_db', perfilDB as unknown as any);
  return actualizado;
}

// Actualizar perfil parcialmente
export async function actualizarPerfil(
  cambios: Partial<Omit<PerfilUsuario, 'id' | 'creado_en'>>
): Promise<PerfilUsuario> {
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