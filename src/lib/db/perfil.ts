import { getDB } from './init';
import { PerfilUsuario } from '../tipos';

const PROFILE_ID = 'profile';

export async function obtenerPerfil(): Promise<PerfilUsuario> {
  const db = await getDB();
  const perfil = await db.get('metadatos_db', PROFILE_ID);
  
  if (perfil && 'nombre' in perfil) {
    return perfil as any;
  }

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

export async function guardarPerfil(perfil: PerfilUsuario): Promise<PerfilUsuario> {
  const db = await getDB();
  const actualizado: PerfilUsuario = {
    ...perfil,
    actualizado_en: new Date(),
  };
  await db.put('metadatos_db', actualizado as any);
  return actualizado;
}

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