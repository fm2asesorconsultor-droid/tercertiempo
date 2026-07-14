"use client"

import { motion } from "framer-motion"
import { Check, Zap, Trophy, Crown, type LucideIcon } from "lucide-react"
import type { CoworkPackage, CoworkPackageFeature } from "@/generated/prisma/client"

const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  trophy: Trophy,
  crown: Crown,
}

const formatCOP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })

type Props = {
  packages: (CoworkPackage & { features: CoworkPackageFeature[] })[]
}

export function CoworkPackages({ packages }: Props) {
  const scrollToForm = () => {
    document.getElementById("cotizar")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="paquetes" className="py-24 bg-background-primary">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-accent-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Soluciones Corporativas</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Paquetes <span className="text-accent-primary italic">Todo Incluido</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Sin sorpresas. Sin cobros ocultos. Elige el paquete que se adapta a tu equipo y tu presupuesto.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {packages.map((pkg, i) => {
            const Icon = ICONS[pkg.iconKey] ?? Zap
            const isAccent = pkg.theme === "ACCENT"
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl border p-8 flex flex-col ${
                  isAccent
                    ? "bg-accent-primary/10 border-accent-primary shadow-[0_0_40px_rgba(255,69,0,0.15)]"
                    : "bg-zinc-900 border-zinc-800"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-primary text-white text-xs font-black px-4 py-1 rounded-full tracking-wider uppercase">
                    Más popular
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isAccent ? "bg-accent-primary/30 border border-accent-primary/50" : "bg-zinc-800 border border-zinc-700"}`}>
                  <Icon className={`w-7 h-7 ${isAccent ? "text-accent-primary" : "text-zinc-300"}`} />
                </div>

                <h3 className="text-2xl font-black text-white mb-1">{pkg.name}</h3>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">{pkg.subtitle}</p>
                <p className={`text-3xl font-black mb-8 ${isAccent ? "text-accent-primary" : "text-white"}`}>{formatCOP.format(pkg.price)}</p>

                <ul className="space-y-3 mb-10 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f.id} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isAccent ? "text-accent-primary" : "text-green-500"}`} />
                      {f.text}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToForm}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                    isAccent
                      ? "bg-accent-primary hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(255,69,0,0.4)]"
                      : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  {pkg.ctaLabel}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
