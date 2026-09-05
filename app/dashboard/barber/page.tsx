"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { format, isWithinInterval, parseISO, startOfWeek, endOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarDays, Check, Clock3, Pause, Plus, Trash2, X } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDemoSession } from "@/lib/demo-auth"
import {
  APPOINTMENTS_CHANGED_EVENT,
  type Appointment,
  type TimeBlock,
  addBarberBlock,
  getStoredAppointments,
  getStoredBlocks,
  removeBarberBlock,
  replaceStoredAppointments,
  timeSlots,
} from "@/lib/data"

const commissionRate = 0.3
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export default function BarberDashboardPage() {
  const [barberId, setBarberId] = useState("1")
  const [barberName, setBarberName] = useState("Rafael")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [blocks, setBlocks] = useState<TimeBlock[]>([])
  const [selectedTime, setSelectedTime] = useState(timeSlots[0] ?? "09:00")
  const [selectedDuration, setSelectedDuration] = useState("30 min")
  const [message, setMessage] = useState("")

  const today = format(new Date(), "yyyy-MM-dd")

  const loadData = (id: string) => {
    setAppointments(getStoredAppointments().filter((appointment) => appointment.barberId === id))
    setBlocks(getStoredBlocks().filter((block) => block.barberId === id && block.date === today))
  }

  useEffect(() => {
    const session = getDemoSession()
    const id = session?.barberId ?? "1"
    setBarberId(id)
    setBarberName(session?.name ?? "Rafael")
    loadData(id)

    const refresh = () => loadData(id)
    window.addEventListener("storage", refresh)
    window.addEventListener(APPOINTMENTS_CHANGED_EVENT, refresh)
    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener(APPOINTMENTS_CHANGED_EVENT, refresh)
    }
  }, [today])

  const todayAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, today],
  )

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  const weekAppointments = appointments.filter((appointment) => {
    try {
      return isWithinInterval(parseISO(appointment.date), { start: weekStart, end: weekEnd })
    } catch {
      return false
    }
  })

  const validToday = todayAppointments.filter((appointment) => appointment.status === "confirmed" || appointment.status === "completed")
  const validWeek = weekAppointments.filter((appointment) => appointment.status === "confirmed" || appointment.status === "completed")
  const commissionToday = validToday.reduce((total, appointment) => total + appointment.price * commissionRate, 0)
  const commissionWeek = validWeek.reduce((total, appointment) => total + appointment.price * commissionRate, 0)
  const nextAppointment = todayAppointments.find((appointment) => appointment.status === "confirmed") ?? null
  const fullDayBlock = blocks.find((block) => block.duration === "full_day")
  const breakBlocks = blocks.filter((block) => block.duration !== "full_day")

  const notify = (text: string) => {
    setMessage(text)
    window.setTimeout(() => setMessage(""), 2800)
  }

  const toggleAvailability = () => {
    if (fullDayBlock) {
      removeBarberBlock(fullDayBlock.id)
      notify("Agenda reaberta para novos horários hoje.")
    } else {
      addBarberBlock({ barberId, date: today, time: "09:00", duration: "full_day", type: "offline" })
      notify("Agenda fechada para novos horários hoje.")
    }
    loadData(barberId)
  }

  const addBreak = () => {
    if (fullDayBlock) {
      notify("Reabra a agenda antes de adicionar um intervalo.")
      return
    }
    if (breakBlocks.some((block) => block.time === selectedTime)) {
      notify("Esse horário já está bloqueado.")
      return
    }

    addBarberBlock({
      barberId,
      date: today,
      time: selectedTime,
      duration: selectedDuration,
      type: "break",
    })
    loadData(barberId)
    notify(`Intervalo bloqueado às ${selectedTime}.`)
  }

  const deleteBlock = (id: string) => {
    removeBarberBlock(id)
    loadData(barberId)
    notify("Bloqueio removido.")
  }

  const updateStatus = (id: string, status: "completed" | "cancelled") => {
    const updated = getStoredAppointments().map((appointment) =>
      appointment.id === id ? { ...appointment, status } : appointment,
    )
    replaceStoredAppointments(updated)
    loadData(barberId)
    notify(status === "completed" ? "Atendimento concluído." : "Atendimento cancelado.")
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <DashboardHeader
        title="Minha rotina"
        subtitle={`${barberName} · ${format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}`}
        type="barber"
      />

      <main className="mx-auto w-full max-w-6xl space-y-7 p-4 sm:p-6">
        {message && <p className="border border-primary/25 bg-primary/10 p-3 text-sm text-primary" aria-live="polite">{message}</p>}

        {fullDayBlock && (
          <div className="flex flex-col gap-3 border border-destructive/35 bg-destructive/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-destructive">Agenda fechada hoje</p>
              <p className="mt-1 text-sm text-muted-foreground">Novos agendamentos estão bloqueados para este profissional.</p>
            </div>
            <Button type="button" onClick={toggleAvailability} variant="outline" className="rounded-none border-destructive/40 bg-transparent">Reabrir agenda</Button>
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumo do dia">
          <article className="border border-border bg-card p-5">
            <CalendarDays className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Atendimentos hoje</p>
            <p className="mt-2 font-heading text-3xl font-semibold">{todayAppointments.length}</p>
          </article>
          <article className="border border-border bg-card p-5">
            <Clock3 className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Comissão prevista hoje</p>
            <p className="mt-2 font-heading text-3xl font-semibold">{currency.format(commissionToday)}</p>
          </article>
          <article className="border border-border bg-card p-5">
            <Check className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Comissão na semana</p>
            <p className="mt-2 font-heading text-3xl font-semibold">{currency.format(commissionWeek)}</p>
          </article>
        </section>

        {nextAppointment && (
          <section className="border border-primary/35 bg-primary/10 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Próximo atendimento</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{nextAppointment.time}</p>
              <p className="mt-2 font-semibold">{nextAppointment.customerName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{nextAppointment.service} · {nextAppointment.duration}</p>
            </div>
            <Link href="/dashboard/barber/schedule" className="mt-5 inline-flex min-h-11 items-center border border-primary px-5 text-sm font-semibold text-primary sm:mt-0">Abrir agenda completa</Link>
          </section>
        )}

        <div className="grid gap-7 xl:grid-cols-[minmax(0,1.25fr)_minmax(290px,0.75fr)]">
          <section className="border border-border bg-card">
            <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <h2 className="font-semibold">Agenda de hoje</h2>
                <p className="mt-1 text-sm text-muted-foreground">Atualize cada atendimento por aqui</p>
              </div>
              <span className="text-sm text-muted-foreground">{todayAppointments.length} no total</span>
            </header>

            {todayAppointments.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="font-medium">Nenhum cliente marcado para hoje.</p>
                <p className="mt-2 text-sm text-muted-foreground">Os novos agendamentos aparecerão aqui automaticamente.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {todayAppointments.map((appointment) => (
                  <article key={appointment.id} className="grid gap-4 px-5 py-4 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-center">
                    <div>
                      <p className="font-heading text-2xl font-semibold text-primary">{appointment.time}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{appointment.duration}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{appointment.customerName}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{appointment.service}</p>
                    </div>
                    {appointment.status === "confirmed" ? (
                      <div className="flex gap-2">
                        <Button type="button" size="sm" onClick={() => updateStatus(appointment.id, "completed")} className="rounded-none bg-primary text-primary-foreground"><Check className="mr-1 h-4 w-4" /> Concluir</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => updateStatus(appointment.id, "cancelled")} className="rounded-none bg-transparent"><X className="mr-1 h-4 w-4" /> Cancelar</Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">{appointment.status === "completed" ? "Concluído" : "Cancelado"}</span>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">Disponibilidade de hoje</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Bloqueie um intervalo ou feche a agenda.</p>
              </div>
              <Pause className="h-5 w-5 shrink-0 text-primary" />
            </div>

            {!fullDayBlock && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div>
                  <label className="text-sm font-medium">Início</label>
                  <Select value={selectedTime} onValueChange={(value) => setSelectedTime(value ?? "09:00")}>
                    <SelectTrigger className="mt-2 h-11 w-full rounded-none bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>{timeSlots.map((time) => <SelectItem key={time} value={time}>{time}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duração</label>
                  <Select value={selectedDuration} onValueChange={(value) => setSelectedDuration(value ?? "30 min")}>
                    <SelectTrigger className="mt-2 h-11 w-full rounded-none bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30 min">30 minutos</SelectItem>
                      <SelectItem value="60 min">1 hora</SelectItem>
                      <SelectItem value="90 min">1 hora e 30 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" onClick={addBreak} className="h-11 rounded-none bg-primary text-primary-foreground sm:col-span-2 xl:col-span-1"><Plus className="mr-2 h-4 w-4" /> Bloquear intervalo</Button>
              </div>
            )}

            {breakBlocks.length > 0 && (
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-sm font-medium">Intervalos bloqueados</p>
                <div className="mt-3 divide-y divide-border border-y border-border">
                  {breakBlocks.map((block) => (
                    <div key={block.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <span>{block.time} · {block.duration}</span>
                      <button type="button" onClick={() => deleteBlock(block.id)} aria-label={`Remover bloqueio das ${block.time}`} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!fullDayBlock && (
              <Button type="button" variant="outline" onClick={toggleAvailability} className="mt-6 h-11 w-full rounded-none border-destructive/40 bg-transparent text-destructive hover:bg-destructive/10">Fechar agenda de hoje</Button>
            )}
          </section>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">Comissão demonstrativa de 30%. Os dados ficam salvos somente neste navegador.</p>
      </main>
    </div>
  )
}
