# ⚾ Sport Click Stats

**Sport Click Stats** es una plataforma web profesional, moderna, modular y de alto rendimiento diseñada para la anotación oficial de partidos de béisbol y sóftbol en tiempo real, conforme a los estándares de la **WBSC (World Baseball Softball Confederation)** y el béisbol profesional organizado.

---

## 🚀 Inicio Rápido

Tienes 3 formas sencillas de ejecutar la aplicación:

### Opción 1: Un solo clic (Recomendada en Windows)
Haz doble clic sobre el archivo:
```bash
start_app.bat
```
Esto abrirá de inmediato tu navegador en `http://localhost:3000` ejecutando el servidor local de Node.js (o directamente `index.html`).

### Opción 2: Mediante Node.js
En la terminal o PowerShell:
```bash
node server.js
```
Abre tu navegador en `http://localhost:3000`.

### Opción 3: Directamente en el navegador
Haz doble clic sobre:
```text
index.html
```
La aplicación funciona sin servidores externos, sin configuraciones complejas y sin problemas de dependencias.

---

## 🎨 1. Identidad y Diseño Visual (UI/UX)
- **Tipografía:** Poppins (Google Fonts: 400, 500, 600, 700, 800) con fallback sans-serif limpio.
- **Estética RGB Gaming Sobrio:**
  - **Modo Oscuro (Predeterminado):** Fondo base en `#0B0E14`, tarjetas y superficies en `#121721` y `#181F2C`, bordes sutiles en `#222B3D`.
  - **Acentos RGB:** Cian suave (`#00F2FE`), Violeta digital (`#7928CA` / `#8B5CF6`), Esmeralda (`#10B981`), Carmesí (`#F43F5E`) y Ámbar (`#F59E0B`). Glows y degradados lineales tenues.
  - **Modo Claro (Toggle):** Fondos en `#F3F4F6`, paneles en `#FFFFFF`, bordes en `#E2E8F0`, textos en carbón `#111827`, conservando el contraste de alto rendimiento.
- **Layout:** Formato **Bento Grid** adaptado para tablets de 10"+ (iPad / Android), laptops, estaciones de trabajo y teléfonos móviles.

---

## 👥 2. Sistema de Usuarios, Autenticación y Perfil
- **Acceso Rápido Demo:** Botón de un toque para acceder de inmediato como *"Lic. Carlos Mendoza - Anotador Oficial WBSC Internacional"*.
- **Formulario de Registro/Login:** Captura de Nombre Completo, Credencial/Licencia oficial de anotador y Email.
- **Perfil de Anotador:** Modal con avatar dinámico, credencial y contadores acumulativos en tiempo real:
  - 📊 Partidos anotados.
  - ⏱️ Total de innings registrados.
  - 🎯 Total de jugadas procesadas.
- **Historial de Partidos (Guardado y Reanudación):**
  - Botón **"Guardar Partido"** en cualquier momento + Autoguardado continuo en `LocalStorage`.
  - Modal **"Historial de Juegos"** con tarjetas de partidos previos (equipos, logos, carreras, entradas, estado).
  - Capacidad de **Reanudar** cualquier juego previo recuperando íntegramente marcador, corredores, rosters, estadísticas y play-by-play, o **Eliminarlo**.

---

## ⚾ 3. Creación de Partidos y Configuración de Rosters / Lineup
La barra superior cuenta con dos herramientas directas para gestionar los juegos del día:

### ➕ Nuevo Partido del Día
Permite registrar cualquier encuentro desde cero con su formulario interactivo:
* **Metadatos:** Torneo/Liga (ej. Liga Municipal, Doble A, Torneo Regional), Sede/Estadio, Fecha y número de entradas oficiales (9 entradas para adultos o 7 entradas para sóftbol/categorías menores).
* **Equipo Visitante:** Ciudad o prefijo, Nombre del equipo, Abreviatura (ej. `ZUL`), Color primario identificativo y Logo/Emoji (ej. 🦅).
* **Equipo Home Club:** Ciudad o prefijo, Nombre del equipo, Abreviatura (ej. `LAR`), Color primario identificativo y Logo/Emoji (ej. 🐦).
* **Flujo Fluido:** Al pulsar *"Crear Partido y Configurar Lineup ➡️"*, el sistema inicializa el marcador y abre de forma inmediata el Gestor de Rosters.

