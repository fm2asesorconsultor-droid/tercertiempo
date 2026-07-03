import { FadeIn } from "@/components/ui/FadeIn"

export function SalasVipHero() {
  return (
    <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-[url('/sala_vip.png')] bg-cover bg-center bg-no-repeat"
        style={{ backgroundPosition: "center 30%" }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-background-primary" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <FadeIn direction="up">
          <span className="text-accent-primary font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 block">
            Exclusividad y Confort
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tight mb-6">
            Salas <span className="text-accent-primary">VIP</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            Vive tu pasión en un espacio diseñado para los verdaderos hinchas. Privacidad, pantalla gigante, y un servicio digno de campeones.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
