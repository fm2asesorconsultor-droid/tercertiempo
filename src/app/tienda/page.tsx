import { TiendaHero } from "@/components/sections/TiendaHero"
import { ProductGrid } from "@/components/sections/ProductGrid"

export const metadata = {
  title: "Tienda Oficial | Tercer Tiempo",
  description: "Personaliza y reserva tus camisetas y merchandising para recoger en el bar.",
}

export default function TiendaPage() {
  return (
    <main className="min-h-screen bg-background-primary">
      <TiendaHero />
      <ProductGrid />
    </main>
  )
}
