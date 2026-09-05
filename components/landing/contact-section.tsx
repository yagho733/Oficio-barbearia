import Link from "next/link"
import { ArrowUpRight, AtSign, Clock3, MapPin, MessageCircle } from "lucide-react"
import { siteConfig, whatsappUrl } from "@/lib/site-config"

export function ContactSection() {
  return (
    <section id="contact" className="bg-background py-20 sm:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow">Contato</p>
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">Passe, marque ou chame</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Escolha a forma mais prática. Para garantir o horário, faça a reserva online.
            </p>
            <Link href="/booking" className="mt-8 inline-flex items-center border-b border-foreground pb-1 text-sm font-semibold hover:text-primary">
              Abrir agenda <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div data-reveal className="border-t border-border">
            <div className="grid gap-4 border-b border-border py-6 sm:grid-cols-[2rem_1fr]">
              <MapPin className="h-5 w-5 text-primary" />
              <div><p className="text-sm font-semibold">Endereço</p><p className="mt-1 text-sm text-muted-foreground">{siteConfig.business.address}</p></div>
            </div>
            <div className="grid gap-4 border-b border-border py-6 sm:grid-cols-[2rem_1fr]">
              <Clock3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Funcionamento</p>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {siteConfig.hours.map((row) => <p key={row.days}>{row.days}: {row.time}</p>)}
                </div>
              </div>
            </div>
            <div className="grid gap-4 border-b border-border py-6 sm:grid-cols-[2rem_1fr]">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div><p className="text-sm font-semibold">Fale com o proprietário</p><a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-muted-foreground hover:text-primary">{siteConfig.business.phone}</a></div>
            </div>
            <div className="grid gap-4 border-b border-border py-6 sm:grid-cols-[2rem_1fr]">
              <AtSign className="h-5 w-5 text-primary" />
              <div><p className="text-sm font-semibold">Instagram</p><p className="mt-1 text-sm text-muted-foreground">{siteConfig.business.instagram}</p></div>
            </div>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">{siteConfig.presentation.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
