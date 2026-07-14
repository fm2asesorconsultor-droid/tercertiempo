"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/Button";
import { logoutAction } from "@/lib/auth/logout";

export function AdminSidebar({ logoUrl }: { logoUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar: only visible below md, holds the menu toggle */}
      <div className="flex items-center justify-between border-b border-border-default p-4 md:hidden">
        <Image src={logoUrl} alt="Tercer Tiempo" width={120} height={36} className="h-8 w-auto object-contain" priority />
        <Button
          variant="ghost"
          size="icon"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar: off-canvas drawer on mobile, static column from md up */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col justify-between border-r border-border-default bg-background-primary p-4 transition-transform duration-300 md:static md:z-auto md:w-60 md:shrink-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Image
            src={logoUrl}
            alt="Tercer Tiempo"
            width={160}
            height={48}
            className="mb-6 hidden h-10 w-auto object-contain md:block"
            priority
          />
          <div onClick={() => setIsOpen(false)}>
            <AdminNav />
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:text-danger"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>
    </>
  );
}
