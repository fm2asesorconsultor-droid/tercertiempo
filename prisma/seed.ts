import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos en el entorno para sembrar el usuario admin."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });

  console.log(`AdminUser listo: ${user.email} (id=${user.id})`);
}

/**
 * Contenido inicial = exactamente lo que hoy está hardcodeado en los
 * componentes públicos (HeroSection.tsx, ContactInfo.tsx, WhatsAppButton.tsx,
 * contacto/page.tsx). Migrar a la base de datos no debe cambiar nada visible
 * en el sitio; solo lo hace editable desde el admin.
 */
async function seedSiteSettings() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      whatsappNumber: "573000000000",
      contactEmail: "hola@tercertiempo.co",
      contactPhone: "+573000000000",
      address: "Bogotá, Colombia. Calle del Estadio #10-25",
      mapsEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127326.10788961888!2d-74.24785!3d4.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzknMDAuMCJOIDc0wrAxNCc1Mi4zIlc!5e0!3m2!1ses!2sco!4v1625000000000!5m2!1ses!2sco",
      instagramUrl: null,
      facebookUrl: null,
      logoUrl: "/logo.png",
      logoPublicId: null,
      schedule: [
        { day: "Lunes – Jueves", hours: "4:00 PM – 12:00 AM" },
        { day: "Viernes", hours: "2:00 PM – 2:00 AM" },
        { day: "Sábados", hours: "12:00 PM – 2:00 AM" },
        { day: "Domingos y Festivos", hours: "12:00 PM – 12:00 AM" },
      ],
    },
  });

  console.log(`SiteSettings listo (id=${settings.id})`);
}

async function seedHeroContent() {
  const hero = await prisma.heroContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      eyebrow: "BIENVENIDO A",
      headline: "DONDE EL FÚTBOL SE VIVE EN GRANDE",
      body: "Una pantalla gigante para ver cada partido. Dos salas VIP con TV de 80 pulgadas. Camisetas, balones, guayos, comida, bebidas y pasión futbolera.",
      ctaPrimaryLabel: "RESERVAR EXPERIENCIA",
      ctaSecondaryLabel: "VER EL AMBIENTE",
      backgroundImageUrl: "/imagen_fondo_tercer_tiiempo.png",
      backgroundImagePublicId: null,
    },
  });

  const existingCards = await prisma.experienceCard.count();
  if (existingCards === 0) {
    await prisma.experienceCard.createMany({
      data: [
        {
          iconKey: "monitor",
          title: "PANTALLA GIGANTE",
          description: "Vive el partido a lo grande.",
          imageUrl: "/pantalla_gigante.png",
          order: 0,
        },
        {
          iconKey: "sofa",
          title: 'SALA VIP 80"',
          description: "Privacidad, confort y TV de 80 pulgadas.",
          imageUrl: "/sala_vip.png",
          order: 1,
        },
        {
          iconKey: "shopping-bag",
          title: "TIENDA FUTBOLERA",
          description: "Camisetas, balones y guayos.",
          imageUrl: "/tienda_futbolera.png",
          order: 2,
        },
      ],
    });
  }

  console.log(`HeroContent listo (id=${hero.id})`);
}

async function seedPremiumExperience() {
  const content = await prisma.premiumExperienceContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      headline: "LA EXPERIENCIA",
      headlineAccent: "DEFINITIVA",
      body: "En Tercer Tiempo, no solo ves el partido, lo vives. Hemos diseñado cada rincón de nuestro espacio para replicar la emoción de la tribuna, sumando el confort, la exclusividad y el sabor de una experiencia verdaderamente premium.",
      imageUrl: "/premium_experience.png",
      imagePublicId: null,
    },
  });

  const existingBenefits = await prisma.premiumBenefit.count();
  if (existingBenefits === 0) {
    await prisma.premiumBenefit.createMany({
      data: [
        { text: "Ubicación privilegiada para cada espectador", order: 0 },
        { text: "Sonido envolvente de estadio", order: 1 },
        { text: "Gastronomía premium y coctelería de autor", order: 2 },
        { text: "Zonas VIP exclusivas para reservas", order: 3 },
        { text: "Servicio a la mesa durante todo el partido", order: 4 },
        { text: "Tienda oficial integrada", order: 5 },
      ],
    });
  }

  console.log(`PremiumExperienceContent listo (id=${content.id})`);
}

