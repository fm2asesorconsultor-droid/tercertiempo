import { FadeIn } from "@/components/ui/FadeIn"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { getHomeMatches } from "@/lib/data/matches"
import { formatShortDate, formatTime } from "@/lib/date-format"

export async function MatchesSection() {
  const matches = await getHomeMatches()

  return (
    <section className="w-full bg-zinc-950 pt-[25px] pb-[25px]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn>
            <h2 className="font-title font-black text-4xl md:text-5xl lg:text-6xl text-white">
              PRÓXIMOS <span className="text-accent-primary">PARTIDOS</span>
            </h2>
            <p className="mt-4 text-text-secondary">
              Reserva tu mesa o sala VIP para los encuentros más importantes de la temporada. Cupos limitados.
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match, idx) => (
            <FadeIn key={match.id} delay={0.1 * idx} direction="up">
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-background-surface p-6 transition-all hover:border-accent-primary/50 hover:shadow-[0_0_30px_rgba(255,69,0,0.1)]">

                <div className="mb-6 flex items-start justify-between">
                  <Badge variant={match.status === "LIVE" ? "warning" : "default"}>
                    {match.competition}
                  </Badge>
                  {match.isVIP && (
                    <Badge variant="success">VIP Disponible</Badge>
                  )}
                </div>

                <div className="mb-8 flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-16 w-16 flex items-center justify-center">
                      <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="max-h-full max-w-full object-contain drop-shadow-lg" />
                    </div>
                    <span className="font-bold text-white text-center">{match.homeTeam.name}</span>
                  </div>

                  <div className="font-title font-black text-2xl text-accent-primary">VS</div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="h-16 w-16 flex items-center justify-center">
                      <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="max-h-full max-w-full object-contain drop-shadow-lg" />
                    </div>
                    <span className="font-bold text-white text-center">{match.awayTeam.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatShortDate(match.kickoffAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{formatTime(match.kickoffAt)}</span>
                    </div>
                  </div>
                  <Button size="sm">Reservar</Button>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4} className="mt-12 text-center">
          <Button variant="outline" size="lg">VER CARTELERA COMPLETA</Button>
        </FadeIn>
      </div>
    </section>
  )
}
