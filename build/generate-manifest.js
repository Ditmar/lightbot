const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function createBuildInfo() {
    const buildInfo = {
        version: '0.9.0',
        buildTime: new Date().toISOString(),
        buildNumber: Date.now(),
        environment: process.env.NODE_ENV || 'development',
        files: {
            css: 'css/lightbot.min.css',
            js: 'js/lightbot.min.js',
            html: 'index.html'
        }
    };

    const buildInfoPath = path.join(process.cwd(), 'deploy', 'build-info.json');
    await fs.writeFile(buildInfoPath, JSON.stringify(buildInfo, null, 2));

    console.log(chalk.gray(`  ✓ Generada información de build`));
    return buildInfo;
}

async function generateManifest() {
    console.log(chalk.blue('📋 Generando manifest...'));

    try {
        // Crear build info
        const buildInfo = await createBuildInfo();

        // Crear manifest para PWA (opcional)
        const manifest = {
            name: 'LightBot Game',
            short_name: 'LightBot',
            description: 'Classic LightBot programming puzzle game',
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#007acc',
            icons: [
                {
                    src: 'img/favicon.ico',
                    sizes: '16x16',
                    type: 'image/x-icon'
                }
            ]
        };

        const manifestPath = path.join(process.cwd(), 'deploy', 'manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

        console.log(chalk.green('✅ Manifest generado'));
        console.log(chalk.gray(`   🏗️  Build: ${buildInfo.buildNumber}`));
        console.log(chalk.gray(`   📅 Fecha: ${buildInfo.buildTime}`));

    } catch (error) {
        console.error(chalk.red('❌ Error generando manifest:'), error.message);
        process.exit(1);
    }
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
    generateManifest();
}

module.exports = { createBuildInfo, generateManifest };