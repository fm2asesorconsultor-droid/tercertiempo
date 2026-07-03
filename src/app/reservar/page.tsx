import { ReservaHero } from "@/components/sections/ReservaHero"
import { ReservationStepper } from "@/components/ui/ReservationStepper"
import { ContactInfo } from "@/components/sections/ContactInfo"

export const metadata = {
  title: "Reservar Mesa | Tercer Tiempo",
  description: "Reserva tu zona en el bar para ver el partido. Elige tu lugar, tu fecha y confirma por WhatsApp.",
}

export default function ReservarPage() {
  return (
    <main className="min-h-screen bg-background-primary">
      <ReservaHero />
      <section className="py-16 px-4 bg-background-primary">
        <ReservationStepper />
      </section>
      <ContactInfo />
    </main>
  )
}
