@echo off
title Sport Click Stats - Anotador Oficial de Beisbol
echo ==============================================================
echo       ⚾ SPORT CLICK STATS - ANOTADOR PROFESIONAL ⚾
echo ==============================================================
echo Iniciando servidor web local...
start http://localhost:3000
node server.js
if %errorlevel% neq 0 (
    echo.
    echo Node.js no se detecto o hubo un problema. Abriendo index.html directamente...
    start index.html
)
pause
