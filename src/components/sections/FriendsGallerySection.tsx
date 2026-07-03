"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Heart, Share2, X } from "lucide-react"

// Mock data for the gallery using existing images
const galleryData = [
  { id: 1, src: "/colombia_birthday.png", category: "Cumpleaños", title: "Celebración Selección", span: "col-span-1 md:col-span-2 row-span-2" },
  { id: 2, src: "/gallery_bar_central.png", category: "Eventos", title: "Noche de Champions", span: "col-span-1 row-span-1" },
  { id: 3, src: "/gallery_sala_vip.png", category: "VIP", title: "Reserva Privada", span: "col-span-1 row-span-1" },
  { id: 4, src: "/pantalla_gigante.png", category: "Eventos", title: "Final de Copa", span: "col-span-1 md:col-span-2 row-span-1" },
  { id: 5, src: "/premium_experience.png", category: "VIP", title: "Experiencia Premium", span: "col-span-1 row-span-2" },
  { id: 6, src: "/gallery_platos.png", category: "Amigos", title: "Tercer Tiempo", span: "col-span-1 row-span-1" },
  { id: 7, src: "/birthday_celebration.png", category: "Cumpleaños", title: "Festejo Inolvidable", span: "col-span-1 md:col-span-2 row-span-1" },
]

type GalleryItem = typeof galleryData[0]

const categories = ["Todos", "Eventos", "Cumpleaños", "VIP", "Amigos"]

export function FriendsGallerySection() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  const filteredImages = activeCategory === "Todos" 
    ? galleryData 
    : galleryData.filter(img => img.category === activeCategory)

  // Prevent scroll when modal is open
  if (typeof window !== 'undefined') {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }

  return (
    <section className="relative py-24 bg-background-primary overflow-hidden min-h-screen">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent-primary rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tight mb-4">
              Nuestros <span className="text-accent-primary">Protagonistas</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Revive los mejores momentos de nuestros eventos. Tú y tus amigos son la verdadera estrella del partido.
            </p>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                activeCategory === cat 
                  ? "bg-accent-primary text-white shadow-[0_0_15px_rgba(255,69,0,0.5)]" 
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Dynamic Grid / Bento Layout */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px] gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((item) => (
              <motion.div
                layout
                key={item.id}
                layoutId={`card-${item.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                className={`relative group overflow-hidden rounded-2xl bg-zinc-900 cursor-pointer ${item.span}`}
                onClick={() => setSelectedImage(item)}
              >
                <motion.div layoutId={`image-${item.id}`} className="absolute inset-0">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </motion.div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Border Glow on Hover */}
                <div className="absolute inset-0 border-2 border-accent-primary/0 group-hover:border-accent-primary/50 rounded-2xl transition-colors duration-300 pointer-events-none" />

                {/* Content Reveal */}
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-accent-primary uppercase tracking-wider mb-1 block">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-accent-primary transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-accent-primary transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Always visible Camera icon indicator (subtle) */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                  <Camera className="w-4 h-4 text-white/70" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="px-8 py-3 rounded-full border border-zinc-700 text-white font-bold hover:bg-white hover:text-black transition-colors duration-300">
            CARGAR MÁS FOTOS
          </button>
        </motion.div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-accent-primary flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              layoutId={`card-${selectedImage.id}`}
              className="relative w-full max-w-5xl aspect-video md:aspect-auto md:h-[80vh] bg-zinc-900 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer clic en la foto
            >
              <motion.div layoutId={`image-${selectedImage.id}`} className="absolute inset-0">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  fill
                  className="object-contain" // object-contain para no recortar la imagen en el modal
                  priority
                />
              </motion.div>
              
              {/* Modal Details Overlay */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-sm font-bold text-accent-primary uppercase tracking-wider mb-2 block">
                      {selectedImage.category}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                      {selectedImage.title}
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-accent-primary font-bold transition-colors">
                      <Heart className="w-5 h-5" />
                      <span>Me Gusta</span>
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-accent-primary font-bold transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span>Compartir</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
