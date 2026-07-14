import { CoworkHero } from "@/components/sections/CoworkHero"
import { CoworkPackages } from "@/components/sections/CoworkPackages"
import { ConsultingServices } from "@/components/sections/ConsultingServices"
import { B2BQuoteForm } from "@/components/ui/B2BQuoteForm"
import { getCoworkStats, getCoworkPackages, getConsultingServices, getQuoteExtras, getEventTypes } from "@/lib/data/cowork"
import { getSiteSettings } from "@/lib/data/site-settings"

export const metadata = {
  title: "Coworking & Eventos Empresariales | Tercer Tiempo",
  description: "El espacio más creativo de la región para reuniones, talleres corporativos y eventos de consultoría. Lego Serious Play, Design Thinking, Team Building y más.",
}

export default async function CoworkPage() {
  const [stats, packages, services, extras, eventTypes, settings] = await Promise.all([
    getCoworkStats(),
    getCoworkPackages(),
    getConsultingServices(),
    getQuoteExtras(),
    getEventTypes(),
    getSiteSettings(),
  ])

  return (
    <main className="min-h-screen bg-background-primary">
      <CoworkHero stats={stats} />
      <CoworkPackages packages={packages} />
      <ConsultingServices services={services} />
      <B2BQuoteForm packages={packages} extras={extras} eventTypes={eventTypes} whatsappNumber={settings.whatsappNumber} />
    </main>
  )
}
