import { FadeIn } from "@/components/ui/FadeIn"

export function PartidosHero() {
  return (
    <section className="relative pt-32 pb-16 w-full overflow-hidden bg-background-primary flex flex-col items-center justify-center border-b border-zinc-800">
      
      {/* Background Effect */}
      <div className="absolute top-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-accent-primary/20 rounded-full blur-[150px]" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <FadeIn direction="up">
          <span className="text-accent-primary font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 block">
            El Calendario de los Campeones
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase italic tracking-tight mb-6">
            Cartelera de <br />
            <span className="text-accent-primary">Partidos</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            Vive los 90 minutos con la mejor atmósfera, comida y sonido. Elige el partido, dinos en qué zona del bar quieres estar, y nosotros nos encargamos del resto.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