### 👥 Gestor de Rosters, Batería y Lineup (1 al 9)
Accesible durante la creación del juego o en cualquier momento con el botón `👥 Rosters / Lineup`:
* **Pestañas por Equipo:** Alterna rápidamente entre `Visitante` y `Home Club`.
* **Batería Titular:**
  * **Lanzador Abridor (SP):** Nombre, Dorsal/Número y Mano de lanzar (`Derecho - R` o `Zurdo - L`).
  * **Receptor Titular (C):** Nombre y Dorsal/Número.
* **Orden al Bate Titular (1 al 9):**
  * Tabla con orden del 1 al 9, campo para nombre del jugador, dorsal y lista desplegable de posición defensiva (`CF`, `2B`, `3B`, `C`, `RF`, `1B`, `SS`, `LF`, `DH`, `P`).
* **Botón de Carga Rápida:** Botón *"⚡ Cargar Nombres de Ejemplo"* para rellenar instantáneamente una alineación competitiva.
* **Banca y Sustitutos (Reservas):**
  * Tabla interactiva para gestionar los jugadores de reserva del equipo.
  * Formulario para añadir sustitutos manualmente con Nombre, Dorsal, Rol (`PH`, `PR`, `RP`, `C`, `INF`, `OF`) y Mano.
  * Botón *"⚡ Cargar Sustitutos de Ejemplo"* para poblar la banca al instante.
* **Guardado Asistido:** Al guardar la alineación del Visitante, el sistema conmuta automáticamente al Home Club para completar ambas alineaciones con rapidez.

### 🔄 Sustituciones en Vivo y 📍 Checkpoints
* **Realizar Sustitución en Vivo:** Botón `🔄 Sustitución` en la Mesa de Anotación para ejecutar:
  * **Bateador Emergente (PH):** Entra a batear en el turno actual.
  * **Corredor Emergente (PR):** Reemplaza a un corredor en base (1B, 2B o 3B).
  * **Cambio de Lanzador (RP):** Relevo en la lomita.
  * **Cambio Defensivo:** Modificación posicional.
  * Registro narrativo automático en el *play-by-play* y actualización de estadísticas.
* **Puntos de Control (Checkpoints):** Botones `📍 Guardar Checkpoint` y `🗂️` en la Mesa de Anotación para guardar instantáneas del juego con notas personalizadas y poder restaurar el marcador y las bases a ese momento exacto ante cualquier duda o revisión.

---

## ⚡ 4. Arquitectura de Anotación Dual
Conmutador visible en la barra superior para alternar en cualquier momento:

1. **Modo Rápido (Turno por Turno / Recomendado):**
   - Oculta el pitch tracker y agiliza la captura con botones de desenlace inmediato organizados por color:
     - **Hits (Esmeralda/Cian):** `1B (Sencillo)`, `2B (Doble)`, `3B (Triple)`, `HR (Jonrón)`.
     - **Outs (Carmesí/Rojo):** `K (Ponche)`, `GO (Rolling)`, `FO (Fly Out)`, `LO (Línea)`, `FC (Fielder's Choice)`.
     - **Avances/Otros (Ámbar/Violeta):** `BB (Boleto)`, `IBB (Intencional)`, `HBP (Golpeado)`, `E (Error)`.
   - Procesa automáticamente el avance de corredores, carreras impulsadas, outs, cambio de media entrada (a los 3 outs) y rotación al siguiente bateador.
2. **Modo Detallado (Pintada / Pitch-by-Pitch):**
   - Panel de conteo de pitcheos del lanzador activo.
   - Cuadrícula interactiva de **9 cuadrantes (Zona de Strike 3x3)** + zonas exteriores (Alta, Baja, Adentro, Afuera).
   - Botones dedicados: Bola fuera (+1 Bola), Strike Cantado, Strike Abanicado, Foul Ball (+1 Strike hasta 2 strikes).
   - Bola 4 dispara automáticamente boleto (BB); Strike 3 dispara ponche (K).
   - Marcadores visuales numerados sobre la zona con el tipo de lanzamiento.

---

