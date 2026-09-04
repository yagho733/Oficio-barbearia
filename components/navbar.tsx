"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#services", label: "Serviços" },
  { href: "#experience", label: "Experiência" },
  { href: "#barbers", label: "Profissionais" },
  { href: "#booking-demo", label: "Como funciona" },
  { href: "#contact", label: "Personalização" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/90 backdrop-blur-xl"
    >
      <div className="border-b border-white/5 bg-primary/10 px-4 py-1.5 text-center text-xs leading-5 text-muted-foreground">
        Demonstração profissional: nome, cores e informações são personalizados para cada barbearia
      </div>

      <nav className="container mx-auto px-4 lg:px-8" aria-label="Navegação principal">
        <div className="flex h-18 items-center justify-between">
          <Link href="/" aria-label="Sua Barbearia - início">
            <Brand />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/booking" className="hidden lg:block">
            <Button className="gradient-primary h-10 border-0 px-5 text-primary-foreground">
              Testar agendamento
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card lg:hidden"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-border py-5 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-3 text-base text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/booking" onClick={() => setIsOpen(false)} className="mt-3">
                <Button className="gradient-primary h-12 w-full border-0 font-semibold text-primary-foreground">Testar agendamento</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </motion.header>
  )
}
