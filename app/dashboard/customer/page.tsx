"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Calendar, Clock, Scissors, User as UserIcon, 
  Trash2, RefreshCcw, ArrowRight, Star, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/header"
import { 
  getStoredAppointments, 
  replaceStoredAppointments,
  Appointment, 
  barbers 
} from "@/lib/data"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function CustomerDashboardPage() {
  const router = useRouter()
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([])
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("barbershop_demo_session") || sessionStorage.getItem("barbershop_demo_session")
    if (!session) {
      router.push("/login")
      return
    }

    try {
      const parsed = JSON.parse(session)
      if (parsed.role !== "customer") {
        // Enforce role-based routing
        router.push(`/dashboard/${parsed.role}`)
        return
      }
      setCurrentUser(parsed)
      setAppointmentsList(getStoredAppointments())
    } catch (e) {
      localStorage.removeItem("barbershop_demo_session")
      router.push("/login")
    }
  }, [router])

  const loadAppointments = () => {
    setAppointmentsList(getStoredAppointments())
  }

  const handleCancelAppointment = (id: string) => {
    const all = getStoredAppointments()
    const updated = all.map(app => {
      if (app.id === id) {
        return { ...app, status: "cancelled" as const }
      }
      return app
    })
    replaceStoredAppointments(updated)
    loadAppointments()
    showToast("Agendamento cancelado com sucesso.")
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const formatarParaBr = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy")
    } catch {
      return dateStr
    }
  }

  const formatarPorExtenso = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd 'de' MMMM", { locale: ptBR })
    } catch {
      return dateStr
    }
  }

  // Segment appointments
  const now = new Date()
  const todayStr = format(now, "yyyy-MM-dd")

  const upcomingAppointments = appointmentsList.filter(
    (a) => a.status === "confirmed" && a.date >= todayStr
  ).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  const recentHistory = appointmentsList.filter(
    (a) => a.status === "confirmed" && a.date < todayStr
  ).slice(0, 3)

  const nextAppointment = upcomingAppointments[0] || null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader 
        title="Área do Cliente" 
        subtitle={currentUser ? `Bem-vindo de volta, ${currentUser.name}` : ""} 
        type="customer" 
      />

      <main className="p-6 space-y-6 max-w-6xl mx-auto w-full pb-20 text-left">
        {toastMessage && (
          <div className="bg-green-500/10 border border-green-500/25 text-green-400 p-3 rounded-lg text-xs font-semibold animate-fade-in">
            {toastMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main area - Left Col */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Next appointment */}
            <Card className="p-6 bg-card border-border overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
              
              <div className="relative space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-primary">Próximo Horário</h2>
                  {nextAppointment && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-0 font-bold text-xs">
                      Confirmado
                    </Badge>
                  )}
                </div>

                {nextAppointment ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground">{nextAppointment.service}</h3>
                        <p className="text-xs text-gold">Profissional: {nextAppointment.barberName}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> {formatarPorExtenso(nextAppointment.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {nextAppointment.time} ({nextAppointment.duration})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <Link href="/booking">
                        <Button variant="outline" size="sm" className="text-xs font-bold gap-1 border-border">
                          <RefreshCcw className="h-3.5 w-3.5" /> Reagendar
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => handleCancelAppointment(nextAppointment.id)} 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-destructive hover:bg-destructive/10 gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                    <Calendar className="h-8 w-8 text-muted-foreground/30" />
                    <p>Você não tem nenhum horário agendado.</p>
                    <Link href="/booking" className="mt-2">
                      <Button size="sm" className="gradient-primary text-primary-foreground border-0 font-bold text-xs h-9">
                        <Plus className="h-3.5 w-3.5 mr-1" /> Agendar Agora
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {/* Recent History */}
            <div className="space-y-3">
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Histórico Recente</h2>
              
              <div className="space-y-3">
                {recentHistory.length === 0 ? (
                  <Card className="p-8 text-center text-xs text-muted-foreground border-dashed">
                    Nenhum atendimento anterior encontrado.
                  </Card>
                ) : (
                  recentHistory.map((app) => (
                    <Card key={app.id} className="p-4 bg-card border-border flex justify-between items-center hover:border-primary/20 transition-all">
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-foreground">{app.service}</p>
                        <p className="text-xs text-muted-foreground">Barbeiro: {app.barberName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1 font-mono">
                          <Calendar className="h-3 w-3" /> {formatarParaBr(app.date)} às {app.time}
                        </p>
                      </div>
                      <div className="text-right space-y-1.5">
                        <Badge className="bg-green-500/10 text-green-400 border-0 font-bold text-xs">Concluído</Badge>
                        <p className="font-heading font-bold text-primary text-sm">R$ {app.price.toFixed(2)}</p>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Col */}
          <div className="space-y-6">
            
            {/* Quick booking CTA */}
            <Card className="p-6 bg-card border-border text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              <div className="relative space-y-3">
                <Scissors className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-heading font-bold text-xs tracking-wider uppercase">Novo Agendamento</h3>
                <p className="text-xs text-muted-foreground">Marque o seu visual com os melhores profissionais da cidade.</p>
                <Link href="/booking" className="block w-full pt-2">
                  <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground border-0 font-bold text-xs h-10">
                    Agendar Novo Serviço <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Profile configuration summary */}
            <Card className="p-6 bg-card border-border space-y-4">
              <h3 className="font-heading font-bold text-xs tracking-wider uppercase">Minha Conta</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm font-mono shrink-0">
                  {currentUser?.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <Link href="/dashboard/customer/profile" className="block">
                <Button variant="outline" className="w-full text-xs font-semibold h-9 border-border">
                  Editar Perfil / Dados
                </Button>
              </Link>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}
