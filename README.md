# LightBot Game Server

Un servidor Express para el clásico juego de programación LightBot.

## 🎮 Sobre el Juego

Lightbot es un juego de rompecabezas de programación donde controlas un robot para iluminar todas las casillas azules en cada nivel. Es una excelente manera de aprender conceptos de programación de forma divertida y está diseñado para cursos introductorios al pensamiento lógico.

## � Sistema de Build

### Build Completo
```bash
npm run build
# o usar el archivo batch en Windows:
build.bat
```

El sistema de build incluye:
- **Minificación de CSS**: Combina y minifica todos los archivos CSS
- **Minificación de JavaScript**: Combina y minifica todos los archivos JS
- **Optimización de Assets**: Copia imágenes y archivos multimedia
- **Generación de Manifest**: Crea archivos de información y PWA manifest

### Scripts de Build Individuales
- `npm run clean` - Limpiar archivos generados
- `npm run build:css` - Solo construir CSS
- `npm run build:js` - Solo construir JavaScript
- `npm run copy:assets` - Solo copiar assets
- `npm run build:manifest` - Solo generar manifest

### Modo Watch (Desarrollo)
```bash
npm run watch
# o usar el archivo batch:
watch.bat
```
Recompila automáticamente cuando detecta cambios en `www/develop/`

## �🚀 Instalación y Uso

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)

### Instalación

```bash
npm install
```

### Ejecutar el servidor

#### Modo Desarrollo

```bash
npm run dev
# o
node server.js --dev
```

Sirve los archivos desde `www/develop/` con archivos JS separados para debugging.

#### Modo Producción

```bash
npm start
# o
node server.js
```

Sirve los archivos desde `deploy/` con archivos minificados para mejor performance.

#### Puerto Personalizado

```bash
npm run serve
# Ejecuta en puerto 8080
```

## 🌐 URLs Disponibles

- **Juego Principal**: `http://localhost:3000/`
- **Health Check**: `http://localhost:3000/health`
- **Info de la API**: `http://localhost:3000/api/info`

## 📁 Estructura del Proyecto

```
lightbot/
├── server.js           # Servidor Express principal
├── package.json        # Configuración de npm
├── deploy/            # Archivos de producción (minificados)
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── img/
│   └── media/
├── www/develop/       # Archivos de desarrollo
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── img/
│   └── media/
└── resources/         # Recursos adicionales
```

## 🛠️ Características del Servidor

- **Compresión gzip** para mejor rendimiento
- **CORS** habilitado para desarrollo
- **Logging** de requests
- **Health check** endpoint
- **Manejo de errores** robusto
- **Modo desarrollo/producción** automático
- **Graceful shutdown**

## 📋 Scripts Disponibles

- `npm start` - Ejecutar en modo producción
- `npm run dev` - Ejecutar en modo desarrollo con nodemon
- `npm run build` - Construir todos los assets para producción
- `npm run build:css` - Construir solo archivos CSS
- `npm run build:js` - Construir solo archivos JavaScript
- `npm run build:manifest` - Generar manifest y build info
- `npm run copy:assets` - Copiar assets (imágenes, media)
- `npm run clean` - Limpiar archivos de build
- `npm run watch` - Modo watch (reconstruye automáticamente)
- `npm run serve` - Ejecutar en puerto 8080
- `npm test` - Placeholder para tests

### Archivos Batch para Windows
- `install.bat` - Instalar dependencias
- `build.bat` - Ejecutar build completo con feedback visual
- `watch.bat` - Ejecutar modo watch
- `start-dev.bat` - Ejecutar servidor en desarrollo
- `start-prod.bat` - Ejecutar servidor en producción

## 🚀 Deployment

### Variables de Entorno

- `PORT` - Puerto del servidor (default: 3000)
- `NODE_ENV=development` - Forzar modo desarrollo

### Plataformas de Deployment

El servidor está preparado para funcionar en:

- Heroku
- Vercel
- Railway
- DigitalOcean
- AWS
- Cualquier servidor con Node.js

## 🎯 Desarrollo Original

- **Desarrollador Original**: Laurent Haan
- **Interfaz**: Zenobia Homan
- **Sprites**: surt
- **Música**: hektikmusic
- **Concepto Original**: coolio niato
- **Modernización**: Ditmar

## 📄 Licencia

MIT License - El contenido de la carpeta "deploy" es todo lo que necesitas para empezar. Simplemente descarga todo el contenido de la carpeta "deploy" y abre el index.html localmente en tu navegador web, o utiliza el nuevo servidor Express para una experiencia más robusta.
