import { ReservaHero } from "@/components/sections/ReservaHero"
import { ReservationStepper } from "@/components/ui/ReservationStepper"
import { ContactInfo } from "@/components/sections/ContactInfo"
import { getZones } from "@/lib/data/zones"
import { getMatchDemandDays, toMatchDaysRecord } from "@/lib/data/matches"
import { getSiteSettings } from "@/lib/data/site-settings"

export const metadata = {
  title: "Reservar Mesa | Tercer Tiempo",
  description: "Reserva tu zona en el bar para ver el partido. Elige tu lugar, tu fecha y confirma por WhatsApp.",
}

export default async function ReservarPage() {
  const [zones, demandDays, settings] = await Promise.all([getZones(), getMatchDemandDays(), getSiteSettings()])
  const matchDays = toMatchDaysRecord(demandDays)

  return (
    <main className="min-h-screen bg-background-primary">
      <ReservaHero />
      <section className="py-16 px-4 bg-background-primary">
        <ReservationStepper zones={zones} matchDays={matchDays} whatsappNumber={settings.whatsappNumber} />
      </section>
      <ContactInfo />
    </main>
  )
}
