import { CoworkHero } from "@/components/sections/CoworkHero"
import { CoworkPackages } from "@/components/sections/CoworkPackages"
import { ConsultingServices } from "@/components/sections/ConsultingServices"
import { B2BQuoteForm } from "@/components/ui/B2BQuoteForm"

export const metadata = {
  title: "Coworking & Eventos Empresariales | Tercer Tiempo",
  description: "El espacio más creativo de la región para reuniones, talleres corporativos y eventos de consultoría. Lego Serious Play, Design Thinking, Team Building y más.",
}

export default function CoworkPage() {
  return (
    <main className="min-h-screen bg-background-primary">
      <CoworkHero />
      <CoworkPackages />
      <ConsultingServices />
      <B2BQuoteForm />
    </main>
  )
}
