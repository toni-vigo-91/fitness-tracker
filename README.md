# Fitness Tracker

Una aplicación web progresiva (PWA) para rastrear tu evolución en entrenamientos, medidas corporales y Personal Records (PRs).

## Características

- ✅ **Completamente Offline**: Todos los datos se guardan localmente en tu dispositivo
- ✅ **PWA Instalable**: Instálala como app nativa en tu teléfono o computadora
- ✅ **Sin Servidor**: No requiere conexión a Internet
- ✅ **Privacidad Total**: Tus datos nunca se envían a ningún servidor
- ✅ **Seguimiento de PRs**: Visualiza tu progreso en cada ejercicio
- ✅ **Gráficos de Progresión**: Observa tu evolución con gráficas detalladas
- ✅ **Rutinas Predefinidas**: 4 rutinas (Upper A/B, Lower A/B) con 32 ejercicios
- ✅ **Medidas Corporales**: Registra peso, medidas y porcentaje de grasa

## Tecnologías

- **Frontend**: Next.js 16.3.2 + TypeScript + Tailwind CSS 4
- **Base de Datos**: IndexedDB (Local)
- **Gráficos**: Recharts
- **PWA**: next-pwa
- **UUIDs**: uuid

## Primeros Pasos

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd fitness-tracker

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Instalación como App

1. Abre la app en tu navegador
2. Presiona el botón "Instalar" (aparece en la parte superior)
3. La app se instalará como app nativa en tu dispositivo

## Uso

### Dashboard
- Visualiza tus estadísticas principales
- Gráficos de frecuencia de entrenamientos
- Ejercicios más frecuentes
- Resumen semanal

### Entrenamientos
- Selecciona una rutina
- Registra series, peso y repeticiones
- Temporizador de descanso automático
- Historial completo con filtros

### Ejercicios
- Biblioteca de 32 ejercicios predefinidos
- Busca y filtra por grupo muscular
- Crea ejercicios personalizados

### PRs (Personal Records)
- Visualiza tus mejores marcas
- Gráficos de progresión por ejercicio
- Historial de PRs

### Medidas
- Registra peso, medidas corporales
- Gráficos de evolución
- Seguimiento histórico

### Perfil
- Gestiona tu información personal
- Preferencias de la app (unidades, idioma)
- Exporta tus datos en JSON
- Información de privacidad

## Datos Personales

**IMPORTANTE**: Todos tus datos se almacenan localmente en tu dispositivo. No se envía ninguna información a servidores externos.

- Los datos se guardan en IndexedDB (base de datos del navegador)
- Para sincronizar entre dispositivos, exporta tus datos (JSON) desde Perfil
- Elimina la app para borrar todos tus datos

## Estructura del Proyecto