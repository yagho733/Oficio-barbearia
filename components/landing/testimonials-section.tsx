"use client"

import { MessageCircleMore, Sparkles, TimerReset } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"

const promises = [
  {
    icon: MessageCircleMore,
    title: "Atendimento consultivo",
    text: "Antes de começar, alinhamos referências, rotina e o resultado que você espera.",
  },
  {
    icon: Sparkles,
    title: "Acabamento cuidadoso",
    text: "Detalhes de contorno, finalização e orientação para manter o corte no dia a dia.",
  },
  {
    icon: TimerReset,
    title: "Experiência sem correria",
    text: "O tempo do serviço é reservado para que cada etapa seja feita com atenção.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="grid gap-10 rounded-[1.75rem] border border-white/8 bg-gradient-to-br from-card to-background p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-14">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-gold">Estrutura profissional</p>
            <h2 className="display-title mt-4 text-[clamp(2.75rem,8vw,4.25rem)]">
              CADA DETALHE AJUDA A GERAR CONFIANÇA
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              O site organiza informações importantes e reduz as dúvidas que impedem o cliente de marcar.
            </p>
          </div>

          <div className="grid gap-4">
            {promises.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-white/8 bg-white/[0.025] p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
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
