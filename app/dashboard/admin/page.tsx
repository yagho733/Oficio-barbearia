"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { addDays, format, isWithinInterval, parseISO, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowRight, CalendarDays, CircleDollarSign, Clock3, UsersRound } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"
import {
  APPOINTMENTS_CHANGED_EVENT,
  type Appointment,
  barbers,
  getStoredAppointments,
} from "@/lib/data"

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

const statusLabel: Record<Appointment["status"], string> = {
  confirmed: "Confirmado",
  pending: "Pendente",
  completed: "Concluído",
  cancelled: "Cancelado",
}

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const load = () => setAppointments(getStoredAppointments())
    load()
    window.addEventListener("storage", load)
    window.addEventListener(APPOINTMENTS_CHANGED_EVENT, load)
    return () => {
      window.removeEventListener("storage", load)
      window.removeEventListener(APPOINTMENTS_CHANGED_EVENT, load)
    }
  }, [])

  const today = format(new Date(), "yyyy-MM-dd")
  const todayAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, today],
  )

  const nextSevenDays = useMemo(() => {
    const start = startOfDay(new Date())
    const end = addDays(start, 7)
    return appointments.filter((appointment) => {
      try {
        return appointment.status !== "cancelled" && isWithinInterval(parseISO(appointment.date), { start, end })
      } catch {
        return false
      }
    })
  }, [appointments])

  const todayRevenue = todayAppointments
    .filter((appointment) => appointment.status === "confirmed" || appointment.status === "completed")
    .reduce((total, appointment) => total + appointment.price, 0)

  const uniqueCustomers = new Set(appointments.map((appointment) => appointment.customerId || appointment.customerName)).size

  const stats = [
    { label: "Agenda de hoje", value: String(todayAppointments.length), detail: "atendimentos", icon: CalendarDays },
    { label: "Receita prevista hoje", value: currency.format(todayRevenue), detail: "reservas válidas", icon: CircleDollarSign },
    { label: "Próximos 7 dias", value: String(nextSevenDays.length), detail: "agendamentos", icon: Clock3 },
    { label: "Clientes cadastrados", value: String(uniqueCustomers), detail: "neste dispositivo", icon: UsersRound },
  ]

  return (
    <div className="min-h-screen bg-background pb-16">
      <DashboardHeader
        title="Visão geral"
        subtitle={format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        type="admin"
      />

      <main className="mx-auto w-full max-w-6xl space-y-7 p-4 sm:p-6">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo do negócio">
          {stats.map(({ label, value, detail, icon: Icon }) => (
            <article key={label} className="border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-3 font-heading text-3xl font-semibold tracking-[-0.035em]">{value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
                </div>
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-3 sm:grid-cols-3" aria-label="Ações rápidas">
          <Link href="/dashboard/admin/appointments" className="flex min-h-14 items-center justify-between border border-primary bg-primary px-5 font-semibold text-primary-foreground">
            Abrir agenda <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/dashboard/admin/services" className="flex min-h-14 items-center justify-between border border-border bg-card px-5 font-semibold hover:border-primary">
            Gerenciar serviços <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/dashboard/admin/barbers" className="flex min-h-14 items-center justify-between border border-border bg-card px-5 font-semibold hover:border-primary">
            Gerenciar equipe <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <div className="grid gap-7 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <section className="border border-border bg-card">
            <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <h2 className="text-base font-semibold">Agenda de hoje</h2>
                <p className="mt-1 text-sm text-muted-foreground">Em ordem de atendimento</p>
              </div>
              <Link href="/dashboard/admin/appointments" className="text-sm font-semibold text-primary hover:underline">Ver agenda</Link>
            </header>

            {todayAppointments.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="font-medium">Nenhum atendimento marcado para hoje.</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Faça um agendamento pelo site para testar como ele aparece automaticamente neste painel.</p>
                <Link href="/booking" className="mt-5 inline-flex min-h-11 items-center border border-border px-5 text-sm font-semibold hover:border-primary">Criar agendamento de teste</Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {todayAppointments.map((appointment) => (
                  <article key={appointment.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-center">
                    <p className="font-heading text-2xl font-semibold text-primary">{appointment.time}</p>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{appointment.customerName}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{appointment.service} · {appointment.barberName}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                      <p className="text-sm font-semibold">{currency.format(appointment.price)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{statusLabel[appointment.status]}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="border border-border bg-card">
            <header className="border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold">Equipe</h2>
              <p className="mt-1 text-sm text-muted-foreground">Agenda de hoje por profissional</p>
            </header>
            <div className="divide-y divide-border">
              {barbers.map((barber) => {
                const count = todayAppointments.filter((appointment) => appointment.barberId === barber.id).length
                return (
                  <article key={barber.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{barber.name}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{barber.specialty}</p>
                    </div>
                    <span className="shrink-0 border border-border px-3 py-1.5 text-sm text-muted-foreground">{count} hoje</span>
                  </article>
                )
              })}
            </div>
          </section>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">Os dados desta demonstração ficam salvos somente neste navegador.</p>
      </main>
    </div>
  )
}
