"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Info, Plus, ChevronUp, Beer, Coffee, Pizza, Beef } from "lucide-react"
import { Button } from "@/components/ui/Button"

const menuCategories = [
  { id: "todos", name: "Todos", icon: null },
  { id: "principales", name: "Principales", icon: Beef },
  { id: "compartir", name: "Para Compartir", icon: Pizza },
  { id: "cervezas", name: "Cervezas", icon: Beer },
  { id: "cocteles", name: "Cócteles", icon: Coffee }, // Using coffee as a generic drink icon for now
]

const menuItems = [
  {
    id: 1,
    name: "La 'Hat-Trick' Burger",
    description: "Tres carnes premium, tocineta crujiente, cheddar fundido, aros de cebolla bañados en cerveza y nuestra salsa BBQ ahumada secreta.",
    price: 45000,
    category: "principales",
    image: "/menu/hat_trick_burger.png",
    match: "Cerveza Artesanal Rubia",
    isMVP: true, // Takes more space in the Bento Grid
  },
  {
    id: 2,
    name: "Picada 'El Clásico'",
    description: "Chorizo, morcilla, chicharrón carnudo, papas rústicas, arepitas y empanadas. Para 4 personas (o 2 defensas centrales hambrientos).",
    price: 85000,
    category: "compartir",
    image: "/menu/picada_clasico.png",
    match: "Jarra de Cerveza 1L",
    isMVP: true,
  },
  {
    id: 3,
    name: "Alitas 'Roja Directa'",
    description: "Alitas bañadas en salsa picante Habanero intenso. Solo para los más valientes del estadio.",
    price: 32000,
    category: "compartir",
    image: "/menu/alitas_roja_directa.png",
    match: "Cóctel El Var (Para apagar el fuego)",
    isMVP: false,
  },
  {
    id: 4,
    name: "Cerveza Artesanal 'Tercer Tiempo'",
    description: "Lager rubia, ligera y muy fría. Servida en jarra helada. La bebida oficial de los 90 minutos.",
    price: 15000,
    category: "cervezas",
    image: "/menu/cerveza_artesanal.png",
    match: "Hat-Trick Burger",
    isMVP: false,
  },
  {
    id: 5,
    name: "Cóctel 'El VAR'",
    description: "Tequila, Blue Curaçao y limón, con un efecto de humo mágico que cambia de color. Tienes que revisarlo en pantalla.",
    price: 28000,
    category: "cocteles",
    image: "/menu/coctel_var.png",
    match: "Alitas Roja Directa",
    isMVP: false,
  }
]

export function MenuBentoGrid() {
  const [activeCategory, setActiveCategory] = useState("todos")
  const [order, setOrder] = useState<any[]>([])
  const [isOrderExpanded, setIsOrderExpanded] = useState(false)
  const [orderStatus, setOrderStatus] = useState<"idle" | "confirming" | "success">("idle")

  const filteredItems = activeCategory === "todos" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory)

  const addToOrder = (item: any) => {
    setOrder([...order, item])
    if (orderStatus === "success") setOrderStatus("idle")
  }

  const handleCallWaiter = () => {
    if (orderStatus === "idle") {
      setOrderStatus("confirming")
    } else if (orderStatus === "confirming") {
      setOrderStatus("success")
      setTimeout(() => {
        setOrder([])
        setOrderStatus("idle")
        setIsOrderExpanded(false)
      }, 3000)
    }
  }

  const orderTotal = order.reduce((sum, item) => sum + item.price, 0)
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <section className="pb-32 bg-background-primary min-h-screen relative pt-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Categorías con Iconos */}
        <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-12 pb-2 md:justify-center">
          {menuCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeCategory === cat.id 
                    ? "bg-accent-primary text-white shadow-[0_0_15px_rgba(255,69,0,0.4)]" 
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Bento Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`group relative bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden hover:border-accent-primary/50 transition-colors flex flex-col ${
                  item.isMVP ? "md:col-span-2 lg:col-span-2" : "col-span-1"
                }`}
              >
                {/* Imagen */}
                <div className={`relative w-full ${item.isMVP ? 'h-72 md:h-96' : 'h-56'} overflow-hidden bg-black`}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                  
                  {/* Perfect Match Hover Reveal */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-[-10px] group-hover:translate-y-0">
                    <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700 flex items-center gap-2 text-xs text-zinc-200">
                      <Flame className="w-3 h-3 text-accent-primary" />
                      <span>Match Perfecto: <strong className="text-white">{item.match}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10 bg-zinc-900">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`font-black text-white ${item.isMVP ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                      {item.name}
                    </h3>
                    <span className="font-bold text-accent-primary text-xl ml-4 shrink-0">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-6 flex-1">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto">
                    <Button 
                      variant="outline" 
                      className="w-full border-zinc-700 hover:bg-white hover:text-black hover:border-white transition-all group-hover:border-accent-primary group-hover:text-accent-primary group-hover:hover:bg-accent-primary group-hover:hover:text-white"
                      onClick={() => addToOrder(item)}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Añadir a mi mesa
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating Order Bar */}
      <AnimatePresence>
        {order.length > 0 && (
          <motion.div
            key="floating-order-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 w-full z-[100] pointer-events-none"
          >
            <div className="container mx-auto px-4 pb-6 pt-4 flex justify-center pointer-events-auto">
              <div className="bg-zinc-950 border border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col">
                
                {/* Bar Header (Always visible) */}
                <div 
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900 transition-colors"
                  onClick={() => setIsOrderExpanded(!isOrderExpanded)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent-primary text-white rounded-full flex items-center justify-center font-bold">
                      {order.length}
                    </div>
                    <div>
                      <h4 className="font-bold text-white leading-none">Mi Mesa</h4>
                      <span className="text-xs text-zinc-500">Simulador de pedido</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-black text-xl text-white">
                      {formatPrice(orderTotal)}
                    </span>
                    <ChevronUp className={`w-5 h-5 text-zinc-400 transition-transform ${isOrderExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isOrderExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-zinc-900"
                    >
                      <div className="p-6 border-t border-zinc-800 space-y-4 max-h-60 overflow-y-auto">
                        {order.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-zinc-300">{item.name}</span>
                            <span className="text-white font-bold">{formatPrice(item.price)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end gap-4 items-center">
                        {orderStatus === "success" ? (
                          <div className="text-green-500 font-bold flex items-center gap-2 animate-in fade-in zoom-in">
                            ¡Mesero notificado! En breve estará en tu mesa.
                          </div>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              className="text-zinc-400 hover:text-white" 
                              onClick={() => {
                                if (orderStatus === "confirming") setOrderStatus("idle")
                                else setOrder([])
                              }}
                            >
                              {orderStatus === "confirming" ? "Cancelar" : "Limpiar"}
                            </Button>
                            <Button 
                              className={orderStatus === "confirming" ? "bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)]" : ""} 
                              onClick={handleCallWaiter}
                            >
                              {orderStatus === "confirming" ? "Sí, confirmar pedido" : "Llamar Mesero"}
                            </Button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}