async function seedBirthday() {
  const content = await prisma.birthdayContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      eyebrow: "TU DÍA ESPECIAL",
      headline: "CELEBRA TU CUMPLEAÑOS",
      headlineAccent: "FUTBOLERO",
      body: "Tu día merece un estadio lleno. Celebra tu cumpleaños con nosotros (reservas de 10 personas o más) y te regalamos beneficios exclusivos para que levantes la copa con tu equipo.",
      backgroundImageUrl: "/colombia_birthday.png",
      backgroundImagePublicId: null,
      ctaLabel: "Armar mi cumpleaños",
    },
  });

  const existingPerks = await prisma.birthdayPerk.count();
  if (existingPerks === 0) {
    await prisma.birthdayPerk.createMany({
      data: [
        { iconKey: "beer", text: "Primera ronda de cervezas gratis", order: 0 },
        { iconKey: "crown", text: "Postre especial para el cumpleañero", order: 1 },
        { iconKey: "gift", text: "Decoración futbolera en tu mesa", order: 2 },
        { iconKey: "party-popper", text: "Reserva prioritaria", order: 3 },
      ],
    });
  }

  console.log(`BirthdayContent listo (id=${content.id})`);
}

async function seedGallery() {
  const existing = await prisma.galleryImage.count();
  if (existing > 0) {
    console.log("GalleryImage ya tiene datos, se omite el seed.");
    return;
  }

  await prisma.galleryImage.createMany({
    data: [
      // Bento de portada (WorldGallerySection)
      { title: "El Bar Central", imageUrl: "/gallery_bar_central.png", category: null, featuredOnHome: true, gridSpan: "large", order: 0 },
      { title: "Sala VIP 1", imageUrl: "/gallery_sala_vip.png", category: null, featuredOnHome: true, gridSpan: "normal", order: 1 },
      { title: "Platos Premium", imageUrl: "/gallery_platos.png", category: null, featuredOnHome: true, gridSpan: "normal", order: 2 },
      { title: "Tienda Oficial", imageUrl: "/gallery_tienda.png", category: null, featuredOnHome: true, gridSpan: "wide", order: 3 },
      // Galería filtrable (/galeria)
      { title: "Celebración Selección", imageUrl: "/colombia_birthday.png", category: "CUMPLEANOS", featuredOnHome: false, gridSpan: "large", order: 4 },
      { title: "Noche de Champions", imageUrl: "/gallery_bar_central.png", category: "EVENTOS", featuredOnHome: false, gridSpan: "normal", order: 5 },
      { title: "Reserva Privada", imageUrl: "/gallery_sala_vip.png", category: "VIP", featuredOnHome: false, gridSpan: "normal", order: 6 },
      { title: "Final de Copa", imageUrl: "/pantalla_gigante.png", category: "EVENTOS", featuredOnHome: false, gridSpan: "wide", order: 7 },
      { title: "Experiencia Premium", imageUrl: "/premium_experience.png", category: "VIP", featuredOnHome: false, gridSpan: "tall", order: 8 },
      { title: "Tercer Tiempo", imageUrl: "/gallery_platos.png", category: "AMIGOS", featuredOnHome: false, gridSpan: "normal", order: 9 },
      { title: "Festejo Inolvidable", imageUrl: "/birthday_celebration.png", category: "CUMPLEANOS", featuredOnHome: false, gridSpan: "wide", order: 10 },
    ],
  });

  console.log("GalleryImage sembrado (11 filas).");
}

