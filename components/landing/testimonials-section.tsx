"use client"

import { Star, Quote } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section"
import { testimonials } from "@/lib/data"

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-gold border-gold/30">
            Depoimentos
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-4">
            O QUE DIZEM
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A satisfação dos nossos clientes é nossa maior recompensa.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <Card className="relative overflow-hidden bg-muted/50 border-border p-8 h-full">
                <Quote className="absolute top-6 right-6 h-12 w-12 text-primary/10" />
                
                <div className="relative">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground mb-8 leading-relaxed text-pretty">
                    {`"${testimonial.content}"`}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-heading">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
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
