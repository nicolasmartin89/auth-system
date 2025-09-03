@echo off
setlocal enabledelayedexpansion

REM === Detectar el provider en schema.prisma ===
set DB_PROVIDER=
for /f "tokens=2 delims==" %%i in ('findstr /R "provider *=*" prisma\schema.prisma') do (
    set DB_PROVIDER=%%i
)

REM Quitar espacios y comillas
set DB_PROVIDER=%DB_PROVIDER: =%
set DB_PROVIDER=%DB_PROVIDER:"=%

echo ==========================================================
echo  Reiniciando base de datos para el proyecto Prisma
echo  Provider detectado: %DB_PROVIDER%
echo ==========================================================

if "%DB_PROVIDER%"=="sqlite" (
    echo 🔹 Usando SQLite: borrando base de datos y migraciones...
    if exist prisma\db\dev.db del /F prisma\db\dev.db
    if exist prisma\migrations rmdir /S /Q prisma\migrations

    echo 🔹 Creando nueva migración...
    npx prisma migrate dev --name init

    echo 🔹 Generando cliente Prisma...
    npx prisma generate

    echo 🔹 Ejecutando seed...
    npm run seed

    echo ✅ Base de datos SQLite reiniciada correctamente.
    pause
    
)

if "%DB_PROVIDER%"=="postgresql" (
    echo 🔹 Usando Postgres/Neon: reseteando la base de datos...
    npx prisma migrate reset --force

    echo 🔹 Aplicando nuevas migraciones...
    npx prisma migrate dev --name init

    echo 🔹 Generando cliente Prisma...
    npx prisma generate

    echo 🔹 Ejecutando seed...
    npm run seed

    echo ✅ Base de datos Postgres/Neon reiniciada correctamente.
    pause
    exit /b
)

echo ⚠️ Provider desconocido. Revisa tu prisma\schema.prisma
pause
