// Tipos principales de la aplicación

export interface Ejercicio {
  id: string;
  nombre: string;
  grupo_muscular: string;
  grupo_secundario: string[];
  tipo_ejercicio: 'compound' | 'isolation' | 'cardio';
  equipamiento: string;
  notas?: string;
  creado_en: Date;
}

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

export interface Entrenamiento {
  id: string;
  nombre: string;
  fecha: Date;
  duracion_minutos?: number;
  notas?: string;
  completado: boolean;
  series: Serie[];
  creado_en: Date;
}

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