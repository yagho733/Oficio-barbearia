"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, ChevronLeft, Search, CheckCircle, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/header"
import { getStoredAppointments, Appointment } from "@/lib/data"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function BarberHistoryPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")

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

    const barberName = parsed.role === "barber" ? parsed.name || "Profissional demonstrativo" : "Profissional demonstrativo"
    const all = getStoredAppointments()
    const history = all.filter(a => a.barberName === barberName)
    
    // Sort by date (most recent first)
    const sorted = [...history].sort((a, b) => {
      return b.date.localeCompare(a.date) || b.time.localeCompare(a.time)
    })
    setAppointments(sorted)
  }, [router])

  const filteredAppointments = appointments.filter(app => 
    app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatarParaBr = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy")
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader 
        title="Histórico de Atendimentos" 
        subtitle="Listagem completa de serviços realizados por você" 
        type="barber"
      />

      <main className="p-6 space-y-6 max-w-4xl w-full mx-auto pb-24 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/dashboard/barber" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar ao painel</span>
          </Link>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar por cliente ou serviço..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border-border pl-9 text-xs h-9 w-full"
            />
          </div>
        </div>

        <Card className="bg-card border-border overflow-hidden">
          <div className="divide-y divide-border">
            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <Calendar className="h-8 w-8 text-muted-foreground/40" />
                <p>Nenhum corte registrado no histórico.</p>
              </div>
            ) : (
              filteredAppointments.map((app) => (
                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-muted/10 transition-all text-xs text-left">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                      {app.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      ) : app.status === "cancelled" ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <Calendar className="h-5 w-5 text-gold" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{app.customerName}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Serviço: <span className="font-semibold text-foreground">{app.service}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground font-mono">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatarParaBr(app.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {app.time} ({app.duration})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 ml-14 sm:ml-0 font-mono">
                    <Badge variant="secondary" className={`border-0 text-xs font-bold px-2 py-0.5 ${
                      app.status === "completed" 
                        ? "bg-green-500/10 text-green-500" 
                        : app.status === "cancelled"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-gold/10 text-gold"
                    }`}>
                      {app.status === "completed" ? "Concluído" : app.status === "cancelled" ? "Cancelado" : "Confirmado"}
                    </Badge>
                    <span className="font-heading text-base text-foreground font-bold">R$ {app.price.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
