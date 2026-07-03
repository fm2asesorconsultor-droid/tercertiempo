import { FriendsGallerySection } from "@/components/sections/FriendsGallerySection"

export const metadata = {
  title: "Galería de Eventos | Tercer Tiempo",
  description: "Revive los mejores momentos de nuestros eventos y cumpleaños. En Tercer Tiempo, tú eres la estrella.",
}

export default function GaleriaPage() {
  return (
    <main className="min-h-screen bg-background-primary pt-20">
      <FriendsGallerySection />
    </main>
  )
}
