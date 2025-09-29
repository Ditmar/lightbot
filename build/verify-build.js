const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function verifyBuild() {
    console.log(chalk.blue('🔍 Verificando build...'));

    const deployDir = path.join(process.cwd(), 'deploy');
    const requiredFiles = [
        'css/lightbot.min.css',
        'js/lightbot.min.js',
        'index.html',
        'build-info.json',
        'manifest.json'
    ];

    let allGood = true;

    try {
        for (const file of requiredFiles) {
            const filePath = path.join(deployDir, file);

            if (await fs.pathExists(filePath)) {
                const stats = await fs.stat(filePath);
                const size = (stats.size / 1024).toFixed(2);
                console.log(chalk.green(`  ✓ ${file} (${size}KB)`));
            } else {
                console.log(chalk.red(`  ❌ ${file} - NO ENCONTRADO`));
                allGood = false;
            }
        }

        // Verificar build-info
        const buildInfoPath = path.join(deployDir, 'build-info.json');
        if (await fs.pathExists(buildInfoPath)) {
            const buildInfo = await fs.readJson(buildInfoPath);
            console.log(chalk.gray(`\n📊 Información de build:`));
            console.log(chalk.gray(`   🏗️  Build: ${buildInfo.buildNumber}`));
            console.log(chalk.gray(`   📅 Fecha: ${new Date(buildInfo.buildTime).toLocaleString()}`));
            console.log(chalk.gray(`   🌍 Entorno: ${buildInfo.environment}`));
        }

        if (allGood) {
            console.log(chalk.green('\n✅ Build verificado exitosamente!'));
            console.log(chalk.gray('   Todos los archivos requeridos están presentes'));
        } else {
            console.log(chalk.red('\n❌ Build incompleto'));
            console.log(chalk.yellow('   Ejecuta "npm run build" para generar los archivos faltantes'));
            process.exit(1);
        }

    } catch (error) {
        console.error(chalk.red('❌ Error verificando build:'), error.message);
        process.exit(1);
    }
}

verifyBuild();