"use client"

import { Star } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { barbers } from "@/lib/data"

const teamImage = "https://images.pexels.com/photos/19225142/pexels-photo-19225142/free-photo-of-barber-standing-in-his-shop-in-front-of-a-chair.jpeg?auto=compress&dpr=1&h=1100&w=900"

export function BarbersSection() {
  return (
    <section id="barbers" className="bg-background py-24 sm:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="mb-14 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-gold">Profissionais</p>
          <h2 className="display-title mt-4 text-[clamp(2.75rem,8vw,4.5rem)]">
            ESCOLHA QUEM CUIDA DO SEU ESTILO
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Perfis individuais valorizam a equipe e conectam cada cliente ao profissional certo.
          </p>
        </AnimatedSection>

        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <AnimatedSection className="relative min-h-[480px] overflow-hidden rounded-[1.75rem] border border-white/10">
            <img src={teamImage} alt="Profissional em uma barbearia moderna" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="font-heading text-3xl leading-tight tracking-wide">SUA EQUIPE TAMBÉM FAZ PARTE DA MARCA</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Fotos, especialidades e disponibilidade podem ser adaptadas para cada profissional.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-4">
            {barbers.slice(0, 3).map((barber, index) => (
              <AnimatedSection key={barber.id} delay={0.08 * index}>
                <article className="group grid gap-5 rounded-2xl border border-white/8 bg-card/65 p-6 transition-colors hover:border-primary/40 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 font-heading text-2xl tracking-wide text-primary">
                    {barber.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl tracking-wide text-foreground">{barber.name}</h3>
                    <p className="mt-1 text-sm font-medium text-primary">{barber.specialty}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{barber.bio}</p>
                  </div>
                  <div className="flex items-center gap-1.5 self-start rounded-full border border-gold/20 bg-gold/8 px-3 py-1.5 text-sm text-gold sm:self-center">
                    <Star className="h-4 w-4 fill-current" />
                    {barber.rating.toFixed(1)}
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
