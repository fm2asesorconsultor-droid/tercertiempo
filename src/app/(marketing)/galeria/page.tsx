import { FriendsGallerySection } from "@/components/sections/FriendsGallerySection"
import { getFilterableGalleryImages } from "@/lib/data/gallery"

export const metadata = {
  title: "Galería de Eventos | Tercer Tiempo",
  description: "Revive los mejores momentos de nuestros eventos y cumpleaños. En Tercer Tiempo, tú eres la estrella.",
}

export default async function GaleriaPage() {
  const images = await getFilterableGalleryImages()

  return (
    <main className="min-h-screen bg-background-primary pt-20">
      <FriendsGallerySection images={images} />
    </main>
  )
}
