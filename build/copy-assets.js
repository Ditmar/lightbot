const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function copyAssets() {
    console.log(chalk.blue('📋 Copiando assets...'));

    const developDir = path.join(process.cwd(), 'www', 'develop');
    const mediaDir = path.join(process.cwd(), 'www', 'media');
    const deployDir = path.join(process.cwd(), 'deploy');

    try {
        // Copiar imágenes
        const imgSource = path.join(developDir, 'img');
        const imgTarget = path.join(deployDir, 'img');

        if (await fs.pathExists(imgSource)) {
            await fs.copy(imgSource, imgTarget);
            console.log(chalk.gray(`  ✓ Copiadas imágenes`));
        }

        // Copiar media (audio y video)
        const mediaTarget = path.join(deployDir, 'media');

        if (await fs.pathExists(mediaDir)) {
            await fs.copy(mediaDir, mediaTarget);
            console.log(chalk.gray(`  ✓ Copiados archivos multimedia`));
        }

        // Crear index.html optimizado para producción
        await createProductionHTML();

        console.log(chalk.green(`✅ Assets copiados exitosamente`));

    } catch (error) {
        console.error(chalk.red('❌ Error copiando assets:'), error.message);
        process.exit(1);
    }
}

async function createProductionHTML() {
    console.log(chalk.blue('📝 Generando index.html de producción...'));

    const htmlTemplate = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>LightBot v0.9</title>
    <link rel="shortcut icon" href="img/favicon.ico" />
    <link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css' />
    <link href='http://fonts.googleapis.com/css?family=Lato:400,900' rel='stylesheet' type='text/css' />
    <link type="text/css" href="css/lightbot.min.css" rel="stylesheet" />
    <script type="text/javascript" src="js/lightbot.min.js"></script>
  </head>
  <body>
    <div id="audioContainer">
      <div id="audioPlayer"></div>
    </div>

    <div id="lightbot">

      <div id="welcomeScreen" class="ui-screen">
        <button class="helpButton">Ayuda</button>
        <button class="achievementsButton">Logros</button>
        <button class="levelSelectButton ui-state-highlight">Comenzar Juego</button>
        <button class="audioToggleButton">Alternar Audio</button>
      </div>

      <div id="achievementsScreen" class="ui-screen ui-helper-hidden">
        <h1>Logros</h1>
        <ul id="achievementsList">
        </ul>
        <button class="mainMenuButton">Menú Principal</button>
      </div>

      <div id="helpScreen" class="ui-screen ui-helper-hidden">
        <div id="helpScreenAccordionContainer">
          <div id="helpScreenAccordion">
            <h3><a href="#goal">Objetivo del juego</a></h3>
            <div>
              <p>
              Para completar el juego, debes decirle al robot cómo iluminar todas las baldosas de luz en un nivel determinado. Sin embargo, tu única forma de interactuar con el robot es ensamblando instrucciones en un programa que el robot puede ejecutar.
              </p>
            </div>
            <h3><a href="#howto">Cómo jugar</a></h3>
            <div>
              <p>
              Puedes crear un programa arrastrando instrucciones desde la lista de instrucciones y soltándolas en el marco del programa. Las instrucciones se agregarán automáticamente en la parte inferior del bloque resaltado.
              </p>
              <p>Ejecuta tu programa haciendo clic en el botón Ejecutar. Si no estás satisfecho con tu programa actual, puedes interrumpir la ejecución en cualquier momento haciendo clic en el botón Detener. Esto reiniciará el robot a su posición inicial.
              </p>
            </div>
            <h3><a href="#objects">Objetos del juego</a></h3>
            <div>
              <p>
              Un nivel está compuesto por baldosas grises que tienen cierta altura. Baldosas especiales de <em>luz</em> están esparcidas por todo el nivel. Estas baldosas de luz pueden ser azules, lo que significa que están apagadas, o pueden ser amarillas, lo que significa que están encendidas. Si en algún momento todas las baldosas de luz en un nivel están encendidas, habrás completado ese nivel.
              </p>
            </div>
            <h3><a href="#walk_forward">Instrucción: caminar hacia adelante</a></h3>
            <div>
              <p>
              Al caminar hacia adelante, el robot avanzará un cuadro en la dirección que esté mirando actualmente. Este movimiento solo se realizará si el espacio al que se dirige tiene la misma altura que el cuadro del que se está moviendo. En cualquier otro caso, el movimiento no se realizará.
              </p>
            </div>
            <h3><a href="#turn_right">Instrucción: Girar 90&deg; a la derecha</a></h3>
            <div>
              <p>
              Al girar 90&deg; a la derecha, el robot permanecerá en su lugar y girará 90&deg; (un cuarto de vuelta) a la derecha (en el sentido de las agujas del reloj).
              </p>
            </div>
            <h3><a href="#turn_left">Instrucción: Girar 90&deg; a la izquierda</a></h3>
            <div>
              <p>
              Al girar 90&deg; a la izquierda, el robot permanecerá en su lugar y girará 90&deg; (un cuarto de vuelta) a la izquierda (en sentido contrario a las agujas del reloj).
              </p>
            </div>
            <h3><a href="#jump">Instrucción: Saltar</a></h3>
            <div>
              <p>
              Saltar es una combinación de un movimiento hacia adelante y un cambio de altura. La dirección del movimiento es en la dirección en la que el robot está mirando. Un salto hacia arriba solo será exitoso si la baldosa de destino es más alta en exactamente un paso que la baldosa inicial. Si la diferencia de altura es mayor que uno, el salto no será exitoso y no se realizará ningún movimiento. Al saltar hacia abajo, no hay límite para la altura desde la que el robot puede saltar hacia abajo. La única condición es que la diferencia de altura sea de al menos uno.
              </p>
            </div>
            <h3><a href="#light">Instrucción: Iluminar</a></h3>
            <div>
              <p>
              La instrucción de iluminar se puede usar para alternar las baldosas de luz encendidas o apagadas. Si el robot está ubicado en una baldosa de luz apagada cuando se ejecuta la instrucción de iluminar, la baldosa de luz se encenderá. Sin embargo, si el robot está ubicado en una baldosa de luz ya encendida, esa baldosa de luz se apagará. Cuando el robot está ubicado en una baldosa normal, no sucede nada.
              </p>
            </div>
            <h3><a href="#repeat">Instrucción: Repetir</a></h3>
            <div>
              <p>
              La instrucción de repetir es una instrucción especial que se puede usar para repetir algunas instrucciones un cierto número de veces. La instrucción de repetir tiene un marco especial donde puedes soltar instrucciones desde la lista de instrucciones. También tiene un contador donde puedes definir el número de veces que se repetirán las instrucciones dentro de la instrucción de repetir. Incluso es posible colocar una instrucción de repetir dentro de otra, lo cual es esencial para crear programas muy pequeños.
              </p>
            </div>
            <h3><a href="#medals">Medallas</a></h3>
            <div>
              <p>
              Las medallas se otorgan por completar niveles con solo una pequeña cantidad de instrucciones. A veces, estos programas pequeños hacen que el robot ejecute muchas instrucciones inútiles, lo cual es muy ineficiente y toma mucho tiempo. Ten en cuenta que en la informática, el <em>mejor</em> programa no es el que <em>contiene</em> la menor cantidad de instrucciones, sino el que hace que el robot <em>ejecute</em> la menor cantidad de instrucciones.
              </p>
            </div>
          </div>
        </div>
        <div id="helpScreenVerticalBar"></div>
        <div id="videoContainer" class="jp-video jp-video-300p">
          <div class="jp-type-single">
            <div id="videoPlayer" class="jp-jplayer"></div>
            <div class="jp-gui">
              <div class="jp-video-play">
                <a href="javascript:;" class="jp-video-play-icon" tabindex="1">reproducir</a>
              </div>
              <div class="jp-interface">
                <div class="jp-progress">
                  <div class="jp-seek-bar">
                    <div class="jp-play-bar"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="mainMenuButton">Menú Principal</button>
      </div>

      <div id="levelSelectScreen" class="ui-screen ui-helper-hidden">
        <h1>Seleccionar Nivel</h1>
        <ul id="levelList">
        </ul>
        <button class="mainMenuButton">Menú Principal</button>
      </div>

      <div id="gameScreen" class="ui-screen ui-helper-hidden">
        <div id="canvasContainer">
          <canvas id="gameCanvas" width="690" height="666"></canvas>
        </div>
        <div id="buttonContainer">
          <button class="levelSelectButton">Atrás</button>
          <button class="audioToggleButton">Alternar Audio</button>
          <button id="clearButton">Limpiar</button>
          <button id="runButton">Ejecutar</button>
        </div>
        <div id="instructionsContainer">
          <h2>Instrucciones</h2>
          <div>
            <ul>
                <li><p class="walk"><span class="ui-icon ui-icon-arrowthick-1-n" style="float: left;"></span>Caminar hacia adelante<span class="ui-icon ui-icon-close" style="float: right;"></span></p></li>
                <li><p class="turnRight"><span class="ui-icon ui-icon-arrowreturnthick-1-w flip" style="float: left;"></span>Girar 90&deg; a la derecha<span class="ui-icon ui-icon-close" style="float: right;"></span></p></li>
                <li><p class="turnLeft"><span class="ui-icon ui-icon-arrowreturnthick-1-w" style="float: left;"></span>Girar 90&deg; a la izquierda<span class="ui-icon ui-icon-close" style="float: right;"></span></p></li>
                <li><p class="jump"><span class="ui-icon ui-icon-arrowthickstop-1-n" style="float: left;"></span>Saltar<span class="ui-icon ui-icon-close" style="float: right;"></span></p></li>
                <li><p class="light"><span class="ui-icon ui-icon-lightbulb" style="float: left;"></span>Iluminar<span class="ui-icon ui-icon-close" style="float: right;"></span></p></li>
                <li><p class="repeat"><span class="ui-icon ui-icon-refresh" style="float: left;"></span>Repetir <span><input type="number" min="1" max="99" step="1" value="2"> veces</span><span class="ui-icon ui-icon-close" style="float: right;"></span></p>
                  <div class="droppable">
                    <div class="ui-widget-content">
                      <ul>
                        <li class="placeholder"><p class="placeholder">Suelta tus instrucciones aquí</p></li>
                      </ul>
                    </div>
                  </div>
                </li>
            </ul>
          </div>
        </div>
        <div id="programContainer">
          <h2>Programa</h2>
          <div class="droppable">
            <ul>
            </ul>
          </div>
        </div>
      </div>

      <div id="credits2">
        <div style="float:left;"></div>
        <div style="float:right;"></div>
      </div>
    </div>

    <div id="dialogs">
      <div id="levelCompleteDialog" title="Nivel completado">
        <p>
          <span class="medal" style="float:left; margin:0 7px 50px 0;"></span>
          ¡Felicidades! ¡Has completado este nivel usando <span class="nbrOfInstructions"></span> instrucciones!
        </p>
        <p class="message" style="margin-top: 10px"></p>
      </div>

      <div id="achievementDialog" title="¡Logro desbloqueado!">
        <p>
          <span class="achievement" style="float:left; margin:0 7px 50px 0;"></span>
          <span class="message"></span>
        </p>
      </div>
    </div>
  </body>
</html>`;

    const outputPath = path.join(process.cwd(), 'deploy', 'index.html');
    await fs.writeFile(outputPath, htmlTemplate);
    console.log(chalk.gray(`  ✓ Generado index.html de producción`));
}

copyAssets();