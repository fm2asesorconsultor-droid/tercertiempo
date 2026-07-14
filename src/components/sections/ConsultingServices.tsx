"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { ConsultingService } from "@/generated/prisma/client"

type Props = {
  services: ConsultingService[]
}

export function ConsultingServices({ services }: Props) {
  const scrollToForm = () => {
    document.getElementById("cotizar")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-accent-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Metodologías & Consultoría</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Experiencias que <span className="text-accent-primary italic">Transforman</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Más que un espacio, ofrecemos metodologías que generan resultados reales para tu empresa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden hover:border-accent-primary/40 transition-all"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/60 backdrop-blur-md border border-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1 rounded-full">
                    {service.tag2}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-black text-white mb-3">{service.name}</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{service.description}</p>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-lg">
                    ⏱ {service.duration}
                  </span>
                  <span className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-lg">
                    👥 {service.participants}
                  </span>
                </div>

                {/* Highlight */}
                <div className="bg-accent-primary/10 border border-accent-primary/30 rounded-xl px-4 py-3 mb-6">
                  <p className="text-accent-primary text-xs font-bold">✓ {service.highlight}</p>
                </div>

                <button
                  onClick={scrollToForm}
                  className="flex items-center gap-2 text-accent-primary font-bold text-sm hover:gap-3 transition-all group-hover:underline"
                >
                  Solicitar cotización <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
