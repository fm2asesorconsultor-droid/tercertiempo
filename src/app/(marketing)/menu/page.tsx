import { MenuHero } from "@/components/sections/MenuHero"
import { MenuBentoGrid } from "@/components/sections/MenuBentoGrid"
import { getMenuCategories, getMenuItems } from "@/lib/data/menu"

export const metadata = {
  title: "Menú Estelar | Tercer Tiempo",
  description: "Descubre nuestros platos MVP y bebidas para acompañar los 90 minutos.",
}

export default async function MenuPage() {
  const [categories, items] = await Promise.all([getMenuCategories(), getMenuItems()])

  return (
    <main className="min-h-screen bg-background-primary">
      <MenuHero />
      <MenuBentoGrid categories={categories} items={items} />
    </main>
  )
}
