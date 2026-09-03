"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft, Users, Repeat, Scissors, Trophy, BarChart2,
  Download, FileSpreadsheet, FileText, TrendingUp, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { getStoredAppointments, Appointment } from "@/lib/data"

const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const session = localStorage.getItem("american_barber_session") || sessionStorage.getItem("american_barber_session")
    if (!session) { router.push("/login"); return }
    const p = JSON.parse(session)
    if (p.role !== "admin") { router.push(`/dashboard/${p.role}`); return }
    setAppointments(getStoredAppointments())
  }, [router])

  const completed = useMemo(() => appointments.filter(a => a.status === "completed" || a.status === "confirmed"), [appointments])

  // New clients (appear only once)
  const clientCounts = useMemo(() => {
    const map: Record<string, number> = {}
    appointments.forEach(a => { map[a.customerName] = (map[a.customerName] || 0) + 1 })
    return map
  }, [appointments])

  const newClients = Object.values(clientCounts).filter(v => v === 1).length
  const returningClients = Object.values(clientCounts).filter(v => v > 1).length

  // Top service
  const serviceCounts = useMemo(() => {
    const map: Record<string, number> = {}
    completed.forEach(a => { map[a.service] = (map[a.service] || 0) + 1 })
    return map
  }, [completed])

  const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]

  // Top barber by revenue
  const barberRevenue = useMemo(() => {
    const map: Record<string, number> = {}
    completed.forEach(a => { map[a.barber] = (map[a.barber] || 0) + a.price })
    return map
  }, [completed])

  const topBarber = Object.entries(barberRevenue).sort((a, b) => b[1] - a[1])[0]

  // Busiest days
  const dayCounts = useMemo(() => {
    const counts = Array(7).fill(0)
    completed.forEach(a => {
      try { const d = new Date(a.date); counts[d.getDay()]++ } catch {}
    })
    return counts
  }, [completed])

  const maxDay = Math.max(...dayCounts, 1)
  const busiestDay = DAYS_PT[dayCounts.indexOf(Math.max(...dayCounts))]

  // Services breakdown for chart
  const serviceList = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const maxService = Math.max(...serviceList.map(s => s[1]), 1)

  // Barbers breakdown
  const barberList = Object.entries(barberRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const maxRevenue = Math.max(...barberList.map(b => b[1]), 1)

  const handleExport = (format: "excel" | "pdf") => {
    alert(`Exportação em ${format.toUpperCase()} será implementada com integração ao backend. Os dados já estão estruturados e prontos para geração.`)
  }

  const Stat = ({ label, value, sub, icon: Icon, accent }: { label: string; value: string | number; sub?: string; icon: any; accent: string }) => (
    <Card className="bg-card border-border p-5 flex flex-col gap-2">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xl font-bold font-mono text-foreground">{value}</p>
      <p className="text-[11px] font-bold text-muted-foreground uppercase font-mono">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </Card>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Relatórios" subtitle="Análise de desempenho e crescimento" type="admin" />

      <main className="p-6 space-y-6 max-w-6xl w-full mx-auto pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/dashboard/admin" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao painel
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("excel")} className="border-border text-xs gap-1.5 h-9">
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" /> Exportar Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")} className="border-border text-xs gap-1.5 h-9">
              <FileText className="h-3.5 w-3.5 text-rose-400" /> Exportar PDF
            </Button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Novos Clientes" value={newClients} sub="1ª visita no período" icon={Users} accent="bg-blue-500/15 text-blue-400" />
          <Stat label="Clientes Recorrentes" value={returningClients} sub="2+ visitas" icon={Repeat} accent="bg-violet-500/15 text-violet-400" />
          <Stat label="Serviço Mais Vendido" value={topService ? topService[1] : 0} sub={topService ? topService[0] : "—"} icon={Scissors} accent="bg-primary/15 text-primary" />
          <Stat label="Dia Mais Movimentado" value={busiestDay} sub={`${Math.max(...dayCounts)} atendimentos`} icon={TrendingUp} accent="bg-amber-500/15 text-amber-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Serviços por demanda */}
          <Card className="bg-card border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4 text-primary" />
              <p className="text-xs font-mono font-bold uppercase text-muted-foreground">Serviços Mais Procurados</p>
            </div>
            <div className="space-y-3">
              {serviceList.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Nenhum dado disponível.</p>
              ) : serviceList.map(([name, count]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-medium">{name}</span>
                    <span className="font-mono text-muted-foreground">{count}x</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${(count / maxService) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Barbeiros por faturamento */}
          <Card className="bg-card border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <p className="text-xs font-mono font-bold uppercase text-muted-foreground">Top Barbeiros por Receita</p>
            </div>
            <div className="space-y-3">
              {barberList.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Nenhum dado disponível.</p>
              ) : barberList.map(([name, rev], i) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs items-center">
                    <span className="flex items-center gap-2">
                      {i === 0 && <span className="text-amber-400 text-sm">🥇</span>}
                      {i === 1 && <span className="text-slate-400 text-sm">🥈</span>}
                      {i === 2 && <span className="text-amber-700 text-sm">🥉</span>}
                      {i > 2 && <span className="w-5 text-center font-mono text-muted-foreground text-[10px]">#{i + 1}</span>}
                      <span className="text-foreground font-medium">{name}</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">R$ {rev.toFixed(2)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${(rev / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Dias da semana */}
        <Card className="bg-card border-border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            <p className="text-xs font-mono font-bold uppercase text-muted-foreground">Atendimentos por Dia da Semana</p>
          </div>
          <div className="flex items-end justify-between gap-2 h-32 px-2">
            {dayCounts.map((count, i) => {
              const pct = (count / maxDay) * 100
              const isBusiest = i === dayCounts.indexOf(Math.max(...dayCounts))
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] font-mono text-muted-foreground">{count > 0 ? count : ""}</span>
                  <div className="w-full rounded-t-sm transition-all duration-700 min-h-[4px]"
                    style={{
                      height: `${Math.max(pct, 4)}%`,
                      background: isBusiest ? "hsl(var(--primary))" : "hsl(var(--muted))"
                    }}
                  />
                  <span className={`text-[10px] font-mono font-bold ${isBusiest ? "text-primary" : "text-muted-foreground"}`}>
                    {DAYS_PT[i]}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Rating summary */}
        <Card className="bg-card border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 text-amber-400" />
            <p className="text-xs font-mono font-bold uppercase text-muted-foreground">Satisfação dos Clientes</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold font-mono text-amber-400">4.8</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-1">Média Geral</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map(star => {
                const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground w-6">{star}★</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground w-8">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
