import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/contenido/hero", label: "Portada (Hero)" },
  { href: "/admin/contenido/experiencia", label: "Experiencia Premium" },
  { href: "/admin/contenido/cumpleanos", label: "Cumpleaños" },
  { href: "/admin/contenido/galeria", label: "Galería" },
  { href: "/admin/contenido/testimonios", label: "Testimonios" },
  { href: "/admin/partidos", label: "Partidos" },
  { href: "/admin/partidos/equipos", label: "Equipos" },
  { href: "/admin/partidos/demanda", label: "Demanda del calendario" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/reservas/zonas", label: "Zonas del bar" },
  { href: "/admin/reservas/salas-vip", label: "Salas VIP" },
  { href: "/admin/tienda/productos", label: "Productos" },
  { href: "/admin/tienda/pedidos", label: "Pedidos de tienda" },
  { href: "/admin/menu/categorias", label: "Categorías de menú" },
  { href: "/admin/menu/items", label: "Platos y bebidas" },
  { href: "/admin/cowork/estadisticas", label: "Cowork: Estadísticas" },
  { href: "/admin/cowork/paquetes", label: "Cowork: Paquetes" },
  { href: "/admin/cowork/servicios", label: "Cowork: Servicios" },
  { href: "/admin/cowork/extras", label: "Cowork: Extras cotizador" },
  { href: "/admin/cowork/tipos-evento", label: "Cowork: Tipos de evento" },
  { href: "/admin/cowork/cotizaciones", label: "Cowork: Cotizaciones" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/configuracion", label: "Configuración del sitio" },
];

export function AdminNav() {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-background-surface hover:text-text-primary"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
