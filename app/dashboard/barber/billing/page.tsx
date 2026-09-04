"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DollarSign, ChevronLeft, TrendingUp, Calendar, ArrowUpRight, Award, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/header"
import { getStoredAppointments, Appointment } from "@/lib/data"
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function BarberBillingPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [barberName, setBarberName] = useState("Rafael Costa")
  const [commissionRate, setCommissionRate] = useState(0.3) // 30% commission

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

    const name = parsed.role === "barber" ? parsed.name || "Rafael Costa" : "Rafael Costa"
    setBarberName(name)

    const all = getStoredAppointments()
    const history = all.filter(a => a.barberName === name && (a.status === "completed" || a.status === "confirmed"))
    setAppointments(history)
  }, [router])

  // Periods filter
  const todayStr = format(new Date(), "yyyy-MM-dd")
  const todayDate = new Date()
  const startOfWeekDate = startOfWeek(todayDate, { weekStartsOn: 1 })
  const endOfWeekDate = endOfWeek(todayDate, { weekStartsOn: 1 })
  const startOfMonthDate = startOfMonth(todayDate)
  const endOfMonthDate = endOfMonth(todayDate)

  const todayApps = appointments.filter(a => a.date === todayStr)
  
  const weeklyApps = appointments.filter(a => {
    try {
      const appDate = parseISO(a.date)
      return isWithinInterval(appDate, { start: startOfWeekDate, end: endOfWeekDate })
    } catch {
      return false
    }
  })

  const monthlyApps = appointments.filter(a => {
    try {
      const appDate = parseISO(a.date)
      return isWithinInterval(appDate, { start: startOfMonthDate, end: endOfMonthDate })
    } catch {
      return false
    }
  })

  const calculateGross = (list: Appointment[]) => list.reduce((acc, curr) => acc + curr.price, 0)
  const calculateCommission = (list: Appointment[]) => list.reduce((acc, curr) => acc + (curr.price * commissionRate), 0)

  const grossToday = calculateGross(todayApps)
  const commToday = calculateCommission(todayApps)

  const grossWeek = calculateGross(weeklyApps)
  const commWeek = calculateCommission(weeklyApps)

  const grossMonth = calculateGross(monthlyApps)
  const commMonth = calculateCommission(monthlyApps)

  const formatarParaBr = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy")
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Meu Faturamento" subtitle="Gestão financeira das suas comissões" type="barber" />

      <main className="p-6 space-y-6 max-w-4xl w-full mx-auto pb-24 text-left">
        <div>
          <Link href="/dashboard/barber" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar ao painel</span>
          </Link>
        </div>

        {/* Dynamic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 bg-card border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Ganhos Hoje</p>
            <p className="font-heading text-2xl font-bold mt-1 text-foreground">R$ {commToday.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">Bruto: R$ {grossToday.toFixed(2)}</p>
          </Card>

          <Card className="p-5 bg-card border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Ganhos da Semana</p>
            <p className="font-heading text-2xl font-bold mt-1 text-foreground">R$ {commWeek.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">Bruto: R$ {grossWeek.toFixed(2)}</p>
          </Card>

          <Card className="p-5 bg-card border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Ganhos do Mês</p>
            <p className="font-heading text-2xl font-bold mt-1 text-foreground">R$ {commMonth.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">Bruto: R$ {grossMonth.toFixed(2)}</p>
          </Card>
        </div>

        {/* Detailed Commission Report */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/10 flex justify-between items-center">
            <span className="font-heading text-xs font-bold uppercase tracking-wider text-primary">Extrato Detalhado de Comissões ({commissionRate * 100}%)</span>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-0 font-bold text-[9px]">Comissões Ativas</Badge>
          </div>

          <div className="divide-y divide-border">
            {appointments.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                Nenhuma comissão registrada.
              </div>
            ) : (
              appointments.map((app) => (
                <div key={app.id} className="p-4 flex justify-between items-center text-xs hover:bg-muted/5 transition-all">
                  <div className="text-left space-y-1">
                    <p className="font-bold text-foreground">{app.customerName}</p>
                    <p className="text-muted-foreground text-[11px]">{app.service} • {formatarParaBr(app.date)} às {app.time}</p>
                  </div>
                  
                  <div className="text-right space-y-1 font-mono">
                    <p className="font-bold text-emerald-400">+ R$ {(app.price * commissionRate).toFixed(2)}</p>
                    <p className="text-muted-foreground text-[10px]">Valor total: R$ {app.price.toFixed(2)}</p>
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
