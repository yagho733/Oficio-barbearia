"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar as CalendarIcon, Clock, ChevronLeft, Plus, Trash2, Coffee, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard/header"
import { 
  getStoredBlocks, 
  addBarberBlock, 
  removeBarberBlock, 
  TimeBlock,
  timeSlots 
} from "@/lib/data"
import { format } from "date-fns"

export default function BarberSchedulePage() {
  const router = useRouter()
  const [blocks, setBlocks] = useState<TimeBlock[]>([])
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("30 min")
  const [selectedDate, setSelectedDate] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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

    const todayStr = format(new Date(), "yyyy-MM-dd")
    setSelectedDate(todayStr)
    setBlocks(getStoredBlocks().filter(b => b.barberId === "1"))
    if (timeSlots.length > 0) {
      setSelectedTime(timeSlots[0])
    }
  }, [router])

  const loadBlocks = () => {
    setBlocks(getStoredBlocks().filter(b => b.barberId === "1"))
  }

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    const exists = blocks.some(b => b.date === selectedDate && b.time === selectedTime)
    if (exists) {
      alert("Este horário já está bloqueado para este dia!")
      return
    }

    addBarberBlock({
      barberId: "1",
      date: selectedDate,
      time: selectedTime,
      duration: selectedDuration,
      type: "break"
    })

    loadBlocks()
    showToast("Horário bloqueado com sucesso.")
  }

  const handleRemoveBlock = (id: string) => {
    removeBarberBlock(id)
    loadBlocks()
    showToast("Bloqueio de horário removido.")
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Agenda Operacional" subtitle="Gerencie seus intervalos e bloqueios de horários" type="barber" />

      <main className="p-6 space-y-6 max-w-4xl w-full mx-auto pb-24 text-left">
        <div>
          <Link href="/dashboard/barber" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar ao painel</span>
          </Link>
        </div>

        {toastMessage && (
          <div className="bg-green-500/10 border border-green-500/25 text-green-400 p-3 rounded-lg text-xs font-semibold animate-fade-in">
            {toastMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Block form */}
          <Card className="p-6 bg-card border-border md:col-span-1 h-fit">
            <h3 className="font-heading font-bold text-xs tracking-wider uppercase mb-4 flex items-center gap-1.5 text-gold">
              <Coffee className="h-4.5 w-4.5" /> Bloquear Horário
            </h3>

            <form onSubmit={handleAddBlock} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Data</label>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Horário</label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full text-xs h-10 bg-background border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {timeSlots.map(t => (
                      <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Duração</label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger className="w-full text-xs h-10 bg-background border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="30 min" className="text-xs">30 min</SelectItem>
                    <SelectItem value="60 min" className="text-xs">1 hora</SelectItem>
                    <SelectItem value="90 min" className="text-xs">1h 30m</SelectItem>
                    <SelectItem value="full_day" className="text-xs">Dia Completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-primary-foreground border-0 font-bold text-xs h-10">
                Inserir Bloqueio
              </Button>
            </form>
          </Card>

          {/* Active blocks list */}
          <Card className="p-6 bg-card border-border md:col-span-2">
            <h3 className="font-heading font-bold text-xs tracking-wider uppercase mb-4">Bloqueios Configurados</h3>

            <div className="divide-y divide-border">
              {blocks.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                  <Clock className="h-8 w-8 text-muted-foreground/30" />
                  <p>Você não tem horários bloqueados no momento.</p>
                </div>
              ) : (
                blocks.map((b) => (
                  <div key={b.id} className="flex items-center justify-between py-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <Coffee className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-foreground">{b.date === format(new Date(), "yyyy-MM-dd") ? "Hoje" : b.date}</p>
                        <p className="text-muted-foreground text-[11px]">Horário: <span className="font-semibold text-foreground">{b.time}</span> ({b.duration === 'full_day' ? 'Dia Inteiro' : b.duration})</p>
                      </div>
                    </div>

                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleRemoveBlock(b.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
