import { FadeIn } from "@/components/ui/FadeIn"
import { ShoppingBag } from "lucide-react"

export function TiendaHero() {
  return (
    <section className="relative pt-32 pb-16 w-full overflow-hidden bg-background-primary flex flex-col items-center justify-center border-b border-zinc-800">
      
      {/* Background Effect */}
      <div className="absolute top-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[80%] h-[70%] bg-accent-primary/10 rounded-full blur-[150px]" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <FadeIn direction="up">
          <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-primary/50">
            <ShoppingBag className="w-8 h-8 text-accent-primary" />
          </div>
          <span className="text-accent-primary font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 block">
            Click & Collect en el Bar
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase italic tracking-tight mb-6">
            Tienda <br />
            <span className="text-accent-primary">Oficial</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            Vístete con los colores de tu pasión. Personaliza tu camiseta, resérvala ahora y recógela en la barra cuando vengas a ver tu próximo partido.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
