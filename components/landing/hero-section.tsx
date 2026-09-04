import Link from "next/link"
import { ArrowRight, Clock3, MapPin } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

const heroImage = "https://images.pexels.com/photos/17027433/pexels-photo-17027433/free-photo-of-interior-of-an-empty-barber-shop-at-night.jpeg?auto=compress&dpr=1&h=1200&w=1600"

export function HeroSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="container mx-auto grid min-h-[620px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex flex-col justify-center px-5 py-16 lg:px-8 lg:py-24">
          <p className="eyebrow">Barbearia em {siteConfig.business.city}</p>
          <h1 className="display-title mt-6 max-w-2xl text-[clamp(3rem,8vw,6.25rem)]">
            Corte bem feito.<br />Horário respeitado.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">
            Corte, barba e cuidado masculino com atendimento marcado e atenção aos detalhes.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/booking" className="inline-flex h-14 items-center justify-center bg-primary px-7 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Agendar agora <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
            <Link href="#services" className="inline-flex h-14 items-center justify-center border border-border px-7 font-semibold transition-colors hover:bg-muted">
              Ver serviços
            </Link>
          </div>
        </div>

        <div className="relative min-h-[430px] overflow-hidden border-t border-border lg:min-h-[620px] lg:border-l lg:border-t-0">
          <img src={heroImage} alt="Interior de uma barbearia contemporânea" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-foreground p-5 text-background sm:p-7">
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-primary" /> Terça a sábado, com hora marcada</p>
              <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> {siteConfig.business.address}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
