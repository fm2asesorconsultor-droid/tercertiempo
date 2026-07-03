"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Users, Tv, GlassWater, Trophy } from "lucide-react"
import { ReservationDrawer } from "@/components/ui/ReservationDrawer"

const mockSalas = [
  {
    id: 1,
    name: "Sala Champions",
    image: "/gallery_sala_vip.png",
    capacity: 12,
    status: "available",
    features: ["Pantalla 85 Pulgadas", "Sofás en cuero", "Sillas huevo en cuero", "Atención VIP"],
    price: "Desde $150.000",
  },
  {
    id: 2,
    name: "Sala Libertadores",
    image: "/sala_vip.png",
    capacity: 8,
    status: "limited",
    features: ["Pantalla 85 Pulgadas", "Sofás en cuero", "Sillas huevo en cuero", "Privacidad total"],
    price: "Desde $100.000",
  }
]

export function SalasSelector() {
  const [selectedSala, setSelectedSala] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const openReservation = (sala: any) => {
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
          {mockSalas.map((sala) => (
            <div key={sala.id} className="relative w-full h-[500px] group [perspective:1000px]">
              
              {/* Contenedor que hace el flip (preserve-3d) */}
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-2xl rounded-2xl">
                
                {/* FRONT de la tarjeta */}
                <div className="absolute inset-0 w-full h-full bg-zinc-900 rounded-2xl overflow-hidden [backface-visibility:hidden]">
                  <div className="relative h-full w-full">
                    <Image 
                      src={sala.image} 
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
                          {sala.status === 'available' && (
                            <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></>
                          )}
                          {sala.status === 'limited' && (
                            <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></>
                          )}
                          {sala.status === 'full' && (
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          )}
                        </span>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {sala.status === 'available' ? 'Disponible' : sala.status === 'limited' ? 'Últimos Cupos' : 'Completa'}
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
                      <span className="text-white font-bold text-xl">{sala.price}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => openReservation(sala)}
                    disabled={sala.status === 'full'}
                    className={`w-full py-4 rounded-lg font-bold uppercase tracking-wider transition-colors mt-4
                      ${sala.status === 'full' 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                        : 'bg-accent-primary text-white hover:bg-white hover:text-black'}
                    `}
                  >
                    {sala.status === 'full' ? 'No Disponible' : 'Reservar Ahora'}
                  </button>

                </div>

              </div>
            </div>
          ))}
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
