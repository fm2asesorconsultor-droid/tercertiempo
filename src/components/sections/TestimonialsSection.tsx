import { FadeIn } from "@/components/ui/FadeIn"
import { StarIcon } from "lucide-react"
import { getPublishedTestimonials } from "@/lib/data/testimonials"

export async function TestimonialsSection() {
  const testimonials = await getPublishedTestimonials()

  return (
    <section className="w-full bg-background-primary pt-[25px] pb-24 border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn>
            <h2 className="font-title font-black text-4xl md:text-5xl text-white">
              LO QUE DICE LA <span className="text-accent-primary">HINCHADA</span>
            </h2>
          </FadeIn>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((test, idx) => (
            <FadeIn key={test.id} delay={0.1 * idx} direction="up">
              <div className="flex flex-col h-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 fill-accent-primary text-accent-primary" />
                  ))}
                </div>
                <p className="flex-1 text-text-secondary italic mb-6">&quot;{test.text}&quot;</p>
                <p className="font-bold text-white">— {test.name}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
