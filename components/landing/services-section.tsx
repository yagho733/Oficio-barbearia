"use client"

import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section"
import { services } from "@/lib/data"

const categoryLabels: Record<string, string> = {
  haircut: "Corte",
  shave: "Barba",
  beard: "Barba",
  package: "Pacote",
}

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-gold border-gold/30">
            Nossos Serviços
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-4">
            EXPERIÊNCIA PREMIUM
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Cada serviço é cuidadosamente executado por nossos barbeiros especialistas, garantindo qualidade e satisfação.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 p-6 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      {categoryLabels[service.category]}
                    </Badge>
                    <span className="font-heading text-3xl text-primary">
                      ${service.price}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl tracking-wide text-foreground mb-2">
                    {service.name.toUpperCase()}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>

                  <Link href="/booking">
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                    >
                      Agendar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
