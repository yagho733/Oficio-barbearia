"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Users, Phone, Mail, ChevronLeft, Search, Calendar, 
  Trash2, Edit3, Award, DollarSign, Save, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard/header"
import { getStoredAppointments, Appointment } from "@/lib/data"
import { format, parseISO } from "date-fns"

interface CustomerAggregate {
  name: string
  email: string
  phone: string
  lastVisit: string
  cutsCount: number
  totalSpent: number
}

export default function AdminCustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<CustomerAggregate[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Edit Dialog simulation states
  const [isEditing, setIsEditing] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("american_barber_session") || sessionStorage.getItem("american_barber_session")
    if (!session) {
      router.push("/login")
      return
    }
    const parsed = JSON.parse(session)
    if (parsed.role !== "admin") {
      router.push(`/dashboard/${parsed.role}`)
      return
    }
    loadData()
  }, [router])

  const loadData = () => {
    const apps = getStoredAppointments()

    // Aggregate client statistics
    const customerMap: Record<string, { email: string; phone: string; visits: string[]; totalSpent: number }> = {}

    apps.forEach((app) => {
      const name = app.customerName
      const email = app.customerId || "cliente@email.com"
      const phone = app.customerPhone || "(53) 99999-9999"

      if (!customerMap[name]) {
        customerMap[name] = {
          email,
          phone,
          visits: [],
          totalSpent: 0
        }
      }

      customerMap[name].visits.push(app.date)
      if (app.status === "completed" || app.status === "confirmed") {
        customerMap[name].totalSpent += app.price
      }
    })

    const summaryList: CustomerAggregate[] = Object.entries(customerMap).map(([name, data]) => {
      const sortedVisits = [...data.visits].sort((a, b) => b.localeCompare(a))
      return {
        name,
        email: data.email,
        phone: data.phone,
        lastVisit: sortedVisits[0] || "N/A",
        cutsCount: data.visits.length,
        totalSpent: data.totalSpent
      }
    })

    setCustomers(summaryList)
  }

  const handleDelete = (name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o cliente '${name}' e todos os seus agendamentos?`)) return
    
    const apps = getStoredAppointments()
    const filtered = apps.filter(a => a.customerName !== name)
    localStorage.setItem("american_barber_appointments", JSON.stringify(filtered))
    loadData()
    showToast(`Cliente '${name}' excluído com sucesso.`)
  }

  const handleEditClick = (c: CustomerAggregate, idx: number) => {
    setEditingIndex(idx)
    setEditName(c.name)
    setEditEmail(c.email)
    setEditPhone(c.phone)
    setIsEditing(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingIndex === null) return

    const oldName = customers[editingIndex].name
    const apps = getStoredAppointments()
    
    // Update name and details in appointments history
    const updated = apps.map(app => {
      if (app.customerName === oldName) {
        return {
          ...app,
          customerName: editName,
          customerId: editEmail,
          customerPhone: editPhone
        }
      }
      return app
    })

    localStorage.setItem("american_barber_appointments", JSON.stringify(updated))
    setIsEditing(false)
    setEditingIndex(null)
    loadData()
    showToast("Dados do cliente atualizados com sucesso.")
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  )

  const formatarParaBr = (dateStr: string) => {
    if (dateStr === "N/A") return "Nunca"
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy")
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <DashboardHeader title="Gerenciamento de Clientes" subtitle="Cadastro e histórico dos clientes do SaaS" type="admin" />

      <main className="p-6 space-y-6 max-w-6xl w-full mx-auto pb-24 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/dashboard/admin" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar ao painel</span>
          </Link>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar cliente por nome, email ou tel..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border-border pl-9 text-xs h-9 w-full"
            />
          </div>
        </div>

        {toastMessage && (
          <div className="bg-green-500/10 border border-green-500/25 text-green-400 p-3 rounded-lg text-xs font-semibold animate-fade-in">
            {toastMessage}
          </div>
        )}

        {/* Clients Table */}
        <Card className="bg-card border-border overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                <th className="p-4">Nome</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">Última Visita</th>
                <th className="p-4">Cortes Realizados</th>
                <th className="p-4">Total Gasto</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Nenhum cliente cadastrado ou encontrado.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] font-mono">
                          {c.name.substring(0,2).toUpperCase()}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[11px]">{c.phone}</td>
                    <td className="p-4 text-muted-foreground">{c.email}</td>
                    <td className="p-4 font-mono text-[11px]">{formatarParaBr(c.lastVisit)}</td>
                    <td className="p-4 font-bold font-mono text-center sm:text-left pl-8">{c.cutsCount}</td>
                    <td className="p-4 font-bold font-mono text-emerald-400">R$ {c.totalSpent.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleEditClick(c, idx)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleDelete(c.name)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </main>

      {/* Edit modal popup */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 bg-card border-border shadow-2xl space-y-4 text-left animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-primary">Editar Cliente</h3>
              <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-bold text-muted-foreground uppercase">Nome</Label>
                <Input 
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-muted border-border text-xs h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-email" className="text-xs font-bold text-muted-foreground uppercase">E-mail</Label>
                <Input 
                  id="edit-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="bg-muted border-border text-xs h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-phone" className="text-xs font-bold text-muted-foreground uppercase">Telefone</Label>
                <Input 
                  id="edit-phone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="bg-muted border-border text-xs h-10"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-primary-foreground border-0 font-bold text-xs h-10 gap-1.5">
                <Save className="h-4 w-4" /> Salvar Alterações
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
