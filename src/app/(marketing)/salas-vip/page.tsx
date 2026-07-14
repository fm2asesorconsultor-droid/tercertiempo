import { SalasVipHero } from "@/components/sections/SalasVipHero"
import { SalasSelector } from "@/components/sections/SalasSelector"
import { getSalasVip } from "@/lib/data/salas-vip"

export const metadata = {
  title: "Salas VIP | Tercer Tiempo",
  description: "Reserva tu espacio privado para disfrutar del mejor fútbol con comodidades exclusivas.",
}

export default async function SalasVipPage() {
  const salas = await getSalasVip()

  return (
    <main className="min-h-screen bg-background-primary pt-20">
      <SalasVipHero />
      <SalasSelector salas={salas} />
    </main>
  )
}
