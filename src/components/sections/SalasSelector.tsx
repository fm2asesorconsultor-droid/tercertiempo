"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Users, Trophy } from "lucide-react"
import { ReservationDrawer } from "@/components/ui/ReservationDrawer"
import type { SalaVip } from "@/generated/prisma/client"

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponible",
  LIMITED: "Últimos Cupos",
  FULL: "Completa",
}

type Props = {
  salas: SalaVip[]
}

export function SalasSelector({ salas }: Props) {
  const [selectedSala, setSelectedSala] = useState<SalaVip | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [flippedId, setFlippedId] = useState<number | null>(null)

  const openReservation = (sala: SalaVip) => {
    setSelectedSala(sala)
    setIsDrawerOpen(true)
  }

  return (
    <section className="py-24 bg-background-primary relative">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight mb-4">
            Elige tu <span className="text-accent-primary">Estadio</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Gira la tarjeta para conocer los detalles y reserva la sala que mejor se adapte a tu equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-[1000px] max-w-5xl mx-auto">
          {salas.map((sala) => {
            const isFlipped = flippedId === sala.id
            return (
            <div
              key={sala.id}
              className="relative w-full h-[500px] group [perspective:1000px] cursor-pointer"
              onClick={() => setFlippedId(isFlipped ? null : sala.id)}
              role="button"
              tabIndex={0}
              aria-pressed={isFlipped}
              aria-label={`Ver detalles de ${sala.name}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setFlippedId(isFlipped ? null : sala.id)
                }
              }}
            >

              {/* Contenedor que hace el flip (preserve-3d). En desktop, hover ya
                  muestra el reverso; en touch no existe hover real, por eso el
                  estado isFlipped (tap/click) también fuerza el giro. */}
              <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] shadow-2xl rounded-2xl ${isFlipped ? "[transform:rotateY(180deg)]" : "group-hover:[transform:rotateY(180deg)]"}`}>

                {/* FRONT de la tarjeta */}
                <div className="absolute inset-0 w-full h-full bg-zinc-900 rounded-2xl overflow-hidden [backface-visibility:hidden]">
                  <div className="relative h-full w-full">
                    <Image
                      src={sala.imageUrl}
                      alt={sala.name}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                    {/* Contenido frontal */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">

                      {/* Indicador de Status */}
                      <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <span className="relative flex h-3 w-3">
                          {sala.status === 'AVAILABLE' && (
                            <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></>
                          )}
                          {sala.status === 'LIMITED' && (
                            <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></>
                          )}
                          {sala.status === 'FULL' && (
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          )}
                        </span>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {STATUS_LABEL[sala.status]}
                        </span>
                      </div>

                      <h3 className="text-3xl font-black text-white italic mb-2 uppercase">{sala.name}</h3>
                      <div className="flex items-center gap-4 text-zinc-300">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-accent-primary" />
                          <span className="font-medium">Hasta {sala.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACK de la tarjeta (rotada 180deg) */}
                <div className="absolute inset-0 w-full h-full bg-zinc-900 rounded-2xl border border-zinc-800 p-8 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col">
                  
                  <h3 className="text-2xl font-black text-accent-primary italic mb-6 uppercase border-b border-zinc-800 pb-4">
                    {sala.name}
                  </h3>
                  
                  <div className="flex-1 space-y-6">
                    <div>
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-accent-primary" />
                        Amenidades VIP
                      </h4>
                      <ul className="space-y-2">
                        {sala.features.map((feature, idx) => (
                          <li key={idx} className="text-zinc-400 text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-1.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-1">Precio Estimado</span>
                      <span className="text-white font-bold text-xl">{sala.priceLabel}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openReservation(sala)
                    }}
                    disabled={sala.status === 'FULL'}
                    className={`w-full py-4 rounded-lg font-bold uppercase tracking-wider transition-colors mt-4
                      ${sala.status === 'FULL'
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        : 'bg-accent-primary text-white hover:bg-white hover:text-black'}
                    `}
                  >
                    {sala.status === 'FULL' ? 'No Disponible' : 'Reservar Ahora'}
                  </button>

                </div>

              </div>
            </div>
            )
          })}
        </div>
      </div>

      <ReservationDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        sala={selectedSala} 
      />
    </section>
  )
}
