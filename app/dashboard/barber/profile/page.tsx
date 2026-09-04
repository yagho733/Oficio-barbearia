"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Phone, Mail, ChevronLeft, Save, ShieldCheck, Award, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard/header"

export default function BarberProfilePage() {
  const router = useRouter()
  const [name, setName] = useState("Rafael Costa")
  const [specialty, setSpecialty] = useState("Cortes Clássicos & Barbaterapia")
  const [email, setEmail] = useState("marcus.barbeiro@barber.com")
  const [bio, setBio] = useState("Barbeiro especialista em cortes clássicos e técnicas tradicionais de toalha quente.")
  const [workingDays, setWorkingDays] = useState("Segunda a Sábado")
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("barbershop_demo_session") || sessionStorage.getItem("barbershop_demo_session")
    if (!session) {
      router.push("/login")
      return
    }
    const parsed = JSON.parse(session)
    if (parsed.role !== "barber" && parsed.role !== "admin") {
      router.push(`/dashboard/${parsed.role}`)
      return
    }

    if (parsed.role === "barber") {
      setName(parsed.name || "Rafael Costa")
      setEmail(parsed.email || "marcus.barbeiro@barber.com")
    }
  }, [router])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader 
        title="Meu Perfil" 
        subtitle="Gerencie seus dados profissionais de barbeiro" 
        type="barber"
      />

      <main className="p-6 space-y-6 max-w-2xl w-full mx-auto pb-24 text-left">
        <div>
          <Link href="/dashboard/barber" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar ao painel</span>
          </Link>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4 border-b border-border/50 pb-5 mb-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-heading text-2xl text-primary font-bold">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{name}</h3>
              <p className="text-xs text-muted-foreground">Profissional • Barbearia demonstrativa</p>
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
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase">E-mail Corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted border-border pl-10 text-xs h-10"
                  required
                  disabled
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="specialty" className="text-xs font-bold text-muted-foreground uppercase">Especialidade</Label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <Input 
                  id="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="bg-muted border-border pl-10 text-xs h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="workingDays" className="text-xs font-bold text-muted-foreground uppercase">Dias de Expediente</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <Input 
                  id="workingDays"
                  value={workingDays}
                  onChange={(e) => setWorkingDays(e.target.value)}
                  className="bg-muted border-border pl-10 text-xs h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-bold text-muted-foreground uppercase">Minha Biografia</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 h-4.5 w-4.5 text-muted-foreground" />
                <textarea 
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-border bg-muted pl-10 pr-3 py-2.5 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  required
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