async function seedTestimonials() {
  const existing = await prisma.testimonial.count();
  if (existing > 0) {
    console.log("Testimonial ya tiene datos, se omite el seed.");
    return;
  }

  await prisma.testimonial.createMany({
    data: [
      { name: "Carlos M.", text: "El mejor lugar para ver la final. La pantalla gigante es increíble y el sonido te hace sentir en el estadio.", rating: 5, published: true, order: 0 },
      { name: "Andrés F.", text: "Alquilamos una Sala VIP para el cumpleaños de mi hermano. La atención de primera y la comida deliciosa.", rating: 5, published: true, order: 1 },
      { name: "Felipe G.", text: "Gran ambiente futbolero. Además me llevé la camiseta retro que estaba buscando en la tienda.", rating: 5, published: true, order: 2 },
    ],
  });

  console.log("Testimonial sembrado (3 filas).");
}

function atTime(daysFromNow: number, hours: number, minutes = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function nextWeekday(targetDay: number): number {
  const today = new Date().getDay();
  let diff = targetDay - today;
  if (diff <= 0) diff += 7;
  return diff;
}

async function seedTeamsAndMatches() {
  const existingTeams = await prisma.team.count();
  if (existingTeams > 0) {
    console.log("Team ya tiene datos, se omite el seed.");
    return;
  }

  const teamData = [
    { name: "Real Madrid", logoUrl: "/teams/real-madrid.svg" },
    { name: "Barcelona", logoUrl: "/teams/barcelona.svg" },
    { name: "Man City", logoUrl: "/teams/man-city.svg" },
    { name: "Arsenal", logoUrl: "/teams/arsenal.svg" },
    { name: "Boca Jrs", logoUrl: "/teams/boca-jrs.svg" },
    { name: "River Plate", logoUrl: "/teams/river-plate.png" },
  ];

  const teams: Record<string, number> = {};
  for (const t of teamData) {
    const created = await prisma.team.create({ data: t });
    teams[t.name] = created.id;
  }

  const saturday = nextWeekday(6);
  const sunday = nextWeekday(0);

  await prisma.match.createMany({
    data: [
      {
        homeTeamId: teams["Real Madrid"],
        awayTeamId: teams["Barcelona"],
        competition: "LaLiga",
        kickoffAt: atTime(0, 15, 0),
        status: "LIVE",
        homeScore: 1,
        awayScore: 0,
        clockMinute: 45,
        hype: 98,
        isFeatured: true,
        isVIP: true,
        showOnHome: true,
      },
      {
        homeTeamId: teams["Man City"],
        awayTeamId: teams["Arsenal"],
        competition: "Premier League",
        kickoffAt: atTime(0, 20, 0),
        status: "UPCOMING",
        hype: 45,
        showOnHome: true,
      },
      {
        homeTeamId: teams["Boca Jrs"],
        awayTeamId: teams["River Plate"],
        competition: "Copa Libertadores",
        kickoffAt: atTime(1, 19, 0),
        status: "UPCOMING",
        hype: 88,
        isVIP: true,
        showOnHome: true,
      },
      {
        homeTeamId: teams["River Plate"],
        awayTeamId: teams["Real Madrid"],
        competition: "Amistoso Internacional",
        kickoffAt: atTime(saturday, 14, 0),
        status: "UPCOMING",
        hype: 60,
      },
      {
        homeTeamId: teams["Barcelona"],
        awayTeamId: teams["Boca Jrs"],
        competition: "Amistoso Internacional",
        kickoffAt: atTime(saturday, 16, 0),
        status: "UPCOMING",
        hype: 82,
        isFeatured: true,
      },
      {
        homeTeamId: teams["Arsenal"],
        awayTeamId: teams["River Plate"],
        competition: "Premier League",
        kickoffAt: atTime(sunday, 15, 0),
        status: "UPCOMING",
        hype: 75,
      },
      {
        homeTeamId: teams["Man City"],
        awayTeamId: teams["Real Madrid"],
        competition: "Champions League",
        kickoffAt: atTime(5, 20, 0),
        status: "UPCOMING",
        hype: 70,
      },
      {
        homeTeamId: teams["Barcelona"],
        awayTeamId: teams["Arsenal"],
        competition: "Champions League",
        kickoffAt: atTime(6, 20, 0),
        status: "UPCOMING",
        hype: 89,
        isVIP: true,
      },
    ],
  });

  console.log("Team y Match sembrados (6 equipos, 8 partidos).");
}

async function seedMatchDemandDays() {
  const existing = await prisma.matchDemandDay.count();
  if (existing > 0) {
    console.log("MatchDemandDay ya tiene datos, se omite el seed.");
    return;
  }

  const dateOnly = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  await prisma.matchDemandDay.createMany({
    data: [
      { date: dateOnly(0), teamsLabel: "Real Madrid vs Barcelona", demand: "HIGH" },
      { date: dateOnly(1), teamsLabel: "Boca Jrs vs River Plate", demand: "HIGH" },
      { date: dateOnly(2), teamsLabel: "Sin partido programado", demand: "LOW" },
      { date: dateOnly(nextWeekday(6)), teamsLabel: "Barcelona vs Boca Jrs", demand: "MID" },
      { date: dateOnly(nextWeekday(0)), teamsLabel: "Arsenal vs River Plate", demand: "MID" },
      { date: dateOnly(5), teamsLabel: "Man City vs Real Madrid", demand: "HIGH" },
    ],
    skipDuplicates: true,
  });

  console.log("MatchDemandDay sembrado (6 fechas).");
}

async function seedZones() {
  const existing = await prisma.zone.count();
  if (existing > 0) {
    console.log("Zone ya tiene datos, se omite el seed.");
    return;
  }

  await prisma.zone.createMany({
    data: [
      { slug: "salon", name: "Salón Pantalla Gigante", floor: 1, capacityLabel: "Hasta 60 personas", priceLabel: "Desde $20.000/mesa", description: "La mejor vista al marcador. Ambiente eléctrico.", order: 0 },
      { slug: "barra", name: "La Barra", floor: 1, capacityLabel: "Hasta 12 taburetes", priceLabel: "Consumo mínimo", description: "Cerca de la acción. Ideal para parejas o amigos.", order: 1 },
      { slug: "terraza", name: "Terraza", floor: 2, capacityLabel: "Hasta 30 personas", priceLabel: "Desde $15.000/mesa", description: "Aire fresco, brisa y pantalla exterior. Vive el partido bajo las estrellas.", order: 2 },
      { slug: "cancha", name: "Cancha Sintética", floor: 2, capacityLabel: "Hasta 14 jugadores", priceLabel: "Desde $150.000/hora", description: "Calienta antes del partido. Alquiler por hora.", order: 3 },
      { slug: "vip1", name: "Sala VIP Campeones", floor: 2, capacityLabel: "Hasta 10 personas", priceLabel: "Desde $350.000", description: "Sofás de cuero, pantalla 85\", ambiente privado.", order: 4 },
      { slug: "vip2", name: "Sala VIP Leyendas", floor: 2, capacityLabel: "Hasta 10 personas", priceLabel: "Desde $350.000", description: "Sillas huevo en cuero, pantalla 85\", privacidad total.", order: 5 },
    ],
  });

  console.log("Zone sembrado (6 zonas fijas).");
}

async function seedSalasVip() {
  const existing = await prisma.salaVip.count();
  if (existing > 0) {
    console.log("SalaVip ya tiene datos, se omite el seed.");
    return;
  }

  await prisma.salaVip.createMany({
    data: [
      {
        name: "Sala Champions",
        imageUrl: "/gallery_sala_vip.png",
        capacity: 12,
        status: "AVAILABLE",
        features: ["Pantalla 85 Pulgadas", "Sofás en cuero", "Sillas huevo en cuero", "Atención VIP"],
        priceLabel: "Desde $150.000",
      },
      {
        name: "Sala Libertadores",
        imageUrl: "/sala_vip.png",
        capacity: 8,
        status: "LIMITED",
        features: ["Pantalla 85 Pulgadas", "Sofás en cuero", "Sillas huevo en cuero", "Privacidad total"],
        priceLabel: "Desde $100.000",
      },
    ],
  });

  console.log("SalaVip sembrado (2 salas).");
}

async function seedProducts() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log("Product ya tiene datos, se omite el seed.");
    return;
  }

  await prisma.product.createMany({
    data: [
      { name: "Camiseta Oficial Colombia", category: "CAMISETAS", price: 299900, imageUrl: "/store/colombia_jersey.png", isNew: true, canCustomize: true },
      { name: "Camiseta Real Madrid Local", category: "CAMISETAS", price: 349900, imageUrl: "/store/real_madrid_jersey.png", isNew: false, canCustomize: true },
      { name: "Gorra Tercer Tiempo", category: "GORRAS", price: 80000, imageUrl: "/store/tercer_tiempo_cap.png", isNew: true, canCustomize: false },
      { name: "Jarra Cervecera 1L", category: "ACCESORIOS", price: 45000, imageUrl: "/store/beer_mug.png", isNew: false, canCustomize: false },
      { name: "Camiseta Boca Juniors", category: "CAMISETAS", price: 289900, imageUrl: "/store/boca_juniors_jersey.png", isNew: false, canCustomize: true },
    ],
  });

  console.log("Product sembrado (5 productos).");
}

