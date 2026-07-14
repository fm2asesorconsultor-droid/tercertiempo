import { ContactInfo } from "@/components/sections/ContactInfo"
import { ReservationStepper } from "@/components/ui/ReservationStepper"
import { FadeIn } from "@/components/ui/FadeIn"
import { Phone, MessageCircle, Mail } from "lucide-react"
import { getSiteSettings } from "@/lib/data/site-settings"
import { getZones } from "@/lib/data/zones"
import { getMatchDemandDays, toMatchDaysRecord } from "@/lib/data/matches"

export const metadata = {
  title: "Contacto | Tercer Tiempo",
  description: "Contáctanos, resuelve tus dudas o reserva tu experiencia en Tercer Tiempo Bar.",
}

export default async function ContactoPage() {
  const [settings, zones, demandDays] = await Promise.all([
    getSiteSettings(),
    getZones(),
    getMatchDemandDays(),
  ])
  const matchDays = toMatchDaysRecord(demandDays)

  return (
    <main className="min-h-screen bg-background-primary">
      {/* Hero */}
      <section className="relative pt-32 pb-16 w-full overflow-hidden bg-background-primary flex flex-col items-center justify-center border-b border-zinc-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-accent-primary/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <FadeIn direction="up">
            <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-primary/50">
              <Phone className="w-8 h-8 text-accent-primary" />
            </div>
            <span className="text-accent-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
              Estamos para servirte
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tight mb-6">
              Contáctanos &amp; <br />
              <span className="text-accent-primary">Reserva</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              ¿Tienes dudas, quieres reservar tu zona o planear un evento privado? Aquí estamos.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Quick Contact Buttons */}
      <section className="py-10 bg-background-primary">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-600/10 border border-green-600/30 hover:border-green-500 hover:bg-green-600/20 rounded-2xl p-5 transition-all group"
            >
              <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">WhatsApp</p>
                <p className="text-white font-bold text-sm">{settings.contactPhone}</p>
              </div>
            </a>

            <a
              href={`tel:${settings.contactPhone}`}
              className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 hover:border-accent-primary/50 rounded-2xl p-5 transition-all group"
            >
              <div className="w-10 h-10 bg-accent-primary/20 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Llamar</p>
                <p className="text-white font-bold text-sm">{settings.contactPhone}</p>
              </div>
            </a>

            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 hover:border-accent-primary/50 rounded-2xl p-5 transition-all group"
            >
              <div className="w-10 h-10 bg-accent-primary/20 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Email</p>
                <p className="text-white font-bold text-sm">{settings.contactEmail}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Reservation Stepper */}
      <section className="py-12 px-4 bg-background-primary">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">Reserva tu Mesa</h2>
            <p className="text-zinc-400">4 pasos rápidos y confirmación inmediata por WhatsApp</p>
          </div>
          <ReservationStepper zones={zones} matchDays={matchDays} whatsappNumber={settings.whatsappNumber} />
        </div>
      </section>

      {/* Contact Info Section (Hours, Map, WhatsApp) */}
      <ContactInfo />
    </main>
  )
}
