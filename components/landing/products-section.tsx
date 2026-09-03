"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section"
import { products } from "@/lib/data"

export function ProductsSection() {
  return (
    <section id="products" className="py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-gold border-gold/30">
            Produtos Premium
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-4">
            CUIDE DO SEU ESTILO
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Produtos selecionados de alta qualidade para manter seu visual impecável entre as visitas.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <Card className="group overflow-hidden bg-muted/50 border-border hover:border-primary/50 transition-all duration-300">
                {/* Product Image Placeholder */}
                <div className="aspect-square bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-background/10 flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>

                <div className="p-5">
                  <Badge variant="secondary" className="mb-3 bg-muted text-muted-foreground text-xs">
                    {product.category === "styling" ? "Styling" : product.category === "beard" ? "Barba" : "Pós-barba"}
                  </Badge>
                  
                  <h3 className="font-heading text-xl tracking-wide text-foreground mb-2">
                    {product.name.toUpperCase()}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-heading text-2xl text-primary">${product.price}</span>
                    <Button size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground hover:border-primary">
                      Comprar
                    </Button>
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
