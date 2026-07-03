"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, MapPin, CalendarDays, CheckCircle2, ChevronRight, ChevronLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { BarZoneMap, barZones } from "@/components/ui/BarZoneMap"
import { MatchCalendar } from "@/components/ui/MatchCalendar"

const STEPS = [
  { id: 1, icon: User, label: "Tu Info", description: "Cuéntanos quién eres" },
  { id: 2, icon: MapPin, label: "Tu Zona", description: "Elige tu rincón del bar" },
  { id: 3, icon: CalendarDays, label: "Tu Partido", description: "Selecciona la fecha" },
  { id: 4, icon: CheckCircle2, label: "Confirmación", description: "¡Todo listo!" },
]

function generateCode() {
  return `#TT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
}

export function ReservationStepper() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: "", phone: "", guests: "2" })
  const [zone, setZone] = useState<string | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [reservationCode] = useState(generateCode)

  const canProceed = () => {
    if (step === 1) return form.name.trim() !== "" && form.phone.trim() !== ""
    if (step === 2) return zone !== null
    if (step === 3) return date !== null
    return true
  }

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-")
    return `${day}/${m}/${y}`
  }

  const selectedZone = barZones.find(z => z.id === zone)

  const whatsappMessage = encodeURIComponent(
    `Hola Tercer Tiempo! 👋\n\nQuiero confirmar mi reserva:\n\n🔑 Código: ${reservationCode}\n👤 Nombre: ${form.name}\n👥 Personas: ${form.guests}\n📍 Zona: ${selectedZone?.name}\n📅 Fecha: ${date ? formatDate(date) : ""}\n📱 Teléfono: ${form.phone}\n\n¡Los espero!`
  )
  const whatsappUrl = `https://wa.me/573000000000?text=${whatsappMessage}`

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-800 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-accent-primary z-0 transition-all duration-500"
          style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((s) => {
          const Icon = s.icon
          const done = step > s.id
          const active = step === s.id
          return (
            <div key={s.id} className="flex flex-col items-center gap-2 z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                done ? "bg-accent-primary border-accent-primary" :
                active ? "bg-zinc-900 border-accent-primary shadow-[0_0_12px_rgba(255,69,0,0.5)]" :
                "bg-zinc-900 border-zinc-700"
              }`}>
                <Icon className={`w-5 h-5 ${done || active ? "text-white" : "text-zinc-600"}`} />
              </div>
              <span className={`text-xs font-bold hidden sm:block ${active ? "text-white" : done ? "text-accent-primary" : "text-zinc-600"}`}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-black text-white mb-2">Tu información</h2>
                <p className="text-zinc-400 text-sm mb-8">Cuéntanos quién va a vivir la experiencia</p>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Nombre completo *</label>
                    <input
                      type="text"
                      placeholder="Ej: Carlos Valderrama"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">WhatsApp / Teléfono *</label>
                    <input
                      type="tel"
                      placeholder="Ej: 300 123 4567"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">¿Cuántos son? *</label>
                    <div className="flex gap-3 flex-wrap">
                      {["1","2","3","4","5","6","7","8","10","12","15","20+"].map(n => (
                        <button
                          key={n}
                          onClick={() => setForm({ ...form, guests: n })}
                          className={`w-14 h-12 rounded-xl font-bold text-sm transition-all ${
                            form.guests === n
                              ? "bg-accent-primary text-white shadow-[0_0_10px_rgba(255,69,0,0.4)]"
                              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-black text-white mb-2">Elige tu zona</h2>
                <p className="text-zinc-400 text-sm mb-8">Haz clic directamente sobre el área del bar donde quieres estar</p>
                <BarZoneMap selected={zone} onSelect={setZone} />
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-black text-white mb-2">Selecciona la fecha</h2>
                <p className="text-zinc-400 text-sm mb-8">Los días con puntos de colores tienen partidos programados</p>
                <MatchCalendar selected={date} onSelect={setDate} />
              </motion.div>
            )}

            {/* STEP 4 - CONFIRMACIÓN */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-accent-primary/20 border-2 border-accent-primary rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-10 h-10 text-accent-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-white mb-1">¡Casi listo!</h2>
                  <p className="text-zinc-400 text-sm">Confirma tu reserva por WhatsApp para asegurar tu lugar</p>
                </div>

                {/* Reservation Card */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 mb-8">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Código de Reserva</span>
                    <span className="text-accent-primary font-black text-xl tracking-widest">{reservationCode}</span>
                  </div>
                  {[
                    ["👤 Nombre", form.name],
                    ["👥 Personas", form.guests],
                    ["📍 Zona", selectedZone?.name ?? "—"],
                    ["📅 Fecha", date ? formatDate(date) : "—"],
                    ["📱 Teléfono", form.phone],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-zinc-400 text-sm">{label}</span>
                      <span className="text-white font-bold text-sm">{value}</span>
                    </div>
                  ))}
                </div>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 shadow-[0_0_25px_rgba(22,163,74,0.4)] hover:shadow-[0_0_35px_rgba(22,163,74,0.6)] transition-all">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Confirmar por WhatsApp
                  </Button>
                </a>
                <p className="text-center text-xs text-zinc-600 mt-3">
                  Se abrirá WhatsApp con tu resumen de reserva listo para enviar
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        {step < 4 && (
          <div className="px-8 pb-8 flex justify-between">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white"
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
            <Button
              onClick={() => setStep(s => Math.min(4, s + 1))}
              disabled={!canProceed()}
              className="gap-2"
            >
              {step === 3 ? "Ver Confirmación" : "Siguiente"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
