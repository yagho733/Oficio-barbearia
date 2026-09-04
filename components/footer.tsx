import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Brand } from "@/components/brand"

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-background">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="max-w-sm">
            <Link href="/" aria-label="Sua Barbearia - início">
              <Brand />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Conceito de site para barbearias que desejam apresentar seus serviços e organizar agendamentos com mais profissionalismo.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm sm:grid-cols-3">
            <Link href="#services" className="text-muted-foreground hover:text-foreground">Serviços</Link>
            <Link href="#experience" className="text-muted-foreground hover:text-foreground">Experiência</Link>
            <Link href="#barbers" className="text-muted-foreground hover:text-foreground">Profissionais</Link>
            <Link href="#booking-demo" className="text-muted-foreground hover:text-foreground">Agendamento</Link>
            <Link href="/login" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              Painel demo <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="#contact" className="text-muted-foreground hover:text-foreground">Contato</Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/8 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>{new Date().getFullYear()} Demonstração de site para barbearias.</p>
          <p>Conteúdo e informações ilustrativas para portfólio.</p>
        </div>
      </div>
    </footer>
  )
}
