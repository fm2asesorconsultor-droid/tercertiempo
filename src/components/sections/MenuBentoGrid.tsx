"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Plus, ChevronUp, Beer, Coffee, Pizza, Beef, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/Button"
import type { MenuCategory, MenuItem } from "@/generated/prisma/client"

const ICONS: Record<string, LucideIcon> = {
  beef: Beef,
  pizza: Pizza,
  beer: Beer,
  coffee: Coffee,
}

type MenuItemWithCategory = MenuItem & { category: MenuCategory }

type Props = {
  categories: MenuCategory[]
  items: MenuItemWithCategory[]
}

export function MenuBentoGrid({ categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState("todos")
  const [order, setOrder] = useState<MenuItemWithCategory[]>([])
  const [isOrderExpanded, setIsOrderExpanded] = useState(false)
  const [orderStatus, setOrderStatus] = useState<"idle" | "confirming" | "success">("idle")

  const filteredItems = activeCategory === "todos"
    ? items
    : items.filter((item) => item.categoryId === Number(activeCategory))

  const addToOrder = (item: MenuItemWithCategory) => {
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
          <button
            onClick={() => setActiveCategory("todos")}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeCategory === "todos"
                ? "bg-accent-primary text-white shadow-[0_0_15px_rgba(255,69,0,0.4)]"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => {
            const Icon = ICONS[cat.iconKey] ?? Beef
            const catKey = String(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(catKey)}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeCategory === catKey
                    ? "bg-accent-primary text-white shadow-[0_0_15px_rgba(255,69,0,0.4)]"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
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
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

                  {/* Perfect Match Hover Reveal */}
                  {item.pairingSuggestion && (
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-[-10px] group-hover:translate-y-0">
                      <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700 flex items-center gap-2 text-xs text-zinc-200">
                        <Flame className="w-3 h-3 text-accent-primary" />
                        <span>Match Perfecto: <strong className="text-white">{item.pairingSuggestion}</strong></span>
                      </div>
                    </div>
                  )}
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
