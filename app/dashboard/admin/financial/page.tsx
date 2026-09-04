"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft, TrendingUp, TrendingDown, DollarSign,
  Wallet, ArrowUpRight, ArrowDownRight, Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { getStoredAppointments, Appointment } from "@/lib/data"
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO, isWithinInterval } from "date-fns"
import { ptBR } from "date-fns/locale"

type Period = "today" | "week" | "month" | "year" | "custom"

const PERIOD_LABELS: Record<Period, string> = {
  today: "Hoje",
  week: "Esta Semana",
  month: "Este Mês",
  year: "Este Ano",
  custom: "Personalizado",
}

const COMMISSION_RATE = 0.30
const FIXED_COSTS = { today: 50, week: 350, month: 1500, year: 18000, custom: 0 }

export default function AdminFinancialPage() {
  const router = useRouter()
  const [period, setPeriod] = useState<Period>("month")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const session = localStorage.getItem("barbershop_demo_session") || sessionStorage.getItem("barbershop_demo_session")
    if (!session) { router.push("/login"); return }
    const p = JSON.parse(session)
    if (p.role !== "admin") { router.push(`/dashboard/${p.role}`); return }
    setAppointments(getStoredAppointments())
  }, [router])

  const { from, to } = useMemo(() => {
    const now = new Date()
    if (period === "today") return { from: now, to: now }
    if (period === "week") return { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) }
    if (period === "month") return { from: startOfMonth(now), to: endOfMonth(now) }
    if (period === "year") return { from: startOfYear(now), to: endOfYear(now) }
    if (period === "custom" && customFrom && customTo) {
      return { from: parseISO(customFrom), to: parseISO(customTo) }
    }
    return { from: startOfMonth(now), to: endOfMonth(now) }
  }, [period, customFrom, customTo])

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      if (a.status !== "completed" && a.status !== "confirmed") return false
      try {
        const d = parseISO(a.date)
        return isWithinInterval(d, { start: from, end: to })
      } catch { return false }
    })
  }, [appointments, from, to])

  const revenue = filtered.reduce((s, a) => s + a.price, 0)
  const expenses = FIXED_COSTS[period] + revenue * COMMISSION_RATE
  const profit = revenue - expenses

  // Build daily chart data for current period (last 7 buckets)
  const chartData = useMemo(() => {
    const days = period === "today" ? 1 : period === "week" ? 7 : period === "month" ? 30 : period === "year" ? 12 : 7
    const buckets: { label: string; revenue: number; profit: number }[] = []

    if (period === "year") {
      for (let m = 0; m < 12; m++) {
        const date = new Date(from.getFullYear(), m, 1)
        const end = endOfMonth(date)
        const dayApps = appointments.filter(a => {
          if (a.status !== "completed" && a.status !== "confirmed") return false
          try { const d = parseISO(a.date); return isWithinInterval(d, { start: date, end }) } catch { return false }
        })
        const r = dayApps.reduce((s, a) => s + a.price, 0)
        buckets.push({ label: format(date, "MMM", { locale: ptBR }), revenue: r, profit: r * (1 - COMMISSION_RATE) - FIXED_COSTS.month / 12 })
      }
    } else {
      const n = Math.min(days, 14)
      for (let i = n - 1; i >= 0; i--) {
        const date = subDays(period === "today" ? new Date() : to, i)
        const dateStr = format(date, "yyyy-MM-dd")
        const dayApps = appointments.filter(a => a.date === dateStr && (a.status === "completed" || a.status === "confirmed"))
        const r = dayApps.reduce((s, a) => s + a.price, 0)
        buckets.push({ label: format(date, "dd/MM"), revenue: r, profit: r * 0.7 })
      }
    }
    return buckets
  }, [period, from, to, appointments])

  const maxVal = Math.max(...chartData.map(d => d.revenue), 1)
  const svgH = 160
  const svgW = 600
  const padX = 40
  const padY = 20
  const innerW = svgW - padX * 2
  const innerH = svgH - padY * 2

  const toPoint = (i: number, val: number) => ({
    x: padX + (i / (chartData.length - 1 || 1)) * innerW,
    y: padY + innerH - (val / maxVal) * innerH,
  })

  const revenuePoints = chartData.map((d, i) => toPoint(i, d.revenue))
  const profitPoints = chartData.map((d, i) => toPoint(i, Math.max(d.profit, 0)))

  const buildPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")

  const buildArea = (pts: { x: number; y: number }[]) =>
    `${buildPath(pts)} L ${pts[pts.length - 1].x.toFixed(1)} ${(padY + innerH).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(padY + innerH).toFixed(1)} Z`

  const KPI = ({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub?: string; icon: any; color: string }) => (
    <Card className="bg-card border-border p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono font-bold uppercase text-muted-foreground">{label}</p>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </Card>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Financeiro" subtitle="Controle de receitas, despesas e lucro" type="admin" />

      <main className="p-6 space-y-6 max-w-6xl w-full mx-auto pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/dashboard/admin" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao painel
          </Link>

          {/* Period selector */}
          <div className="flex items-center gap-2 flex-wrap">
            {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-colors ${period === p ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/40"}`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {period === "custom" && (
          <Card className="bg-card border-border p-4 flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-muted-foreground">De</label>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="bg-muted border border-border rounded-md px-3 h-9 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-muted-foreground">Até</label>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="bg-muted border border-border rounded-md px-3 h-9 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </Card>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPI label="Receita Bruta" value={`R$ ${revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} sub={`${filtered.length} atendimentos concluídos`} icon={DollarSign} color="bg-emerald-500/15 text-emerald-400" />
          <KPI label="Despesas" value={`R$ ${expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} sub={`Comissões + custos fixos estimados`} icon={ArrowDownRight} color="bg-rose-500/15 text-rose-400" />
          <KPI label="Lucro Líquido" value={`R$ ${profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} sub={profit >= 0 ? "No azul 💚" : "Atenção ao resultado ⚠️"} icon={profit >= 0 ? TrendingUp : TrendingDown} color={profit >= 0 ? "bg-primary/15 text-primary" : "bg-amber-500/15 text-amber-400"} />
        </div>

        {/* Chart */}
        <Card className="bg-card border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-bold uppercase text-muted-foreground">Evolução Financeira</p>
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" /> Receita</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary inline-block" /> Lucro</span>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full min-w-[300px]" style={{ height: "160px" }}>
              <defs>
                <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="pro-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i} x1={padX} x2={svgW - padX} y1={padY + t * innerH} y2={padY + t * innerH}
                  stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4,4" />
              ))}

              {chartData.length > 1 && (
                <>
                  <path d={buildArea(revenuePoints)} fill="url(#rev-grad)" />
                  <path d={buildPath(revenuePoints)} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={buildArea(profitPoints)} fill="url(#pro-grad)" />
                  <path d={buildPath(profitPoints)} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}

              {chartData.map((d, i) => {
                const pt = toPoint(i, d.revenue)
                return (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="3" fill="#34d399" />
                    {i % Math.max(1, Math.floor(chartData.length / 6)) === 0 && (
                      <text x={pt.x} y={svgH - 4} textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))" fontFamily="monospace">{d.label}</text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </Card>

        {/* Breakdown table */}
        <Card className="bg-card border-border overflow-x-auto">
          <div className="p-4 border-b border-border">
            <p className="text-xs font-mono font-bold uppercase text-muted-foreground">Detalhamento de Transações</p>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-xs font-mono font-bold uppercase text-muted-foreground border-b border-border bg-muted/10">
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Serviço</th>
                <th className="p-3 text-left">Barbeiro</th>
                <th className="p-3 text-right">Valor</th>
                <th className="p-3 text-right">Comissão</th>
                <th className="p-3 text-right">Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.slice(0, 20).map((a, i) => (
                <tr key={i} className="hover:bg-muted/10 transition-colors">
                  <td className="p-3 font-mono">{a.date}</td>
                  <td className="p-3 text-foreground font-medium">{a.customerName}</td>
                  <td className="p-3 text-muted-foreground">{a.service}</td>
                  <td className="p-3 text-muted-foreground">{a.barber}</td>
                  <td className="p-3 text-right font-mono text-emerald-400 font-bold">R$ {a.price.toFixed(2)}</td>
                  <td className="p-3 text-right font-mono text-rose-400">- R$ {(a.price * COMMISSION_RATE).toFixed(2)}</td>
                  <td className="p-3 text-right font-mono text-primary font-bold">R$ {(a.price * (1 - COMMISSION_RATE)).toFixed(2)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Nenhum atendimento concluído no período selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {filtered.length > 20 && (
            <div className="p-3 text-center text-xs text-muted-foreground border-t border-border font-mono">
              Mostrando 20 de {filtered.length} registros
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
