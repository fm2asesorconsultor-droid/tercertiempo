"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type MatchDay = { teams: string; demand: "high" | "mid" | "low" }

const demandColors: Record<string, string> = {
  high: "bg-red-500",
  mid: "bg-yellow-500",
  low: "bg-green-500",
}

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

type Props = {
  matchDays: Record<string, MatchDay>
  selected: string | null
  onSelect: (date: string) => void
}

export function MatchCalendar({ matchDays, selected, onSelect }: Props) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const toKey = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-white text-lg">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-bold text-zinc-500 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const key = toKey(day)
          const match = matchDays[key]
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
          const isSelected = selected === key

          return (
            <motion.button
              key={key}
              disabled={isPast}
              onClick={() => !isPast && onSelect(key)}
              whileHover={!isPast ? { scale: 1.05 } : {}}
              whileTap={!isPast ? { scale: 0.95 } : {}}
              className={`relative flex flex-col items-center justify-center rounded-lg p-1.5 aspect-square text-sm font-bold transition-all
                ${isPast ? "opacity-30 cursor-not-allowed text-zinc-600" : "cursor-pointer"}
                ${isSelected ? "bg-accent-primary text-white shadow-[0_0_12px_rgba(255,69,0,0.5)]" : ""}
                ${!isSelected && !isPast ? "hover:bg-zinc-800 text-white" : ""}
                ${isToday && !isSelected ? "ring-1 ring-accent-primary text-accent-primary" : ""}
              `}
            >
              {day}
              {match && !isPast && (
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${demandColors[match.demand]}`} />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
        <span className="text-xs text-zinc-500 font-bold">Disponibilidad:</span>
        {[["high","Alta demanda"],["mid","Media"],["low","Libre"]].map(([d, label]) => (
          <span key={d} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className={`w-2 h-2 rounded-full ${demandColors[d]}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Selected date match info */}
      {selected && matchDays[selected] && (
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex items-center gap-3"
        >
          <div className={`w-3 h-3 rounded-full ${demandColors[matchDays[selected].demand]} shrink-0`} />
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Partido del día</p>
            <p className="text-white font-bold">{matchDays[selected].teams}</p>
          </div>
        </motion.div>
      )}
      {selected && !matchDays[selected] && (
        <motion.div
          key={`no-${selected}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex items-center gap-3"
        >
          <div className="w-3 h-3 rounded-full bg-zinc-500 shrink-0" />
          <p className="text-zinc-400 text-sm">Sin partido programado — disponibilidad alta</p>
        </motion.div>
      )}
    </div>
  )
}
