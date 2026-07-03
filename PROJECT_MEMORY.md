# Memoria del Proyecto: Tercer Tiempo

Este documento sirve como registro de las decisiones de diseño, arquitectura técnica y componentes desarrollados para la plataforma web de **Tercer Tiempo** (Sports Bar Premium).

## 1. Stack Tecnológico
- **Framework:** Next.js (App Router)
- **Estilos:** Tailwind CSS v4 (Configurado mediante variables CSS en `globals.css`)
- **3D:** `@react-three/fiber`, `@react-three/drei` y `three.js`
- **Iconografía:** `lucide-react`

## 2. Principios de Diseño
- **Estética:** Premium, inmersiva, moderna y fotorealista.
- **Paleta de Colores:**
  - *Fondo Principal:* Negro profundo (`#0A0A0A`).
  - *Acento Principal:* Naranja Neón (`#FF4500`), usado en botones, textos destacados y halos de luz.
  - *Acento Secundario:* Naranja Suave (`#FF6B00`).
  - *Textos:* Blanco (`#FFFFFF`) y grises apagados (`#A0A0A0`, `#5A5A5A`).
- **Tipografía:** Fuerte y deportiva para los títulos (`font-title font-black`).

## 3. Componentes Principales Desarrollados

### 3.1. Hero Section (`HeroSection.tsx`)
- **Estructura:** Layout dividido. Izquierda para textos de alto impacto (título, descripción, botones) y derecha para el interactivo 3D y las tarjetas de experiencia.
- **Mejoras visuales:** 
  - Gradiente negro superpuesto a la imagen de fondo en el lado izquierdo (`bg-gradient-to-r from-black/90 via-black/40 to-transparent`) para garantizar la legibilidad perfecta de los textos.
  - **Tarjetas de Experiencia:** Convertidas en elementos con fondo de imagen (generadas por IA), degradados oscuros para leer el texto, y efectos hover de zoom y brillo.
  - **Indicador Interactivo:** Texto "GIRA EL BALÓN" con un icono de mouse rebotando (`animate-bounce`), perfectamente centrado con el balón 3D (ajustado con `-translate-x-[15px]`).

### 3.2. Balón 3D Premium (`Football3D.tsx`)
El corazón visual interactivo de la página de inicio. Se construyó desde cero evitando UV mapping estándar para que no se deformara, utilizando matemáticas puras:
- **Material Base (Shader Personalizado):** 
  - Utiliza la matemática de un **icosaedro truncado** (20 hexágonos, 12 pentágonos) calculado en el `fragmentShader`.
  - **Colores puros:** Hexágonos blanco puro (`vec3(1.0, 1.0, 1.0)`) y pentágonos negros oscuros (`vec3(0.06, 0.06, 0.07)`).
  - **Iluminación Mate:** Se eliminó el reflejo especular (`spec = 0.0`) para dar un aspecto mate premium. La luz ambiente se subió a `0.45` y la difusa a `0.75` (limitada a `1.0` máximo) para lograr unos paneles blancos súper brillantes.
- **Halos Neón:**
  - Dos esferas detrás del balón con `AdditiveBlending`. Una suave (`opacity: 0.15`) y una intensa (`opacity: 0.4`), ambas configuradas exactamente con el color naranja de la marca (`#FF4500`).
- **Logos con Neón (Shader de Decal):**
  - Se proyectaron dos logos (`<Decal>`) frente y atrás.
  - **Shader Neón:** En lugar de un material estándar, se programó un shader de fragmento que:
    1. Lee el canal alfa del logo.
    2. Rellena el centro de color negro mate (`vec3(0.02)`).
    3. Aplica un cálculo de desenfoque (blur) a los bordes transparentes.
    4. Colorea ese desenfoque exterior con un resplandor naranja luminoso (`vec3(1.0, 0.27, 0.0) * 2.5`), integrándolo perfectamente con el halo trasero y el botón de acción.

### 3.3. Bento Grid & Galería (`WorldGallerySection.tsx`)
- Modificado para usar fotografías fotorrealistas en lugar de simples íconos grises.
- Las imágenes cubren cada recuadro (Bar Central, Sala VIP, Platos Premium, Tienda Oficial).
- Espaciado inferior (`pb-[25px]`) ajustado milimétricamente.

### 3.4. Experiencia Premium (`PremiumExperienceSection.tsx`)
- Se reemplazó el marcador de posición por la imagen principal `premium_experience.png` (amigos celebrando).
- Incluye el logo translúcido en la esquina y efectos de sombra (`shadow-2xl`) y escalado on-hover.
- Espaciado superior del módulo de Partidos (`MatchesSection.tsx`) ajustado a `pt-[25px]`. Esto logra una distancia exacta de **50 píxeles** de separación con la galería, dándole aire y estructura matemática al diseño.

## 4. Assets Gráficos (IA)
Todas las siguientes imágenes fueron generadas en alta calidad fotorealista y almacenadas en la carpeta `public/`:
- `pantalla_gigante.png`
- `sala_vip.png`
- `tienda_futbolera.png`
- `gallery_bar_central.png`
- `gallery_sala_vip.png`
- `gallery_platos.png`
- `gallery_tienda.png`
- `premium_experience.png`

## 5. Pendientes y Próximos Pasos (To-Do)
*(Agrega aquí cualquier idea futura, optimización móvil específica o integraciones de backend que el proyecto requiera)*.
