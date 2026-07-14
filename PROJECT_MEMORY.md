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

## 5. Panel de Administración y Backend (Fases A-D)

Contenido y operaciones **100% reales** — sin datos simulados — conectados de forma segura al frontend público vía Server Actions.

- **Auth propia y ligera**: cookies firmadas con `jose` (JWT), hash de password con `bcryptjs`, DAL (`verifySession()`/`requireAdmin()`) revalidado en cada Server Action (no solo en el proxy), `sessionVersion` para poder revocar sesiones, rate-limit de login basado en BD (no en memoria, porque Vercel serverless no comparte memoria entre invocaciones).
- **Base de datos**: Prisma 7 (generador `prisma-client`, salida en `src/generated/prisma`) sobre Postgres. En local corre en un contenedor Docker (`tercertiempo-db`, puerto 5433) — `prisma dev` no funciona en esta máquina.
- **~28 modelos**: `AdminUser`, `SiteSettings` y todo el contenido de marketing (hero, galería, testimonios, partidos, zonas, salas VIP, productos, menú, cowork) más las entidades operativas reales: `Reservation` (unifica mesa/sala/partido), `ProductOrder`, `B2BQuote`, `NewsletterSubscriber`.
- **Server Actions como base** (no rutas API sueltas): Next 16 protege automáticamente contra CSRF por header `Origin`; cada acción exportada arranca con `await requireAdmin()`.
- **Cloudinary** para subida/borrado real de imágenes (`isCloudinaryConfigured()` hace fallback silencioso si no hay credenciales configuradas).
- **Resend** para emails de confirmación transaccionales (opcional, nunca bloquea el flujo si no está configurado).
- **Flujos antes simulados, ahora reales**: reserva de mesa/partido/sala VIP, pedido de tienda con QR real (`qrcode`), cotización B2B con precio recalculado en el servidor (nunca se confía en el total del cliente), newsletter.
- **~30 páginas de admin** bajo `/admin/(dashboard)/...`, con patrón reutilizable: `FormField`, `ImageUploadField`, `DataTable`, `ConfirmDeleteButton`, `StatusSelect`.
- **Logo real** de la marca en login y sidebar del admin (antes placeholder).

## 6. Auditoría de UI por DOM (Mobile + Desktop)

Metodología: muestreo del centro de cada elemento interactivo visible vía `document.elementFromPoint()` (Playwright), comparando contra overlays legítimos (drawers/backdrops `position:fixed`) para no marcar como bug capas de superposición intencionales (ej. fondo cubierto por un drawer abierto).

- **Bug real encontrado y corregido**: `CoworkHero.tsx` en mobile — los CTAs ("Ver Paquetes"/"Cotizar Evento") quedaban tapados por la franja de estadísticas (`absolute bottom-0` sin reservar su propio espacio, colisionando con contenido centrado verticalmente). Solución: sección `flex-col` con la franja en flujo normal.
- **Panel admin sin diseño responsive**: el sidebar fijo (`w-60`, ~240px) nunca colapsaba, causando overflow horizontal severo en todas las páginas autenticadas en mobile (confirmado en dashboard, formularios y listados). Solución: `AdminSidebar.tsx` — drawer off-canvas con botón hamburguesa y backdrop en mobile, sidebar estático desde `md:` en adelante; `min-w-0` en el `<main>` para que tablas anchas scrolleen en su propio contenedor.
- **Salas VIP con flip-card solo por hover**: `SalasSelector.tsx` dependía de `group-hover` para revelar el botón "Reservar Ahora", inalcanzable en dispositivos táctiles reales (no hay hover en touch). Solución: estado `isFlipped` que también responde a tap/click, con `stopPropagation()` en el botón para que no vuelva a girar la tarjeta al reservar.
- **Confirmado sin overlaps reales** (tras las correcciones): 9 páginas públicas, 30 estados de drawers/modales abiertos (reservar, partidos, salas-vip, tienda) y el panel admin completo (login, dashboard, formularios, listados) — en ambos viewports (390×844 mobile, 1440×900 desktop).
- Un hallazgo de overflow horizontal en mobile home (24px) se investigó y se descartó como falso positivo: ya está contenido por `overflow-x-hidden` en `<body>`, sin scroll ni fuga visual real.

## 7. Pendientes y Próximos Pasos (To-Do)

- **Fase E (limpieza)**: eliminar arrays hardcodeados ya muertos tras la migración a datos reales; barrido de grep para confirmar cero placeholders del número de WhatsApp (`573000000000`) o email de prueba; revisar el filtro de fechas de `PartidosList.tsx` para casos límite; evaluar si sobra algún `"use client"` heredado del código anterior.
- **Credenciales de producción**: `DATABASE_URL` de Postgres real (hoy local), `CLOUDINARY_*` y `RESEND_API_KEY` reales, `ADMIN_EMAIL`/`ADMIN_PASSWORD` de producción (hoy son credenciales de seed de desarrollo).
- *(Agrega aquí cualquier otra idea futura u optimización específica que el proyecto requiera)*.
