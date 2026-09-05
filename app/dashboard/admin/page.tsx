"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  DollarSign, Users, TrendingUp, UserCheck, Calendar, Award,
  ChevronRight, ArrowUpRight, BarChart3, Clock, CheckCircle, XCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/header"
import { getStoredAppointments, barbers, Appointment } from "@/lib/data"
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([])

  useEffect(() => {
    const session = localStorage.getItem("barbershop_demo_session") || sessionStorage.getItem("barbershop_demo_session")
    if (!session) {
      router.push("/login")
      return
    }
    const parsed = JSON.parse(session)
    if (parsed.role !== "admin") {
      router.push(`/dashboard/${parsed.role}`)
      return
    }
    setAppointmentsList(getStoredAppointments())
  }, [router])

  const formatarParaBr = (dateStr: string) => {
    try { return format(parseISO(dateStr), "dd/MM/yyyy") } catch { return dateStr }
  }

  const formatarPorExtenso = (dateStr: string) => {
    try { return format(parseISO(dateStr), "dd 'de' MMMM", { locale: ptBR }) } catch { return dateStr }
  }

  const todayStr = format(new Date(), "yyyy-MM-dd")
  const todayDate = new Date()
  const startOfWeekDate = startOfWeek(todayDate, { weekStartsOn: 1 })
  const endOfWeekDate = endOfWeek(todayDate, { weekStartsOn: 1 })
  const startOfMonthDate = startOfMonth(todayDate)
  const endOfMonthDate = endOfMonth(todayDate)

  // Calculations
  const totalAppointments = appointmentsList.length
  
  const todayApps = appointmentsList.filter(a => a.date === todayStr)
  const faturamentoHoje = todayApps
    .filter(a => a.status === "confirmed" || a.status === "completed")
    .reduce((acc, curr) => acc + curr.price, 0)

  const weeklyApps = appointmentsList.filter(a => {
    try {
      return isWithinInterval(parseISO(a.date), { start: startOfWeekDate, end: endOfWeekDate })
    } catch {
      return false
    }
  })
  const faturamentoSemana = weeklyApps
    .filter(a => a.status === "confirmed" || a.status === "completed")
    .reduce((acc, curr) => acc + curr.price, 0)

  const monthlyApps = appointmentsList.filter(a => {
    try {
      return isWithinInterval(parseISO(a.date), { start: startOfMonthDate, end: endOfMonthDate })
    } catch {
      return false
    }
  })
  const faturamentoMes = monthlyApps
    .filter(a => a.status === "confirmed" || a.status === "completed")
    .reduce((acc, curr) => acc + curr.price, 0)

  const uniqueCustomers = Array.from(new Set(appointmentsList.map(a => a.customerName))).length
  const totalBarbers = barbers.length

  // Revenue chart data (mock for visual polish, matching real months trend)
  const chartData = [
    { month: "Jan", val: 12400 },
    { month: "Fev", val: 14600 },
    { month: "Mar", val: 15300 },
    { month: "Abr", val: 17800 },
    { month: "Mai", val: 16900 },
    { month: "Jun", val: faturamentoMes > 0 ? faturamentoMes : 18500 }
  ]

  // SVG Chart scale calculations
  const maxVal = Math.max(...chartData.map(d => d.val)) * 1.15
  const chartPoints = chartData.map((d, i) => {
    const x = 50 + i * 100
    const y = 200 - (d.val / maxVal) * 160
    return `${x},${y}`
  }).join(" ")

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <DashboardHeader title="Painel de Controle" subtitle="Performance Estratégica da Barbearia" type="admin" />

      <main className="p-6 space-y-6 max-w-6xl mx-auto w-full text-left">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="p-5 bg-card border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Faturamento Hoje</p>
                <p className="font-heading text-lg font-bold text-foreground mt-1.5">R$ {faturamentoHoje.toFixed(2)}</p>
              </div>
              <DollarSign className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            </div>
          </Card>

          <Card className="p-5 bg-card border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Faturamento Semana</p>
                <p className="font-heading text-lg font-bold text-foreground mt-1.5">R$ {faturamentoSemana.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-4.5 w-4.5 text-primary shrink-0" />
            </div>
          </Card>

          <Card className="p-5 bg-card border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Faturamento Mês</p>
                <p className="font-heading text-lg font-bold text-foreground mt-1.5">R$ {faturamentoMes.toFixed(2)}</p>
              </div>
              <DollarSign className="h-4.5 w-4.5 text-purple-400 shrink-0" />
            </div>
          </Card>

          <Card className="p-5 bg-card border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Clientes Ativos</p>
                <p className="font-heading text-lg font-bold text-foreground mt-1.5">{uniqueCustomers}</p>
              </div>
              <Users className="h-4.5 w-4.5 text-gold shrink-0" />
            </div>
          </Card>

          <Card className="p-5 bg-card border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Agendamentos</p>
                <p className="font-heading text-lg font-bold text-foreground mt-1.5">{totalAppointments}</p>
              </div>
              <Calendar className="h-4.5 w-4.5 text-sky-400 shrink-0" />
            </div>
          </Card>

          <Card className="p-5 bg-card border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Barbeiros</p>
                <p className="font-heading text-lg font-bold text-foreground mt-1.5">{totalBarbers}</p>
              </div>
              <Award className="h-4.5 w-4.5 text-pink-400 shrink-0" />
            </div>
          </Card>
        </div>

        {/* Graphics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Chart */}
          <Card className="p-6 bg-card border-border lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">Faturamento da Barbearia</h3>
              <Badge className="bg-primary/10 text-primary border-0 text-xs">Gráfico Mensal</Badge>
            </div>
            
            {/* SVG line chart */}
            <div className="w-full h-[220px] relative">
              <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                {/* Horizontal gridlines */}
                <line x1="50" y1="40" x2="550" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="50" y1="90" x2="550" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="50" y1="140" x2="550" y2="140" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="50" y1="200" x2="550" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                
                {/* Chart Line */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  points={chartPoints}
                />
                
                {/* Dots on nodes */}
                {chartData.map((d, i) => {
                  const x = 50 + i * 100
                  const y = 200 - (d.val / maxVal) * 160
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="3" />
                      <text x={x} y={y - 12} fontSize="9" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontFamily="monospace">
                        R$ {d.val}
                      </text>
                      <text x={x} y="215" fontSize="10" fill="rgba(255,255,255,0.4)" textAnchor="middle">
                        {d.month}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </Card>

          {/* Agenda do Dia */}
          <Card className="bg-card border-border overflow-hidden lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="p-4 border-b border-border bg-muted/10 flex justify-between items-center">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-gold">Agenda do Dia</span>
                <Badge className="bg-gold/10 text-gold border-0 text-xs">{todayApps.length} cortes</Badge>
              </div>

              <div className="divide-y divide-border max-h-[220px] overflow-y-auto pr-1">
                {todayApps.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-10">Nenhum atendimento marcado para hoje.</p>
                ) : (
                  todayApps.map(app => (
                    <div key={app.id} className="p-3 flex justify-between items-center text-xs hover:bg-muted/5 transition-all">
                      <div className="text-left">
                        <p className="font-bold text-foreground truncate max-w-[120px]">{app.customerName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{app.service} com {app.barberName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary font-mono">{app.time}</p>
                        <p className="text-xs text-muted-foreground font-mono">{app.duration}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <Link href="/dashboard/admin/appointments" className="block p-3 text-center border-t border-border/40 text-xs font-bold text-primary hover:underline">
              Visualizar Agenda Completa
            </Link>
          </Card>

        </div>

        {/* Bottom Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Last bookings */}
          <Card className="bg-card border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/10 font-heading text-xs font-bold uppercase tracking-wider text-primary">
              Últimos Agendamentos Recebidos
            </div>

            <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
              {appointmentsList.slice(0, 5).map((app) => (
                <div key={app.id} className="p-4 flex justify-between items-center text-xs hover:bg-muted/5">
                  <div className="text-left">
                    <p className="font-bold text-foreground">{app.customerName}</p>
                    <p className="text-muted-foreground text-xs">{app.service} com {app.barberName}</p>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <p className="font-bold text-emerald-400">R$ {app.price.toFixed(2)}</p>
                    <p className="text-muted-foreground text-xs">{formatarParaBr(app.date)} às {app.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Clients */}
          <Card className="bg-card border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/10 font-heading text-xs font-bold uppercase tracking-wider text-primary">
              Clientes Atendidos Recentemente
            </div>

            <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
              {Array.from(new Set(appointmentsList.map(a => a.customerName))).slice(0, 5).map((name, i) => {
                const clientApps = appointmentsList.filter(a => a.customerName === name)
                const lastApp = clientApps[0]
                return (
                  <div key={i} className="p-4 flex justify-between items-center text-xs hover:bg-muted/5">
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary font-mono text-xs">
                        {name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-foreground">{name}</p>
                        <p className="text-muted-foreground text-xs">Cortes realizados: <span className="font-bold text-foreground font-mono">{clientApps.length}</span></p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge className="bg-green-500/10 text-green-500 border-0 text-xs font-bold">Ativo</Badge>
                      <p className="text-xs text-muted-foreground font-mono mt-1">Último: {lastApp ? formatarParaBr(lastApp.date) : ""}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

        </div>
      </main>
    </div>
  )
}
