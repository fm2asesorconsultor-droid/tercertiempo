import { PartidosHero } from "@/components/sections/PartidosHero"
import { PartidosList } from "@/components/sections/PartidosList"

export const metadata = {
  title: "Cartelera de Partidos | Tercer Tiempo",
  description: "Revisa la programación de partidos y reserva tu mesa en la zona que prefieras.",
}

export default function PartidosPage() {
  return (
    <main className="min-h-screen bg-background-primary">
      <PartidosHero />
      <PartidosList />
    </main>
  )
}
