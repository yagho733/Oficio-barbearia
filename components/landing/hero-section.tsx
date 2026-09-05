import Link from "next/link"
import { ArrowRight, Clock3, MapPin } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

const heroImage = "https://images.pexels.com/photos/17027433/pexels-photo-17027433/free-photo-of-interior-of-an-empty-barber-shop-at-night.jpeg?auto=compress&dpr=1&h=1200&w=1600"

export function HeroSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="container mx-auto grid min-h-[620px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="hero-enter relative flex flex-col justify-center px-5 py-14 sm:py-18 lg:px-8 lg:py-24">
          <span aria-hidden="true" className="absolute left-5 top-0 h-px w-24 bg-primary lg:left-8" />
          <p className="eyebrow">Barbearia em {siteConfig.business.city}</p>
          <h1 className="display-title mt-6 max-w-2xl text-[clamp(3rem,14vw,6.25rem)]">
            Corte bem feito.<br />Horário respeitado.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">
            Corte, barba e cuidado masculino com atendimento marcado e atenção aos detalhes.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/booking" className="inline-flex min-h-14 items-center justify-center bg-primary px-7 font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90">
              Agendar agora <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
            <Link href="#services" className="inline-flex min-h-14 items-center justify-center border border-border px-7 font-semibold transition-colors hover:border-primary hover:text-primary">
              Ver serviços
            </Link>
          </div>
        </div>

        <div className="group relative min-h-[390px] overflow-hidden border-t border-border sm:min-h-[480px] lg:min-h-[620px] lg:border-l lg:border-t-0">
          <img src={heroImage} alt="Interior de uma barbearia contemporânea" className="absolute inset-0 h-full w-full object-cover brightness-[0.72] saturate-[0.78] transition-transform duration-1000 ease-out group-hover:scale-[1.025]" />
          <div className="absolute inset-0 bg-linear-to-t from-background/55 via-transparent to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-background/94 p-5 text-foreground backdrop-blur-md sm:p-7">
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
