"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Calendar, Clock, DollarSign, Users, TrendingUp, Star, CheckCircle, XCircle,
  Power, Coffee, Plus, Trash2, AlertTriangle, ChevronRight, User as UserIcon, Scissors
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  getStoredAppointments, 
  getStoredBlocks, 
  addBarberBlock, 
  removeBarberBlock, 
  replaceStoredAppointments,
  TimeBlock,
  timeSlots,
  Appointment
} from "@/lib/data"
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"

export default function BarberDashboardPage() {
  const router = useRouter()
  
  // Barber state details
  const [barberName, setBarberName] = useState("Profissional demonstrativo")
  const [commissionRate, setCommissionRate] = useState(0.3) // 30% commission
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([])
  
  // Controls
  const [blocks, setBlocks] = useState<TimeBlock[]>([])
  const [isOffline, setIsOffline] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [selectedDuration, setSelectedDuration] = useState<string>("30 min")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const getTodayStr = () => {
    return format(new Date(), "yyyy-MM-dd")
  }

  const todayStr = getTodayStr()

  useEffect(() => {
    // Validate session
    const session = localStorage.getItem("barbershop_demo_session") || sessionStorage.getItem("barbershop_demo_session")
    if (!session) {
      router.push("/login")
      return
    }

    try {
      const parsed = JSON.parse(session)
      if (parsed.role !== "barber" && parsed.role !== "admin") {
        router.push(`/dashboard/${parsed.role}`)
        return
      }
      
      // Use the selected demonstration profile name.
      if (parsed.role === "barber") {
        setBarberName(parsed.name || "Profissional demonstrativo")
      }
    } catch (e) {
      router.push("/login")
      return
    }

    loadData()

    if (timeSlots.length > 0) {
      setSelectedTimeSlot(timeSlots[0])
    }
  }, [router, todayStr])

  const loadData = () => {
    const apps = getStoredAppointments()
    // Filter to only this barber's appointments
    const filteredApps = apps.filter(a => a.barberName === barberName)
    setAppointmentsList(filteredApps)

    setBlocks(getStoredBlocks().filter(b => b.barberId === "1" && b.date === todayStr))
    setIsOffline(localStorage.getItem("barber_1_offline") === "true")
  }

  const handleToggleOffline = () => {
    const nextVal = !isOffline
    setIsOffline(nextVal)
    localStorage.setItem("barber_1_offline", String(nextVal))
    showToast(nextVal ? "Você está offline para agendamentos hoje." : "Você está online para agendamentos.")
  }

  const handleAddBreak = () => {
    if (!selectedTimeSlot) return
    
    const exists = blocks.some(b => b.time === selectedTimeSlot)
    if (exists) {
      alert("Este horário já está bloqueado!")
      return
    }

    const newBlock = addBarberBlock({
      barberId: "1",
      date: todayStr,
      time: selectedTimeSlot,
      duration: selectedDuration,
      type: "break"
    })

    setBlocks([...blocks, newBlock])
    showToast(`Horário das ${selectedTimeSlot} bloqueado.`)
  }

  const handleRemoveBlock = (id: string) => {
    removeBarberBlock(id)
    setBlocks(blocks.filter(b => b.id !== id))
    showToast("Bloqueio removido.")
  }

  const updateAppointmentStatus = (id: string, nextStatus: "confirmed" | "completed" | "cancelled") => {
    const allApps = getStoredAppointments()
    const updated = allApps.map(a => {
      if (a.id === id) {
        return { ...a, status: nextStatus }
      }
      return a
    })
    replaceStoredAppointments(updated)
    loadData()
    showToast(`Agendamento atualizado para '${nextStatus === 'completed' ? 'Concluído' : nextStatus === 'cancelled' ? 'Cancelado' : 'Confirmado'}'.`)
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Financial and stats calculations
  const todayDate = new Date()
  const startOfWeekDate = startOfWeek(todayDate, { weekStartsOn: 1 }) // Monday
  const endOfWeekDate = endOfWeek(todayDate, { weekStartsOn: 1 })
  const startOfMonthDate = startOfMonth(todayDate)
  const endOfMonthDate = endOfMonth(todayDate)

  // Filter lists based on period
  const todayApps = appointmentsList.filter(a => a.date === todayStr)
  
  const weeklyApps = appointmentsList.filter(a => {
    try {
      const appDate = parseISO(a.date)
      return isWithinInterval(appDate, { start: startOfWeekDate, end: endOfWeekDate })
    } catch {
      return false
    }
  })

  const monthlyApps = appointmentsList.filter(a => {
    try {
      const appDate = parseISO(a.date)
      return isWithinInterval(appDate, { start: startOfMonthDate, end: endOfMonthDate })
    } catch {
      return false
    }
  })

  // Calculate revenue based on standard price and commission rate
  const calculateCommissions = (list: Appointment[]) => {
    return list
      .filter(a => a.status === "confirmed" || a.status === "completed")
      .reduce((acc, curr) => acc + (curr.price * commissionRate), 0)
  }

  const faturamentoHoje = calculateCommissions(todayApps)
  const faturamentoSemana = calculateCommissions(weeklyApps)
  const faturamentoMes = calculateCommissions(monthlyApps)

  const totalAtendimentos = appointmentsList.filter(a => a.status === "completed").length
  const proximoCliente = appointmentsList
    .filter(a => a.date === todayStr && a.status === "confirmed")
    .sort((a, b) => a.time.localeCompare(b.time))[0] || null

  const clientesAtendidosList = appointmentsList
    .filter(a => a.status === "completed")
    .reduce((acc: { customerName: string; service: string; date: string; price: number }[], curr) => {
      // Avoid duplicate names to show a clean list of unique serviced clients
      if (!acc.some(item => item.customerName === curr.customerName)) {
        acc.push({
          customerName: curr.customerName,
          service: curr.service,
          date: curr.date,
          price: curr.price
        })
      }
      return acc
    }, [])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Painel Operacional" subtitle={`Bem-vindo, ${barberName}`} type="barber" />
      
      <main className="p-6 space-y-6 max-w-6xl mx-auto w-full pb-20 text-left">
        {toastMessage && (
          <div className="bg-green-500/10 border border-green-500/25 text-green-400 p-3 rounded-lg text-xs font-semibold animate-fade-in">
            {toastMessage}
          </div>
        )}

        {isOffline && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="font-semibold text-destructive text-sm">Modo Offline Ativo</p>
              <p className="text-xs text-muted-foreground">Você está atualmente marcado como indisponível. Clientes não conseguirão agendar novos horários com você hoje.</p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Cortes Hoje</p>
                <p className="font-heading text-3xl text-foreground font-bold mt-1">{todayApps.length}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">agendados para hoje</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Comissão Semana</p>
                <p className="font-heading text-3xl text-foreground font-bold mt-1">R$ {faturamentoSemana.toFixed(2)}</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium mt-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Comissão de {commissionRate * 100}% ativa
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 border border-gold/20 shrink-0">
                <DollarSign className="h-6 w-6 text-gold" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Total Concluídos</p>
                <p className="font-heading text-3xl text-foreground font-bold mt-1">{totalAtendimentos}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">atendimentos realizados</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 shrink-0">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Meta Mensal</p>
                <p className="font-heading text-3xl text-foreground font-bold mt-1">R$ {faturamentoMes.toFixed(2)}</p>
                <div className="flex items-center gap-0.5 mt-1.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`h-3 w-3 text-gold fill-gold`} />
                  ))}
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 shrink-0">
                <Star className="h-6 w-6 text-gold" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule - Left Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Next client card */}
            {proximoCliente && (
              <Card className="p-5 bg-card border-border border-l-4 border-l-primary flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                <div className="relative space-y-2">
                  <span className="text-xs font-bold text-primary font-mono uppercase tracking-wider">Próximo Cliente</span>
                  <h3 className="font-heading text-lg font-bold text-foreground">{proximoCliente.customerName}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {proximoCliente.time}</span>
                    <span className="flex items-center gap-1"><Scissors className="h-3.5 w-3.5" /> {proximoCliente.service}</span>
                  </div>
                </div>
                <div className="relative flex gap-2 shrink-0">
                  <Button 
                    onClick={() => updateAppointmentStatus(proximoCliente.id, "completed")} 
                    size="sm" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-bold text-xs h-9"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Concluir
                  </Button>
                  <Button 
                    onClick={() => updateAppointmentStatus(proximoCliente.id, "cancelled")} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs font-bold text-destructive hover:bg-destructive/10 border-border h-9"
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Cancelar
                  </Button>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">Agenda de Hoje</h2>
                <Badge className="bg-primary/20 text-primary border-0 font-mono text-xs">
                  {todayApps.length} agendamentos
                </Badge>
              </div>

              <Card className="bg-card border-border overflow-hidden">
                <div className="divide-y divide-border">
                  {todayApps.length === 0 ? (
                    <div className="p-12 text-center text-xs text-muted-foreground">
                      Não há cortes agendados para hoje.
                    </div>
                  ) : (
                    todayApps.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[70px] font-mono">
                            <p className="font-heading text-sm font-bold text-foreground">{app.time}</p>
                            <p className="text-xs text-muted-foreground">{app.duration}</p>
                          </div>
                          <div className="h-10 w-px bg-border" />
                          <div className="text-left">
                            <p className="font-bold text-sm text-foreground">{app.customerName}</p>
                            <p className="text-xs text-muted-foreground">{app.service}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-heading text-sm font-bold text-primary">R$ {app.price.toFixed(2)}</p>
                            <Badge className={`border-0 text-xs font-bold mt-1 px-1.5 py-0.2 ${
                              app.status === "completed" 
                                ? "bg-green-500/10 text-green-500" 
                                : app.status === "cancelled"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-gold/10 text-gold"
                            }`}>
                              {app.status === "completed" ? "Concluído" : app.status === "cancelled" ? "Cancelado" : "Confirmado"}
                            </Badge>
                          </div>

                          {app.status === "confirmed" && (
                            <div className="flex gap-1 shrink-0">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => updateAppointmentStatus(app.id, "completed")}
                                className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10 border-0"
                              >
                                <CheckCircle className="h-4.5 w-4.5" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => updateAppointmentStatus(app.id, "cancelled")}
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 border-0"
                              >
                                <XCircle className="h-4.5 w-4.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Weekly calendar simulation bar */}
            <div className="space-y-4">
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">Visão Semanal de Faturamento (Comissão)</h2>
              <Card className="p-5 bg-card border-border">
                <div className="grid grid-cols-7 gap-3">
                  {[
                    { day: "Seg", date: "20", apps: todayStr.endsWith("20") ? todayApps.length : 3, val: todayStr.endsWith("20") ? faturamentoHoje : 45.00 },
                    { day: "Ter", date: "21", apps: todayStr.endsWith("21") ? todayApps.length : 4, val: todayStr.endsWith("21") ? faturamentoHoje : 60.00 },
                    { day: "Qua", date: "22", apps: todayStr.endsWith("22") ? todayApps.length : 2, val: todayStr.endsWith("22") ? faturamentoHoje : 30.00 },
                    { day: "Qui", date: "23", apps: todayStr.endsWith("23") ? todayApps.length : todayApps.length, val: faturamentoHoje },
                    { day: "Sex", date: "24", apps: 6, val: 95.00 },
                    { day: "Sáb", date: "25", apps: 8, val: 120.00 },
                    { day: "Dom", date: "26", apps: 0, val: 0.00 }
                  ].map((d) => {
                    const isToday = d.day === "Qui" // Simulation
                    return (
                      <div key={d.day} className="text-center space-y-2">
                        <p className={`text-xs font-semibold ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>{d.day}</p>
                        <div className={`p-2 rounded-lg text-center ${isToday ? "bg-primary/10 border border-primary/20" : "bg-muted/30 border border-transparent"} space-y-1`}>
                          <p className="font-heading text-base font-bold text-foreground">{d.apps}</p>
                          <p className="text-xs text-muted-foreground font-mono">R$ {d.val.toFixed(0)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>

          </div>

          {/* Sidebar controls - Right Area */}
          <div className="space-y-6">
            
            {/* Toggle Availability Center */}
            <Card className="p-6 bg-card border-border border-l-4 border-l-gold text-left">
              <h3 className="font-heading font-bold text-xs tracking-wider uppercase mb-4 flex items-center gap-2 text-gold">
                <Coffee className="h-4.5 w-4.5" /> CONTROLE DE EXPEDIENTE
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border">
                  <div className="flex items-center gap-2.5">
                    <Power className={`h-4.5 w-4.5 ${isOffline ? "text-destructive" : "text-green-500"}`} />
                    <div>
                      <p className="text-xs font-bold text-foreground">Ficar Offline</p>
                      <p className="text-xs text-muted-foreground">Bloqueia agendamentos</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleOffline}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 outline-none ${
                      isOffline ? "bg-destructive" : "bg-muted border border-border"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        isOffline ? "translate-x-4.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Intervalo Manual</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground font-bold">Início</label>
                      <Select value={selectedTimeSlot} onValueChange={(value) => setSelectedTimeSlot(value ?? "")}>
                        <SelectTrigger className="w-full text-xs h-9 bg-muted border-border">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {timeSlots.map(t => (
                            <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground font-bold">Duração</label>
                      <Select value={selectedDuration} onValueChange={(value) => setSelectedDuration(value ?? "30 min")}>
                        <SelectTrigger className="w-full text-xs h-9 bg-muted border-border">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="30 min" className="text-xs">30 min</SelectItem>
                          <SelectItem value="60 min" className="text-xs">1 hora</SelectItem>
                          <SelectItem value="90 min" className="text-xs">1h 30m</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddBreak}
                    disabled={isOffline}
                    className="w-full text-xs h-9 font-semibold gap-1 bg-gold hover:bg-gold/90 text-gold-foreground border-0"
                  >
                    <Plus className="h-3.5 w-3.5" /> Bloquear Horário
                  </Button>
                </div>

                {blocks.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Bloqueios Ativos Hoje</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {blocks.map(b => (
                        <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-muted border border-border text-xs">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-gold" />
                            <span className="font-semibold text-foreground">{b.time}</span>
                            <span className="text-muted-foreground text-xs">({b.duration})</span>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleRemoveBlock(b.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* List of Unique Serviced Clients */}
            <Card className="p-6 bg-card border-border space-y-4">
              <h3 className="font-heading font-bold text-xs tracking-wider uppercase">Clientes Recentes</h3>
              <div className="divide-y divide-border">
                {clientesAtendidosList.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">Nenhum cliente finalizado recentemente.</p>
                ) : (
                  clientesAtendidosList.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {c.customerName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1 text-xs">
                        <p className="font-bold text-foreground truncate">{c.customerName}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.service}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}
