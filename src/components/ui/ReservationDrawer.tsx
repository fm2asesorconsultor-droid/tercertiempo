"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Users, Trophy, ChevronRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface ReservationDrawerProps {
  isOpen: boolean
  onClose: () => void
  sala: any
}

export function ReservationDrawer({ isOpen, onClose, sala }: ReservationDrawerProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    date: "",
    people: 2,
    package: "basico",
    name: "",
    phone: ""
  })

  const handleNext = () => setStep(s => Math.min(s + 1, 4))
  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(4) // Success step
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
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
                <h3 className="font-bold text-white text-xl">Reservar Sala</h3>
                <p className="text-accent-primary text-sm font-semibold">{sala?.name}</p>
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
                
                {/* STEP 1: DATE & PEOPLE */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-accent-primary" />
                        ¿Cuándo nos visitas?
                      </h4>
                      <Input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-zinc-900 border-zinc-800 h-12"
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-accent-primary" />
                        ¿Cuántos son? (Máx. {sala?.capacity})
                      </h4>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="2" 
                          max={sala?.capacity || 10} 
                          value={formData.people}
                          onChange={(e) => setFormData({...formData, people: parseInt(e.target.value)})}
                          className="flex-1 accent-accent-primary"
                        />
                        <span className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xl text-white">
                          {formData.people}
                        </span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleNext} 
                      className="w-full h-12" 
                      disabled={!formData.date}
                    >
                      Siguiente Paso <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* STEP 2: PACKAGES */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-accent-primary" />
                      Elige tu paquete
                    </h4>
                    
                    {/* Paquete Basico */}
                    <div 
                      onClick={() => setFormData({...formData, package: "basico"})}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.package === "basico" ? "border-accent-primary bg-accent-primary/10" : "border-zinc-800 bg-zinc-900"}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-bold text-white">Básico</h5>
                        <span className="text-accent-primary font-bold">Incluido</span>
                      </div>
                      <p className="text-sm text-zinc-400">Acceso a la sala privada y pantalla gigante. Consumo a la carta.</p>
                    </div>

                    {/* Paquete Campeon */}
                    <div 
                      onClick={() => setFormData({...formData, package: "campeon"})}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.package === "campeon" ? "border-accent-primary bg-accent-primary/10" : "border-zinc-800 bg-zinc-900"}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-bold text-white">Campeón</h5>
                        <span className="text-accent-primary font-bold">+$30.000</span>
                      </div>
                      <p className="text-sm text-zinc-400">Incluye tabla de picadas premium y jarra de cerveza artesanal.</p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={handleBack} className="w-full h-12 border-zinc-700">Atrás</Button>
                      <Button onClick={handleNext} className="w-full h-12">Siguiente <ChevronRight className="w-5 h-5 ml-2" /></Button>
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
                    <h4 className="text-white font-bold mb-6">Tus Datos</h4>
                    <form onSubmit={handleComplete} className="space-y-4">
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Nombre completo</label>
                        <Input 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-zinc-900 border-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block">WhatsApp</label>
                        <Input 
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-zinc-900 border-zinc-800"
                        />
                      </div>
                      
                      <div className="bg-zinc-900 p-4 rounded-lg mt-6 border border-zinc-800">
                        <h5 className="font-bold text-white text-sm mb-2">Resumen:</h5>
                        <ul className="text-sm text-zinc-400 space-y-1">
                          <li>Sala: {sala?.name}</li>
                          <li>Fecha: {formData.date}</li>
                          <li>Personas: {formData.people}</li>
                          <li>Paquete: <span className="capitalize">{formData.package}</span></li>
                        </ul>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={handleBack} className="w-full h-12 border-zinc-700">Atrás</Button>
                        <Button type="submit" className="w-full h-12">Confirmar Reserva</Button>
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
                    className="flex flex-col items-center justify-center text-center h-full space-y-4"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">¡Reserva Confirmada!</h3>
                    <p className="text-zinc-400">
                      Hola {formData.name}, hemos recibido tu solicitud. Te enviaremos un mensaje a tu WhatsApp ({formData.phone}) con los detalles.
                    </p>
                    <Button onClick={onClose} className="mt-8 w-full h-12">
                      Volver a Salas
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
