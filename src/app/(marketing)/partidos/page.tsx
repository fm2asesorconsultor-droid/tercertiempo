import { PartidosHero } from "@/components/sections/PartidosHero"
import { PartidosList } from "@/components/sections/PartidosList"
import { getAllMatches } from "@/lib/data/matches"
import { getZones } from "@/lib/data/zones"

export const metadata = {
  title: "Cartelera de Partidos | Tercer Tiempo",
  description: "Revisa la programación de partidos y reserva tu mesa en la zona que prefieras.",
}

export default async function PartidosPage() {
  const [matches, zones] = await Promise.all([getAllMatches(), getZones()])

  return (
    <main className="min-h-screen bg-background-primary">
      <PartidosHero />
      <PartidosList matches={matches} zones={zones} />
    </main>
  )
}
