import { getDB } from './init';
import { PerfilUsuario } from '../tipos';

const PROFILE_ID = 'profile';

// Obtener o crear perfil predeterminado
export async function obtenerPerfil(): Promise<PerfilUsuario> {
  const db = await getDB();

  try {
    const perfil = await db.get('metadatos_db', PROFILE_ID);
    if (perfil) return perfil;
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

  await db.put('metadatos_db', actualizado);
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