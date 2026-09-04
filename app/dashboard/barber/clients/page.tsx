"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Phone, Mail, ChevronLeft, Search, Calendar, Scissors, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard/header"
import { getStoredAppointments, Appointment } from "@/lib/data"
import { format, parseISO } from "date-fns"

interface ClientSummary {
  name: string
  email: string
  phone: string
  lastVisit: string
  cutsCount: number
  totalSpent: number
}

export default function BarberClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const session = localStorage.getItem("american_barber_session") || sessionStorage.getItem("american_barber_session")
    if (!session) {
      router.push("/login")
      return
    }
    const parsed = JSON.parse(session)
    if (parsed.role !== "barber" && parsed.role !== "admin") {
      router.push(`/dashboard/${parsed.role}`)
      return
    }

    const barberName = parsed.role === "barber" ? parsed.name || "Rafael Costa" : "Rafael Costa"
    const apps = getStoredAppointments().filter(a => a.barberName === barberName)

    // Aggregate client statistics
    const clientMap: Record<string, { email: string; phone: string; visits: string[]; totalSpent: number }> = {}

    apps.forEach((app) => {
      const name = app.customerName
      const email = app.customerId || "cliente@email.com"
      const phone = app.customerPhone || "(53) 99999-9999"

      if (!clientMap[name]) {
        clientMap[name] = {
          email,
          phone,
          visits: [],
          totalSpent: 0
        }
      }

      clientMap[name].visits.push(app.date)
      if (app.status === "completed" || app.status === "confirmed") {
        clientMap[name].totalSpent += app.price
      }
    })

    const summaryList: ClientSummary[] = Object.entries(clientMap).map(([name, data]) => {
      // Sort visits to find the most recent
      const sortedVisits = [...data.visits].sort((a, b) => b.localeCompare(a))
      return {
        name,
        email: data.email,
        phone: data.phone,
        lastVisit: sortedVisits[0] || "N/A",
        cutsCount: data.visits.length,
        totalSpent: data.totalSpent
      }
    })

    setClients(summaryList)
  }, [router])

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  )

  const formatarParaBr = (dateStr: string) => {
    if (dateStr === "N/A") return "Nunca"
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy")
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Meus Clientes" subtitle="Lista de clientes atendidos por você" type="barber" />

      <main className="p-6 space-y-6 max-w-5xl w-full mx-auto pb-24 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/dashboard/barber" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar ao painel</span>
          </Link>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar por nome, email ou tel..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border-border pl-9 text-xs h-9 w-full"
            />
          </div>
        </div>

        <Card className="bg-card border-border overflow-hidden">
          <div className="divide-y divide-border">
            {filteredClients.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <Users className="h-8 w-8 text-muted-foreground/30" />
                <p>Nenhum cliente encontrado.</p>
              </div>
            ) : (
              filteredClients.map((client, idx) => (
                <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-all text-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm font-mono shrink-0">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-left space-y-1">
                      <p className="font-bold text-sm text-foreground">{client.name}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {client.phone}</span>
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {client.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 text-left sm:text-right shrink-0 ml-12 sm:ml-0 font-mono">
                    <div>
                      <p className="text-muted-foreground text-[9px] uppercase tracking-wider">Última Visita</p>
                      <p className="font-semibold text-foreground mt-0.5">{formatarParaBr(client.lastVisit)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[9px] uppercase tracking-wider">Total Cortes</p>
                      <p className="font-bold text-primary mt-0.5">{client.cutsCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[9px] uppercase tracking-wider">Gasto Total</p>
                      <p className="font-bold text-emerald-400 mt-0.5">R$ {client.totalSpent.toFixed(2)}</p>
                    </div>
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
