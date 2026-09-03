"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Scissors, Calendar, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navLinks = [
  { href: "#services", label: "Serviços" },
  { href: "#products", label: "Produtos" },
  { href: "#barbers", label: "Barbeiros" },
  { href: "#testimonials", label: "Depoimentos" },
  { href: "#contact", label: "Contato" },
]

const dashboardLinks = [
  { href: "/booking", label: "Agendar", icon: Calendar },
  { href: "/dashboard/customer", label: "Minha Conta", icon: User },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="American Barber Logo"
              className="h-10 w-10 rounded-full object-contain filter drop-shadow-md"
            />
            <div className="flex flex-col leading-none">
              <span className="font-heading text-lg tracking-wider text-foreground">AMERICAN</span>
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground">BARBER</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/dashboard/customer">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Minha Conta
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0">
                Agendar Horário
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm bg-background border-border">
              <div className="flex flex-col gap-8 mt-8">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="h-px bg-border" />
                <div className="flex flex-col gap-3">
                  <Link href="/booking" onClick={() => setIsOpen(false)}>
                    <Button className="w-full gradient-primary text-primary-foreground border-0">
                      Agendar Horário
                    </Button>
                  </Link>
                  <Link href="/dashboard/customer" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Minha Conta
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  )
}
