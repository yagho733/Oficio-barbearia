"use client"

import Link from "next/link"
import { Calendar, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/ui/animated-section"

const features = [
  "Escolha seu barbeiro preferido",
  "Selecione data e horário disponíveis",
  "Confirmação instantânea",
  "Lembretes automáticos",
]

export function BookingPreviewSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 text-gold border-gold/30">
              Agendamento Online
            </Badge>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-6">
              AGENDE EM<br />SEGUNDOS
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Nossa plataforma de agendamento inteligente torna fácil marcar seu horário. 
              Escolha o barbeiro, serviço, data e horário que melhor se encaixam na sua agenda.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/booking">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0">
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimatedSection>

          {/* Preview Card */}
          <AnimatedSection delay={0.2}>
            <Card className="glass-card p-6 lg:p-8">
              <div className="space-y-6">
                {/* Step indicators */}
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                        step === 1 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>

                <div className="h-px bg-border" />

                {/* Mock booking preview */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Passo 1</p>
                  <h3 className="font-heading text-2xl text-foreground mb-4">ESCOLHA SEU BARBEIRO</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {["Marcus J.", "David W.", "James T.", "Michael B."].map((name, i) => (
                      <Card 
                        key={name}
                        className={`p-4 cursor-pointer transition-all ${
                          i === 0 
                            ? "bg-primary/10 border-primary" 
                            : "bg-muted/50 border-transparent hover:border-border"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-muted mb-2" />
                        <p className="text-sm font-medium text-foreground">{name}</p>
                        <p className="text-xs text-muted-foreground">Disponível</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button className="w-full gradient-primary text-primary-foreground border-0">
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
