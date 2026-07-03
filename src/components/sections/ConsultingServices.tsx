"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const services = [
  {
    id: "lsp",
    name: "Lego Serious Play",
    tag: "Metodología Premium",
    description: "Una técnica de facilitación probada globalmente donde los participantes construyen modelos con LEGO para explorar desafíos empresariales, alinear visiones y tomar decisiones estratégicas. Ideal para equipos directivos.",
    image: "/cowork/lego_serious_play.png",
    duration: "4 – 8 horas",
    participants: "5 – 20 personas",
    highlight: "Incluye facilitador certificado y materiales LEGO",
    tag2: "🧩 Innovación"
  },
  {
    id: "dt",
    name: "Design Thinking & Sprint",
    tag: "Innovación",
    description: "Metodología centrada en las personas para resolver problemas complejos de forma ágil. Desde la empatía con el usuario hasta el prototipado rápido de soluciones, todo en un día intenso y transformador.",
    image: "/cowork/design_thinking.png",
    duration: "6 – 8 horas",
    participants: "10 – 40 personas",
    highlight: "Post-its, prototipos y un plan de acción concreto",
    tag2: "💡 Creatividad"
  },
  {
    id: "team",
    name: "Team Building Deportivo",
    tag: "Integración",
    description: "Combina el poder del deporte con la dinámica de equipo. Desde torneos internos en la cancha de fútbol sintético hasta retos grupales en el bar. Una forma diferente y memorable de fortalecer equipos.",
    image: "/cowork/team_building.png",
    duration: "3 – 5 horas",
    participants: "10 – 60 personas",
    highlight: "Incluye uso de la cancha sintética y brindis",
    tag2: "⚽ Deporte"
  },
  {
    id: "coaching",
    name: "Coaching Ejecutivo",
    tag: "Liderazgo",
    description: "Sesiones individuales o de equipo en las Salas VIP privadas. Un espacio íntimo, diferente a la oficina, que facilita conversaciones profundas, reflexión estratégica y planes de desarrollo de liderazgo.",
    image: "/cowork/coaching_ejecutivo.png",
    duration: "2 – 4 horas",
    participants: "1 – 10 personas",
    highlight: "Sala VIP privada con pantalla 85\" y sofás de cuero",
    tag2: "🎯 Liderazgo"
  },
]

export function ConsultingServices() {
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
                  src={service.image}
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
