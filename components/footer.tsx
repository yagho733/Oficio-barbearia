import Link from "next/link"
import { Scissors, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="American Barber Logo"
                className="h-10 w-10 rounded-full object-contain filter drop-shadow-md"
              />
              <div className="flex flex-col leading-none">
                <span className="font-heading text-xl tracking-wider text-foreground">AMERICAN</span>
                <span className="text-xs tracking-[0.2em] text-muted-foreground">BARBER</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tradição americana com estilo moderno. Experiência premium de barbearia para o homem contemporâneo.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-lg tracking-wider">LINKS RÁPIDOS</h4>
            <nav className="flex flex-col gap-3">
              <Link href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Serviços
              </Link>
              <Link href="#barbers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Barbeiros
              </Link>
              <Link href="#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Produtos
              </Link>
              <Link href="/booking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Agendar
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-lg tracking-wider">SERVIÇOS</h4>
            <nav className="flex flex-col gap-3">
              <span className="text-sm text-muted-foreground">Corte Clássico</span>
              <span className="text-sm text-muted-foreground">Corte Executivo</span>
              <span className="text-sm text-muted-foreground">Barba & Shave</span>
              <span className="text-sm text-muted-foreground">Tratamento Royal</span>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-lg tracking-wider">CONTATO</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Av. Duque de Caxias, 775 - Fragata</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>(53) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>contato@americanbarber.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} American Barber. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
