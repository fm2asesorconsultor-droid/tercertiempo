import { TiendaHero } from "@/components/sections/TiendaHero"
import { ProductGrid } from "@/components/sections/ProductGrid"
import { getProducts } from "@/lib/data/products"

export const metadata = {
  title: "Tienda Oficial | Tercer Tiempo",
  description: "Personaliza y reserva tus camisetas y merchandising para recoger en el bar.",
}

export default async function TiendaPage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-background-primary">
      <TiendaHero />
      <ProductGrid products={products} />
    </main>
  )
}
