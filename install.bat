@echo off
echo Instalando dependencias de LightBot Game Server...
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✓ Dependencias instaladas exitosamente
    echo.
    echo Para ejecutar el servidor:
    echo   Desarrollo:  npm run dev
    echo   Produccion:  npm start
    echo.
    pause
) else (
    echo.
    echo ✗ Error al instalar dependencias
    echo Por favor revisa los errores arriba
    pause
)