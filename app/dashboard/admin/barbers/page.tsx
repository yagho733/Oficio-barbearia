"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft, Plus, Search, Edit3, Trash2, X, Save,
  Scissors, Clock, Star, DollarSign, Calendar, User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard/header"

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

interface Barber {
  id: string
  name: string
  specialty: string
  workingDays: string[]
  startTime: string
  endTime: string
  commission: number
  bio: string
  rating: number
  totalCuts: number
}

const INITIAL_BARBERS: Barber[] = [
  {
    id: "1",
    name: "Carlos Silva",
    specialty: "Corte Clássico & Barba",
    workingDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    startTime: "09:00",
    endTime: "18:00",
    commission: 30,
    bio: "10 anos de experiência em cortes clássicos.",
    rating: 4.9,
    totalCuts: 1240,
  },
  {
    id: "2",
    name: "Rafael Santos",
    specialty: "Degradê & Desenho",
    workingDays: ["Ter", "Qua", "Qui", "Sex", "Sáb"],
    startTime: "10:00",
    endTime: "19:00",
    commission: 30,
    bio: "Especialista em degradês modernos e desenhos.",
    rating: 4.8,
    totalCuts: 987,
  },
  {
    id: "3",
    name: "Lucas Oliveira",
    specialty: "Coloração & Química",
    workingDays: ["Seg", "Qua", "Sex", "Sáb"],
    startTime: "09:00",
    endTime: "17:00",
    commission: 35,
    bio: "Certificado em colorimetria e técnicas modernas.",
    rating: 4.7,
    totalCuts: 654,
  },
]

const STORAGE_KEY = "american_barber_barbers"

function getStoredBarbers(): Barber[] {
  if (typeof window === "undefined") return INITIAL_BARBERS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : INITIAL_BARBERS
  } catch {
    return INITIAL_BARBERS
  }
}

function saveBarbers(barbers: Barber[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(barbers))
}

const emptyBarber = (): Barber => ({
  id: Date.now().toString(),
  name: "",
  specialty: "",
  workingDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
  startTime: "09:00",
  endTime: "18:00",
  commission: 30,
  bio: "",
  rating: 5.0,
  totalCuts: 0,
})

export default function AdminBarbersPage() {
  const router = useRouter()
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const session =
      localStorage.getItem("american_barber_session") ||
      sessionStorage.getItem("american_barber_session")
    if (!session) { router.push("/login"); return }
    const parsed = JSON.parse(session)
    if (parsed.role !== "admin") { router.push(`/dashboard/${parsed.role}`); return }
    setBarbers(getStoredBarbers())
  }, [router])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const openAdd = () => {
    setEditingBarber(emptyBarber())
    setModalOpen(true)
  }

  const openEdit = (b: Barber) => {
    setEditingBarber({ ...b })
    setModalOpen(true)
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Excluir o barbeiro "${name}"? Esta ação não pode ser desfeita.`)) return
    const updated = barbers.filter(b => b.id !== id)
    setBarbers(updated)
    saveBarbers(updated)
    showToast(`Barbeiro "${name}" excluído.`)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBarber) return
    const exists = barbers.find(b => b.id === editingBarber.id)
    let updated: Barber[]
    if (exists) {
      updated = barbers.map(b => b.id === editingBarber.id ? editingBarber : b)
      showToast("Barbeiro atualizado com sucesso.")
    } else {
      updated = [...barbers, editingBarber]
      showToast("Barbeiro cadastrado com sucesso.")
    }
    setBarbers(updated)
    saveBarbers(updated)
    setModalOpen(false)
  }

  const toggleDay = (day: string) => {
    if (!editingBarber) return
    const has = editingBarber.workingDays.includes(day)
    setEditingBarber({
      ...editingBarber,
      workingDays: has
        ? editingBarber.workingDays.filter(d => d !== day)
        : [...editingBarber.workingDays, day],
    })
  }

  const filtered = barbers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Barbeiros" subtitle="Gestão da equipe de profissionais" type="admin" />

      <main className="p-6 space-y-6 max-w-6xl w-full mx-auto pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/dashboard/admin" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao painel
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar barbeiro..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-card border-border pl-9 text-xs h-9"
              />
            </div>
            <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 gap-1.5 shrink-0">
              <Plus className="h-4 w-4" /> Novo Barbeiro
            </Button>
          </div>
        </div>

        {toast && (
          <div className="bg-green-500/10 border border-green-500/25 text-green-400 p-3 rounded-lg text-xs font-semibold">
            {toast}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(b => (
            <Card key={b.id} className="bg-card border-border p-5 space-y-4 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold font-mono text-sm border border-primary/20">
                    {b.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.specialty}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(b)} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(b.id, b.name)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">Comissão</p>
                  <p className="text-sm font-bold text-primary font-mono">{b.commission}%</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">Cortes</p>
                  <p className="text-sm font-bold text-foreground font-mono">{b.totalCuts}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">Avaliação</p>
                  <p className="text-sm font-bold text-amber-400 font-mono">★ {b.rating}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1.5">Dias de Trabalho</p>
                <div className="flex gap-1 flex-wrap">
                  {DAYS.map(d => (
                    <span key={d} className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${b.workingDays.includes(d) ? "bg-primary/15 text-primary border border-primary/25" : "bg-muted/20 text-muted-foreground/40"}`}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <Clock className="h-3.5 w-3.5" />
                {b.startTime} – {b.endTime}
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
              Nenhum barbeiro encontrado.
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalOpen && editingBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg p-6 bg-card border-border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border/40 pb-3 mb-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                {barbers.find(b => b.id === editingBarber.id) ? "Editar Barbeiro" : "Novo Barbeiro"}
              </h3>
              <Button size="icon" variant="ghost" onClick={() => setModalOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Nome Completo</Label>
                  <Input value={editingBarber.name} onChange={e => setEditingBarber({ ...editingBarber, name: e.target.value })} className="bg-muted border-border text-xs h-9" required />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Especialidade</Label>
                  <Input value={editingBarber.specialty} onChange={e => setEditingBarber({ ...editingBarber, specialty: e.target.value })} className="bg-muted border-border text-xs h-9" required />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Início</Label>
                  <Input type="time" value={editingBarber.startTime} onChange={e => setEditingBarber({ ...editingBarber, startTime: e.target.value })} className="bg-muted border-border text-xs h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Término</Label>
                  <Input type="time" value={editingBarber.endTime} onChange={e => setEditingBarber({ ...editingBarber, endTime: e.target.value })} className="bg-muted border-border text-xs h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Comissão (%)</Label>
                  <Input type="number" min={0} max={100} value={editingBarber.commission} onChange={e => setEditingBarber({ ...editingBarber, commission: Number(e.target.value) })} className="bg-muted border-border text-xs h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Total de Cortes</Label>
                  <Input type="number" min={0} value={editingBarber.totalCuts} onChange={e => setEditingBarber({ ...editingBarber, totalCuts: Number(e.target.value) })} className="bg-muted border-border text-xs h-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Dias de Trabalho</Label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold border transition-colors ${editingBarber.workingDays.includes(d) ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-muted-foreground hover:border-primary/40"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Bio / Apresentação</Label>
                <textarea
                  value={editingBarber.bio}
                  onChange={e => setEditingBarber({ ...editingBarber, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 gap-1.5">
                <Save className="h-4 w-4" /> Salvar Barbeiro
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