## 💎 4. Visualizador de Campo y Corredores
- Diamante SVG interactivo con arco de tierra, grama interior, líneas de cal, montículo y las 4 almohadillas.
- Almohadillas con iluminación dinámica (glow ámbar) cuando están ocupadas, mostrando nombre y dorsal del corredor.
- Botones contextuales rápidos para eventos de bases:
  - 🏃 `+SB (Robo de Base)`: Avanza al corredor y suma robo permitido al receptor.
  - 🧤 `+CS (Atrapado Robando)`: Registra out al corredor y suma CS al receptor activo.
  - ⚠️ `+PB (Pasbol)`: Avanza corredores y registra Pasbol al receptor.
  - 💨 `+WP (Wild Pitch)`: Avanza corredores y registra lanzamiento salvaje al lanzador.
  - 🎯 `+Pickoff`: Viraje defensivo y out a la almohadilla.
  - 🧹 `Limpiar`: Restablece corredores.

---

## 📊 5. Panel de Estadísticas Especializadas
Pestañas dinámicas para monitoreo en vivo:

1. **Estadísticas de Lanzadores:**
   - Columnas: Nombre, Dorsal, Mano (`R`/`L`), **IP** (Entradas lanzadas con decimales oficiales: .1, .2, .0), **H** (Hits), **C** (Carreras totales), **CL** (Carreras limpias), **BB** (Boletos), **K/SO** (Ponches), **HR** (Jonrones permitidos), **PC** (Conteo de pitcheos), **ERA en vivo** ($9 \times CL / IP$) y **WHIP** ($(BB + H) / IP$).
2. **Estadísticas de Receptores (Catchers):**
   - Columnas: Nombre, Dorsal, Innings detrás del plato, **CS** (Caught Stealing), **SB** (Bases robadas permitidas), **CS%** ($CS / (CS + SB) \times 100$), **PB** (Passed Balls), **E** (Errores) y **CERA** (Efectividad del pitcheo bajo su conducción: $9 \times CL_{equipo} / IP_{catcher}$).
   - Botones rápidos de batería: `+CS`, `+SB`, `+PB`.
3. **Box Score Tradicional:**
   - Tabla Inning por Inning (Line Score del 1 al 9 con C, H, E).
   - Tablas completas de bateo para ambos equipos: AB, C, H, 2B, 3B, HR, CI (RBI), BB, SO, AVG, OBP, SLG.
4. **Jugada a Jugada Completo:**
   - Bitácora cronológica con etiquetas de entrada, tipo de jugada y hora exacta.
   - Botón **↩️ Deshacer (Undo)** para corregir cualquier jugada anotada por error.

---

## 🌐 6. Módulo de Importación de Liga (URL & Scraping Simulator)
- Entrada de URL oficial de torneos o ligas federadas.
- **4 Plantillas Simuladas Inmediatas:**
  - 🇻🇪 **LVBP:** Leones del Caracas vs. Navegantes del Magallanes
  - 🇺🇸 **MLB:** New York Yankees vs. Los Angeles Dodgers
  - 🌐 **WBSC:** Japón (Samurai Japan) vs. República Dominicana
  - 🇲🇽 **LMB:** Diablos Rojos del México vs. Tigres de Quintana Roo
- Animación interactiva de extracción de datos con barra de progreso y registros en consola ("Conectando a API...", "Extrayendo colores y logos...", "Parseando rosters...", "Configurando batería...").

---

## 📄 7. Exportación y Reportes
- **Exportar Box Score en JSON:** Descarga un archivo `.json` estructurado con metadatos del juego, rosters, bateadores, lanzadores, receptores y registro jugada a jugada.
- **Exportar en PDF / Impresión Oficial:** Hoja oficial en blanco y negro de alto contraste con cabecera de la WBSC, tabla de carreras por entradas y desglose de bateo, pitcheo y receptoría lista para guardar como PDF o imprimir.

---

## 📁 Estructura del Proyecto
```text
App anotación beisbol/
│
├── index.html              # Estructura principal y Bento Grid de la aplicación
├── server.js               # Servidor HTTP ultraligero de Node.js (cero dependencias)
├── start_app.bat           # Lanzador directo de un clic para Windows
├── README.md               # Documentación técnica completa
│
├── css/
│   └── styles.css          # Sistema de diseño, temas Dark/Light, Bento Grid y estilos de impresión
│
├── js/
│   ├── app.js              # Controlador principal y gestión de eventos de UI
│   ├── baseballRules.js    # Motor de reglas oficiales WBSC y cálculo de estadísticas avanzadas
│   ├── mockLeagues.js      # Base de datos preconfigurada (LVBP, MLB, WBSC, LMB)
│   └── storage.js          # Persistencia en LocalStorage (sesión, métricas de anotador, historial)
│
└── materiales/             # Carpeta dedicada para recursos, logos, manuales y notas
```
