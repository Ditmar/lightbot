const fs = require('fs-extra');
const path = require('path');
const CleanCSS = require('clean-css');
const chalk = require('chalk');

async function buildCSS() {
    console.log(chalk.blue('🎨 Construyendo CSS...'));

    const developCSSDir = path.join(process.cwd(), 'www', 'develop', 'css');
    const deployCSSDir = path.join(process.cwd(), 'deploy', 'css');

    try {
        // Asegurar que el directorio de destino existe
        await fs.ensureDir(deployCSSDir);

        // Lista de archivos CSS a concatenar y minificar
        const cssFiles = [
            path.join(developCSSDir, 'smoothness', 'jquery-ui-1.8.16.custom.css'),
            path.join(developCSSDir, 'jplayer.css'),
            path.join(developCSSDir, 'lightbot.css')
        ];

        let combinedCSS = '';
        let processedFiles = 0;

        // Leer y concatenar archivos CSS
        for (const cssFile of cssFiles) {
            if (await fs.pathExists(cssFile)) {
                const content = await fs.readFile(cssFile, 'utf8');
                combinedCSS += `\n/* ${path.basename(cssFile)} */\n${content}\n`;
                processedFiles++;
                console.log(chalk.gray(`  ✓ Procesado: ${path.relative(process.cwd(), cssFile)}`));
            } else {
                console.log(chalk.yellow(`  ⚠️  No encontrado: ${path.relative(process.cwd(), cssFile)}`));
            }
        }

        if (combinedCSS) {
            // Minificar CSS
            const cleanCSS = new CleanCSS({
                level: 2,
                returnPromise: true
            });

            const minified = await cleanCSS.minify(combinedCSS);

            if (minified.errors.length > 0) {
                console.error(chalk.red('❌ Errores en CSS:'), minified.errors);
                process.exit(1);
            }

            // Escribir archivo minificado
            const outputFile = path.join(deployCSSDir, 'lightbot.min.css');
            await fs.writeFile(outputFile, minified.styles);

            // Copiar carpeta de imágenes de jQuery UI
            const imagesSource = path.join(developCSSDir, 'smoothness', 'images');
            const imagesTarget = path.join(deployCSSDir, 'images');

            if (await fs.pathExists(imagesSource)) {
                await fs.copy(imagesSource, imagesTarget);
                console.log(chalk.gray(`  ✓ Copiadas imágenes de UI`));
            }

            const stats = await fs.stat(outputFile);
            console.log(chalk.green(`✅ CSS construido exitosamente`));
            console.log(chalk.gray(`   📁 ${processedFiles} archivos procesados`));
            console.log(chalk.gray(`   📊 Tamaño: ${(stats.size / 1024).toFixed(2)}KB`));
            console.log(chalk.gray(`   🎯 Guardado en: ${path.relative(process.cwd(), outputFile)}`));
        } else {
            console.log(chalk.yellow('⚠️  No se encontraron archivos CSS para procesar'));
        }

    } catch (error) {
        console.error(chalk.red('❌ Error construyendo CSS:'), error.message);
        process.exit(1);
    }
}

buildCSS();