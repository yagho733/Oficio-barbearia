"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, CheckCircle, LogOut, Star, Calendar as CalendarIcon, Clock, Scissors, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  getStoredAppointments, 
  saveAppointment, 
  barbers, 
  services, 
  timeSlots,
  Appointment 
} from "@/lib/data"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isBefore, startOfDay, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function BookingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([])
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null)

  // Booking selections
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<typeof barbers[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")

  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    // Session validation
    const session = localStorage.getItem("american_barber_session") || sessionStorage.getItem("american_barber_session")
    if (!session) {
      router.push("/login?redirect=/booking")
      return
    }
    
    try {
      const parsed = JSON.parse(session)
      setCurrentUser(parsed)
    } catch (e) {
      router.push("/login?redirect=/booking")
      return
    }

    setAppointmentsList(getStoredAppointments())
  }, [step, router])

  const handleLogout = () => {
    localStorage.removeItem("american_barber_session")
    sessionStorage.removeItem("american_barber_session")
    router.push("/login")
  }

  // Days mapping helper for Barber availability
  // availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dayNameMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const isBarberAvailableOnDay = (date: Date) => {
    if (!selectedBarber) return false
    const dayOfWeek = getDay(date)
    const dayName = dayNameMap[dayOfWeek]
    return selectedBarber.availability.includes(dayName)
  }

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = getDay(monthStart)

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleFinalizeBooking = () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      alert("Por favor, preencha todos os campos do agendamento.")
      return
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd")

    const slotBusy = appointmentsList.some(
      (app) => 
        app.barberName === selectedBarber.name &&
        app.date === dateStr &&
        app.time === selectedTime &&
        app.status === "confirmed"
    )

    if (slotBusy) {
      alert(`Erro: O profissional ${selectedBarber.name} já se encontra ocupado neste horário. Por favor, selecione outro!`)
      return
    }

    const newAppointment = {
      customerId: currentUser?.email || "customer",
      customerName: currentUser?.name || "Cliente Autenticado",
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      service: selectedService.name,
      price: selectedService.price,
      date: dateStr,
      time: selectedTime,
      duration: selectedService.duration,
      status: "confirmed" as const
    }

    saveAppointment(newAppointment)
    setStep(4) 
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full pb-20">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border flex justify-between items-center max-w-4xl mx-auto w-full mt-4 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-primary tracking-wider uppercase">AMERICAN BARBER • AGENDAMENTO</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground hidden sm:inline">Olá, {currentUser?.name}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs text-destructive gap-1.5 hover:bg-destructive/10">
            <LogOut className="h-3.5 w-3.5" /> Sair
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto w-full space-y-6 mt-4 text-left">
        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono bg-card p-4 rounded-xl border border-border shadow-sm">
            <span className={step === 1 ? "text-primary font-bold" : ""}>1. SERVIÇO</span>
            <span>➔</span>
            <span className={step === 2 ? "text-primary font-bold" : ""}>2. BARBEIRO</span>
            <span>➔</span>
            <span className={step === 3 ? "text-primary font-bold" : ""}>3. HORÁRIO</span>
          </div>
        )}

        {/* STEP 1: SERVICE */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-base font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">Selecione o Serviço</h2>
            <div className="grid gap-3">
              {services.map((ser) => (
                <Card 
                  key={ser.id} 
                  onClick={() => { setSelectedService(ser); setStep(2); }}
                  className="p-5 border border-border bg-card cursor-pointer hover:border-primary hover:shadow-md transition-all flex justify-between items-center group"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-sm group-hover:text-primary transition-colors">{ser.name}</p>
                    <p className="text-xs text-muted-foreground">{ser.description}</p>
                    <span className="inline-block text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">{ser.duration}</span>
                  </div>
                  <p className="font-heading text-lg text-primary font-bold">R$ {ser.price.toFixed(2)}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: BARBER */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs">
                <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              <h2 className="text-base font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">Escolha o Barbeiro</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {barbers.map((bar) => (
                <Card 
                  key={bar.id} 
                  onClick={() => { setSelectedBarber(bar); setStep(3); }}
                  className="p-5 border border-border bg-card cursor-pointer hover:border-primary hover:shadow-md transition-all flex flex-col justify-between text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-lg border border-primary/20 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      {bar.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{bar.name}</p>
                      <p className="text-xs text-primary font-semibold mt-0.5">{bar.specialty}</p>
                      <div className="flex items-center gap-1 mt-2 text-gold">
                        <Star className="h-3 w-3 fill-gold" />
                        <span className="text-xs font-semibold">{bar.rating}</span>
                        <span className="text-[10px] text-muted-foreground">({bar.reviews} avaliações)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-4 italic line-clamp-2">"{bar.bio}"</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: DATE & TIME */}
        {step === 3 && selectedBarber && selectedService && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-xs">
                <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              <h2 className="text-base font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">Escolha Data e Horário</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Modern Calendar */}
              <Card className="p-4 bg-card border-border flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                    {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handlePrevMonth} disabled={isBefore(monthStart, startOfMonth(new Date()))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Weekdays headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground mb-2">
                  <span>DOM</span>
                  <span>SEG</span>
                  <span>TER</span>
                  <span>QUA</span>
                  <span>QUI</span>
                  <span>SEX</span>
                  <span>SÁB</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty spaces for the first week offset */}
                  {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {daysInMonth.map((day) => {
                    const isPast = isBefore(day, startOfDay(new Date()))
                    const works = isBarberAvailableOnDay(day)
                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
                    const isDisabled = isPast || !works

                    return (
                      <button
                        key={day.toString()}
                        type="button"
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedDate(day)
                            setSelectedTime("") // Reset time selection
                          }
                        }}
                        disabled={isDisabled}
                        className={`h-9 w-full rounded-lg text-xs font-semibold transition-all flex flex-col items-center justify-center relative ${
                          isSelected
                            ? "bg-primary text-primary-foreground shadow"
                            : isDisabled
                            ? "text-muted-foreground/30 bg-muted/10 cursor-not-allowed"
                            : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <span>{format(day, "d")}</span>
                        {works && !isPast && !isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </Card>

              {/* Time Slots Selection */}
              <Card className="p-4 bg-card border-border flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Horários Disponíveis</h3>
                  
                  {!selectedDate ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      Selecione um dia no calendário para visualizar os horários disponíveis.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {timeSlots.map((time) => {
                        const dateStr = format(selectedDate, "yyyy-MM-dd")
                        const ocupado = appointmentsList.some(
                          (a) => a.barberName === selectedBarber.name && a.date === dateStr && a.time === time && a.status === "confirmed"
                        )
                        return (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? "default" : "outline"}
                            disabled={ocupado}
                            onClick={() => setSelectedTime(time)}
                            className={`h-9 text-xs font-medium ${
                              ocupado ? 'opacity-30 bg-muted cursor-not-allowed border-0' : ''
                            }`}
                          >
                            {time} {ocupado && "(Ocupado)"}
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleFinalizeBooking} 
                  disabled={!selectedTime || !selectedDate}
                  className="w-full bg-primary font-bold text-xs h-10 mt-4 border-0 text-primary-foreground"
                >
                  Confirmar Agendamento
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMED */}
        {step === 4 && (
          <Card className="p-8 text-center bg-card border-border space-y-6 animate-in zoom-in-95 duration-300 shadow-xl max-w-md mx-auto">
            <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
            <div className="space-y-2">
              <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">Reserva Confirmada!</h2>
              <p className="text-xs text-muted-foreground">Seu corte com o profissional de elite foi agendado.</p>
            </div>
            <div className="p-4 bg-background border rounded-lg text-left text-xs space-y-2 font-mono">
              <p><span className="text-muted-foreground font-semibold">Corte:</span> {selectedService?.name}</p>
              <p><span className="text-muted-foreground font-semibold">Profissional:</span> {selectedBarber?.name}</p>
              <p>
                <span className="text-muted-foreground font-semibold">Data:</span>{" "}
                {selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""} às {selectedTime}
              </p>
              <p><span className="text-muted-foreground font-semibold">Preço:</span> R$ {selectedService?.price.toFixed(2)}</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push("/dashboard/customer")}
                variant="outline"
                className="w-full font-bold text-xs h-10"
              >
                Ir para Dashboard
              </Button>
              <Button 
                onClick={() => { setStep(1); setSelectedTime(""); setSelectedService(null); setSelectedBarber(null); setSelectedDate(null); }} 
                className="w-full bg-primary font-bold text-xs h-10 border-0 text-primary-foreground"
              >
                Novo Agendamento
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}