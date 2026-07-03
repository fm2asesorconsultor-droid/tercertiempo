import { FadeIn } from "@/components/ui/FadeIn"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Send } from "lucide-react"
import Image from "next/image"

export function NewsletterSection() {
  return (
    <section className="w-full relative z-20">
      {/* Fondo naranja con los brillos encapsulados para no desbordar al resto de la página */}
      <div className="absolute inset-0 bg-accent-primary overflow-hidden z-0">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-black opacity-20 blur-3xl"></div>
      </div>
      
      {/* Imagen de los fans sobresaliendo por encima de la franja (oculta en móvil) */}
      <div className="hidden lg:flex absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[135%] z-10 pointer-events-none opacity-100 items-end justify-center">
        <img 
          src="/fans-transparent.png" 
          alt="Hinchas celebrando" 
          className="max-h-full max-w-full object-contain object-bottom drop-shadow-2xl"
        />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-20 py-16 md:py-20">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          <FadeIn direction="right" className="flex-1 max-w-xl text-center lg:text-left drop-shadow-lg">
            <h2 className="font-title font-black text-4xl md:text-5xl text-white">
              UNETE AL EQUIPO TITULAR
            </h2>
            <p className="mt-2 text-white font-medium text-lg lg:max-w-md">
              Suscríbete para recibir acceso prioritario a reservas de partidos importantes, promociones en nuestra tienda y noticias exclusivas.
            </p>
          </FadeIn>
          
          <FadeIn direction="left" delay={0.2} className="w-full flex-1 max-w-md lg:ml-auto">
            <form className="flex w-full gap-2 bg-black/30 p-2 rounded-lg backdrop-blur-md border border-white/20 shadow-2xl">
              <Input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="flex-1 bg-white/95 text-black border-0 focus-visible:ring-2 focus-visible:ring-black placeholder:text-zinc-600 font-medium"
                required
              />
              <Button type="submit" variant="default" className="bg-black text-white hover:bg-zinc-800 shrink-0 font-bold border border-zinc-700">
                <span className="hidden sm:inline mr-2">SUSCRIBIRME</span>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
