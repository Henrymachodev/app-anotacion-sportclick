# Guía Rápida de Simbología y Fórmulas - Sport Click Stats

Esta carpeta contiene materiales de apoyo y referencias para la anotación oficial de béisbol.

## 1. Simbología Oficial de Béisbol
- **1B:** Sencillo (Single).
- **2B:** Doble (Double).
- **3B:** Triple (Triple).
- **HR:** Jonrón (Home Run).
- **K:** Ponche tirándole (Strikeout Swinging).
- **ꓘ:** Ponche mirando (Strikeout Looking).
- **GO:** Ground Out (Rolling al cuadro).
- **FO:** Fly Out (Elevado al jardín).
- **LO:** Line Out (Línea directa).
- **FC:** Fielder's Choice (Jugada de Selección).
- **BB:** Base por Bolas (Base on Balls).
- **IBB:** Base por Bolas Intencional (Intentional Walk).
- **HBP:** Golpeado por el Lanzamiento (Hit by Pitch).
- **E:** Error a la Defensiva.
- **SB:** Robo de Base (Stolen Base).
- **CS:** Atrapado Robando (Caught Stealing).
- **PB:** Pasbol (Passed Ball - receptor).
- **WP:** Wild Pitch (Lanzamiento Desviado - lanzador).

---

## 2. Fórmulas Oficiales Implementadas
- **ERA (Efectividad en vivo):**
  $$\text{ERA} = \frac{9 \times \text{CL}}{\text{IP}}$$
  *(Donde $\text{CL}$ = Carreras Limpias, $\text{IP}$ = Entradas lanzadas en formato decimal).*

- **WHIP (Bases y hits por entrada):**
  $$\text{WHIP} = \frac{\text{BB} + \text{H}}{\text{IP}}$$

- **CS% (Porcentaje de corredores atrapados en robo):**
  $$\text{CS\%} = \frac{\text{CS}}{\text{CS} + \text{SB}} \times 100\%$$

- **CERA (Efectividad del receptor):**
  $$\text{CERA} = \frac{9 \times \text{CL}_{\text{equipo}}}{\text{IP}_{\text{catcher}}}$$

- **AVG (Promedio de Bateo):**
  $$\text{AVG} = \frac{\text{H}}{\text{AB}}$$

- **OBP (Porcentaje de Embasado):**
  $$\text{OBP} = \frac{\text{H} + \text{BB} + \text{HBP}}{\text{AB} + \text{BB} + \text{HBP} + \text{SF}}$$

- **SLG (Promedio de Slugging):**
  $$\text{SLG} = \frac{1\text{B} + 2 \times 2\text{B} + 3 \times 3\text{B} + 4 \times \text{HR}}{\text{AB}}$$
