const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function clean() {
    console.log(chalk.blue('🧹 Limpiando directorios de build...'));

    const deployDir = path.join(process.cwd(), 'deploy');

    try {
        // Limpiar solo los archivos generados, mantener media y recursos estáticos
        const filesToClean = [
            path.join(deployDir, 'css', 'lightbot.min.css'),
            path.join(deployDir, 'js', 'lightbot.min.js'),
            path.join(deployDir, 'index.html')
        ];

        for (const file of filesToClean) {
            if (await fs.pathExists(file)) {
                await fs.remove(file);
                console.log(chalk.gray(`  ✓ Eliminado: ${path.relative(process.cwd(), file)}`));
            }
        }

        console.log(chalk.green('✅ Limpieza completada'));
    } catch (error) {
        console.error(chalk.red('❌ Error durante la limpieza:'), error.message);
        process.exit(1);
    }
}

clean();