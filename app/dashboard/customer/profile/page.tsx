"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Phone, Mail, MapPin, ChevronLeft, Save, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard/header"

export default function CustomerProfilePage() {
  const [name, setName] = useState("John Smith")
  const [phone, setPhone] = useState("+55 (53) 99999-9999")
  const [email, setEmail] = useState("john.smith@gmail.com")
  const [address, setAddress] = useState("Av. Duque de Caxias, 775 - Fragata")
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader 
        title="Meu Perfil" 
        subtitle="Gerencie seus dados pessoais" 
        type="customer"
      />

      <main className="p-6 space-y-6 max-w-2xl w-full mx-auto pb-24">
        {/* Breadcrumb */}
        <div>
          <Link href="/dashboard/customer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors text-left">
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar ao painel</span>
          </Link>
        </div>

        {/* Profile Card */}
        <Card className="p-6 bg-card border-border text-left">
          <div className="flex items-center gap-4 border-b border-border/50 pb-5 mb-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-heading text-2xl text-primary font-bold">
              JS
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{name}</h3>
              <p className="text-xs text-muted-foreground">Cliente demonstração</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted border-border pl-10 text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted border-border pl-10 text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase">Telefone / Celular</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <Input 
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-muted border-border pl-10 text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-bold text-muted-foreground uppercase">Endereço de Preferência</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <Input 
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-muted border-border pl-10 text-xs h-10"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <span className="text-xs text-green-500 font-semibold flex items-center gap-1.5">
                {isSaved && (
                  <>
                    <ShieldCheck className="h-4 w-4" /> Alterações salvas!
                  </>
                )}
              </span>
              <Button type="submit" className="bg-primary text-primary-foreground border-0 font-bold text-xs h-10 px-5 gap-1.5">
                <Save className="h-4 w-4" /> Salvar Perfil
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
