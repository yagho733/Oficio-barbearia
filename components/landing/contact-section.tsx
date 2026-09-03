"use client"

import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedSection } from "@/components/ui/animated-section"

const hours = [
  { day: "Segunda - Sexta", time: "9:00 - 20:00" },
  { day: "Sábado", time: "9:00 - 18:00" },
  { day: "Domingo", time: "Fechado" },
]

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-gold border-gold/30">
            Contato
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-4">
            VISITE-NOS
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Estamos localizados no coração da cidade, prontos para recebê-lo.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <AnimatedSection>
            <Card className="bg-muted/50 border-border p-8 h-full">
              <h3 className="font-heading text-2xl tracking-wide text-foreground mb-6">
                INFORMAÇÕES
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Endereço</p>
                    <p className="text-sm text-muted-foreground">
                      123 Main Street, Downtown<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Telefone</p>
                    <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">info@americanbarber.com</p>
                  </div>
                </div>

                <div className="h-px bg-border my-6" />

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h4 className="font-heading text-lg tracking-wide text-foreground">HORÁRIO DE FUNCIONAMENTO</h4>
                  </div>
                  <div className="space-y-2">
                    {hours.map((item) => (
                      <div key={item.day} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.day}</span>
                        <span className="text-foreground">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection delay={0.2}>
            <Card className="bg-muted/50 border-border p-8 h-full">
              <h3 className="font-heading text-2xl tracking-wide text-foreground mb-6">
                ENVIE UMA MENSAGEM
              </h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input 
                      id="name" 
                      placeholder="Seu nome" 
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    placeholder="(00) 00000-0000" 
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <textarea 
                    id="message" 
                    rows={4}
                    placeholder="Como podemos ajudá-lo?"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">
                  Enviar Mensagem
                </Button>
              </form>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
