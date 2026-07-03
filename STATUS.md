# Estado del Proyecto: Tercer Tiempo

## 🎯 Progreso Actual

Hasta la fecha, hemos construido y finalizado con éxito la **Landing Page (Home)** de Tercer Tiempo. La página cuenta con un diseño premium, "Dark Mode" cinematográfico y detalles en naranja vibrante (`#FF4500`), enfocada en una experiencia de usuario moderna y de alto impacto.

### Componentes Completados:
- **Navbar:** Navegación responsiva con menú hamburguesa y botón superior de reserva.
- **Hero Section:** Diseño en dos columnas con un objeto 3D interactivo (balón de fútbol flotante y girable), botones CTA y un **ticker animado tipo marquesina** en la parte inferior con el texto en **color naranja** (`text-accent-primary`). En móvil, las tarjetas de experiencia funcionan como un carrusel táctil horizontal con snap.
- **La Experiencia Definitiva:** Sección descriptiva con listado de beneficios (checkmarks) e imagen representativa con logo superpuesto.
- **Cumpleaños Futbolero:** Sección promocional para grupos con imagen de celebración Colombia. Gradiente vertical en móvil para legibilidad del texto sobre la imagen. Padding reducido a `p-6 md:p-12 lg:p-16`.
- **Próximos Partidos:** Grilla dinámica de 3 eventos deportivos con escudos SVG/PNG oficiales, estado VIP, fecha y hora. Tarjetas con hover iluminado naranja.
- **Nuestro Mundo (Galería):** Cuadrícula asimétrica de 4 imágenes. En móvil, cada imagen tiene `h-[220px]` fijo sin contenedor de altura rígida (se eliminó el `h-[800px]` que generaba scroll excesivo).
- **Newsletter (Únete al Equipo Titular):** Banda naranja completa con imagen PNG transparent de 3 hinchas (recorte manual en Photoshop) con efecto pop-out. En móvil la imagen se oculta (`hidden lg:flex`) y el texto/formulario quedan bien centrados.
- **Footer:** Pie de página de 4 columnas, responsivo (colapsa a 2 en tablet y 1 en móvil), con logo, redes sociales, enlaces rápidos e información de contacto.
- **Botón Flotante WhatsApp:** Animado (pulsante) fijo en la esquina inferior derecha.

### Aspectos Técnicos:
- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript.
- **Estilos:** Tailwind CSS con variables personalizadas. Color principal: `accent-primary` = `#FF4500`.
- **Animaciones:** Framer Motion (componente `FadeIn` reutilizable) + CSS puro (marquesina, carruseles snap).
- **3D:** React Three Fiber + Drei para el balón 3D interactivo.
- **Responsividad:** 100% Mobile-First. `overflow-x-hidden` en `<body>` para evitar scroll horizontal. Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px).
- **Imágenes:** Todas en `/public`. La imagen `fans-transparent.png` fue recortada manualmente en Photoshop con canal alfa limpio.

---

## 💡 Ideas Pendientes de Implementar (Balón 3D)

Se discutieron las siguientes interacciones avanzadas para el balón 3D del Hero. Aún no se han desarrollado. El usuario puede elegir cuál implementar:

1. **🎰 Tragabalón (Gira x10 → Premio):** Al girar el balón 10 veces completas, se activa una animación de confeti y aparece un modal con un código de descuento único. Se guarda en `localStorage` para evitar repetición. *(Idea del usuario, altamente recomendada)*
2. **🌀 Ruleta de Premios:** Combinar los 10 giros con una ruleta visible de beneficios (cerveza gratis, mesa VIP, 10% en tienda).
3. **🎤 Balón Oráculo:** Clic en el balón → muestra una frase futbolera aleatoria tipo "Bola 8 mágica".
4. **💥 El Chutazo:** Doble clic → el balón sale disparado y rebota en los bordes de la pantalla.
5. **🎙️ Modo Narrador:** Clic sostenido y soltar → grito de "¡¡GOOOL!!" con audio y efecto de pantalla temblorosa.

---

## 🚀 Próximas Páginas por Construir

Cuando retomes el proyecto, indica al asistente en qué página enfocarse y que lea este archivo primero:

1. **Página de Menú (`/menu`):**
   - Categorías: Entradas, Platos Fuertes, Coctelería, Cervezas.
   - Tarjetas de producto con descripciones e imágenes apetitosas.

2. **Página de Salas VIP (`/salas-vip`):**
   - Galería dedicada a los espacios privados.
   - Formulario avanzado: fecha, cantidad de personas, partido deseado.

3. **Tienda Futbolera (`/tienda`):**
   - Catálogo de camisetas, balones y guayos.
   - Efectos hover estilo e-commerce moderno.

4. **Contacto y FAQ (`/contacto`):**
   - Mapa de ubicación embebido o simulado.
   - Acordeones interactivos para preguntas frecuentes.

> **Instrucción para el asistente al retomar:** *"Lee el archivo `STATUS.md` en la raíz del proyecto para entender el contexto completo. Luego comencemos a trabajar en la página de [Nombre]."*
