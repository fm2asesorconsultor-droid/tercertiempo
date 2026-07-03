import { SalasVipHero } from "@/components/sections/SalasVipHero"
import { SalasSelector } from "@/components/sections/SalasSelector"

export const metadata = {
  title: "Salas VIP | Tercer Tiempo",
  description: "Reserva tu espacio privado para disfrutar del mejor fútbol con comodidades exclusivas.",
}

export default function SalasVipPage() {
  return (
    <main className="min-h-screen bg-background-primary pt-20">
      <SalasVipHero />
      <SalasSelector />
    </main>
  )
}
