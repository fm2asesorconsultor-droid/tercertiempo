"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, ChevronDown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import type { CoworkPackage, QuoteExtra, EventType } from "@/generated/prisma/client"
import { createB2BQuoteAction } from "@/lib/actions/b2b-quotes"

const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n)

type Props = {
  packages: CoworkPackage[]
  extras: QuoteExtra[]
  eventTypes: EventType[]
  whatsappNumber: string
}

export function B2BQuoteForm({ packages, extras, eventTypes, whatsappNumber }: Props) {
  const [form, setForm] = useState({
    company: "",
    name: "",
    phone: "",
    email: "",
    eventType: "",
    packageId: packages[1]?.id ?? packages[0]?.id ?? 0,
    participants: 20,
    date: "",
    message: "",
  })
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
  }

  const extrasTotal = selectedExtras.reduce((sum, id) => {
    const extra = extras.find(e => String(e.id) === id)
    return sum + (extra?.price ?? 0)
  }, 0)

  const selectedPackage = packages.find(p => p.id === form.packageId)
  const basePrice = selectedPackage?.price ?? 0
  const participantSurcharge = form.participants > 30 ? Math.floor((form.participants - 30) / 10) * 50000 : 0
  const total = basePrice + participantSurcharge + extrasTotal

  const whatsappMessage = encodeURIComponent(
    `Hola Tercer Tiempo! 👋 Quiero cotizar un evento corporativo:\n\n` +
    `🏢 Empresa: ${form.company}\n` +
    `👤 Contacto: ${form.name}\n` +
    `📱 Teléfono: ${form.phone}\n` +
    `📋 Tipo de evento: ${form.eventType}\n` +
    `📦 Paquete: ${selectedPackage?.name ?? ""}\n` +
    `👥 Participantes: ${form.participants}\n` +
    `📅 Fecha tentativa: ${form.date}\n` +
    `➕ Extras: ${selectedExtras.length > 0 ? extras.filter(e => selectedExtras.includes(String(e.id))).map(e => e.label).join(", ") : "Ninguno"}\n\n` +
    `💰 Presupuesto estimado: ${formatCOP(total)}\n\n` +
    `¡Quedo atento a su propuesta!`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const canSubmit = form.company.trim() !== "" && form.name.trim() !== "" && form.phone.trim() !== "" && form.eventType !== ""

  const handleSubmit = () => {
    setSubmitError(null)
    const fd = new FormData()
    fd.set("packageId", String(form.packageId))
    fd.set("eventType", form.eventType)
    fd.set("participants", String(form.participants))
    selectedExtras.forEach((id) => fd.append("extraIds", id))
    fd.set("companyName", form.company)
    fd.set("customerName", form.name)
    fd.set("customerPhone", form.phone)
    fd.set("customerEmail", form.email)
    fd.set("preferredDate", form.date)
    fd.set("message", form.message)

    startTransition(async () => {
      const result = await createB2BQuoteAction(fd)
      if (result.ok) {
        setSubmitted(true)
      } else {
        setSubmitError(result.error)
      }
    })
  }

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
              <input
                type="email"
                placeholder="Correo (opcional, para confirmación)"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent-primary transition-colors text-sm"
              />
              <textarea
                placeholder="Mensaje adicional (opcional)"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent-primary transition-colors text-sm"
              />
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
                  {eventTypes.map(t => <option key={t.id} value={t.label}>{t.label}</option>)}
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
                {packages.map(pkg => (
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
                    <span className={form.packageId === pkg.id ? "text-accent-primary" : "text-zinc-500"}>{formatCOP(pkg.price)}</span>
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
                    onClick={() => toggleExtra(String(extra.id))}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                      selectedExtras.includes(String(extra.id))
                        ? "bg-accent-primary/10 border-accent-primary text-white"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white"
                    }`}
                  >
                    <span>{extra.label}</span>
                    <span className={`font-bold text-xs ${selectedExtras.includes(String(extra.id)) ? "text-accent-primary" : "text-zinc-500"}`}>
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
                  const extra = extras.find(e => String(e.id) === id)
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

              {submitted ? (
                <div className="flex items-start gap-3 bg-green-600/10 border border-green-600/30 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm">¡Solicitud enviada!</p>
                    <p className="text-zinc-400 text-xs mt-1">Quedó registrada en nuestro sistema. Te contactaremos pronto.</p>
                  </div>
                </div>
              ) : (
                <>
                  {submitError && (
                    <p className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-4 py-3">{submitError}</p>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isPending}
                    className="w-full py-4 h-auto text-base font-bold"
                  >
                    {isPending ? "Enviando..." : "Enviar solicitud de cotización"}
                  </Button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-600/10 hover:bg-green-600/20 border border-green-600/30 text-green-500 font-bold py-3 rounded-xl transition-all text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Avisar también por WhatsApp
                  </a>
                  <p className="text-xs text-zinc-600 text-center">
                    Al enviar, tu solicitud queda registrada en nuestro sistema. El WhatsApp es opcional.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
