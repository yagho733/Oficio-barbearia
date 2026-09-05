"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { ServicesSection } from "@/components/landing/services-section"
import { ProductsSection } from "@/components/landing/products-section"
import { BarbersSection } from "@/components/landing/barbers-section"
import { ContactSection } from "@/components/landing/contact-section"
import { BookingPreviewSection } from "@/components/landing/booking-preview-section"
import { Footer } from "@/components/footer"
import { ScrollEffects } from "@/components/scroll-effects"
import { WhatsappCta } from "@/components/whatsapp-cta"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <ScrollEffects />
      <Navbar />

      <main>
        <HeroSection />
        <ServicesSection />
        <ProductsSection />
        <BarbersSection />
        <BookingPreviewSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsappCta />
    </div>
  )
}
