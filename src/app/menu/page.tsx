import { MenuHero } from "@/components/sections/MenuHero"
import { MenuBentoGrid } from "@/components/sections/MenuBentoGrid"

export const metadata = {
  title: "Menú Estelar | Tercer Tiempo",
  description: "Descubre nuestros platos MVP y bebidas para acompañar los 90 minutos.",
}

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-background-primary">
      <MenuHero />
      <MenuBentoGrid />
    </main>
  )
}
