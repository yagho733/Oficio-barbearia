import Link from "next/link"
import { ArrowUpRight, Clock3 } from "lucide-react"
import { services } from "@/lib/data"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(price)

export function ServicesSection() {
  return (
    <section id="services" className="bg-card py-20 sm:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="eyebrow">Serviços</p>
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">Escolha o seu atendimento</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            Valores e duração informados antes da reserva. Sem precisar ligar ou esperar uma resposta no WhatsApp.
          </p>
        </div>

        <div className="grid md:grid-cols-2">
          {services.map((service, index) => (
            <article key={service.id} className={`grid grid-cols-[1fr_auto] gap-5 border-b border-border py-7 md:px-7 ${index % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"}`}>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{service.description}</p>
                <p className="mt-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-primary" /> {service.duration}
                </p>
              </div>
              <p className="font-heading text-2xl font-semibold text-primary">{formatPrice(service.price)}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-start sm:justify-end">
          <Link href="/booking" className="inline-flex items-center border-b border-foreground pb-1 text-sm font-semibold hover:text-primary">
            Consultar horários <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
