import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  Ejercicio,
  Entrenamiento,
  Serie,
  MedidaCorporal,
  Rutina,
  EjercicioDeRutina,
  MetadatosDB,
} from '../tipos';

interface FitnessDB extends DBSchema {
  ejercicios: {
    key: string;
    value: Ejercicio;
    indexes: {
      'by-seed-id': string;
    };
  };
  rutinas: {
    key: string;
    value: Rutina;
    indexes: {
      'by-seed-id': string;
    };
  };
  ejercicios_de_rutina: {
    key: string;
    value: EjercicioDeRutina;
    indexes: {
      'by-rutina': string;
      'by-ejercicio': string;
    };
  };
  entrenamientos: {
    key: string;
    value: Entrenamiento;
    indexes: {
      'by-fecha': string;
      'by-rutina': string;
    };
  };
  series: {
    key: string;
    value: Serie;
    indexes: {
      'by-entrenamiento': string;
      'by-ejercicio': string;
    };
  };
  medidas: {
    key: string;
    value: MedidaCorporal;
    indexes: {
      'by-fecha': string;
    };
  };
  metadatos_db: {
    key: string;
    value: MetadatosDB;
  };
}

let db: IDBPDatabase<FitnessDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<FitnessDB>> {
  if (db) return db;

  db = await openDB<FitnessDB>('fitness-tracker', 2, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Tabla: Ejercicios
      if (!db.objectStoreNames.contains('ejercicios')) {
        const ejerciciosStore = db.createObjectStore('ejercicios', {
          keyPath: 'id',
        });
        ejerciciosStore.createIndex('by-seed-id', 'seed_id');
      }

      // Tabla: Rutinas
      if (!db.objectStoreNames.contains('rutinas')) {
        const rutinasStore = db.createObjectStore('rutinas', {
          keyPath: 'id',
        });
        rutinasStore.createIndex('by-seed-id', 'seed_id');
      }

      // Tabla: Ejercicios de Rutina
      if (!db.objectStoreNames.contains('ejercicios_de_rutina')) {
        const ejerciciosDeRutinaStore = db.createObjectStore(
          'ejercicios_de_rutina',
          { keyPath: 'id' }
        );
        ejerciciosDeRutinaStore.createIndex('by-rutina', 'rutina_id');
        ejerciciosDeRutinaStore.createIndex('by-ejercicio', 'ejercicio_id');
      }

      // Tabla: Entrenamientos
      if (!db.objectStoreNames.contains('entrenamientos')) {
        const entrenamientosStore = db.createObjectStore('entrenamientos', {
          keyPath: 'id',
        });
        entrenamientosStore.createIndex('by-fecha', 'fecha');
        entrenamientosStore.createIndex('by-rutina', 'rutina_id');
      }

      // Tabla: Series
      if (!db.objectStoreNames.contains('series')) {
        const seriesStore = db.createObjectStore('series', {
          keyPath: 'id',
        });
        seriesStore.createIndex('by-entrenamiento', 'entrenamiento_id');
        seriesStore.createIndex('by-ejercicio', 'ejercicio_id');
      }

      // Tabla: Medidas Corporales
      if (!db.objectStoreNames.contains('medidas')) {
        const medidasStore = db.createObjectStore('medidas', {
          keyPath: 'id',
        });
        medidasStore.createIndex('by-fecha', 'fecha');
      }

      // Tabla: Metadatos DB
      if (!db.objectStoreNames.contains('metadatos_db')) {
        db.createObjectStore('metadatos_db', { keyPath: 'id' });
      }
    },
  });

  return db;
}

export async function getDB(): Promise<IDBPDatabase<FitnessDB>> {
  if (!db) {
    return initDB();
  }
  return db;
}