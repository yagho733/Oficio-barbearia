"use client"

import Link from "next/link"
import { ArrowRight, Clock3, MapPin, MessageCircle, MonitorCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/ui/animated-section"

const info = [
  { icon: MapPin, label: "Localização", value: "Endereço e mapa da barbearia" },
  { icon: Clock3, label: "Funcionamento", value: "Dias e horários personalizados" },
  { icon: MessageCircle, label: "Contato", value: "WhatsApp e redes sociais oficiais" },
]

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-card py-24 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(201,154,83,0.12),transparent_32rem)]" />
      <div className="container relative mx-auto px-4 lg:px-8">
        <AnimatedSection className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-gold">Personalização completa</p>
            <h2 className="display-title mt-4 max-w-3xl text-[clamp(3rem,9vw,5.25rem)]">
              ESTE MODELO PODE TER A CARA DA SUA BARBEARIA
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Identidade visual, fotos, valores, profissionais, endereço e WhatsApp são preparados para o seu negócio.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking">
                <Button size="lg" className="gradient-primary h-14 w-full border-0 px-8 text-base text-primary-foreground sm:w-auto">
                  Testar agendamento <ArrowRight className="ml-2 h-5 w-5" />
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
              Os dados acima são exemplos. A versão comercial recebe apenas informações verdadeiras da barbearia.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
