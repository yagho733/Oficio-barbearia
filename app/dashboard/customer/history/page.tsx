"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, ChevronLeft, Scissors, Star, Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/header"
import { getStoredAppointments, Appointment } from "@/lib/data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function CustomerHistoryPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const all = getStoredAppointments()
    const now = new Date()
    const todayStr = format(now, "yyyy-MM-dd")
    
    // Past appointments or cancelled ones
    const history = all.filter(app => app.status === "cancelled" || app.date < todayStr)
    // Sort by date (most recent first)
    const sorted = [...history].sort((a, b) => {
      return new Date(`${b.date}T12:00:00`).getTime() - new Date(`${a.date}T12:00:00`).getTime()
    })
    setAppointments(sorted)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader 
        title="Histórico de Atendimentos" 
        subtitle="Histórico de cortes e serviços realizados" 
        type="customer"
      />

      <main className="p-6 space-y-6 max-w-4xl w-full mx-auto pb-24">
        {/* Breadcrumb */}
        <div>
          <Link href="/dashboard/customer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors text-left">
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar ao painel</span>
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-lg tracking-wider text-muted-foreground uppercase text-left">Cortes Realizados ({appointments.length})</h2>

          <Card className="bg-card border-border overflow-hidden divide-y divide-border">
            {appointments.map(app => (
              <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-muted/30 transition-all text-left">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                    <Scissors className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base">{app.service}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      com {app.barberName} • {format(new Date(app.date + "T12:00:00"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {app.time}
                    </p>
                    
                    {app.status !== "cancelled" && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gold font-medium">
                        <Star className="h-3 w-3 fill-gold" />
                        <span>Avaliado em 5.0 estrelas</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 ml-14 sm:ml-0">
                  <Badge variant="secondary" className={`border-0 text-xs font-bold px-2 py-0.5 ${
                    app.status === "cancelled" 
                      ? "bg-destructive/10 text-destructive" 
                      : "bg-green-500/10 text-green-500"
                  }`}>
                    {app.status === "cancelled" ? "Cancelado" : "Concluído"}
                  </Badge>
                  <span className="font-heading text-xl text-foreground font-bold">${app.price}</span>
                </div>
              </div>
            ))}

            {appointments.length === 0 && (
              <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <Scissors className="h-8 w-8 text-muted-foreground/40" />
                <p>Nenhum atendimento no histórico.</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
