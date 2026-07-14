import { FadeIn } from "@/components/ui/FadeIn"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { getPremiumExperienceContent, getPremiumBenefits } from "@/lib/data/premium"
import { getSiteSettings } from "@/lib/data/site-settings"

export async function PremiumExperienceSection() {
  const [content, benefits, siteSettings] = await Promise.all([
    getPremiumExperienceContent(),
    getPremiumBenefits(),
    getSiteSettings(),
  ])

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950 pt-24 pb-[25px]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-center">

          <div className="space-y-8">
            <FadeIn>
              <h2 className="font-title font-black text-4xl md:text-5xl lg:text-6xl text-white">
                {content.headline} <span className="text-accent-primary">{content.headlineAccent}</span>
              </h2>
              <p className="mt-4 text-text-secondary text-lg leading-relaxed max-w-xl">
                {content.body}
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <ul className="grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li key={benefit.id} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-accent-primary" />
                    <span className="text-sm font-medium text-text-primary">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          <FadeIn direction="left" delay={0.3} className="relative h-[400px] w-full rounded-2xl overflow-hidden md:h-[500px] border border-zinc-800 shadow-2xl">
            <Image
              src={content.imageUrl}
              alt="Ambiente premium en Tercer Tiempo"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10"></div>

            <div className="absolute bottom-6 left-6 z-20">
              <Image
                src={siteSettings.logoUrl}
                alt="Tercer Tiempo Logo"
                width={160}
                height={48}
                className="opacity-70"
              />
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  )
}
