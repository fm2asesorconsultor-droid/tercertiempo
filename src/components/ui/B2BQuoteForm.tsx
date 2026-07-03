"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/Button"

const eventTypes = ["Reunión de equipo", "Taller Lego Serious Play", "Design Thinking / Sprint", "Team Building", "Coaching Ejecutivo", "Capacitación / Formación", "Lanzamiento de producto", "Otro"]

const extras = [
  { id: "catering", label: "Catering personalizado", price: 80000 },
  { id: "facilitador", label: "Facilitador profesional", price: 350000 },
  { id: "lsp-kit", label: "Kit Lego Serious Play", price: 200000 },
  { id: "fotografia", label: "Fotografía del evento", price: 120000 },
  { id: "streaming", label: "Transmisión en vivo", price: 180000 },
  { id: "vip", label: "Sala VIP privada", price: 250000 },
]

const baseRates: Record<string, number> = {
  "medio-tiempo": 250000,
  "tiempo-completo": 480000,
  "estadio": 800000,
}

const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n)

export function B2BQuoteForm() {
  const [form, setForm] = useState({
    company: "",
    name: "",
    phone: "",
    eventType: "",
    packageId: "tiempo-completo",
    participants: 20,
    date: "",
  })
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
  }

  const extrasTotal = selectedExtras.reduce((sum, id) => {
    const extra = extras.find(e => e.id === id)
    return sum + (extra?.price ?? 0)
  }, 0)

  const basePrice = baseRates[form.packageId] ?? 0
  const participantSurcharge = form.participants > 30 ? Math.floor((form.participants - 30) / 10) * 50000 : 0
  const total = basePrice + participantSurcharge + extrasTotal

  const whatsappMessage = encodeURIComponent(
    `Hola Tercer Tiempo! 👋 Quiero cotizar un evento corporativo:\n\n` +
    `🏢 Empresa: ${form.company}\n` +
    `👤 Contacto: ${form.name}\n` +
    `📱 Teléfono: ${form.phone}\n` +
    `📋 Tipo de evento: ${form.eventType}\n` +
    `📦 Paquete: ${form.packageId}\n` +
    `👥 Participantes: ${form.participants}\n` +
    `📅 Fecha tentativa: ${form.date}\n` +
    `➕ Extras: ${selectedExtras.length > 0 ? selectedExtras.join(", ") : "Ninguno"}\n\n` +
    `💰 Presupuesto estimado: ${formatCOP(total)}\n\n` +
    `¡Quedo atento a su propuesta!`
  )
  const whatsappUrl = `https://wa.me/573000000000?text=${whatsappMessage}`

  return (
    <section id="cotizar" className="py-24 bg-background-primary border-t border-zinc-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-accent-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Solicitud de Cotización</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Arma tu <span className="text-accent-primary italic">Presupuesto</span>
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">Configura tu evento y ve el estimado en tiempo real. Sin compromiso.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Form — 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            {/* Company & Contact */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold text-lg border-b border-zinc-800 pb-4">1. Datos de contacto</h3>
              <input
                type="text"
                placeholder="Nombre de la empresa *"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent-primary transition-colors text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tu nombre *"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent-primary transition-colors text-sm"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp *"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent-primary transition-colors text-sm"
                />
              </div>
            </div>

            {/* Event Type */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold text-lg border-b border-zinc-800 pb-4">2. Tipo de evento</h3>
              <div className="relative">
                <select
                  value={form.eventType}
                  onChange={e => setForm({ ...form, eventType: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors text-sm appearance-none"
                >
                  <option value="" disabled>Selecciona el tipo de evento *</option>
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors text-sm"
              />
            </div>

            {/* Package */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold text-lg border-b border-zinc-800 pb-4">3. Paquete base</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: "medio-tiempo", name: "Medio Tiempo (AM)", price: "$ 250.000" },
                  { id: "tiempo-completo", name: "Tiempo Completo (Full Day)", price: "$ 480.000" },
                  { id: "estadio", name: "Paquete Estadio (Especial)", price: "$ 800.000" },
                ].map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => setForm({ ...form, packageId: pkg.id })}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border text-sm font-bold transition-all ${
                      form.packageId === pkg.id
                        ? "bg-accent-primary/10 border-accent-primary text-white"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white"
                    }`}
                  >
                    <span>{pkg.name}</span>
                    <span className={form.packageId === pkg.id ? "text-accent-primary" : "text-zinc-500"}>{pkg.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Participants */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h3 className="text-white font-bold text-lg">4. Participantes</h3>
                <span className="text-3xl font-black text-accent-primary">{form.participants}</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={form.participants}
                onChange={e => setForm({ ...form, participants: Number(e.target.value) })}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-zinc-500 font-bold">
                <span>5 personas</span>
                <span>80 personas</span>
              </div>
              {form.participants > 30 && (
                <p className="text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                  ⚠ Grupos mayores de 30 personas tienen un cargo adicional de {formatCOP(participantSurcharge)}
                </p>
              )}
            </div>

            {/* Extras */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold text-lg border-b border-zinc-800 pb-4">5. Servicios adicionales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {extras.map(extra => (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                      selectedExtras.includes(extra.id)
                        ? "bg-accent-primary/10 border-accent-primary text-white"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white"
                    }`}
                  >
                    <span>{extra.label}</span>
                    <span className={`font-bold text-xs ${selectedExtras.includes(extra.id) ? "text-accent-primary" : "text-zinc-500"}`}>
                      +{formatCOP(extra.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Summary — 2 cols */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <h3 className="text-white font-bold text-lg border-b border-zinc-800 pb-4">Resumen de cotización</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Paquete base</span>
                  <span className="text-white font-bold">{formatCOP(basePrice)}</span>
                </div>
                {participantSurcharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Cargo por grupo grande</span>
                    <span className="text-yellow-400 font-bold">+{formatCOP(participantSurcharge)}</span>
                  </div>
                )}
                {selectedExtras.map(id => {
                  const extra = extras.find(e => e.id === id)
                  return extra ? (
                    <div key={id} className="flex justify-between">
                      <span className="text-zinc-400">{extra.label}</span>
                      <span className="text-white font-bold">+{formatCOP(extra.price)}</span>
                    </div>
                  ) : null
                })}
              </div>

              <div className="border-t border-zinc-700 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-zinc-300 font-bold">Estimado total</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={total}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="text-4xl font-black text-accent-primary"
                  >
                    {formatCOP(total)}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-zinc-500 mt-1">Precio estimado · Sujeto a confirmación</p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)]"
              >
                <MessageCircle className="w-5 h-5" />
                Enviar cotización por WhatsApp
              </a>
              <p className="text-xs text-zinc-600 text-center">
                Se abrirá WhatsApp con el resumen completo de tu evento listo para enviar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
