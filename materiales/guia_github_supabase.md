# 🚀 Guía de Puesta en Producción: GitHub y Supabase Cloud

Esta guía detalla los pasos exactos para subir **Sport Click Stats** a un repositorio en **GitHub** y conectar su base de datos en tiempo real con **Supabase (PostgreSQL)**.

---

## PARTE 1: SUBIR EL PROYECTO A GITHUB

### Método A: Desde la Terminal (si tienes Git instalado)
Abre la terminal o PowerShell en la carpeta del proyecto (`c:\Users\henry\Downloads\App anotación beisbol`):

```bash
# 1. Inicializar el repositorio Git local
git init

# 2. Agregar todos los archivos (el .gitignore ya está configurado)
git add .

# 3. Crear el primer commit
git commit -m "feat: Lanzamiento oficial Sport Click Stats con soporte Supabase"

# 4. Renombrar la rama principal a main
git branch -M main

# 5. Enlazar con tu repositorio de GitHub (reemplaza TU_USUARIO y TU_REPOSITORIO)
git remote add origin https://github.com/TU_USUARIO/sport-click-stats.git

# 6. Subir el proyecto a GitHub
git push -u origin main
```

### Método B: Con GitHub Desktop (Interfaz Visual Recomendada)
1. Descarga e instala **GitHub Desktop** desde [desktop.github.com](https://desktop.github.com) si prefieres una interfaz gráfica.
2. Abre GitHub Desktop y selecciona **File -> Add Local Repository...**
3. Selecciona la carpeta `App anotación beisbol`.
4. Si te indica que no es un repositorio Git, haz clic en **"create a repository"**.
5. Escribe un resumen de commit (ej. *"Versión inicial Sport Click Stats"*) y haz clic en **Commit to main**.
6. Haz clic en el botón superior **"Publish repository"** para subirlo directamente a tu cuenta de GitHub.

### Opcional: Publicar la Web en Vivo con GitHub Pages
1. En tu repositorio en GitHub, ve a **Settings** -> **Pages** (en el menú lateral izquierdo).
2. En **Build and deployment -> Branch**, selecciona la rama `main` y la carpeta `/ (root)`.
3. Haz clic en **Save**.
4. ¡En menos de un minuto tu app estará disponible en una URL pública gratuita tipo: `https://TU_USUARIO.github.io/sport-click-stats/`!

---

## PARTE 2: CONECTAR LA BASE DE DATOS EN LA NUBE (SUPABASE)

Sport Click Stats cuenta con arquitectura **Híbrida Offline-First**: funciona tanto en local (`LocalStorage`) como conectada en tiempo real a la nube de **Supabase**.

### Paso 1: Crear el Proyecto en Supabase
1. Ingresa a [supabase.com](https://supabase.com) e inicia sesión (puedes entrar directamente con tu cuenta de GitHub).
2. Haz clic en el botón verde **"New Project"**.
3. Asigna un nombre a tu proyecto (ej: `sport-click-stats-db`), define una contraseña segura para tu base de datos y selecciona la región más cercana (ej: *East US / São Paulo*).
4. Haz clic en **"Create new project"** y espera ~1-2 minutos mientras se aprovisiona tu base de datos PostgreSQL.

---

### Paso 2: Crear las Tablas y Políticas de Seguridad
Ya dejamos el script SQL listo para ti:

1. En el panel de Supabase, haz clic en **SQL Editor** (ícono de terminal `>_` en la barra lateral izquierda).
2. Haz clic en **"New query"**.
3. Abre el archivo [`materiales/supabase_schema.sql`](./supabase_schema.sql) que hemos creado en este proyecto, copia todo su contenido y pégalo en el editor de Supabase.
4. Haz clic en el botón verde **"Run"** (o presiona `Ctrl + Enter`).
5. Verás el mensaje *"Success. No rows returned"*.
   Esto habrá creado automáticamente:
   - Tabla `games` (partidos completos, marcadores, lineups y estadísticas).
   - Tabla `checkpoints` (puntos de control del juego para restaurar jugadas).
   - Tabla `scorer_profiles` (perfiles de anotador y métricas acumuladas).
   - Políticas de seguridad (RLS) para permitir lectura y guardado con la API Key pública.

---

### Paso 3: Obtener tus Credenciales de API
1. En Supabase, ve a **Project Settings** (ícono de engranaje ⚙️ abajo a la izquierda).
2. Haz clic en el submenú **API**.
3. Copia dos valores:
   - **Project URL:** Algo como `https://abcdefghijklm.supabase.co`
   - **Project API keys (anon / public):** Una cadena larga tipo `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

---

### Paso 4: Conectar la App desde la Interfaz
1. Abre tu aplicación **Sport Click Stats** en el navegador (ejecutando `start_app.bat` o desde tu URL de GitHub Pages).
2. En la barra superior (`top-navbar`), haz clic en el botón **`☁️ Supabase`**.
3. Pega tu **Project URL** y tu **API Key (anon)** en los campos correspondientes.
4. Haz clic en **"🧪 Probar Conexión"**. Verás un mensaje verde de confirmación:
   `✅ ¡Conexión exitosa con Supabase PostgreSQL!`
5. Haz clic en **"💾 Guardar y Conectar"**.
6. El icono de la nube en la barra superior cambiará a **🟢 verde**.

---

## 🎯 ¿CÓMO FUNCIONA LA SINCRONIZACIÓN AUTOMÁTICA?

A partir de este momento:
* Cada vez que se crea un partido, se actualiza un turno, se hace una sustitución o se guarda un **Checkpoint**, los datos se envían automáticamente a tu base de datos en Supabase.
* Si te quedas sin conexión a internet en el estadio, la aplicación sigue funcionando 100% de manera local en `LocalStorage` sin interrumpir la anotación.
* Al recuperar la conexión o abrir la app, los datos se sincronizan con la nube.
