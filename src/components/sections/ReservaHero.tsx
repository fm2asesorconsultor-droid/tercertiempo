import { FadeIn } from "@/components/ui/FadeIn"
import { CalendarCheck } from "lucide-react"

export function ReservaHero() {
  return (
    <section className="relative pt-32 pb-16 w-full overflow-hidden bg-background-primary flex flex-col items-center justify-center border-b border-zinc-800">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-accent-primary/10 rounded-full blur-[150px]" />
      </div>
      <div className="relative z-10 container mx-auto px-4 text-center">
        <FadeIn direction="up">
          <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-primary/50">
            <CalendarCheck className="w-8 h-8 text-accent-primary" />
          </div>
          <span className="text-accent-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
            Asegura tu lugar en el estadio
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tight mb-6">
            Reserva tu <br />
            <span className="text-accent-primary">Experiencia</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Elige tu zona, selecciona el partido y asegura tu mesa. En 4 pasos, todo listo. Confirmación inmediata por WhatsApp.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
