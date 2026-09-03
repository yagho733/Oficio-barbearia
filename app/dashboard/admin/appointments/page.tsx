"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Calendar, Clock, ChevronLeft, Search, Filter, 
  Trash2, Edit, CheckCircle, XCircle, RefreshCcw, DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard/header"
import { getStoredAppointments, barbers, Appointment } from "@/lib/data"
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"

export default function AdminAppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [barberFilter, setBarberFilter] = useState("all")
  const [timePeriodFilter, setTimePeriodFilter] = useState("all") // all, today, week, month
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("american_barber_session") || sessionStorage.getItem("american_barber_session")
    if (!session) {
      router.push("/login")
      return
    }
    const parsed = JSON.parse(session)
    if (parsed.role !== "admin") {
      router.push(`/dashboard/${parsed.role}`)
      return
    }
    loadData()
  }, [router])

  const loadData = () => {
    setAppointments(getStoredAppointments())
  }

  const updateStatus = (id: string, newStatus: "confirmed" | "completed" | "cancelled" | "pending") => {
    const all = getStoredAppointments()
    const updated = all.map(app => {
      if (app.id === id) {
        return { ...app, status: newStatus as any }
      }
      return app
    })
    localStorage.setItem("american_barber_appointments", JSON.stringify(updated))
    loadData()
    showToast(`Status do agendamento alterado para '${newStatus === 'completed' ? 'Concluído' : newStatus === 'cancelled' ? 'Cancelado' : 'Confirmado'}'.`)
  }

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir permanentemente este agendamento?")) return
    const all = getStoredAppointments()
    const filtered = all.filter(app => app.id !== id)
    localStorage.setItem("american_barber_appointments", JSON.stringify(filtered))
    loadData()
    showToast("Agendamento excluído com sucesso.")
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Filter calculations
  const todayStr = format(new Date(), "yyyy-MM-dd")
  const todayDate = new Date()
  const startOfWeekDate = startOfWeek(todayDate, { weekStartsOn: 1 })
  const endOfWeekDate = endOfWeek(todayDate, { weekStartsOn: 1 })
  const startOfMonthDate = startOfMonth(todayDate)
  const endOfMonthDate = endOfMonth(todayDate)

  const filteredAppointments = appointments.filter(app => {
    // Search filter
    const matchesSearch = 
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.barberName.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Status filter
    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    // Barber filter
    const matchesBarber = barberFilter === "all" || app.barberName === barberFilter

    // Time filter
    let matchesTime = true
    if (timePeriodFilter === "today") {
      matchesTime = app.date === todayStr
    } else if (timePeriodFilter === "week") {
      try {
        matchesTime = isWithinInterval(parseISO(app.date), { start: startOfWeekDate, end: endOfWeekDate })
      } catch {
        matchesTime = false
      }
    } else if (timePeriodFilter === "month") {
      try {
        matchesTime = isWithinInterval(parseISO(app.date), { start: startOfMonthDate, end: endOfMonthDate })
      } catch {
        matchesTime = false
      }
    }

    return matchesSearch && matchesStatus && matchesBarber && matchesTime
  })

  const formatarParaBr = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy")
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Controle de Agendamentos" subtitle="Base geral de reservas da barbearia" type="admin" />

      <main className="p-6 space-y-6 max-w-6xl w-full mx-auto pb-24 text-left">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <ChevronLeft className="h-4 w-4" />
          <Link href="/dashboard/admin">Voltar ao painel</Link>
        </div>

        {toastMessage && (
          <div className="bg-green-500/10 border border-green-500/25 text-green-400 p-3 rounded-lg text-xs font-semibold animate-fade-in">
            {toastMessage}
          </div>
        )}

        {/* Filters Panel */}
        <Card className="p-5 bg-card border-border grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Pesquisa</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cliente, barbeiro, corte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background border-border pl-8 text-xs h-9"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Período</label>
            <Select value={timePeriodFilter} onValueChange={setTimePeriodFilter}>
              <SelectTrigger className="w-full text-xs h-9 bg-background border-border">
                <SelectValue placeholder="Todos os períodos" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="text-xs">Todos os períodos</SelectItem>
                <SelectItem value="today" className="text-xs">Hoje</SelectItem>
                <SelectItem value="week" className="text-xs">Esta Semana</SelectItem>
                <SelectItem value="month" className="text-xs">Este Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Barbeiro</label>
            <Select value={barberFilter} onValueChange={setBarberFilter}>
              <SelectTrigger className="w-full text-xs h-9 bg-background border-border">
                <SelectValue placeholder="Todos os barbeiros" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="text-xs">Todos os barbeiros</SelectItem>
                {barbers.map(b => (
                  <SelectItem key={b.id} value={b.name} className="text-xs">{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full text-xs h-9 bg-background border-border">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="text-xs">Todos os status</SelectItem>
                <SelectItem value="confirmed" className="text-xs">Confirmado / Agendado</SelectItem>
                <SelectItem value="completed" className="text-xs">Concluído</SelectItem>
                <SelectItem value="cancelled" className="text-xs">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Database Table */}
        <Card className="bg-card border-border overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                <th className="p-4">Cliente</th>
                <th className="p-4">Barbeiro</th>
                <th className="p-4">Serviço</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Nenhum agendamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold text-foreground">{app.customerName}</td>
                    <td className="p-4 text-gold font-semibold">{app.barberName}</td>
                    <td className="p-4">{app.service}</td>
                    <td className="p-4 font-mono font-bold text-primary">R$ {app.price.toFixed(2)}</td>
                    <td className="p-4 font-mono text-[11px]">
                      {formatarParaBr(app.date)} às {app.time}
                    </td>
                    <td className="p-4">
                      <Badge className={`border-0 text-[9px] font-bold px-2 py-0.5 ${
                        app.status === "completed" 
                          ? "bg-green-500/10 text-green-500" 
                          : app.status === "cancelled"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-gold/10 text-gold"
                      }`}>
                        {app.status === "completed" ? "Concluído" : app.status === "cancelled" ? "Cancelado" : "Confirmado"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        {app.status === "confirmed" && (
                          <>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => updateStatus(app.id, "completed")}
                              className="h-8 w-8 text-green-500 hover:bg-green-500/10"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => updateStatus(app.id, "cancelled")}
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleDelete(app.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  )
}