async function seedMenu() {
  const existing = await prisma.menuCategory.count();
  if (existing > 0) {
    console.log("MenuCategory ya tiene datos, se omite el seed.");
    return;
  }

  const categoryData = [
    { name: "Principales", iconKey: "beef", order: 0 },
    { name: "Para Compartir", iconKey: "pizza", order: 1 },
    { name: "Cervezas", iconKey: "beer", order: 2 },
    { name: "Cócteles", iconKey: "coffee", order: 3 },
  ];

  const categories: Record<string, number> = {};
  for (const c of categoryData) {
    const created = await prisma.menuCategory.create({ data: c });
    categories[c.name] = created.id;
  }

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: categories["Principales"],
        name: "La 'Hat-Trick' Burger",
        description: "Tres carnes premium, tocineta crujiente, cheddar fundido, aros de cebolla bañados en cerveza y nuestra salsa BBQ ahumada secreta.",
        price: 45000,
        imageUrl: "/menu/hat_trick_burger.png",
        pairingSuggestion: "Cerveza Artesanal Rubia",
        isMVP: true,
        order: 0,
      },
      {
        categoryId: categories["Para Compartir"],
        name: "Picada 'El Clásico'",
        description: "Chorizo, morcilla, chicharrón carnudo, papas rústicas, arepitas y empanadas. Para 4 personas (o 2 defensas centrales hambrientos).",
        price: 85000,
        imageUrl: "/menu/picada_clasico.png",
        pairingSuggestion: "Jarra de Cerveza 1L",
        isMVP: true,
        order: 1,
      },
      {
        categoryId: categories["Para Compartir"],
        name: "Alitas 'Roja Directa'",
        description: "Alitas bañadas en salsa picante Habanero intenso. Solo para los más valientes del estadio.",
        price: 32000,
        imageUrl: "/menu/alitas_roja_directa.png",
        pairingSuggestion: "Cóctel El Var (Para apagar el fuego)",
        isMVP: false,
        order: 2,
      },
      {
        categoryId: categories["Cervezas"],
        name: "Cerveza Artesanal 'Tercer Tiempo'",
        description: "Lager rubia, ligera y muy fría. Servida en jarra helada. La bebida oficial de los 90 minutos.",
        price: 15000,
        imageUrl: "/menu/cerveza_artesanal.png",
        pairingSuggestion: "Hat-Trick Burger",
        isMVP: false,
        order: 3,
      },
      {
        categoryId: categories["Cócteles"],
        name: "Cóctel 'El VAR'",
        description: "Tequila, Blue Curaçao y limón, con un efecto de humo mágico que cambia de color. Tienes que revisarlo en pantalla.",
        price: 28000,
        imageUrl: "/menu/coctel_var.png",
        pairingSuggestion: "Alitas Roja Directa",
        isMVP: false,
        order: 4,
      },
    ],
  });

  console.log("MenuCategory y MenuItem sembrados (4 categorías, 5 items).");
}

