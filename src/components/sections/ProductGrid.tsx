"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { ProductCustomizerDrawer } from "@/components/ui/ProductCustomizerDrawer"

const categories = ["Todos", "Camisetas", "Gorras", "Accesorios"]

const products = [
  {
    id: 1,
    name: "Camiseta Oficial Colombia",
    category: "Camisetas",
    price: "$299.900",
    image: "/store/colombia_jersey.png",
    isNew: true,
    canCustomize: true
  },
  {
    id: 2,
    name: "Camiseta Real Madrid Local",
    category: "Camisetas",
    price: "$349.900",
    image: "/store/real_madrid_jersey.png",
    isNew: false,
    canCustomize: true
  },
  {
    id: 3,
    name: "Gorra Tercer Tiempo",
    category: "Gorras",
    price: "$80.000",
    image: "/store/tercer_tiempo_cap.png",
    isNew: true,
    canCustomize: false
  },
  {
    id: 4,
    name: "Jarra Cervecera 1L",
    category: "Accesorios",
    price: "$45.000",
    image: "/store/beer_mug.png",
    isNew: false,
    canCustomize: false
  },
  {
    id: 5,
    name: "Camiseta Boca Juniors",
    category: "Camisetas",
    price: "$289.900",
    image: "/store/boca_juniors_jersey.png",
    isNew: false,
    canCustomize: true
  }
]

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const filteredProducts = activeCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === activeCategory)

  const openCustomizer = (product: any) => {
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }

  return (
    <section className="pb-24 bg-background-primary min-h-screen pt-12">
      <div className="container mx-auto px-4">
        
        {/* Category Filter */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-12 pb-2 md:justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeCategory === category 
                  ? "bg-accent-primary text-white shadow-[0_0_15px_rgba(255,69,0,0.4)]" 
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-accent-primary transition-colors cursor-pointer"
                onClick={() => openCustomizer(product)}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-accent-primary/0 group-hover:bg-accent-primary/10 transition-colors z-0" />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-accent-primary text-white border-none">NUEVO</Badge>
                  )}
                  {product.canCustomize && (
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-zinc-500 text-zinc-300">
                      Personalizable
                    </Badge>
                  )}
                </div>

                {/* Image Container with Hover Scale */}
                <div className="relative h-72 w-full overflow-hidden bg-zinc-950 z-10 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                  />
                  {/* Fake "Hover to view back" or just a nice overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
                </div>

                {/* Product Info */}
                <div className="relative z-20 p-6 flex flex-col items-center text-center">
                  <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {product.name}
                  </h3>
                  <span className="text-xl font-black text-accent-primary mb-6">
                    {product.price}
                  </span>
                  
                  <Button className="w-full font-bold shadow-lg group-hover:shadow-[0_0_20px_rgba(255,69,0,0.5)] transition-shadow">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.canCustomize ? "Personalizar" : "Reservar"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProductCustomizerDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedProduct}
      />
    </section>
  )
}
