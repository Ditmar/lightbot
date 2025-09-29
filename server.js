const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

const app = express();

// Configuración de puerto
const PORT = process.env.PORT || 3000;

// Detectar modo de desarrollo
const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';

// Middlewares
app.use(compression()); // Compresión gzip
app.use(cors()); // CORS para desarrollo

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Servir archivos estáticos según el modo
if (isDev) {
    console.log('🚀 Ejecutando en modo DESARROLLO');

    // En desarrollo, servir desde www/develop y recursos compartidos
    app.use('/css', express.static(path.join(__dirname, 'www/develop/css')));
    app.use('/js', express.static(path.join(__dirname, 'www/develop/js')));
    app.use('/img', express.static(path.join(__dirname, 'www/develop/img')));
    app.use('/media', express.static(path.join(__dirname, 'www/media')));

    // Ruta principal para desarrollo
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'www/develop/index.html'));
    });

} else {
    console.log('📦 Ejecutando en modo PRODUCCIÓN');

    // En producción, servir desde deploy
    app.use('/css', express.static(path.join(__dirname, 'deploy/css')));
    app.use('/js', express.static(path.join(__dirname, 'deploy/js')));
    app.use('/img', express.static(path.join(__dirname, 'deploy/img')));
    app.use('/media', express.static(path.join(__dirname, 'deploy/media')));

    // Ruta principal para producción
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'deploy/index.html'));
    });
}

// Rutas adicionales para recursos comunes
app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'deploy/img/favicon.ico')));

// Ruta de salud para deployment
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        mode: isDev ? 'development' : 'production',
        timestamp: new Date().toISOString(),
        version: '0.9.0'
    });
});

// Ruta de información del juego
app.get('/api/info', (req, res) => {
    res.json({
        name: 'LightBot Game',
        version: '0.9.0',
        description: 'Classic LightBot programming puzzle game',
        mode: isDev ? 'development' : 'production',
        author: 'Laurent Haan (original), Ditmar (modernization)'
    });
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Recurso no encontrado',
        path: req.originalUrl,
        method: req.method
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: isDev ? err.message : 'Ha ocurrido un error inesperado'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
🎮 LightBot Game Server
========================
🌐 Servidor ejecutándose en: http://localhost:${PORT}
📁 Modo: ${isDev ? 'Desarrollo' : 'Producción'}
📂 Sirviendo desde: ${isDev ? 'www/develop/' : 'deploy/'}
🔧 Health check: http://localhost:${PORT}/health
ℹ️  Info API: http://localhost:${PORT}/api/info
========================
  `);
});

// Manejo graceful del cierre
process.on('SIGTERM', () => {
    console.log('Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Cerrando servidor...');
    process.exit(0);
});

module.exports = app;