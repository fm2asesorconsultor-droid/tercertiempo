"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, User, Hash, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createProductOrderAction } from "@/lib/actions/product-orders"

interface ProductCustomizerDrawerProps {
  isOpen: boolean
  onClose: () => void
  product: { id: number; name: string; price: string; image: string; canCustomize: boolean } | null
}

const sizes = ["S", "M", "L", "XL", "XXL"]
const PICKUP_WINDOWS = [
  { label: "Hoy (Próximo Partido)", value: "TODAY" as const },
  { label: "Mañana", value: "TOMORROW" as const },
  { label: "Fin de Semana", value: "WEEKEND" as const },
]

export function ProductCustomizerDrawer({ isOpen, onClose, product }: ProductCustomizerDrawerProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    size: "",
    customName: "",
    customNumber: "",
    pickupWindow: "TODAY" as "TODAY" | "TOMORROW" | "WEEKEND",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
  })
  const [result, setResult] = useState<{ confirmationCode: string; qrDataUrl: string } | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleNext = () => setStep(s => Math.min(s + 1, 3))
  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    setSubmitError(null)

    const fd = new FormData()
    fd.set("productId", String(product.id))
    fd.set("size", formData.size)
    fd.set("customName", formData.customName)
    fd.set("customNumber", formData.customNumber)
    fd.set("pickupWindow", formData.pickupWindow)
    fd.set("customerName", formData.customerName)
    fd.set("customerPhone", formData.customerPhone)
    fd.set("customerEmail", formData.customerEmail)

    startTransition(async () => {
      const res = await createProductOrderAction(fd)
      if (res.ok) {
        setResult({ confirmationCode: res.confirmationCode, qrDataUrl: res.qrDataUrl })
        setStep(3)
      } else {
        setSubmitError(res.error)
      }
    })
  }

  const pickupLabel = PICKUP_WINDOWS.find(p => p.value === formData.pickupWindow)?.label ?? ""

  // Calculate dynamic text size based on length to fit the jersey back
  const nameLength = formData.customName.length
  const fontSize = nameLength > 8 ? "text-xl" : "text-2xl"

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
                <h3 className="font-bold text-white text-xl">Personalizar y Reservar</h3>
                <p className="text-accent-primary text-sm font-semibold mt-1">
                  {product?.name}
                </p>
                <div className="text-white font-black mt-1">
                  {product?.price}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Preview Area - Always visible during steps 1 & 2 */}
            {step < 3 && (
              <div className="relative w-full h-64 bg-zinc-900 border-b border-zinc-800 flex items-center justify-center overflow-hidden">
                {/* Simulated Jersey Back Image */}
                <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
                  <img src={product?.image} alt={product?.name} className="w-full h-full object-cover" />
                </div>

                {/* Live Text Overlay */}
                <div className="relative z-10 flex flex-col items-center justify-center font-black uppercase text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                  <motion.span
                    key={`name-${formData.customName}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`tracking-widest font-title italic ${fontSize}`}
                  >
                    {formData.customName || "TU NOMBRE"}
                  </motion.span>
                  <motion.span
                    key={`number-${formData.customNumber}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-7xl font-title italic mt-2"
                  >
                    {formData.customNumber || "10"}
                  </motion.span>
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 relative">
              <AnimatePresence mode="wait">

                {/* STEP 1: SIZE AND CUSTOMIZATION */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-white font-bold mb-3">1. Selecciona tu talla</h4>
                      <div className="flex gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setFormData({...formData, size})}
                            className={`flex-1 h-12 rounded-lg font-bold transition-all ${formData.size === size ? "bg-accent-primary text-white border-2 border-accent-primary" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600"}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {product?.canCustomize && (
                      <div className="space-y-4 pt-4">
                        <h4 className="text-white font-bold mb-2">2. Personaliza la espalda (Gratis)</h4>
                        <div>
                          <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2"><User className="w-4 h-4"/> Nombre a estampar</label>
                          <Input
                            maxLength={12}
                            placeholder="Ej. FALCAO"
                            value={formData.customName}
                            onChange={(e) => setFormData({...formData, customName: e.target.value.toUpperCase()})}
                            className="w-full bg-zinc-900 border-zinc-800 font-bold uppercase"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2"><Hash className="w-4 h-4"/> Número</label>
                          <Input
                            type="number"
                            min="1"
                            max="99"
                            placeholder="Ej. 9"
                            value={formData.customNumber}
                            onChange={(e) => setFormData({...formData, customNumber: e.target.value})}
                            className="w-full bg-zinc-900 border-zinc-800 font-bold"
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleNext}
                      className="w-full h-12 mt-6"
                      disabled={!formData.size}
                    >
                      Continuar a Reserva
                    </Button>
                  </motion.div>
                )}

                {/* STEP 2: CLICK & COLLECT */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <form onSubmit={handleComplete} className="space-y-6">
                      <h4 className="text-white font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-accent-primary" />
                        ¿Cuándo pasas por el bar a recogerlo?
                      </h4>

                      <p className="text-sm text-zinc-400">
                        Recuerda que no hacemos envíos. Debes reclamar tu producto en la barra de Tercer Tiempo.
                      </p>

                      <div className="space-y-3">
                        {PICKUP_WINDOWS.map((window) => (
                          <div
                            key={window.value}
                            onClick={() => setFormData({...formData, pickupWindow: window.value})}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.pickupWindow === window.value ? "border-accent-primary bg-accent-primary/10" : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"}`}
                          >
                            <h5 className="font-bold text-white">{window.label}</h5>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="text-sm text-zinc-400 mb-2 block">Tu nombre</label>
                          <Input
                            required
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            className="w-full bg-zinc-900 border-zinc-800"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400 mb-2 block">WhatsApp</label>
                          <Input
                            required
                            type="tel"
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                            className="w-full bg-zinc-900 border-zinc-800"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400 mb-2 block">Correo (opcional, para confirmación)</label>
                          <Input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                            className="w-full bg-zinc-900 border-zinc-800"
                          />
                        </div>
                      </div>

                      {submitError && (
                        <p className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-4 py-3">{submitError}</p>
                      )}

                      <div className="flex gap-4 pt-2">
                        <Button type="button" variant="outline" onClick={handleBack} className="w-full h-12 border-zinc-700">Atrás</Button>
                        <Button type="submit" className="w-full h-12" disabled={isPending}>
                          {isPending ? "Confirmando..." : "Confirmar Click & Collect"}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 3: SUCCESS */}
                {step === 3 && result && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center h-full space-y-4 pb-12"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase italic">¡Reserva Lista!</h3>

                    <div className="bg-white p-4 rounded-lg my-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={result.qrDataUrl} alt={`Código QR ${result.confirmationCode}`} className="w-32 h-32" />
                    </div>

                    <p className="text-accent-primary font-black text-lg tracking-widest">{result.confirmationCode}</p>

                    <p className="text-zinc-400 text-sm">
                      Muestra este código QR en la barra el día <strong className="text-white">{pickupLabel}</strong> para pagar y recoger tu {product?.name}.
                    </p>

                    {product?.canCustomize && (
                      <div className="w-full p-4 bg-zinc-900 border border-zinc-800 mt-4 rounded-lg">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Personalización Guardada</p>
                        <p className="text-lg font-bold text-white uppercase">{formData.customName} - {formData.customNumber}</p>
                        <p className="text-sm text-zinc-400">Talla: {formData.size}</p>
                      </div>
                    )}

                    <Button onClick={onClose} className="mt-8 w-full h-12">
                      Seguir Comprando
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
