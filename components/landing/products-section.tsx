"use client"

import { Award, Clock3, ShieldCheck } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"

const craftImage = "https://images.unsplash.com/photo-1657105052497-f996284ffff8?auto=format&fit=crop&fm=jpg&q=82&w=1600"

const details = [
  { icon: Award, title: "Técnica apurada", text: "Cortes atuais sem abrir mão do acabamento clássico." },
  { icon: Clock3, title: "Seu horário respeitado", text: "Agenda organizada para reduzir espera e atender com calma." },
  { icon: ShieldCheck, title: "Cuidado em cada etapa", text: "Higiene, produtos selecionados e orientação para manter o resultado." },
]

export function ProductsSection() {
  return (
    <section id="experience" className="overflow-hidden border-y border-white/5 bg-card py-24 sm:py-28">
      <div className="container mx-auto grid items-center gap-14 px-4 lg:grid-cols-2 lg:px-8">
        <AnimatedSection className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-gold/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10">
            <img src={craftImage} alt="Barbeiro realizando um corte com precisão" className="h-[520px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="rounded-full border border-white/15 bg-background/70 px-4 py-2 text-sm text-white/80 backdrop-blur">
                Precisão do primeiro ao último detalhe
              </span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.12}>
          <p className="text-sm uppercase tracking-[0.28em] text-gold">Mais que um corte</p>
          <h2 className="display-title mt-4 text-[clamp(2.75rem,8vw,4.5rem)]">
            UMA EXPERIÊNCIA QUE COMEÇA ANTES DA CADEIRA
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            O cliente escolhe o serviço, o profissional e um horário realmente livre. A barbearia recebe uma agenda organizada e fácil de acompanhar.
          </p>

          <div className="mt-9 space-y-5">
            {details.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-white/8 bg-background/50 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-medium text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
