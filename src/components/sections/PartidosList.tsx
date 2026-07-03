"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, ClockIcon, Flame, MapPin } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { MatchReservationDrawer } from "@/components/ui/MatchReservationDrawer"

// Mock Data
const dates = ["Todos", "Hoy", "Mañana", "Sábado", "Domingo"]

const initialMatches = [
  {
    id: 1,
    team1: "Real Madrid",
    logo1: "/teams/real-madrid.svg",
    team2: "Barcelona",
    logo2: "/teams/barcelona.svg",
    competition: "LaLiga",
    date: "Hoy",
    time: "15:00",
    status: "live", // live, upcoming, finished
    hype: 98,
    isFeatured: true
  },
  {
    id: 2,
    team1: "Man City",
    logo1: "/teams/man-city.svg",
    team2: "Arsenal",
    logo2: "/teams/arsenal.svg",
    competition: "Premier League",
    date: "Hoy",
    time: "11:30",
    status: "upcoming",
    hype: 45,
    isFeatured: false
  },
  {
    id: 3,
    team1: "Boca Jrs",
    logo1: "/teams/boca-jrs.svg",
    team2: "River Plate",
    logo2: "/teams/river-plate.png",
    competition: "Libertadores",
    date: "Mañana",
    time: "19:00",
    status: "upcoming",
    hype: 88,
    isFeatured: false
  },
  {
    id: 4,
    team1: "Liverpool",
    logo1: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", 
    team2: "Chelsea",
    logo2: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
    competition: "Premier League",
    date: "Sábado",
    time: "14:00",
    status: "upcoming",
    hype: 60,
    isFeatured: false
  },
  {
    id: 5,
    team1: "Colombia",
    logo1: "https://flagcdn.com/w160/co.png",
    team2: "Brasil",
    logo2: "https://flagcdn.com/w160/br.png",
    competition: "Mundial 2026",
    date: "Hoy",
    time: "20:00",
    status: "upcoming",
    hype: 95,
    isFeatured: false
  },
  {
    id: 6,
    team1: "Argentina",
    logo1: "https://flagcdn.com/w160/ar.png",
    team2: "Uruguay",
    logo2: "https://flagcdn.com/w160/uy.png",
    competition: "Mundial 2026",
    date: "Sábado",
    time: "16:00",
    status: "upcoming",
    hype: 89,
    isFeatured: false
  },
  {
    id: 7,
    team1: "Francia",
    logo1: "https://flagcdn.com/w160/fr.png",
    team2: "España",
    logo2: "https://flagcdn.com/w160/es.png",
    competition: "Mundial 2026",
    date: "Sábado",
    time: "12:00",
    status: "upcoming",
    hype: 82,
    isFeatured: false
  },
  {
    id: 8,
    team1: "Inglaterra",
    logo1: "https://flagcdn.com/w160/gb-eng.png",
    team2: "Alemania",
    logo2: "https://flagcdn.com/w160/de.png",
    competition: "Mundial 2026",
    date: "Domingo",
    time: "15:00",
    status: "upcoming",
    hype: 75,
    isFeatured: false
  },
  {
    id: 9,
    team1: "México",
    logo1: "https://flagcdn.com/w160/mx.png",
    team2: "USA",
    logo2: "https://flagcdn.com/w160/us.png",
    competition: "Mundial 2026",
    date: "Mañana",
    time: "21:00",
    status: "upcoming",
    hype: 88,
    isFeatured: false
  },
  {
    id: 10,
    team1: "Portugal",
    logo1: "https://flagcdn.com/w160/pt.png",
    team2: "Italia",
    logo2: "https://flagcdn.com/w160/it.png",
    competition: "Mundial 2026",
    date: "Mañana",
    time: "14:00",
    status: "upcoming",
    hype: 70,
    isFeatured: false
  }
]

