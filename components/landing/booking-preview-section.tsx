"use client"

import Link from "next/link"
import { ArrowRight, CalendarDays, CheckCircle2, Scissors, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/ui/animated-section"

const steps = [
  { icon: Scissors, number: "01", title: "Escolha o serviço", text: "Veja o valor e o tempo estimado antes de continuar." },
  { icon: UserRound, number: "02", title: "Selecione o profissional", text: "Encontre a especialidade ideal para o seu estilo." },
  { icon: CalendarDays, number: "03", title: "Reserve o horário", text: "Confira a agenda disponível e conclua em poucos passos." },
]

export function BookingPreviewSection() {
  return (
    <section id="booking-demo" className="border-y border-white/5 bg-card py-24 sm:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-gold">Sem ligação e sem espera</p>
          <h2 className="mt-4 font-heading text-5xl leading-none tracking-wide text-foreground sm:text-6xl">
            AGENDE EM MENOS DE UM MINUTO
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Uma experiência simples no celular para o cliente e uma agenda mais organizada para a barbearia.
          </p>
        </AnimatedSection>

        <div className="relative mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent md:block" />
          {steps.map(({ icon: Icon, number, title, text }, index) => (
            <AnimatedSection key={title} delay={index * 0.1} className="relative">
              <div className="h-full rounded-2xl border border-white/8 bg-background/65 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/25 bg-primary/12 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="mt-6 block text-xs font-medium tracking-[0.24em] text-gold">PASSO {number}</span>
                <h3 className="mt-2 font-heading text-2xl tracking-wide text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2} className="mt-10 flex flex-col items-center gap-4">
          <Link href="/booking">
            <Button size="lg" className="gradient-primary h-14 border-0 px-8 text-base text-primary-foreground">
              Testar o agendamento <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Fluxo demonstrativo; nenhuma cobrança será realizada.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
