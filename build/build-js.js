const fs = require('fs-extra');
const path = require('path');
const UglifyJS = require('uglify-js');
const chalk = require('chalk');

async function buildJS() {
    console.log(chalk.blue('⚡ Construyendo JavaScript...'));

    const developJSDir = path.join(process.cwd(), 'www', 'develop', 'js');
    const deployJSDir = path.join(process.cwd(), 'deploy', 'js');

    try {
        // Asegurar que el directorio de destino existe
        await fs.ensureDir(deployJSDir);

        // Lista de archivos JS en el orden correcto para concatenación
        const jsFiles = [
            // Librerías externas primero
            'jquery-1.7.min.js',
            'jquery-ui-1.8.16.custom.min.js',
            'jquery.jplayer.min.js',
            'jquery.history.js',

            // Modelos de LightBot
            'lightbot.model.game.js',
            'lightbot.model.directions.js',
            'lightbot.model.bot.js',
            'lightbot.model.bot.instructions.js',
            'lightbot.model.map.js',
            'lightbot.model.map.state.js',
            'lightbot.model.box.js',
            'lightbot.model.lightbox.js',
            'lightbot.model.medals.js',
            'lightbot.model.achievements.js',

            // Vistas de LightBot
            'lightbot.view.canvas.js',
            'lightbot.view.canvas.ui.js',
            'lightbot.view.canvas.ui.media.js',
            'lightbot.view.canvas.ui.buttons.js',
            'lightbot.view.canvas.ui.dialogs.js',
            'lightbot.view.canvas.ui.editor.js',
            'lightbot.view.canvas.ui.history.js',
            'lightbot.view.canvas.game.js',
            'lightbot.view.canvas.map.js',
            'lightbot.view.canvas.box.js',
            'lightbot.view.canvas.bot.animations.js',
            'lightbot.view.canvas.bot.js',
            'lightbot.view.canvas.projection.js',
            'lightbot.view.canvas.medals.js',
            'lightbot.view.canvas.achievements.js'
        ];

        let combinedJS = '';
        let processedFiles = 0;
        const filesToMinify = {};

        // Leer y concatenar archivos JS
        for (const jsFile of jsFiles) {
            const filePath = path.join(developJSDir, jsFile);

            if (await fs.pathExists(filePath)) {
                const content = await fs.readFile(filePath, 'utf8');

                // Si el archivo ya está minificado (.min.js), no lo minificamos de nuevo
                if (jsFile.includes('.min.js')) {
                    combinedJS += `\n/* ${jsFile} */\n${content}\n`;
                } else {
                    // Preparar para minificación
                    filesToMinify[jsFile] = content;
                    combinedJS += `\n/* ${jsFile} */\n${content}\n`;
                }

                processedFiles++;
                console.log(chalk.gray(`  ✓ Procesado: ${jsFile}`));
            } else {
                console.log(chalk.yellow(`  ⚠️  No encontrado: ${jsFile}`));
            }
        }

        if (combinedJS) {
            console.log(chalk.blue('🔧 Minificando JavaScript...'));

            // Minificar el JavaScript combinado
            const minified = UglifyJS.minify(combinedJS, {
                compress: {
                    drop_console: false, // Mantener console.log para debugging
                    drop_debugger: true,
                    pure_funcs: ['console.debug']
                },
                mangle: {
                    reserved: ['$', 'jQuery', 'lightbot'] // Preservar nombres importantes
                },
                output: {
                    comments: /^!/
                }
            });

            if (minified.error) {
                console.error(chalk.red('❌ Error minificando JavaScript:'), minified.error);
                process.exit(1);
            }

            // Escribir archivo minificado
            const outputFile = path.join(deployJSDir, 'lightbot.min.js');
            await fs.writeFile(outputFile, minified.code);

            // También copiar los archivos SWF necesarios
            const swfFiles = ['Jplayer.swf'];
            for (const swfFile of swfFiles) {
                const sourcePath = path.join(developJSDir, swfFile);
                const targetPath = path.join(deployJSDir, swfFile);

                if (await fs.pathExists(sourcePath)) {
                    await fs.copy(sourcePath, targetPath);
                    console.log(chalk.gray(`  ✓ Copiado: ${swfFile}`));
                }
            }

            const stats = await fs.stat(outputFile);
            const originalSize = Buffer.byteLength(combinedJS, 'utf8');
            const compressionRatio = ((1 - (stats.size / originalSize)) * 100).toFixed(1);

            console.log(chalk.green(`✅ JavaScript construido exitosamente`));
            console.log(chalk.gray(`   📁 ${processedFiles} archivos procesados`));
            console.log(chalk.gray(`   📊 Tamaño original: ${(originalSize / 1024).toFixed(2)}KB`));
            console.log(chalk.gray(`   📊 Tamaño minificado: ${(stats.size / 1024).toFixed(2)}KB`));
            console.log(chalk.gray(`   🗜️  Compresión: ${compressionRatio}%`));
            console.log(chalk.gray(`   🎯 Guardado en: ${path.relative(process.cwd(), outputFile)}`));
        } else {
            console.log(chalk.yellow('⚠️  No se encontraron archivos JS para procesar'));
        }

    } catch (error) {
        console.error(chalk.red('❌ Error construyendo JavaScript:'), error.message);
        process.exit(1);
    }
}

buildJS();