export function PartidosList() {
  const [activeDate, setActiveDate] = useState("Todos")
  const [matches, setMatches] = useState(initialMatches)
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const filteredMatches = activeDate === "Todos" 
    ? matches 
    : matches.filter(m => m.date === activeDate)

  const handleHype = (id: number) => {
    setMatches(matches.map(m => {
      if (m.id === id) {
        return { ...m, hype: m.hype + 1 }
      }
      return m
    }))
  }

  const openReservation = (match: any) => {
    setSelectedMatch(match)
    setIsDrawerOpen(true)
  }

  return (
    <section className="pb-24 bg-background-primary min-h-screen">
      
      {/* Sticky Timeline Bar */}
      <div className="sticky top-20 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 md:justify-center">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setActiveDate(date)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                  activeDate === date 
                    ? "bg-accent-primary text-white shadow-[0_0_15px_rgba(255,69,0,0.4)]" 
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12 max-w-5xl">
        <AnimatePresence mode="popLayout">
          {filteredMatches.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20 text-zinc-500"
            >
              No hay partidos programados para este día.
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredMatches.sort((a,b) => b.hype - a.hype).map((match, idx) => {
                const isTopHype = idx === 0 && match.hype > 80;
                
                return (
                  <motion.div
                    key={match.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className={`relative overflow-hidden rounded-2xl border bg-background-surface transition-all ${
                      match.status === 'live' 
                        ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                        : isTopHype 
                          ? 'border-accent-primary shadow-[0_0_30px_rgba(255,69,0,0.1)]' 
                          : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Background glow if live or top hype */}
                    {(match.status === 'live' || isTopHype) && (
                      <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none opacity-20 ${match.status === 'live' ? 'bg-red-500' : 'bg-accent-primary'}`} />
                    )}

                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
                      
                      {/* Match Meta (Left/Top) */}
                      <div className="flex flex-col items-center md:items-start md:w-1/4 gap-3 shrink-0 w-full">
                        <div className="flex items-center gap-2">
                          <Badge variant={match.status === 'live' ? "destructive" : "default"} className={match.status === 'live' ? "animate-pulse" : ""}>
                            {match.status === 'live' ? 'EN VIVO' : match.competition}
                          </Badge>
                          {isTopHype && match.status !== 'live' && (
                            <Badge variant="warning" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Partido Destacado</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{match.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{match.time}</span>
                          </div>
                        </div>
                        
                        {/* Hype Meter */}
                        <div className="mt-2 flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                          <button 
                            onClick={() => handleHype(match.id)}
                            className="text-zinc-500 hover:text-orange-500 transition-colors"
                            title="¡Votame si vas a venir a verlo!"
                          >
                            <Flame className={`w-5 h-5 ${match.hype > 80 ? 'text-orange-500 fill-orange-500 animate-pulse' : ''}`} />
                          </button>
                          <div className="h-2 w-24 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${Math.min(match.hype, 100)}%` }} />
                          </div>
                          <span className="text-xs font-bold text-zinc-300">{match.hype}%</span>
                        </div>
                      </div>

                      {/* Teams (Center) */}
                      <div className="flex-1 flex items-center justify-center gap-4 md:gap-8 w-full">
                        <div className="flex flex-col items-center gap-3 flex-1">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center p-3 border border-white/10">
                            <img src={match.logo1} alt={match.team1} className="max-w-full max-h-full object-contain" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                          </div>
                          <span className="font-bold text-white text-center md:text-lg">{match.team1}</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                          {match.status === 'live' ? (
                            <span className="font-black text-4xl md:text-5xl text-red-500 tracking-tighter">1 - 0</span>
                          ) : (
                            <span className="font-title font-black text-2xl md:text-4xl text-zinc-700 italic">VS</span>
                          )}
                          {match.status === 'live' && <span className="text-xs text-red-500 font-bold animate-pulse">45'</span>}
                        </div>

                        <div className="flex flex-col items-center gap-3 flex-1">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center p-3 border border-white/10">
                            <img src={match.logo2} alt={match.team2} className="max-w-full max-h-full object-contain" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                          </div>
                          <span className="font-bold text-white text-center md:text-lg">{match.team2}</span>
                        </div>
                      </div>

                      {/* CTA (Right/Bottom) */}
                      <div className="flex flex-col items-center md:items-end md:w-1/4 shrink-0 w-full mt-4 md:mt-0">
                        <Button 
                          size="lg"
                          className="w-full md:w-auto font-bold uppercase tracking-wider"
                          onClick={() => openReservation(match)}
                        >
                          Reservar Mesa
                        </Button>
                        <span className="text-xs text-zinc-500 mt-3 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Zonas: Pantalla Gigante, Barra, Terraza
                        </span>
                      </div>

                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      <MatchReservationDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        match={selectedMatch}
      />
    </section>
  )
}
