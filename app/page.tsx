"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { ServicesSection } from "@/components/landing/services-section"
import { ProductsSection } from "@/components/landing/products-section"
import { BarbersSection } from "@/components/landing/barbers-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* Header / Navbar */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Products Section */}
        <ProductsSection />

        {/* Barbers / Equipe Section */}
        <BarbersSection />

        {/* Testimonials / Avaliações Section */}
        <TestimonialsSection />

        {/* Contact and Location Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}