async function seedCowork() {
  const existing = await prisma.coworkStat.count();
  if (existing === 0) {
    await prisma.coworkStat.createMany({
      data: [
        { value: "60+", label: "Personas capacidad", order: 0 },
        { value: "2", label: "Salas VIP privadas", order: 1 },
        { value: "85\"", label: "Pantallas 4K", order: 2 },
        { value: "100%", label: "WiFi empresarial", order: 3 },
      ],
    });
    console.log("CoworkStat sembrado (4 filas).");
  } else {
    console.log("CoworkStat ya tiene datos, se omite el seed.");
  }

  const existingPackages = await prisma.coworkPackage.count();
  if (existingPackages === 0) {
    await prisma.coworkPackage.create({
      data: {
        slug: "medio-tiempo",
        iconKey: "zap",
        name: "Medio Tiempo",
        subtitle: "AM · 8:00 AM – 1:00 PM",
        price: 250000,
        theme: "ZINC",
        popular: false,
        ctaLabel: "Reservar Medio Tiempo",
        order: 0,
        features: {
          create: [
            { text: "Salón principal hasta 30 personas", order: 0 },
            { text: "WiFi empresarial de alta velocidad", order: 1 },
            { text: "Pantalla 85\" con HDMI", order: 2 },
            { text: "Café y agua incluidos", order: 3 },
            { text: "1 asistente de sala", order: 4 },
            { text: "Parqueadero", order: 5 },
          ],
        },
      },
    });
    await prisma.coworkPackage.create({
      data: {
        slug: "tiempo-completo",
        iconKey: "trophy",
        name: "Tiempo Completo",
        subtitle: "Full Day · 8:00 AM – 6:00 PM",
        price: 480000,
        theme: "ACCENT",
        popular: true,
        ctaLabel: "Reservar Tiempo Completo",
        order: 1,
        features: {
          create: [
            { text: "Salón principal hasta 60 personas", order: 0 },
            { text: "WiFi empresarial de alta velocidad", order: 1 },
            { text: "Pantalla 85\" con HDMI y sonido", order: 2 },
            { text: "2 coffee breaks incluidos", order: 3 },
            { text: "Almuerzo corporativo incluido", order: 4 },
            { text: "Asistente de sala dedicado", order: 5 },
            { text: "Parqueadero", order: 6 },
            { text: "Grabación de sesión (opcional)", order: 7 },
          ],
        },
      },
    });
    await prisma.coworkPackage.create({
      data: {
        slug: "estadio",
        iconKey: "crown",
        name: "Paquete Estadio",
        subtitle: "Evento Especial · A convenir",
        price: 800000,
        theme: "ZINC",
        popular: false,
        ctaLabel: "Solicitar Cotización",
        order: 2,
        features: {
          create: [
            { text: "Todo del paquete Tiempo Completo", order: 0 },
            { text: "Sala VIP privada disponible", order: 1 },
            { text: "Facilitador profesional incluido", order: 2 },
            { text: "Materiales para talleres (LSP, DT...)", order: 3 },
            { text: "Catering personalizado", order: 4 },
            { text: "Fotografía del evento", order: 5 },
            { text: "Transmisión en vivo", order: 6 },
            { text: "Brindis final de cierre", order: 7 },
          ],
        },
      },
    });
    console.log("CoworkPackage sembrado (3 paquetes con features).");
  } else {
    console.log("CoworkPackage ya tiene datos, se omite el seed.");
  }

  const existingServices = await prisma.consultingService.count();
  if (existingServices === 0) {
    await prisma.consultingService.createMany({
      data: [
        {
          name: "Lego Serious Play",
          tag: "Metodología Premium",
          tag2: "🧩 Innovación",
          description: "Una técnica de facilitación probada globalmente donde los participantes construyen modelos con LEGO para explorar desafíos empresariales, alinear visiones y tomar decisiones estratégicas. Ideal para equipos directivos.",
          imageUrl: "/cowork/lego_serious_play.png",
          duration: "4 – 8 horas",
          participants: "5 – 20 personas",
          highlight: "Incluye facilitador certificado y materiales LEGO",
          order: 0,
        },
        {
          name: "Design Thinking & Sprint",
          tag: "Innovación",
          tag2: "💡 Creatividad",
          description: "Metodología centrada en las personas para resolver problemas complejos de forma ágil. Desde la empatía con el usuario hasta el prototipado rápido de soluciones, todo en un día intenso y transformador.",
          imageUrl: "/cowork/design_thinking.png",
          duration: "6 – 8 horas",
          participants: "10 – 40 personas",
          highlight: "Post-its, prototipos y un plan de acción concreto",
          order: 1,
        },
        {
          name: "Team Building Deportivo",
          tag: "Integración",
          tag2: "⚽ Deporte",
          description: "Combina el poder del deporte con la dinámica de equipo. Desde torneos internos en la cancha de fútbol sintético hasta retos grupales en el bar. Una forma diferente y memorable de fortalecer equipos.",
          imageUrl: "/cowork/team_building.png",
          duration: "3 – 5 horas",
          participants: "10 – 60 personas",
          highlight: "Incluye uso de la cancha sintética y brindis",
          order: 2,
        },
        {
          name: "Coaching Ejecutivo",
          tag: "Liderazgo",
          tag2: "🎯 Liderazgo",
          description: "Sesiones individuales o de equipo en las Salas VIP privadas. Un espacio íntimo, diferente a la oficina, que facilita conversaciones profundas, reflexión estratégica y planes de desarrollo de liderazgo.",
          imageUrl: "/cowork/coaching_ejecutivo.png",
          duration: "2 – 4 horas",
          participants: "1 – 10 personas",
          highlight: "Sala VIP privada con pantalla 85\" y sofás de cuero",
          order: 3,
        },
      ],
    });
    console.log("ConsultingService sembrado (4 servicios).");
  } else {
    console.log("ConsultingService ya tiene datos, se omite el seed.");
  }

  const existingExtras = await prisma.quoteExtra.count();
  if (existingExtras === 0) {
    await prisma.quoteExtra.createMany({
      data: [
        { label: "Catering personalizado", price: 80000, iconKey: "catering", order: 0 },
        { label: "Facilitador profesional", price: 350000, iconKey: "facilitador", order: 1 },
        { label: "Kit Lego Serious Play", price: 200000, iconKey: "lsp-kit", order: 2 },
        { label: "Fotografía del evento", price: 120000, iconKey: "fotografia", order: 3 },
        { label: "Transmisión en vivo", price: 180000, iconKey: "streaming", order: 4 },
        { label: "Sala VIP privada", price: 250000, iconKey: "vip", order: 5 },
      ],
    });
    console.log("QuoteExtra sembrado (6 extras).");
  } else {
    console.log("QuoteExtra ya tiene datos, se omite el seed.");
  }

  const existingEventTypes = await prisma.eventType.count();
  if (existingEventTypes === 0) {
    await prisma.eventType.createMany({
      data: [
        { label: "Reunión de equipo", order: 0 },
        { label: "Taller Lego Serious Play", order: 1 },
        { label: "Design Thinking / Sprint", order: 2 },
        { label: "Team Building", order: 3 },
        { label: "Coaching Ejecutivo", order: 4 },
        { label: "Capacitación / Formación", order: 5 },
        { label: "Lanzamiento de producto", order: 6 },
        { label: "Otro", order: 7 },
      ],
    });
    console.log("EventType sembrado (8 tipos).");
  } else {
    console.log("EventType ya tiene datos, se omite el seed.");
  }
}

async function main() {
  await seedAdminUser();
  await seedSiteSettings();
  await seedHeroContent();
  await seedPremiumExperience();
  await seedBirthday();
  await seedGallery();
  await seedTestimonials();
  await seedTeamsAndMatches();
  await seedMatchDemandDays();
  await seedZones();
  await seedSalasVip();
  await seedProducts();
  await seedMenu();
  await seedCowork();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
