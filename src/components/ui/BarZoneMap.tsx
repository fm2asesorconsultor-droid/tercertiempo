"use client"

import { motion } from "framer-motion"
import type { Zone } from "@/generated/prisma/client"

type Props = {
  zones: Zone[]
  selected: string | null
  onSelect: (id: string) => void
}

export function BarZoneMap({ zones, selected, onSelect }: Props) {
  const getZoneStyle = (id: string) => ({
    fill: selected === id ? "rgba(255,69,0,0.5)" : "rgba(255,255,255,0.05)",
    stroke: selected === id ? "#FF4500" : "rgba(255,255,255,0.2)",
    strokeWidth: selected === id ? 2 : 1,
    cursor: "pointer",
    transition: "all 0.2s",
  })

  return (
    <div className="space-y-6">
      {/* Floor 1 */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-primary inline-block" />
          Primer Piso
        </p>
        <svg viewBox="0 0 400 160" className="w-full rounded-xl border border-zinc-800 bg-zinc-950">
          {/* Building outline */}
          <rect x="5" y="5" width="390" height="150" rx="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Salon */}
          <motion.rect
            x="10" y="10" width="250" height="140" rx="6"
            style={getZoneStyle("salon")}
            onClick={() => onSelect("salon")}
            whileHover={{ fill: "rgba(255,69,0,0.25)" }}
          />
          <text x="135" y="74" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" pointerEvents="none">📺 Salón</text>
          <text x="135" y="90" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" pointerEvents="none">Pantalla Gigante</text>

          {/* Barra */}
          <motion.rect
            x="270" y="10" width="120" height="65" rx="6"
            style={getZoneStyle("barra")}
            onClick={() => onSelect("barra")}
            whileHover={{ fill: "rgba(255,69,0,0.25)" }}
          />
          <text x="330" y="40" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" pointerEvents="none">🍺 Barra</text>
          <text x="330" y="56" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" pointerEvents="none">Bar principal</text>

          {/* Tienda (no selectable) */}
          <rect x="270" y="85" width="120" height="65" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 2" />
          <text x="330" y="116" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" pointerEvents="none">🛍️ Tienda</text>
          <text x="330" y="130" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="9" pointerEvents="none">(sin reserva)</text>
        </svg>
      </div>

      {/* Floor 2 */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          Segundo Piso
        </p>
        <svg viewBox="0 0 400 160" className="w-full rounded-xl border border-zinc-800 bg-zinc-950">
          <rect x="5" y="5" width="390" height="150" rx="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Terraza */}
          <motion.rect
            x="10" y="10" width="150" height="140" rx="6"
            style={getZoneStyle("terraza")}
            onClick={() => onSelect("terraza")}
            whileHover={{ fill: "rgba(255,69,0,0.25)" }}
          />
          <text x="85" y="74" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" pointerEvents="none">🌿 Terraza</text>
          <text x="85" y="90" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" pointerEvents="none">Aire libre</text>

          {/* Cancha */}
          <motion.rect
            x="170" y="10" width="120" height="140" rx="6"
            style={getZoneStyle("cancha")}
            onClick={() => onSelect("cancha")}
            whileHover={{ fill: "rgba(255,69,0,0.25)" }}
          />
          <text x="230" y="74" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" pointerEvents="none">⚽ Cancha</text>
          <text x="230" y="90" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" pointerEvents="none">Sintética</text>

          {/* VIP 1 */}
          <motion.rect
            x="300" y="10" width="90" height="65" rx="6"
            style={getZoneStyle("vip1")}
            onClick={() => onSelect("vip1")}
            whileHover={{ fill: "rgba(255,69,0,0.25)" }}
          />
          <text x="345" y="38" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">⭐ VIP 1</text>
          <text x="345" y="54" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" pointerEvents="none">Campeones</text>

          {/* VIP 2 */}
          <motion.rect
            x="300" y="85" width="90" height="65" rx="6"
            style={getZoneStyle("vip2")}
            onClick={() => onSelect("vip2")}
            whileHover={{ fill: "rgba(255,69,0,0.25)" }}
          />
          <text x="345" y="112" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">⭐ VIP 2</text>
          <text x="345" y="128" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" pointerEvents="none">Leyendas</text>
        </svg>
      </div>

      {/* Zone Detail Card */}
      {selected && (() => {
        const zone = zones.find(z => z.slug === selected)
        if (!zone) return null
        return (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-primary/10 border border-accent-primary/40 rounded-xl p-4 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-accent-primary/20 border border-accent-primary/50 flex items-center justify-center shrink-0 text-lg">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-white">{zone.name}</h4>
              <p className="text-zinc-400 text-sm">{zone.description}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-accent-primary font-bold">{zone.capacityLabel}</span>
                <span className="text-xs text-zinc-500">{zone.priceLabel}</span>
              </div>
            </div>
          </motion.div>
        )
      })()}
    </div>
  )
}
