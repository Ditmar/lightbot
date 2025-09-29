@echo off
echo ========================================
echo  LightBot Game - Build Process
echo ========================================
echo.

echo Instalando dependencias de desarrollo...
npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)

echo.
echo Ejecutando build...
npm run build

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  ✅ BUILD COMPLETADO EXITOSAMENTE
    echo ========================================
    echo.
    echo Archivos generados en la carpeta 'deploy':
    echo   - css/lightbot.min.css
    echo   - js/lightbot.min.js  
    echo   - index.html
    echo   - build-info.json
    echo   - manifest.json
    echo.
    echo Para ejecutar el servidor:
    echo   Producción: npm start
    echo   Desarrollo: npm run dev
    echo.
) else (
    echo.
    echo ❌ Error durante el build
    echo Por favor revisa los errores arriba
)

pause