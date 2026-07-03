"use client"

import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { FadeIn } from "@/components/ui/FadeIn"
import Link from "next/link"

export function CoworkHero() {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/cowork/cowork_hero.png"
          alt="Coworking Tercer Tiempo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background-primary" />
      </div>

      {/* Day/Night badge */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md border border-zinc-700 rounded-full p-1">
          <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold text-xs">
            <Sun className="w-3.5 h-3.5 text-yellow-500" /> DÍA · Cowork &amp; Eventos
          </div>
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white px-4 py-2 rounded-full font-bold text-xs transition-colors">
            <Moon className="w-3.5 h-3.5 text-accent-primary" /> NOCHE · Bar Deportivo
          </Link>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <FadeIn direction="up">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block text-accent-primary font-bold tracking-[0.25em] uppercase text-sm mb-6 border border-accent-primary/40 bg-accent-primary/10 px-4 py-1.5 rounded-full"
          >
            De 8 AM a 6 PM · Lunes a Viernes
          </motion.span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase italic tracking-tight mb-6 leading-none">
            El Espacio que<br />
            <span className="text-accent-primary">Trabaja Contigo</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            De día, el ambiente más creativo y diferente para tus reuniones, talleres y eventos corporativos. De noche, el mejor bar deportivo de la región.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#paquetes" className="bg-accent-primary hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,69,0,0.4)] hover:shadow-[0_0_30px_rgba(255,69,0,0.6)]">
              Ver Paquetes
            </a>
            <a href="#cotizar" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all">
              Cotizar Evento
            </a>
          </div>
        </FadeIn>
      </div>

      {/* Stats strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            ["60+", "Personas capacidad"],
            ["2", "Salas VIP privadas"],
            ["85\"", "Pantallas 4K"],
            ["100%", "WiFi empresarial"],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="text-2xl font-black text-accent-primary">{num}</p>
              <p className="text-xs text-zinc-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
