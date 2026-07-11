import { Button } from "@/components/ui/Button"
import { FadeIn } from "@/components/ui/FadeIn"
import { Football3D } from "@/components/ui/Football3D"
import { FootballMobileSprite } from "@/components/ui/FootballMobileSprite"
import Image from "next/image"
import { Play, ChevronRight, Monitor, Sofa, ShoppingBag, MousePointer2 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-background-primary pt-4 lg:pt-2">
      {/* Imagen de fondo a pantalla completa */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/imagen_fondo_tercer_tiiempo.png"
          alt="Fondo Tercer Tiempo"
          fill
          className="object-cover"
          priority
        />
        {/* Degradado para oscurecer la mitad izquierda y resaltar los textos */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Columna Izquierda: Textos */}
          <div className="flex flex-col justify-center space-y-8 lg:col-span-5 relative z-20">
            <FadeIn delay={0.1}>
              <p className="font-title font-black text-accent-primary text-xl tracking-wider">BIENVENIDO A</p>
              <div className="mt-4 w-full">
                <Image 
                  src="/logo.png" 
                  alt="Tercer Tiempo Logo" 
                  width={560} 
                  height={168} 
                  className="w-full max-w-[560px] h-auto object-contain"
                  priority
                />
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2} direction="up">
              <h2 className="text-xl md:text-2xl font-bold text-white">DONDE EL FÚTBOL SE VIVE EN GRANDE</h2>
              <p className="mt-4 text-text-secondary max-w-[400px]">
                Una pantalla gigante para ver cada partido. Dos salas VIP con TV de 80 pulgadas. Camisetas, balones, guayos, comida, bebidas y pasión futbolera.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.3} direction="up" className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto font-bold tracking-wide">
                RESERVAR EXPERIENCIA <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold tracking-wide group">
                <Play className="mr-2 h-5 w-5 text-accent-primary group-hover:text-white" /> VER EL AMBIENTE
              </Button>
            </FadeIn>
          </div>
          
          {/* Columna Derecha: Balón (3D en Desktop, SVG animado en Móvil) */}
          <div className="relative mt-12 lg:col-span-4 lg:mt-0 flex flex-col items-center justify-center">
            
            {/* Versión 3D Real - Solo Desktop (Evita crashes de memoria WebGL en móviles) */}
            <FadeIn delay={0.4} direction="left" className="w-full h-full relative z-10 hidden md:block">
              <Football3D />
            </FadeIn>

            {/* Versión Ligera (Sprite 360°) - Solo Móvil (arrastre táctil, cero WebGL, cero crashes) */}
            <FadeIn delay={0.4} direction="left" className="flex md:hidden justify-center items-center w-full h-[300px] relative z-10">
              <FootballMobileSprite />
            </FadeIn>

            {/* Indicador interactivo (mismo mensaje en desktop y móvil, ambos son arrastrables) */}
            <FadeIn delay={0.8} direction="up" className="flex absolute -bottom-4 lg:bottom-4 z-20 flex-col items-center justify-center pointer-events-none opacity-80 md:-translate-x-[25px]">
              <MousePointer2 className="h-6 w-6 text-accent-primary animate-bounce mb-1 drop-shadow-md" />
              <span className="text-[10px] font-bold text-white tracking-widest uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Gira el balón</span>
            </FadeIn>
          </div>
          
          {/* Columna Derecha: Cards de Experiencia */}
          <div className="flex overflow-x-auto snap-x lg:flex-col justify-start lg:justify-center gap-4 lg:col-span-3 relative z-20 pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <div className="shrink-0 w-[85vw] sm:w-[320px] lg:w-full snap-start lg:shrink">
              <FadeIn delay={0.4} direction="left">
                <ExperienceCard 
                  icon={<Monitor className="h-6 w-6 text-white" />}
                  title="PANTALLA GIGANTE"
                  description="Vive el partido a lo grande."
                  image="/pantalla_gigante.png"
                />
              </FadeIn>
            </div>
            <div className="shrink-0 w-[85vw] sm:w-[320px] lg:w-full snap-start lg:shrink">
              <FadeIn delay={0.5} direction="left">
                <ExperienceCard 
                  icon={<Sofa className="h-6 w-6 text-white" />}
                  title={'SALA VIP 80"'}
                  description="Privacidad, confort y TV de 80 pulgadas."
                  image="/sala_vip.png"
                />
              </FadeIn>
            </div>
            <div className="shrink-0 w-[85vw] sm:w-[320px] lg:w-full snap-start lg:shrink">
              <FadeIn delay={0.6} direction="left">
                <ExperienceCard 
                  icon={<ShoppingBag className="h-6 w-6 text-white" />}
                  title="TIENDA FUTBOLERA"
                  description="Camisetas, balones y guayos."
                  image="/tienda_futbolera.png"
                />
              </FadeIn>
            </div>
          </div>
          
          
        </div>
      </div>
      
      {/* Ticker / Marquee Inferior */}
      <div className="absolute bottom-0 w-full overflow-hidden border-y border-zinc-800/50 bg-black/50 py-3 backdrop-blur-sm">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
           {[...Array(10)].map((_, i) => (
             <span key={i} className="font-title font-black text-sm tracking-widest text-accent-primary">
               PASIÓN. FÚTBOL. AMIGOS. TERCER TIEMPO.
             </span>
           ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ icon, title, description, image }: { icon: React.ReactNode, title: string, description: string, image?: string }) {
  return (
    <div className="group relative flex cursor-pointer items-end gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden transition-all hover:border-accent-glow hover:shadow-[0_0_20px_rgba(255,69,0,0.15)] h-[120px]">
      {image && (
        <>
          <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30" />
        </>
      )}
      <div className="relative z-10 flex w-full items-center gap-4 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black/60 border border-zinc-700/50 backdrop-blur-md">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-sm tracking-wide drop-shadow-md">{title}</h3>
          <p className="text-xs text-zinc-300 mt-1 line-clamp-2 drop-shadow-md">{description}</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-zinc-700/50 text-zinc-300 group-hover:bg-accent-primary group-hover:text-white transition-colors group-hover:border-transparent">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
