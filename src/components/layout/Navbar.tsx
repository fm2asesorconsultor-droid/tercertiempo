"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Calendar, Menu, X } from "lucide-react"

export function Navbar({ logoUrl }: { logoUrl: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-default bg-background-primary/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logoUrl}
            alt="Tercer Tiempo Logo"
            width={160}
            height={48}
            className="h-10 w-auto object-contain md:h-12"
            priority
          />
        </Link>
        
        <nav className="hidden items-center gap-5 lg:flex">
          <Link href="/" className="text-sm font-medium text-white hover:text-accent-primary transition-colors">INICIO</Link>
          <Link href="/menu" className="text-sm font-medium text-white hover:text-accent-primary transition-colors">MENÚ</Link>
          <Link href="/galeria" className="text-sm font-medium text-white hover:text-accent-primary transition-colors">GALERÍA</Link>
          <Link href="/partidos" className="text-sm font-medium text-white hover:text-accent-primary transition-colors">PARTIDOS</Link>
          <Link href="/salas-vip" className="text-sm font-medium text-white hover:text-accent-primary transition-colors">VIP</Link>
          <Link href="/tienda" className="text-sm font-medium text-white hover:text-accent-primary transition-colors">TIENDA</Link>
          <Link href="/cowork" className="text-sm font-medium text-white hover:text-accent-primary transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse inline-block" />
            COWORK
          </Link>
          <Link href="/contacto" className="text-sm font-medium text-white hover:text-accent-primary transition-colors">CONTACTO</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button className="hidden md:flex gap-2" asChild>
            <Link href="/reservar">
              RESERVAR <Calendar className="h-4 w-4" />
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-white hover:text-accent-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-zinc-950 border-b border-zinc-800 shadow-2xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 space-y-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-white hover:text-accent-primary hover:bg-zinc-900 rounded-md transition-colors">INICIO</Link>
            <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-white hover:text-accent-primary hover:bg-zinc-900 rounded-md transition-colors">MENÚ</Link>
            <Link href="/galeria" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-white hover:text-accent-primary hover:bg-zinc-900 rounded-md transition-colors">GALERÍA</Link>
            <Link href="/partidos" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-white hover:text-accent-primary hover:bg-zinc-900 rounded-md transition-colors">PARTIDOS</Link>
            <Link href="/salas-vip" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-white hover:text-accent-primary hover:bg-zinc-900 rounded-md transition-colors">SALAS VIP</Link>
            <Link href="/tienda" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-white hover:text-accent-primary hover:bg-zinc-900 rounded-md transition-colors">TIENDA</Link>
            <Link href="/cowork" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-white hover:text-accent-primary hover:bg-zinc-900 rounded-md transition-colors flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse inline-block" /> COWORK
            </Link>
            <Link href="/contacto" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-white hover:text-accent-primary hover:bg-zinc-900 rounded-md transition-colors">CONTACTO</Link>
            <div className="pt-4 border-t border-zinc-800">
              <Button className="w-full flex gap-2 justify-center" asChild onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/reservar">
                  RESERVAR EXPERIENCIA <Calendar className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
