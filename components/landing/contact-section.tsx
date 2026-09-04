"use client"

import Link from "next/link"
import { ArrowRight, Clock3, MapPin, MessageCircle, MonitorCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/ui/animated-section"

const info = [
  { icon: MapPin, label: "Localização", value: "Centro • Pelotas, RS" },
  { icon: Clock3, label: "Horários", value: "Segunda a sábado • 9h às 20h" },
  { icon: MessageCircle, label: "Confirmação", value: "Atendimento e lembretes pelo WhatsApp" },
]

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-card py-24 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(185,28,28,0.14),transparent_32rem)]" />
      <div className="container relative mx-auto px-4 lg:px-8">
        <AnimatedSection className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-gold">Seu próximo horário</p>
            <h2 className="mt-4 max-w-3xl font-heading text-6xl leading-[0.95] tracking-wide text-foreground sm:text-7xl">
              PRONTO PARA ATUALIZAR O VISUAL?
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Escolha o serviço, o profissional e o melhor horário. O restante fica por nossa conta.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking">
                <Button size="lg" className="gradient-primary h-14 w-full border-0 px-8 text-base text-primary-foreground sm:w-auto">
                  Agendar agora <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 w-full border-white/15 bg-white/5 px-7 text-base hover:bg-white/10 sm:w-auto">
                  <MonitorCog className="mr-2 h-5 w-5" />
                  Ver painel demonstrativo
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-background/75 p-6 shadow-2xl backdrop-blur sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-primary">Informações ilustrativas</p>
            <div className="mt-6 space-y-4">
              {info.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4 rounded-xl border border-white/8 bg-white/[0.025] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-1 font-medium text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-white/8 pt-5 text-sm leading-relaxed text-muted-foreground">
              Em uma versão comercial, localização, WhatsApp, horários e identidade visual são personalizados para a barbearia.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
