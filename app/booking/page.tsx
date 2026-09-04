"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { addDays, format, getDay, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Check, CheckCircle2, Clock3, Scissors, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { barbers, getStoredAppointments, saveAppointment, services, timeSlots } from "@/lib/data"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<(typeof services)[number] | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<(typeof barbers)[number] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")

  const availableDates = useMemo(() => {
    const today = startOfDay(new Date())
    return Array.from({ length: 14 }, (_, index) => addDays(today, index))
      .filter((date) => getDay(date) !== 0)
      .slice(0, 8)
  }, [])

  const availableTimes = useMemo(() => {
    if (!selectedDate || !selectedBarber) return timeSlots
    const date = format(selectedDate, "yyyy-MM-dd")
    const appointments = getStoredAppointments()
    return timeSlots.filter((time) => !appointments.some((appointment) =>
      appointment.date === date &&
      appointment.time === time &&
      appointment.barberId === selectedBarber.id &&
      appointment.status !== "cancelled"
    ))
  }, [selectedDate, selectedBarber, step])

  const finalizeBooking = () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) return
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 10) {
      setError("Informe seu nome e um WhatsApp válido para continuar.")
      return
    }

    saveAppointment({
      customerId: phone.replace(/\D/g, ""),
      customerName: name.trim(),
      customerPhone: phone.trim(),
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      barber: selectedBarber.name,
      service: selectedService.name,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      duration: selectedService.duration,
      price: selectedService.price,
    })
    setError("")
    setStep(4)
  }

  const goBack = () => {
    if (step === 1) return
    setStep((current) => current - 1)
    setError("")
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Voltar ao início">
            <img src="/logo.png" alt="" className="h-11 w-11 rounded-full object-cover ring-1 ring-white/15" />
            <div className="leading-none">
              <p className="font-heading text-xl tracking-[0.12em]">AMERICAN BARBER</p>
              <p className="mt-1 text-xs tracking-[0.2em] text-primary">AGENDAMENTO DEMONSTRATIVO</p>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-white/15 bg-white/5">
              <ArrowLeft className="mr-2 h-4 w-4" /> Início
            </Button>
          </Link>
        </header>

        {step < 4 && (
          <div className="mt-10 grid grid-cols-3 gap-2" aria-label={"Etapa " + step + " de 3"}>
            {["Serviço", "Profissional", "Horário"].map((label, index) => {
              const number = index + 1
              const active = number === step
              const complete = number < step
              return (
                <div key={label}>
                  <div className={"h-1.5 rounded-full " + (number <= step ? "bg-primary" : "bg-muted")} />
                  <p className={"mt-2 text-sm " + (active ? "text-foreground" : "text-muted-foreground")}>
                    {complete ? <Check className="mr-1 inline h-4 w-4 text-primary" /> : null}
                    {label}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        <Card className="mt-8 border-white/10 bg-card/80 p-5 shadow-2xl sm:p-8">
          {step === 1 && (
            <section>
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Etapa 1</p>
              <h1 className="mt-3 font-heading text-4xl tracking-wide sm:text-5xl">QUAL SERVIÇO VOCÊ PROCURA?</h1>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => { setSelectedService(service); setStep(2) }}
                    className="group rounded-xl border border-white/10 bg-background/60 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                        <Scissors className="h-5 w-5" />
                      </span>
                      <span className="font-heading text-2xl text-primary">{formatPrice(service.price)}</span>
                    </div>
                    <h2 className="mt-5 font-heading text-xl tracking-wide">{service.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                    <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4" /> {service.duration}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <button type="button" onClick={goBack} className="mb-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Etapa 2</p>
              <h1 className="mt-3 font-heading text-4xl tracking-wide sm:text-5xl">ESCOLHA O PROFISSIONAL</h1>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {barbers.slice(0, 3).map((barber) => (
                  <button
                    key={barber.id}
                    type="button"
                    onClick={() => { setSelectedBarber(barber); setStep(3) }}
                    className="rounded-xl border border-white/10 bg-background/60 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
                        <UserRound className="h-6 w-6" />
                      </span>
                      <div>
                        <h2 className="font-heading text-xl tracking-wide">{barber.name}</h2>
                        <p className="mt-1 text-sm text-primary">{barber.specialty}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{barber.bio}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 3 && selectedService && selectedBarber && (
            <section>
              <button type="button" onClick={goBack} className="mb-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Etapa 3</p>
              <h1 className="mt-3 font-heading text-4xl tracking-wide sm:text-5xl">DATA, HORÁRIO E CONTATO</h1>

              <div className="mt-7 rounded-xl border border-white/8 bg-background/60 p-4 text-sm text-muted-foreground">
                <span className="text-foreground">{selectedService.name}</span> com <span className="text-foreground">{selectedBarber.name}</span>
                <span className="mx-2 text-white/20">•</span>{formatPrice(selectedService.price)}
              </div>

              <div className="mt-7">
                <Label className="text-sm font-medium">Escolha o dia</Label>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {availableDates.map((date) => {
                    const active = selectedDate && format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => { setSelectedDate(date); setSelectedTime("") }}
                        className={"rounded-lg border px-3 py-3 text-sm capitalize transition-colors " + (active ? "border-primary bg-primary text-primary-foreground" : "border-white/10 bg-background hover:border-primary/45")}
                      >
                        {format(date, "EEE, dd/MM", { locale: ptBR })}
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className="mt-7">
                  <Label className="text-sm font-medium">Escolha o horário</Label>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={"rounded-lg border px-3 py-2.5 text-sm transition-colors " + (selectedTime === time ? "border-primary bg-primary text-primary-foreground" : "border-white/10 bg-background hover:border-primary/45")}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedTime && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="booking-name">Seu nome</Label>
                    <Input id="booking-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome completo" className="mt-2 h-11 bg-background" />
                  </div>
                  <div>
                    <Label htmlFor="booking-phone">WhatsApp</Label>
                    <Input id="booking-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(53) 99999-9999" inputMode="tel" className="mt-2 h-11 bg-background" />
                  </div>
                </div>
              )}

              {error && <p className="mt-4 rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

              <Button
                type="button"
                onClick={finalizeBooking}
                disabled={!selectedDate || !selectedTime}
                className="gradient-primary mt-8 h-12 w-full border-0 text-base text-primary-foreground"
              >
                Confirmar demonstração
              </Button>
              <p className="mt-3 text-center text-sm text-muted-foreground">Nenhuma cobrança ou contato real será realizado.</p>
            </section>
          )}

          {step === 4 && selectedService && selectedBarber && selectedDate && (
            <section className="py-8 text-center">
              <span className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-primary/12 text-primary">
                <CheckCircle2 className="h-9 w-9" />
              </span>
              <p className="mt-6 text-sm uppercase tracking-[0.25em] text-gold">Demonstração concluída</p>
              <h1 className="mt-3 font-heading text-5xl tracking-wide">HORÁRIO RESERVADO</h1>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                {name}, sua demonstração foi salva neste dispositivo para {format(selectedDate, "dd/MM/yyyy")} às {selectedTime}.
              </p>
              <div className="mx-auto mt-7 max-w-md rounded-xl border border-white/8 bg-background/60 p-5 text-left text-sm">
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Serviço</span><span>{selectedService.name}</span></div>
                <div className="mt-3 flex justify-between gap-4"><span className="text-muted-foreground">Profissional</span><span>{selectedBarber.name}</span></div>
                <div className="mt-3 flex justify-between gap-4"><span className="text-muted-foreground">Valor</span><span className="text-primary">{formatPrice(selectedService.price)}</span></div>
              </div>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/"><Button className="gradient-primary h-12 border-0 px-6 text-primary-foreground">Voltar ao site</Button></Link>
                <Button variant="outline" className="h-12 border-white/15 bg-white/5 px-6" onClick={() => {
                  setStep(1)
                  setSelectedService(null)
                  setSelectedBarber(null)
                  setSelectedDate(null)
                  setSelectedTime("")
                }}>Fazer outro teste</Button>
              </div>
            </section>
          )}
        </Card>
      </div>
    </main>
  )
}
