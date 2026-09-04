"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Brand } from "@/components/brand"

const navLinks = [
  { href: "#services", label: "Serviços" },
  { href: "#experience", label: "A barbearia" },
  { href: "#barbers", label: "Equipe" },
  { href: "#contact", label: "Contato" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <nav className="container mx-auto px-5 lg:px-8" aria-label="Navegação principal">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" aria-label="Ofício Barbearia — início">
            <Brand />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/booking" className="hidden border-b-2 border-primary pb-1 text-sm font-semibold text-foreground transition-colors hover:text-primary lg:block">
            Agendar horário
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center border border-border bg-background lg:hidden"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-border py-4 lg:hidden">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block border-b border-border/70 py-3.5 text-base">
                {link.label}
              </Link>
            ))}
            <Link href="/booking" onClick={() => setIsOpen(false)} className="mt-4 flex h-12 items-center justify-center bg-primary px-5 font-semibold text-primary-foreground">
              Agendar horário
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
