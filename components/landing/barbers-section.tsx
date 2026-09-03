"use client"

import { Star, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section"
import { barbers } from "@/lib/data"

export function BarbersSection() {
  return (
    <section id="barbers" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-gold border-gold/30">
            Nossa Equipe
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-4">
            MESTRES DA ARTE
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Barbeiros especialistas com anos de experiência, dedicados a proporcionar a melhor experiência.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {barbers.map((barber) => (
            <StaggerItem key={barber.id}>
              <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
                {/* Barber Image Placeholder */}
                <div className="aspect-[3/4] bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-background/10 flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Rating badge */}
                  <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3 text-gold fill-gold" />
                    <span className="text-sm font-medium text-foreground">{barber.rating}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-xl tracking-wide text-foreground mb-1">
                    {barber.name.toUpperCase()}
                  </h3>
                  
                  <p className="text-sm text-primary mb-3">
                    {barber.specialty}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{barber.experience}</span>
                    <span className="text-muted-foreground">{barber.reviews} avaliações</span>
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
