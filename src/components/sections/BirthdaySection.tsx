import { FadeIn } from "@/components/ui/FadeIn"
import { Button } from "@/components/ui/Button"
import Image from "next/image"
import { PartyPopper, Beer, Crown, Gift, type LucideIcon } from "lucide-react"
import { getBirthdayContent, getBirthdayPerks } from "@/lib/data/birthday"

const ICONS: Record<string, LucideIcon> = {
  beer: Beer,
  crown: Crown,
  gift: Gift,
  "party-popper": PartyPopper,
}

export async function BirthdaySection() {
  const [content, perks] = await Promise.all([getBirthdayContent(), getBirthdayPerks()])

  return (
    <section className="w-full bg-zinc-950 pt-[25px] pb-[25px]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(255,69,0,0.1)] bg-zinc-900/50">
          <div className="absolute inset-0 z-0 bg-zinc-950">
            <Image
              src={content.backgroundImageUrl}
              alt="Celebración de cumpleaños en Tercer Tiempo"
              fill
              className="object-cover opacity-80"
            />
            {/* Gradiente para que el texto sea muy legible: vertical en móvil, horizontal en desktop */}
            <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black via-black/80 to-transparent/30"></div>
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center p-6 md:p-12 lg:p-16">
            <div className="space-y-8">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/20 border border-accent-primary/50 text-accent-primary text-sm font-bold mb-4">
                  <PartyPopper className="w-4 h-4" />
                  <span>{content.eyebrow}</span>
                </div>
                <h2 className="font-title font-black text-4xl md:text-5xl text-white leading-tight">
                  {content.headline} <br/>
                  <span className="text-accent-primary">{content.headlineAccent}</span>
                </h2>
                <p className="mt-6 text-text-secondary text-lg leading-relaxed max-w-xl">
                  {content.body}
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {perks.map((perk) => {
                    const Icon = ICONS[perk.iconKey] ?? Gift
                    return (
                      <div key={perk.id} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-accent-primary">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-white">{perk.text}</span>
                      </div>
                    )
                  })}
                </div>
              </FadeIn>

              <FadeIn delay={0.4} className="pt-4">
                <Button className="h-14 px-8 text-lg bg-accent-primary text-white hover:bg-white hover:text-accent-primary border-2 border-transparent hover:border-accent-primary transition-all duration-300 font-bold shadow-[0_0_20px_rgba(255,69,0,0.4)]">
                  {content.ctaLabel}
                </Button>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
