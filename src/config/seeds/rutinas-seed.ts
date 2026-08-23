import { Rutina, EjercicioDeRutina } from '@/lib/tipos';

// DEFINICIÓN DE RUTINAS
export const rutinasSeed: Omit<Rutina, 'id' | 'creado_en'>[] = [
  {
    seed_id: 'upper-a',
    nombre: 'Upper A',
    descripcion: 'Pecho + espalda + hombro + brazos + abs',
    tipo: 'seed',
  },
  {
    seed_id: 'upper-b',
    nombre: 'Upper B',
    descripcion: 'Pecho + espalda + hombro + brazos + abs',
    tipo: 'seed',
  },
  {
    seed_id: 'lower-a',
    nombre: 'Lower A',
    descripcion: 'Pierna completa',
    tipo: 'seed',
  },
  {
    seed_id: 'lower-b',
    nombre: 'Lower B',
    descripcion: 'Pierna complementaria',
    tipo: 'seed',
  },
];

// EJERCICIOS DE RUTINA (ejercicio_seed_id -> [orden, series, reps, grupo_superserie, notas])
// Nota: Los IDs reales se asignarán durante la seed
type EjercicioRutinaConfig = {
  ejercicio_seed_id: string;
  orden: number;
  series_objetivo: number;
  repeticiones_objetivo: number;
  grupo_superserie?: string;
  notas?: string;
};

export const upper_a_ejercicios: EjercicioRutinaConfig[] = [
  // Superserie 1
  {
    ejercicio_seed_id: 'press-banca-plano',
    orden: 1,
    series_objetivo: 3,
    repeticiones_objetivo: 10,
    grupo_superserie: 'ss-1',
  },
  {
    ejercicio_seed_id: 'svend-press',
    orden: 2,
    series_objetivo: 3,
    repeticiones_objetivo: 10,
    grupo_superserie: 'ss-1',
  },
  {
    ejercicio_seed_id: 'remo-gironda',
    orden: 3,
    series_objetivo: 3,
    repeticiones_objetivo: 12,
  },
  {
    ejercicio_seed_id: 'press-banca-declinado',
    orden: 4,
    series_objetivo: 3,
    repeticiones_objetivo: 12,
  },
  {
    ejercicio_seed_id: 'jalon-prono',
    orden: 5,
    series_objetivo: 3,
    repeticiones_objetivo: 12,
  },
  {
    ejercicio_seed_id: 'elevaciones-laterales',
    orden: 6,
    series_objetivo: 3,
    repeticiones_objetivo: 20,
  },
  {
    ejercicio_seed_id: 'face-pull',
    orden: 7,
    series_objetivo: 3,
    repeticiones_objetivo: 20,
  },
  {
    ejercicio_seed_id: 'curl-biceps',
    orden: 8,
    series_objetivo: 3,
    repeticiones_objetivo: 12,
  },
  {
    ejercicio_seed_id: 'extension-triceps-unilateral',
    orden: 9,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'curl-muñeca',
    orden: 10,
    series_objetivo: 3,
    repeticiones_objetivo: 20,
  },
  {
    ejercicio_seed_id: 'crunch-polea',
    orden: 11,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'elevaciones-piernas-banco',
    orden: 12,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
];

export const upper_b_ejercicios: EjercicioRutinaConfig[] = [
  {
    ejercicio_seed_id: 'press-banca-inclinado',
    orden: 1,
    series_objetivo: 3,
    repeticiones_objetivo: 10,
  },
  {
    ejercicio_seed_id: 'remo-unilateral',
    orden: 2,
    series_objetivo: 3,
    repeticiones_objetivo: 12,
  },
  {
    ejercicio_seed_id: 'aperturas-maquina',
    orden: 3,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'jalon-neutro-supino',
    orden: 4,
    series_objetivo: 3,
    repeticiones_objetivo: 12,
  },
  {
    ejercicio_seed_id: 'elevaciones-frontales',
    orden: 5,
    series_objetivo: 3,
    repeticiones_objetivo: 20,
  },
  {
    ejercicio_seed_id: 'curl-martillo',
    orden: 6,
    series_objetivo: 3,
    repeticiones_objetivo: 12,
  },
  {
    ejercicio_seed_id: 'extension-triceps-cuerda',
    orden: 7,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'curl-inverso-barra',
    orden: 8,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'ab-wheel',
    orden: 9,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'landmine-180',
    orden: 10,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
    notas: 'Realizar por lado',
  },
];

export const lower_a_ejercicios: EjercicioRutinaConfig[] = [
  {
    ejercicio_seed_id: 'sentadilla',
    orden: 1,
    series_objetivo: 4,
    repeticiones_objetivo: 10,
  },
  {
    ejercicio_seed_id: 'peso-muerto-rumano',
    orden: 2,
    series_objetivo: 3,
    repeticiones_objetivo: 10,
  },
  {
    ejercicio_seed_id: 'prensa',
    orden: 3,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'curl-femoral',
    orden: 4,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'hip-thrust',
    orden: 5,
    series_objetivo: 3,
    repeticiones_objetivo: 12,
  },
  {
    ejercicio_seed_id: 'gemelos',
    orden: 6,
    series_objetivo: 4,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'abductores',
    orden: 7,
    series_objetivo: 3,
    repeticiones_objetivo: 25,
  },
];

export const lower_b_ejercicios: EjercicioRutinaConfig[] = [
  {
    ejercicio_seed_id: 'prensa',
    orden: 1,
    series_objetivo: 3,
    repeticiones_objetivo: 12,
  },
  {
    ejercicio_seed_id: 'extension-cuadriceps',
    orden: 2,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'curl-femoral',
    orden: 3,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'hip-thrust',
    orden: 4,
    series_objetivo: 3,
    repeticiones_objetivo: 12,
  },
  {
    ejercicio_seed_id: 'patada-gluteos',
    orden: 5,
    series_objetivo: 3,
    repeticiones_objetivo: 15,
  },
  {
    ejercicio_seed_id: 'gemelos',
    orden: 6,
    series_objetivo: 4,
    repeticiones_objetivo: 20,
  },
  {
    ejercicio_seed_id: 'aductores',
    orden: 7,
    series_objetivo: 0, // No definido por el usuario
    repeticiones_objetivo: 0, // No definido
    notas: 'Número de series/reps a definir',
  },
];

export const ejerciciosPorRutina: Record<string, EjercicioRutinaConfig[]> = {
  'upper-a': upper_a_ejercicios,
  'upper-b': upper_b_ejercicios,
  'lower-a': lower_a_ejercicios,
  'lower-b': lower_b_ejercicios,
};