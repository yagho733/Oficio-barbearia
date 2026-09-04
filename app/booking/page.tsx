"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { addDays, format, getDay, isSameDay, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Check, CheckCircle2, Clock3, Info, Scissors, UserRound } from "lucide-react"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  APPOINTMENTS_CHANGED_EVENT,
  AppointmentConflictError,
  barbers,
  durationToMinutes,
  getStoredAppointments,
  getStoredBlocks,
  isTimeSlotAvailable,
  saveAppointment,
  services,
  timeSlots,
} from "@/lib/data"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

const weekdayCodes = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const closingTimeInMinutes = 20 * 60

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<(typeof services)[number] | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<(typeof barbers)[number] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [availabilityVersion, setAvailabilityVersion] = useState(0)

  useEffect(() => {
    const refreshAvailability = () => setAvailabilityVersion((current) => current + 1)
    window.addEventListener("storage", refreshAvailability)
    window.addEventListener(APPOINTMENTS_CHANGED_EVENT, refreshAvailability)
    return () => {
      window.removeEventListener("storage", refreshAvailability)
      window.removeEventListener(APPOINTMENTS_CHANGED_EVENT, refreshAvailability)
    }
  }, [])

  const isAvailable = (date: Date, time: string) => {
    if (!selectedService || !selectedBarber) return false

    const now = new Date()
    const startMinutes = timeToMinutes(time)
    const endsAfterClosing = startMinutes + durationToMinutes(selectedService.duration) > closingTimeInMinutes
    const isPast = isSameDay(date, now) && startMinutes <= now.getHours() * 60 + now.getMinutes()

    if (endsAfterClosing || isPast) return false

    return isTimeSlotAvailable({
      barberId: selectedBarber.id,
      date: format(date, "yyyy-MM-dd"),
      time,
      duration: selectedService.duration,
      appointments: getStoredAppointments(),
      blocks: getStoredBlocks(),
    })
  }

  const availableDates = useMemo(() => {
    if (!selectedService || !selectedBarber) return []
    const today = startOfDay(new Date())

    return Array.from({ length: 21 }, (_, index) => addDays(today, index))
      .filter((date) => selectedBarber.availability.includes(weekdayCodes[getDay(date)]))
      .filter((date) => timeSlots.some((time) => isAvailable(date, time)))
      .slice(0, 8)
    // availabilityVersion força uma nova consulta após uma reserva ou alteração em outra aba.
  }, [selectedBarber, selectedService, availabilityVersion])

  const slotAvailability = useMemo(() => {
    if (!selectedDate) return []
    return timeSlots.map((time) => ({ time, available: isAvailable(selectedDate, time) }))
  }, [selectedDate, selectedBarber, selectedService, availabilityVersion])

  const selectService = (service: (typeof services)[number]) => {
    setSelectedService(service)
    setSelectedBarber(null)
    setSelectedDate(null)
    setSelectedTime("")
    setStep(2)
  }

  const selectBarber = (barber: (typeof barbers)[number]) => {
    setSelectedBarber(barber)
    setSelectedDate(null)
    setSelectedTime("")
    setStep(3)
  }

  const finalizeBooking = () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) return
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 10) {
      setError("Informe seu nome e um WhatsApp válido para continuar.")
      return
    }

    try {
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
    } catch (bookingError) {
      setAvailabilityVersion((current) => current + 1)
      setSelectedTime("")
      setError(
        bookingError instanceof AppointmentConflictError
          ? bookingError.message
          : "Não foi possível reservar. Atualize a página e tente novamente.",
      )
    }
  }

  const goBack = () => {
    if (step === 1) return
    setStep((current) => current - 1)
    setError("")
  }

  const resetBooking = () => {
    setStep(1)
    setSelectedService(null)
    setSelectedBarber(null)
    setSelectedDate(null)
    setSelectedTime("")
    setError("")
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="Voltar ao início">
            <Brand compact />
          </Link>
          <Link href="/">
            <Button variant="outline" className="h-10 border-border bg-background px-3 sm:px-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Início
            </Button>
          </Link>
        </header>

        {step < 4 && (
          <div className="mt-8 grid grid-cols-3 gap-2 sm:mt-10" aria-label={`Etapa ${step} de 3`}>
            {["Serviço", "Profissional", "Horário"].map((label, index) => {
              const number = index + 1
              const active = number === step
              const complete = number < step
              return (
                <div key={label}>
                  <div className={`h-1.5 rounded-full ${number <= step ? "bg-primary" : "bg-muted"}`} />
                  <p className={`mt-2 flex items-center text-xs leading-5 sm:text-sm ${active ? "text-foreground" : "text-muted-foreground"}`}>
                    {complete ? <Check className="mr-1 h-4 w-4 shrink-0 text-primary" /> : null}
                    <span className="truncate">{label}</span>
                  </p>
                </div>
              )
            })}
          </div>
        )}

        <Card className="mt-7 overflow-hidden border-border bg-card p-5 shadow-none sm:mt-8 sm:p-8">
          {step === 1 && (
            <section>
              <p className="eyebrow">Etapa 1 de 3</p>
              <h1 className="display-title mt-3 text-[clamp(2.35rem,8vw,3.75rem)]">Escolha o serviço</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">Confira valor e duração antes de continuar.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <button key={service.id} type="button" onClick={() => selectService(service)} className="group border border-border bg-background p-5 text-left transition-colors hover:border-primary focus-visible:border-primary">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-primary/25 bg-primary/8 text-primary"><Scissors className="h-5 w-5" /></span>
                      <span className="font-heading text-2xl leading-none text-primary">{formatPrice(service.price)}</span>
                    </div>
                    <h2 className="mt-5 font-heading text-2xl leading-tight tracking-wide">{service.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
                    <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="h-4 w-4" /> {service.duration}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <button type="button" onClick={goBack} className="mb-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</button>
              <p className="eyebrow">Etapa 2 de 3</p>
              <h1 className="display-title mt-3 text-[clamp(2.35rem,8vw,3.75rem)]">Escolha o profissional</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">Cada agenda é independente. Um horário ocupado com um profissional pode estar livre com outro.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {barbers.slice(0, 3).map((barber) => (
                  <button key={barber.id} type="button" onClick={() => selectBarber(barber)} className="border border-border bg-background p-5 text-left transition-colors hover:border-primary focus-visible:border-primary">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/25 bg-primary/8 text-primary"><UserRound className="h-6 w-6" /></span>
                      <div className="min-w-0">
                        <h2 className="font-heading text-2xl leading-tight tracking-wide">{barber.name}</h2>
                        <p className="mt-1 text-sm leading-5 text-primary">{barber.specialty}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{barber.bio}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 3 && selectedService && selectedBarber && (
            <section>
              <button type="button" onClick={goBack} className="mb-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</button>
              <p className="eyebrow">Etapa 3 de 3</p>
              <h1 className="display-title mt-3 text-[clamp(2.35rem,8vw,3.75rem)]">Escolha data e horário</h1>

              <div className="mt-6 grid gap-3 border border-border bg-background p-4 text-sm sm:grid-cols-3">
                <div><span className="block text-muted-foreground">Serviço</span><strong className="mt-1 block font-medium">{selectedService.name}</strong></div>
                <div><span className="block text-muted-foreground">Profissional</span><strong className="mt-1 block font-medium">{selectedBarber.name}</strong></div>
                <div><span className="block text-muted-foreground">Valor</span><strong className="mt-1 block font-medium text-primary">{formatPrice(selectedService.price)}</strong></div>
              </div>

              <div className="mt-7">
                <Label className="text-sm font-medium">Dias com disponibilidade</Label>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {availableDates.map((date) => {
                    const active = selectedDate && format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                    return (
                      <button key={date.toISOString()} type="button" onClick={() => { setSelectedDate(date); setSelectedTime(""); setError("") }} className={`min-h-16 border px-3 py-2 text-sm capitalize transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>
                        <span className="block font-medium">{format(date, "EEEE", { locale: ptBR })}</span>
                        <span className={`mt-1 block text-xs ${active ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{format(date, "dd 'de' MMM", { locale: ptBR })}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className="mt-7">
                  <Label className="text-sm font-medium">Horários de {selectedBarber.name}</Label>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {slotAvailability.map(({ time, available }) => (
                      <button key={time} type="button" disabled={!available} onClick={() => { setSelectedTime(time); setError("") }} className={`min-h-14 border px-2 py-2 text-sm transition-colors ${selectedTime === time ? "border-primary bg-primary text-primary-foreground" : available ? "border-border bg-background hover:border-primary" : "cursor-not-allowed border-border bg-muted/45 text-muted-foreground/50"}`}>
                        <span className="block font-medium">{time}</span>
                        {!available && <span className="mt-0.5 block text-xs">Ocupado</span>}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Horários ocupados e períodos que entram em conflito com a duração do serviço ficam bloqueados.</p>
                </div>
              )}

              {selectedTime && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div><Label htmlFor="booking-name">Seu nome</Label><Input id="booking-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome completo" autoComplete="name" className="mt-2 h-11 bg-background" /></div>
                  <div><Label htmlFor="booking-phone">WhatsApp</Label><Input id="booking-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Digite seu número" inputMode="tel" autoComplete="tel" className="mt-2 h-11 bg-background" /></div>
                </div>
              )}

              {error && <p aria-live="polite" className="mt-4 rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-sm leading-6 text-destructive">{error}</p>}

              <Button type="button" onClick={finalizeBooking} disabled={!selectedDate || !selectedTime} className="mt-8 h-12 w-full rounded-none bg-primary text-base font-semibold text-primary-foreground">Confirmar reserva</Button>
              <p className="mt-3 text-center text-sm leading-6 text-muted-foreground">Demonstração: a reserva fica salva somente neste navegador.</p>
            </section>
          )}

          {step === 4 && selectedService && selectedBarber && selectedDate && (
            <section className="py-6 text-center sm:py-8" aria-live="polite">
              <span className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-primary/12 text-primary"><CheckCircle2 className="h-9 w-9" /></span>
              <p className="eyebrow mt-6">Reserva demonstrativa concluída</p>
              <h1 className="display-title mt-3 text-[clamp(2.5rem,9vw,4rem)]">Horário reservado</h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">{name}, o horário de {format(selectedDate, "dd/MM/yyyy")} às {selectedTime} agora aparece como ocupado na agenda de {selectedBarber.name}.</p>
              <div className="mx-auto mt-7 max-w-md border border-border bg-background p-5 text-left text-sm">
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Serviço</span><span className="text-right">{selectedService.name}</span></div>
                <div className="mt-3 flex justify-between gap-4"><span className="text-muted-foreground">Profissional</span><span className="text-right">{selectedBarber.name}</span></div>
                <div className="mt-3 flex justify-between gap-4"><span className="text-muted-foreground">Data e hora</span><span className="text-right">{format(selectedDate, "dd/MM")} às {selectedTime}</span></div>
                <div className="mt-3 flex justify-between gap-4"><span className="text-muted-foreground">Valor</span><span className="text-right text-primary">{formatPrice(selectedService.price)}</span></div>
              </div>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button className="h-12 rounded-none bg-primary px-6 font-semibold text-primary-foreground" onClick={resetBooking}>Conferir horário bloqueado</Button>
                <Link href="/"><Button variant="outline" className="h-12 w-full rounded-none border-border bg-background px-6">Voltar ao site</Button></Link>
              </div>
            </section>
          )}
        </Card>
      </div>
    </main>
  )
}
