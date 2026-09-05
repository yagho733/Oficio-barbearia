"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft, Plus, Search, Edit3, Trash2, X, Save,
  Clock, DollarSign, Tag, Image as ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard/header"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number // minutes
  category: string
}

const CATEGORIES = ["Corte", "Barba", "Tratamento", "Combo", "Coloração", "Outros"]

const INITIAL_SERVICES: Service[] = [
  { id: "1", name: "Corte Clássico", description: "Corte tradicional com acabamento perfeito.", price: 45, duration: 30, category: "Corte" },
  { id: "2", name: "Corte + Barba", description: "Combo completo de corte e aparação de barba.", price: 70, duration: 50, category: "Combo" },
  { id: "3", name: "Barba Completa", description: "Aparação, design e finalização da barba.", price: 35, duration: 25, category: "Barba" },
  { id: "4", name: "Degradê Moderno", description: "Corte degradê com acabamento de máquina.", price: 55, duration: 40, category: "Corte" },
  { id: "5", name: "Hidratação Capilar", description: "Tratamento profundo para os fios.", price: 60, duration: 45, category: "Tratamento" },
  { id: "6", name: "Coloração", description: "Coloração profissional com produtos premium.", price: 90, duration: 60, category: "Coloração" },
]

const STORAGE_KEY = "barbershop_demo_services"

function getStored(): Service[] {
  if (typeof window === "undefined") return INITIAL_SERVICES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : INITIAL_SERVICES
  } catch { return INITIAL_SERVICES }
}
function store(data: Service[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }

const empty = (): Service => ({
  id: Date.now().toString(),
  name: "",
  description: "",
  price: 0,
  duration: 30,
  category: "Corte",
})

export default function AdminServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todos")
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("barbershop_demo_session") || sessionStorage.getItem("barbershop_demo_session")
    if (!session) { router.push("/login"); return }
    const p = JSON.parse(session)
    if (p.role !== "admin") { router.push(`/dashboard/${p.role}`); return }
    setServices(getStored())
  }, [router])

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000) }

  const openAdd = () => { setEditing(empty()); setModal(true) }
  const openEdit = (s: Service) => { setEditing({ ...s }); setModal(true) }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Excluir o serviço "${name}"?`)) return
    const updated = services.filter(s => s.id !== id)
    setServices(updated); store(updated)
    showToast(`Serviço "${name}" excluído.`)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const exists = services.find(s => s.id === editing.id)
    const updated = exists ? services.map(s => s.id === editing.id ? editing : s) : [...services, editing]
    setServices(updated); store(updated)
    showToast(exists ? "Serviço atualizado." : "Serviço cadastrado.")
    setModal(false)
  }

  const cats = ["Todos", ...CATEGORIES]
  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === "Todos" || s.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Serviços" subtitle="Catálogo de serviços oferecidos" type="admin" />

      <main className="p-6 space-y-6 max-w-6xl w-full mx-auto pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/dashboard/admin" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao painel
          </Link>
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar serviço..." value={search} onChange={e => setSearch(e.target.value)} className="bg-card border-border pl-9 text-xs h-9" />
            </div>
            <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 gap-1.5 shrink-0">
              <Plus className="h-4 w-4" /> Novo Serviço
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-colors ${categoryFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/40"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {toast && (
          <div className="bg-green-500/10 border border-green-500/25 text-green-400 p-3 rounded-lg text-xs font-semibold">
            {toast}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <Card key={s.id} className="bg-card border-border p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-bold text-sm text-foreground">{s.name}</p>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border">
                      {s.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id, s.name)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>

              <div className="flex items-center gap-3 pt-1 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className="font-bold font-mono text-sm">R$ {s.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-mono text-xs">{s.duration} min</span>
                </div>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
              Nenhum serviço encontrado.
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 bg-card border-border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border/40 pb-3 mb-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                {services.find(s => s.id === editing.id) ? "Editar Serviço" : "Novo Serviço"}
              </h3>
              <Button size="icon" variant="ghost" onClick={() => setModal(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Nome do Serviço</Label>
                  <Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="bg-muted border-border text-xs h-9" required />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Descrição</Label>
                  <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Preço (R$)</Label>
                  <Input type="number" min={0} step={0.01} value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} className="bg-muted border-border text-xs h-9" required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Duração (min)</Label>
                  <Input type="number" min={5} step={5} value={editing.duration} onChange={e => setEditing({ ...editing, duration: Number(e.target.value) })} className="bg-muted border-border text-xs h-9" required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Categoria</Label>
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full bg-muted border border-border rounded-md px-3 text-xs h-9 text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 gap-1.5">
                <Save className="h-4 w-4" /> Salvar Serviço
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
