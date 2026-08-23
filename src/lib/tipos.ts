// Ejercicio de la biblioteca
export interface Ejercicio {
  id: string;
  nombre: string;
  grupo_muscular: string;
  grupo_secundario: string[];
  tipo_ejercicio: 'compound' | 'isolation' | 'cardio';
  equipamiento: string;
  notas?: string;
  
  // Para idempotencia de seed
  es_seedeado: boolean;
  seed_id?: string;
  
  creado_en: Date;
}

// Plantilla/rutina de entrenamiento
export interface Rutina {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: 'custom' | 'seed';
  seed_id?: string;
  notas?: string;
  creado_en: Date;
}

// Relación entre rutina y ejercicio
export interface EjercicioDeRutina {
  id: string;
  rutina_id: string;
  ejercicio_id: string;
  orden: number;
  series_objetivo: number;
  repeticiones_objetivo: number;
  grupo_superserie?: string; // Ej: "ss-1"
  notas?: string;
  creado_en: Date;
}

// Sesión de entrenamiento realizada
export interface Entrenamiento {
  id: string;
  nombre: string;
  fecha: Date;
  rutina_id?: string; // FK a la rutina que origino este entrenamiento
  duracion_minutos?: number;
  notas?: string;
  completado: boolean;
  creado_en: Date;
}

// Serie realizada en un entrenamiento
export interface Serie {
  id: string;
  entrenamiento_id: string;
  ejercicio_id: string;
  numero_serie: number;
  peso_kg: number;
  repeticiones: number;
  rir?: number;
  es_calentamiento: boolean;
  notas?: string;
  creado_en: Date;
}

// Medida corporal registrada
export interface MedidaCorporal {
  id: string;
  fecha: Date;
  peso_kg: number;
  cintura_cm?: number;
  pecho_cm?: number;
  brazo_cm?: number;
  muslo_cm?: number;
  cadera_cm?: number;
  grasa_corporal_pct?: number;
  notas?: string;
  creado_en: Date;
}

// Metadatos de la BD (para versionado de seed)
export interface MetadatosDB {
  id: string; // Siempre "fitness-db-metadata"
  seed_version: number;
}

// Agregar al final del archivo:

export interface PerfilUsuario {
  id: string; // Siempre 'profile'
  nombre: string;
  edad?: number;
  peso_objetivo_kg?: number;
  unidades: 'kg' | 'lbs';
  idioma: 'es' | 'en';
  notificaciones_activas: boolean;
  tema: 'dark' | 'light';
  objetivo_semanal_entrenamientos?: number;
  foto_url?: string;
  creado_en: Date;
  actualizado_en: Date;
}