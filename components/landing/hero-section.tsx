"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Star, Calendar, Clock, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Star className="h-4 w-4 text-gold fill-gold" />
            <span className="text-sm text-muted-foreground">Experiência Premium desde 2010</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wide text-foreground mb-6"
          >
            <span className="block">TRADIÇÃO</span>
            <span className="block text-primary">AMERICANA.</span>
            <span className="block">ESTILO MODERNO.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experiência premium de barbearia e agendamento inteligente para o homem que valoriza qualidade e tradição.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/booking">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 h-14 text-base">
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Horário
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#services">
              <Button size="lg" variant="outline" className="px-8 h-14 text-base border-border hover:bg-muted">
                Explorar Serviços
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-border/50"
          >
            <div className="flex flex-col items-center">
              <span className="font-heading text-4xl md:text-5xl text-foreground">15+</span>
              <span className="text-sm text-muted-foreground mt-1">Anos de Experiência</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-4xl md:text-5xl text-foreground">10K+</span>
              <span className="text-sm text-muted-foreground mt-1">Clientes Satisfeitos</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-4xl md:text-5xl text-primary">4.9</span>
              <span className="text-sm text-muted-foreground mt-1">Avaliação Média</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-4xl md:text-5xl text-foreground">4</span>
              <span className="text-sm text-muted-foreground mt-1">Barbeiros Especialistas</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  )
}
