import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Send, Users, Camera } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border-default bg-background-primary py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Tercer Tiempo Logo" 
                width={160} 
                height={48} 
                className="h-10 w-auto object-contain md:h-12"
              />
            </div>
            <p className="text-sm text-text-secondary">
              Más que un bar.<br/>
              El lugar donde el fútbol<br/>
              sigue después del pitazo final.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-text-muted hover:bg-accent-primary hover:text-white transition-colors">
                <Camera className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-text-muted hover:bg-accent-primary hover:text-white transition-colors">
                <Users className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-text-primary">ENLACES RÁPIDOS</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/" className="hover:text-accent-primary transition-colors">Inicio</Link></li>
              <li><Link href="/menu" className="hover:text-accent-primary transition-colors">Menú</Link></li>
              <li><Link href="/partidos" className="hover:text-accent-primary transition-colors">Partidos</Link></li>
              <li><Link href="/salas-vip" className="hover:text-accent-primary transition-colors">Salas VIP</Link></li>
              <li><Link href="/tienda" className="hover:text-accent-primary transition-colors">Tienda</Link></li>
              <li><Link href="/contacto" className="hover:text-accent-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-text-primary">INFORMACIÓN</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/contacto" className="hover:text-accent-primary transition-colors">¿Cómo llegar?</Link></li>
              <li><Link href="/faq" className="hover:text-accent-primary transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/politicas" className="hover:text-accent-primary transition-colors">Políticas</Link></li>
              <li><Link href="/trabaja-con-nosotros" className="hover:text-accent-primary transition-colors">Trabaja con nosotros</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-text-primary">RECIBE NOVEDADES EXCLUSIVAS</h4>
            <p className="text-sm text-text-secondary">
              Sé el primero en enterarte de eventos, promociones, productos y reservas especiales.
            </p>
            <form className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="max-w-[200px]"
                required
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Suscribirse</span>
              </Button>
            </form>
          </div>

        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border-default pt-8 text-xs text-text-muted md:flex-row">
          <p>© {new Date().getFullYear()} TERCER TIEMPO. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <Link href="/terminos" className="hover:text-text-secondary transition-colors">TÉRMINOS Y CONDICIONES</Link>
            <Link href="/privacidad" className="hover:text-text-secondary transition-colors">PRIVACIDAD</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
