"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, User, Scissors, XCircle, Plus, ChevronLeft, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/header"
import { getStoredAppointments, replaceStoredAppointments, Appointment } from "@/lib/data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function CustomerAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadAppointments = () => {
    // For simplicity, we assume customerName is "John Smith" (from current customer mock)
    const all = getStoredAppointments()
    // Sort by date and time (most recent first)
    const sorted = [...all].sort((a, b) => {
      return new Date(`${b.date}T12:00:00`).getTime() - new Date(`${a.date}T12:00:00`).getTime()
    })
    setAppointments(sorted)
  }

  useEffect(() => {
    loadAppointments()
  }, [])

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
    setToastMessage("Agendamento cancelado com sucesso.")
    setTimeout(() => setToastMessage(null), 3000)
  }

  const filteredAppointments = appointments.filter(app => {
    if (filter === "all") return true
    return app.status === filter
  })

  // Group appointments into upcoming and past
  const now = new Date()
  const todayStr = format(now, "yyyy-MM-dd")

  const upcoming = filteredAppointments.filter(app => {
    return app.status !== "cancelled" && app.date >= todayStr
  })

  const pastOrCancelled = filteredAppointments.filter(app => {
    return app.status === "cancelled" || app.date < todayStr
  })

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader 
        title="Meus Agendamentos" 
        subtitle="Gerencie seus horários reservados" 
        type="customer"
      />

      <main className="p-6 space-y-6 max-w-4xl w-full mx-auto pb-24">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/customer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar ao painel</span>
          </Link>

          <Link href="/booking">
            <Button size="sm" className="gradient-primary text-primary-foreground border-0 text-xs font-bold gap-1.5 h-9">
              <Plus className="h-3.5 w-3.5" /> Novo Agendamento
            </Button>
          </Link>
        </div>

        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500/10 border border-green-500/25 text-green-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Info className="h-4.5 w-4.5 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "Todos" },
            { id: "confirmed", label: "Confirmados" },
            { id: "pending", label: "Pendentes" },
            { id: "cancelled", label: "Cancelados" }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                filter === f.id
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content lists */}
        <div className="space-y-8">
          {/* Upcoming Section */}
          <div className="space-y-4">
            <h2 className="font-heading text-lg tracking-wider text-muted-foreground uppercase">Próximos Agendamentos ({upcoming.length})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map(app => (
                <Card key={app.id} className="p-5 bg-card border-border hover:border-primary/30 transition-all flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Scissors className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 text-left">
                        <h3 className="font-semibold text-foreground truncate">{app.service}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">com {app.barberName}</p>
                        
                        <div className="flex flex-col gap-1.5 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gold" />
                            <span>{format(new Date(app.date + "T12:00:00"), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-gold" />
                            <span>{app.time} ({app.duration})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1.5">
                      <Badge variant="secondary" className={`border-0 text-xs font-bold px-2 py-0.5 ${
                        app.status === "confirmed" 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-gold/10 text-gold"
                      }`}>
                        {app.status === "confirmed" ? "Confirmado" : "Pendente"}
                      </Badge>
                      <span className="font-heading text-xl text-primary font-bold">${app.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border/50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCancelAppointment(app.id)}
                      className="w-full text-xs font-semibold h-8 text-destructive hover:text-destructive hover:bg-destructive/10 border-border"
                    >
                      <XCircle className="h-4 w-4 mr-1.5" /> Cancelar Agendamento
                    </Button>
                  </div>
                </Card>
              ))}

              {upcoming.length === 0 && (
                <Card className="p-8 bg-card border-border text-center col-span-full flex flex-col items-center gap-3">
                  <Calendar className="h-10 w-10 text-muted-foreground/60" />
                  <div>
                    <h3 className="font-semibold text-foreground">Sem agendamentos futuros</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">Você não possui nenhum horário marcado para os próximos dias.</p>
                  </div>
                  <Link href="/booking">
                    <Button className="gradient-primary text-primary-foreground border-0 text-xs font-bold mt-2 h-9">
                      Agendar Horário
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>

          {/* Past/Cancelled Section */}
          <div className="space-y-4">
            <h2 className="font-heading text-lg tracking-wider text-muted-foreground uppercase">Histórico / Cancelados ({pastOrCancelled.length})</h2>
            
            <Card className="bg-card border-border overflow-hidden divide-y divide-border">
              {pastOrCancelled.map(app => (
                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/30 transition-all text-left">
                  <div className="flex items-center gap-3.5">
                    <div className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                      {app.status === "cancelled" ? (
                        <XCircle className="h-4.5 w-4.5 text-destructive" />
                      ) : (
                        <CheckCircle className="h-4.5 w-4.5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{app.service}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        com {app.barberName} • {format(new Date(app.date + "T12:00:00"), "dd/MM/yyyy")} às {app.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 ml-12 sm:ml-0">
                    <Badge variant="secondary" className={`border-0 text-xs font-bold px-2 ${
                      app.status === "cancelled" 
                        ? "bg-destructive/10 text-destructive" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {app.status === "cancelled" ? "Cancelado" : "Concluído"}
                    </Badge>
                    <span className="font-heading text-lg text-foreground font-bold">${app.price}</span>
                  </div>
                </div>
              ))}

              {pastOrCancelled.length === 0 && (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Nenhum agendamento finalizado ou cancelado encontrado.
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

// Simple internal check circle icon fallback
function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}
