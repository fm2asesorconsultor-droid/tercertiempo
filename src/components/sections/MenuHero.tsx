import { FadeIn } from "@/components/ui/FadeIn"
import { UtensilsCrossed } from "lucide-react"

export function MenuHero() {
  return (
    <section className="relative pt-32 pb-16 w-full overflow-hidden bg-background-primary flex flex-col items-center justify-center border-b border-zinc-800">
      
      {/* Background Effect */}
      <div className="absolute top-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[70%] h-[70%] bg-accent-primary/15 rounded-full blur-[150px]" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <FadeIn direction="up">
          <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-primary/50">
            <UtensilsCrossed className="w-8 h-8 text-accent-primary" />
          </div>
          <span className="text-accent-primary font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 block">
            El Combustible de los Campeones
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase italic tracking-tight mb-6">
            Menú <br />
            <span className="text-accent-primary">Estelar</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            Desde la legendaria Hat-Trick Burger hasta las cervezas artesanales más frías del estadio. Arma tu táctica y añade platos a tu cuenta antes de llamar al árbitro (mesero).
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
