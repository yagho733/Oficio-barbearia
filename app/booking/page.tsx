"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { addDays, format, getDay, isSameDay, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Check, CheckCircle2, ChevronRight, Info } from "lucide-react"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
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

  const availableTimes = useMemo(() => {
    if (!selectedDate) return []
    return timeSlots.filter((time) => isAvailable(selectedDate, time))
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

  const changeService = () => {
    setSelectedService(null)
    setSelectedBarber(null)
    setSelectedDate(null)
    setSelectedTime("")
    setError("")
    setStep(1)
  }

  const changeBarber = () => {
    setSelectedBarber(null)
    setSelectedDate(null)
    setSelectedTime("")
    setError("")
    setStep(2)
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
    if (step === 2) changeService()
    if (step === 3) changeBarber()
  }

  const resetBooking = () => {
    setStep(1)
    setSelectedService(null)
    setSelectedBarber(null)
    setSelectedDate(null)
    setSelectedTime("")
    setName("")
    setPhone("")
    setError("")
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-3 border-b border-border pb-5">
          <Link href="/" aria-label="Voltar ao início">
            <Brand compact />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
        </header>

        {step < 4 && (
          <div className="mt-7 grid grid-cols-3 border-y border-border" aria-label={`Etapa ${step} de 3`}>
            {["Serviço", "Profissional", "Data e horário"].map((label, index) => {
              const number = index + 1
              const active = number === step
              const complete = number < step
              return (
                <div key={label} className={`flex min-h-16 items-center gap-3 border-r border-border px-3 last:border-r-0 sm:px-5 ${active ? "bg-card" : ""}`}>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-semibold ${number <= step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                    {complete ? <Check className="h-4 w-4" /> : number}
                  </span>
                  <span className={`hidden text-sm sm:block ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</span>
                </div>
              )
            })}
          </div>
        )}

        {step < 4 ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start">
            <section className="border border-border bg-card px-5 py-7 sm:px-8 sm:py-9">
              {step === 1 && (
                <div>
                  <p className="eyebrow">Etapa 1 de 3</p>
                  <h1 className="mt-3 font-heading text-[clamp(2.25rem,7vw,3.5rem)] font-semibold leading-none tracking-[-0.045em]">Qual serviço você quer?</h1>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">O valor e o tempo de atendimento aparecem antes da escolha.</p>

                  <div className="mt-8 border-t border-border">
                    {services.map((service) => (
                      <button key={service.id} type="button" onClick={() => selectService(service)} className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-5 border-b border-border py-5 text-left focus-visible:bg-muted/50 sm:py-6">
                        <div>
                          <h2 className="text-base font-semibold transition-colors group-hover:text-primary sm:text-lg">{service.name}</h2>
                          <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">{service.description}</p>
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{service.duration}</p>
                        </div>
                        <div className="text-right">
                          <span className="block font-heading text-xl font-semibold text-primary sm:text-2xl">{formatPrice(service.price)}</span>
                          <span className="mt-2 inline-flex items-center text-xs font-semibold uppercase tracking-[0.1em] text-foreground">Escolher <ChevronRight className="ml-1 h-4 w-4" /></span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <button type="button" onClick={goBack} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</button>
                  <p className="eyebrow">Etapa 2 de 3</p>
                  <h1 className="mt-3 font-heading text-[clamp(2.25rem,7vw,3.5rem)] font-semibold leading-none tracking-[-0.045em]">Escolha o profissional</h1>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">Você verá apenas os dias e horários livres na agenda dele.</p>

                  <div className="mt-8 border-t border-border">
                    {barbers.slice(0, 3).map((barber, index) => (
                      <button key={barber.id} type="button" onClick={() => selectBarber(barber)} className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-5 text-left focus-visible:bg-muted/50 sm:gap-6 sm:py-6">
                        <span className="font-heading text-2xl text-primary">{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <h2 className="text-base font-semibold transition-colors group-hover:text-primary sm:text-lg">{barber.name}</h2>
                          <p className="mt-1 text-sm text-muted-foreground">{barber.specialty}</p>
                          <p className="mt-2 hidden max-w-xl text-sm leading-6 text-muted-foreground sm:block">{barber.bio}</p>
                        </div>
                        <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.1em]">Escolher <ChevronRight className="ml-1 h-4 w-4" /></span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && selectedService && selectedBarber && (
                <div>
                  <button type="button" onClick={goBack} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</button>
                  <p className="eyebrow">Etapa 3 de 3</p>
                  <h1 className="mt-3 font-heading text-[clamp(2.25rem,7vw,3.5rem)] font-semibold leading-none tracking-[-0.045em]">Quando você prefere?</h1>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">Escolha um dia para ver somente os horários disponíveis.</p>

                  <div className="mt-8">
                    <Label className="text-sm font-semibold">Próximos dias disponíveis</Label>
                    {availableDates.length > 0 ? (
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {availableDates.map((date) => {
                          const active = selectedDate && format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                          return (
                            <button key={date.toISOString()} type="button" onClick={() => { setSelectedDate(date); setSelectedTime(""); setError("") }} className={`min-h-17 border px-3 py-3 text-left text-sm capitalize transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>
                              <span className="block font-semibold">{format(date, "EEE", { locale: ptBR })}</span>
                              <span className={`mt-1 block text-xs ${active ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{format(date, "dd 'de' MMM", { locale: ptBR })}</span>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="mt-3 border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">Não há horários livres nas próximas três semanas. Escolha outro profissional.</p>
                    )}
                  </div>

                  {selectedDate && (
                    <div className="mt-8">
                      <Label className="text-sm font-semibold">Horários livres em {format(selectedDate, "dd/MM")}</Label>
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {availableTimes.map((time) => (
                          <button key={time} type="button" onClick={() => { setSelectedTime(time); setError("") }} className={`min-h-12 border px-2 py-2 text-sm font-semibold transition-colors ${selectedTime === time ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>
                            {time}
                          </button>
                        ))}
                      </div>
                      <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0" /> Horários já reservados não aparecem nesta lista.</p>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="mt-9 border-t border-border pt-7">
                      <h2 className="text-lg font-semibold">Seus dados</h2>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">Usados para identificar e confirmar a reserva.</p>
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div><Label htmlFor="booking-name">Nome</Label><Input id="booking-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome completo" autoComplete="name" className="mt-2 h-11 rounded-none bg-background" /></div>
                        <div><Label htmlFor="booking-phone">WhatsApp</Label><Input id="booking-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Seu número com DDD" inputMode="tel" autoComplete="tel" className="mt-2 h-11 rounded-none bg-background" /></div>
                      </div>
                    </div>
                  )}

                  {error && <p aria-live="polite" className="mt-4 border border-destructive/25 bg-destructive/10 p-3 text-sm leading-6 text-destructive">{error}</p>}

                  <Button type="button" onClick={finalizeBooking} disabled={!selectedDate || !selectedTime} className="mt-7 h-12 w-full rounded-none bg-primary text-base font-semibold text-primary-foreground">Confirmar agendamento</Button>
                  <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">Demonstração: a reserva fica salva somente neste navegador.</p>
                </div>
              )}
            </section>

            <aside className="border border-border bg-card p-5 lg:sticky lg:top-5" aria-label="Resumo do agendamento">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Seu agendamento</p>
              <div className="mt-5 border-t border-border">
                <div className="border-b border-border py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground">Serviço</span>
                    {selectedService && <button type="button" onClick={changeService} className="text-xs font-semibold text-primary hover:underline">Alterar</button>}
                  </div>
                  <p className={`mt-1 text-sm font-semibold ${selectedService ? "text-foreground" : "text-muted-foreground"}`}>{selectedService?.name ?? "Ainda não escolhido"}</p>
                  {selectedService && <p className="mt-1 text-xs text-muted-foreground">{selectedService.duration} · {formatPrice(selectedService.price)}</p>}
                </div>
                <div className="border-b border-border py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground">Profissional</span>
                    {selectedBarber && <button type="button" onClick={changeBarber} className="text-xs font-semibold text-primary hover:underline">Alterar</button>}
                  </div>
                  <p className={`mt-1 text-sm font-semibold ${selectedBarber ? "text-foreground" : "text-muted-foreground"}`}>{selectedBarber?.name ?? "Ainda não escolhido"}</p>
                </div>
                <div className="py-4">
                  <span className="text-xs text-muted-foreground">Data e horário</span>
                  <p className={`mt-1 text-sm font-semibold ${selectedDate && selectedTime ? "text-foreground" : "text-muted-foreground"}`}>
                    {selectedDate && selectedTime ? `${format(selectedDate, "dd/MM/yyyy")} às ${selectedTime}` : "Ainda não escolhido"}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        ) : selectedService && selectedBarber && selectedDate ? (
          <section className="mx-auto mt-10 max-w-2xl border border-border bg-card px-5 py-10 text-center sm:px-10 sm:py-12" aria-live="polite">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"><CheckCircle2 className="h-8 w-8" /></span>
            <p className="eyebrow mt-6">Agendamento concluído</p>
            <h1 className="mt-3 font-heading text-[clamp(2.5rem,9vw,4rem)] font-semibold leading-none tracking-[-0.045em]">Horário reservado</h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">{name}, sua reserva foi registrada e esse horário não aparecerá mais como disponível para {selectedBarber.name}.</p>
            <div className="mx-auto mt-7 max-w-md border-y border-border py-2 text-left text-sm">
              <div className="flex justify-between gap-4 border-b border-border py-3"><span className="text-muted-foreground">Serviço</span><span className="text-right font-medium">{selectedService.name}</span></div>
              <div className="flex justify-between gap-4 border-b border-border py-3"><span className="text-muted-foreground">Profissional</span><span className="text-right font-medium">{selectedBarber.name}</span></div>
              <div className="flex justify-between gap-4 border-b border-border py-3"><span className="text-muted-foreground">Data e hora</span><span className="text-right font-medium">{format(selectedDate, "dd/MM")} às {selectedTime}</span></div>
              <div className="flex justify-between gap-4 py-3"><span className="text-muted-foreground">Valor</span><span className="text-right font-semibold text-primary">{formatPrice(selectedService.price)}</span></div>
            </div>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button className="h-12 rounded-none bg-primary px-6 font-semibold text-primary-foreground" onClick={resetBooking}>Fazer novo agendamento</Button>
              <Link href="/"><Button variant="outline" className="h-12 w-full rounded-none border-border bg-background px-6">Voltar ao site</Button></Link>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
