"use client"

import Link from "next/link"
import { ArrowUpRight, Clock, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section"
import { services } from "@/lib/data"

const categoryLabels: Record<string, string> = {
  haircut: "Cabelo",
  shave: "Barba",
  beard: "Barba",
  package: "Experiência",
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

export function ServicesSection() {
  return (
    <section id="services" className="bg-background py-24 sm:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-5 border-gold/30 text-gold">Serviços e valores</Badge>
            <h2 className="display-title text-[clamp(2.75rem,8vw,4.5rem)]">
              SERVIÇOS BEM APRESENTADOS VENDEM MELHOR
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              O cliente entende o que está contratando, quanto custa e quanto tempo leva antes de reservar.
            </p>
          </div>
          <Link href="/booking">
            <Button variant="outline" className="h-12 border-white/15 bg-white/5 px-5 hover:bg-white/10">
              Ver horários disponíveis <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </AnimatedSection>

        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <StaggerItem key={service.id}>
              <Card className="group h-full border-white/8 bg-card/65 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Scissors className="h-5 w-5" />
                  </div>
                  <span className="font-heading text-4xl text-white/5">0{index + 1}</span>
                </div>
                <div className="mt-8">
                  <span className="text-xs uppercase tracking-[0.2em] text-gold">
                    {categoryLabels[service.category] ?? "Serviço"}
                  </span>
                  <h3 className="mt-2 font-heading text-2xl tracking-wide text-foreground">{service.name}</h3>
                  <p className="mt-3 min-h-12 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                </div>
                <div className="mt-7 flex items-end justify-between border-t border-white/8 pt-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    {service.duration}
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-muted-foreground">a partir de</span>
                    <span className="font-heading text-2xl tracking-wide text-primary">{formatPrice(service.price)}</span>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
