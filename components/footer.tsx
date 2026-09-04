import Link from "next/link"
import { Brand } from "@/components/brand"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto flex flex-col justify-between gap-8 px-5 py-10 sm:flex-row sm:items-end lg:px-8">
        <div>
          <Link href="/" aria-label="Ofício Barbearia — início"><Brand compact /></Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Corte, barba e cuidado masculino com hora marcada.</p>
        </div>
        <div className="text-sm text-muted-foreground sm:text-right">
          <p>Projeto demonstrativo para portfólio.</p>
          <p className="mt-1">{new Date().getFullYear()} · Informações ilustrativas.</p>
        </div>
      </div>
    </footer>
  )
}
