"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BadgeCheck, Calendar, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const heroImage = "https://images.pexels.com/photos/17027433/pexels-photo-17027433/free-photo-of-interior-of-an-empty-barber-shop-at-night.jpeg?auto=compress&dpr=1&h=1100&w=1600"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/5 pt-32 lg:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(201,154,83,0.16),transparent_32rem)]" />

      <div className="container relative mx-auto grid min-h-[680px] items-center gap-14 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-sm text-gold"
          >
            <BadgeCheck className="h-4 w-4" />
            Modelo profissional para apresentar a qualquer barbearia
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="display-title text-[clamp(3.25rem,12vw,6.6rem)]"
          >
            UM SITE À ALTURA
            <span className="block text-primary">DO SEU TRABALHO</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Mostre serviços, equipe e horários em uma experiência rápida no celular. Esta demonstração simula a jornada que o cliente terá na sua barbearia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/booking">
              <Button size="lg" className="gradient-primary h-14 w-full border-0 px-7 text-base text-primary-foreground sm:w-auto">
                <Calendar className="mr-2 h-5 w-5" />
                Testar o agendamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#services">
              <Button size="lg" variant="outline" className="h-14 w-full border-white/15 bg-white/5 px-7 text-base hover:bg-white/10 sm:w-auto">
                Conhecer a estrutura
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3"
          >
            {["Valores transparentes", "Agenda por profissional", "Horários sem conflito"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.12 }}
          className="relative mx-auto w-full max-w-xl lg:mx-0"
        >
          <div className="absolute -inset-5 rounded-[2rem] bg-primary/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-card shadow-2xl">
            <img
              src={heroImage}
              alt="Interior moderno de uma barbearia"
              className="h-[440px] w-full object-cover object-center sm:h-[520px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="font-heading text-3xl leading-tight tracking-wide">A IDENTIDADE DA SUA BARBEARIA</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/70">
                Nome, fotos, serviços, equipe, endereço e cores preparados para o seu negócio.
              </p>
            </div>
          </div>
          <div className="absolute bottom-5 left-5 rounded-xl border border-white/10 bg-card/95 px-5 py-4 shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Experiência completa</p>
            <p className="mt-1 font-heading text-2xl leading-tight tracking-wide text-primary">SITE E AGENDAMENTO</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
