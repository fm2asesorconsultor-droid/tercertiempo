"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Users, MapPin, ChevronRight, CheckCircle2, Ticket } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import type { Zone } from "@/generated/prisma/client"
import type { MatchWithTeams } from "@/lib/data/matches"
import { formatShortDate, formatTime } from "@/lib/date-format"
import { createPartidoReservationAction } from "@/lib/actions/reservations"

interface MatchReservationDrawerProps {
  isOpen: boolean
  onClose: () => void
  match: MatchWithTeams | null
  zones: Zone[]
}

const FLOOR_LABEL: Record<number, string> = { 1: "Primer Piso", 2: "Segundo Piso" }

export function MatchReservationDrawer({ isOpen, onClose, match, zones }: MatchReservationDrawerProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    zoneSlug: "",
    people: 4,
    name: "",
    phone: "",
    email: "",
  })
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleNext = () => setStep(s => Math.min(s + 1, 4))
  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const selectedZone = zones.find(z => z.slug === formData.zoneSlug)

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault()
    if (!match) return
    setSubmitError(null)

    const fd = new FormData()
    fd.set("customerName", formData.name)
    fd.set("customerPhone", formData.phone)
    fd.set("customerEmail", formData.email)
    fd.set("partySize", String(formData.people))
    fd.set("zoneSlug", formData.zoneSlug)
    fd.set("matchId", String(match.id))

    startTransition(async () => {
      const result = await createPartidoReservationAction(fd)
      if (result.ok) {
        setConfirmationCode(result.confirmationCode)
        setStep(4)
      } else {
        setSubmitError(result.error)
      }
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-background-surface">
              <div>
                <h3 className="font-bold text-white text-xl">Reservar Mesa</h3>
                <p className="text-accent-primary text-sm font-semibold mt-1">
                  {match?.homeTeam.name} vs {match?.awayTeam.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{match && `${formatShortDate(match.kickoffAt)} - ${formatTime(match.kickoffAt)}`}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 relative">
              <AnimatePresence mode="wait">

                {/* STEP 1: ZONE SELECTION */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-accent-primary" />
                      ¿En qué zona del estadio te sentarás?
                    </h4>

                    <div className="space-y-3">
                      {zones.map((zone) => (
                        <div
                          key={zone.id}
                          onClick={() => setFormData({ ...formData, zoneSlug: zone.slug })}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.zoneSlug === zone.slug ? "border-accent-primary bg-accent-primary/10" : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="font-bold text-white">{zone.name}</h5>
                            <span className="text-xs font-bold px-2 py-1 bg-black rounded-md text-zinc-400">{FLOOR_LABEL[zone.floor]}</span>
                          </div>
                          <p className="text-sm text-zinc-400">{zone.description}</p>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleNext}
                      className="w-full h-12 mt-6"
                      disabled={!formData.zoneSlug}
                    >
                      Continuar <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* STEP 2: PEOPLE */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-accent-primary" />
                        ¿Cuántos hinchas son?
                      </h4>
                      <p className="text-sm text-zinc-400 mb-6">
                        Seleccionaste: {selectedZone?.name}. Las mesas son de hasta 10 personas. Para grupos más grandes recomendamos las Salas VIP.
                      </p>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={formData.people}
                          onChange={(e) => setFormData({ ...formData, people: parseInt(e.target.value) })}
                          className="flex-1 accent-accent-primary"
                        />
                        <span className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xl text-white shrink-0">
                          {formData.people}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-8">
                      <Button variant="outline" onClick={handleBack} className="w-full h-12 border-zinc-700">Atrás</Button>
                      <Button onClick={handleNext} className="w-full h-12">Continuar <ChevronRight className="w-5 h-5 ml-2" /></Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: USER DATA */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-accent-primary" />
                      Asegura tu entrada
                    </h4>
                    <form onSubmit={handleComplete} className="space-y-4">
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Nombre completo (Capitán del equipo)</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-zinc-900 border-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block">WhatsApp de contacto</label>
                        <Input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-zinc-900 border-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Correo (opcional, para confirmación)</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-zinc-900 border-zinc-800"
                        />
                      </div>

                      <div className="bg-zinc-900 p-4 rounded-lg mt-6 border border-zinc-800">
                        <h5 className="font-bold text-white text-sm mb-3">Resumen del Partido:</h5>
                        <ul className="text-sm text-zinc-400 space-y-2">
                          <li className="flex justify-between"><span className="text-zinc-500">Partido:</span> <span className="text-right font-medium text-white">{match?.homeTeam.name} vs {match?.awayTeam.name}</span></li>
                          <li className="flex justify-between"><span className="text-zinc-500">Fecha/Hora:</span> <span className="text-right text-white">{match && `${formatShortDate(match.kickoffAt)} - ${formatTime(match.kickoffAt)}`}</span></li>
                          <li className="flex justify-between"><span className="text-zinc-500">Zona:</span> <span className="text-right text-accent-primary font-bold">{selectedZone?.name}</span></li>
                          <li className="flex justify-between"><span className="text-zinc-500">Hinchas:</span> <span className="text-right text-white">{formData.people} personas</span></li>
                        </ul>
                      </div>

                      {submitError && (
                        <p className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-4 py-3">{submitError}</p>
                      )}

                      <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={handleBack} className="w-full h-12 border-zinc-700">Atrás</Button>
                        <Button type="submit" className="w-full h-12" disabled={isPending}>
                          {isPending ? "Confirmando..." : "Confirmar Reserva"}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 4: SUCCESS */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center h-full space-y-4 pb-12"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase italic">¡Reserva Confirmada!</h3>
                    <p className="text-zinc-400 text-sm">
                      Crack {formData.name}, hemos asegurado tu mesa en la zona de <strong className="text-white">{selectedZone?.name}</strong> para disfrutar de este partidazo.
                    </p>
                    <div className="w-full p-4 bg-zinc-900 border-l-4 border-accent-primary text-left mt-4 rounded-r-lg">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Código de confirmación</p>
                      <p className="text-accent-primary font-black text-xl tracking-widest">{confirmationCode}</p>
                    </div>
                    <Button onClick={onClose} className="mt-8 w-full h-12">
                      Ver más partidos
                    </Button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
