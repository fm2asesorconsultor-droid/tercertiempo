import { FadeIn } from "@/components/ui/FadeIn"
import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { getFeaturedGalleryImages } from "@/lib/data/gallery"
import { HOME_BENTO_SPAN } from "@/lib/gallery-spans"

export async function WorldGallerySection() {
  const images = await getFeaturedGalleryImages()

  return (
    <section className="w-full bg-background-primary pt-[25px] pb-[25px]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeIn>
            <h2 className="font-title font-black text-4xl md:text-5xl lg:text-6xl text-white">
              NUESTRO <span className="text-accent-primary">MUNDO</span>
            </h2>
            <p className="mt-4 text-text-secondary max-w-lg">
              Un vistazo a las instalaciones de Tercer Tiempo. Diseño de vanguardia, confort absoluto y la mejor atmósfera para disfrutar.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} direction="left">
            <Button variant="outline" className="hidden group md:flex">
              VER GALERÍA COMPLETA <ArrowRight className="ml-2 h-4 w-4 text-accent-primary group-hover:text-white" />
            </Button>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 md:h-[500px] lg:h-[600px]">
          {images.map((img, idx) => (
            <FadeIn
              key={img.id}
              delay={0.1 * idx}
              className={`group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 h-[220px] md:h-auto ${HOME_BENTO_SPAN[img.gridSpan ?? "normal"] ?? HOME_BENTO_SPAN.normal}`}
            >
              <Image
                src={img.imageUrl}
                alt={img.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="font-title font-black text-2xl tracking-wider text-white drop-shadow-md transform transition-transform group-hover:-translate-y-2">{img.title}</span>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Button variant="outline" className="w-full group">
            VER GALERÍA COMPLETA <ArrowRight className="ml-2 h-4 w-4 text-accent-primary group-hover:text-white" />
          </Button>
        </div>
      </div>
    </section>
  )
}
