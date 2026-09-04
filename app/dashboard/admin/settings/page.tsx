"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft, Save, Store, Phone, MapPin, AtSign,
  MessageCircle, Clock, Calendar, Palette, Globe, CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard/header"

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

interface BarbershopSettings {
  name: string
  tagline: string
  phone: string
  whatsapp: string
  instagram: string
  website: string
  address: string
  city: string
  state: string
  zipcode: string
  openDays: string[]
  openTime: string
  closeTime: string
  lunchStart: string
  lunchEnd: string
  slotInterval: number
  primaryColor: string
  accentColor: string
  currency: string
  timezone: string
}

const DEFAULT_SETTINGS: BarbershopSettings = {
  name: "Sua Barbearia",
  tagline: "Atendimento, estilo e praticidade",
  phone: "(53) 99999-0000",
  whatsapp: "5553999990000",
  instagram: "suabarbearia",
  website: "https://suabarbearia.com.br",
  address: "Endereço da barbearia",
  city: "Pelotas",
  state: "RS",
  zipcode: "96200-000",
  openDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  openTime: "09:00",
  closeTime: "19:00",
  lunchStart: "12:00",
  lunchEnd: "13:00",
  slotInterval: 30,
  primaryColor: "#c8a97e",
  accentColor: "#8b6914",
  currency: "BRL",
  timezone: "America/Sao_Paulo",
}

const SETTINGS_KEY = "barbershop_demo_settings"

function getSettings(): BarbershopSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch { return DEFAULT_SETTINGS }
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<BarbershopSettings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState("Geral")

  useEffect(() => {
    const session = localStorage.getItem("barbershop_demo_session") || sessionStorage.getItem("barbershop_demo_session")
    if (!session) { router.push("/login"); return }
    const p = JSON.parse(session)
    if (p.role !== "admin") { router.push(`/dashboard/${p.role}`); return }
    setSettings(getSettings())
  }, [router])

  const set = (key: keyof BarbershopSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const toggleDay = (day: string) => {
    const has = settings.openDays.includes(day)
    set("openDays", has ? settings.openDays.filter(d => d !== day) : [...settings.openDays, day])
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const SECTIONS = ["Geral", "Contato", "Funcionamento", "Aparência"]

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold uppercase text-muted-foreground font-mono">{label}</Label>
      {children}
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Configurações" subtitle="Personalize os dados e operação da barbearia" type="admin" />

      <main className="p-6 space-y-6 max-w-5xl w-full mx-auto pb-24">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/admin" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao painel
          </Link>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 p-3 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Configurações salvas com sucesso!
          </div>
        )}

        {/* Section tabs */}
        <div className="flex gap-2 border-b border-border pb-0">
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`pb-3 px-1 text-xs font-mono font-bold border-b-2 transition-colors ${activeSection === s ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* ---- GERAL ---- */}
          {activeSection === "Geral" && (
            <Card className="bg-card border-border p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <Store className="h-4 w-4 text-primary" />
                <p className="text-xs font-mono font-bold uppercase text-muted-foreground">Dados da Barbearia</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nome da Barbearia">
                  <Input value={settings.name} onChange={e => set("name", e.target.value)} className="bg-muted border-border text-xs h-9" required />
                </Field>
                <Field label="Slogan / Tagline">
                  <Input value={settings.tagline} onChange={e => set("tagline", e.target.value)} className="bg-muted border-border text-xs h-9" />
                </Field>
                <Field label="Fuso Horário">
                  <select value={settings.timezone} onChange={e => set("timezone", e.target.value)} className="w-full bg-muted border border-border rounded-md px-3 h-9 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
                    <option value="America/Fortaleza">América/Fortaleza (GMT-3)</option>
                    <option value="America/Manaus">América/Manaus (GMT-4)</option>
                    <option value="America/Belem">América/Belém (GMT-3)</option>
                  </select>
                </Field>
                <Field label="Intervalo de Agendamento (min)">
                  <select value={settings.slotInterval} onChange={e => set("slotInterval", Number(e.target.value))} className="w-full bg-muted border border-border rounded-md px-3 h-9 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    {[15, 20, 30, 45, 60].map(v => <option key={v} value={v}>{v} minutos</option>)}
                  </select>
                </Field>
              </div>
            </Card>
          )}

          {/* ---- CONTATO ---- */}
          {activeSection === "Contato" && (
            <Card className="bg-card border-border p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <Phone className="h-4 w-4 text-primary" />
                <p className="text-xs font-mono font-bold uppercase text-muted-foreground">Contato & Redes Sociais</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Telefone">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={settings.phone} onChange={e => set("phone", e.target.value)} className="bg-muted border-border text-xs h-9 pl-9" />
                  </div>
                </Field>
                <Field label="WhatsApp (com DDI e DDD)">
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={settings.whatsapp} onChange={e => set("whatsapp", e.target.value)} className="bg-muted border-border text-xs h-9 pl-9" placeholder="5511999999999" />
                  </div>
                </Field>
                <Field label="Instagram (sem @)">
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={settings.instagram} onChange={e => set("instagram", e.target.value)} className="bg-muted border-border text-xs h-9 pl-9" />
                  </div>
                </Field>
                <Field label="Website">
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={settings.website} onChange={e => set("website", e.target.value)} className="bg-muted border-border text-xs h-9 pl-9" />
                  </div>
                </Field>
                <Field label="Endereço">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={settings.address} onChange={e => set("address", e.target.value)} className="bg-muted border-border text-xs h-9 pl-9" />
                  </div>
                </Field>
                <Field label="Cidade">
                  <Input value={settings.city} onChange={e => set("city", e.target.value)} className="bg-muted border-border text-xs h-9" />
                </Field>
                <Field label="Estado">
                  <Input value={settings.state} onChange={e => set("state", e.target.value)} className="bg-muted border-border text-xs h-9" maxLength={2} />
                </Field>
                <Field label="CEP">
                  <Input value={settings.zipcode} onChange={e => set("zipcode", e.target.value)} className="bg-muted border-border text-xs h-9" />
                </Field>
              </div>
            </Card>
          )}

          {/* ---- FUNCIONAMENTO ---- */}
          {activeSection === "Funcionamento" && (
            <Card className="bg-card border-border p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-xs font-mono font-bold uppercase text-muted-foreground">Horários de Funcionamento</p>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase text-muted-foreground font-mono mb-3 block">Dias de Funcionamento</Label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-colors ${settings.openDays.includes(d) ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-muted-foreground hover:border-primary/40"}`}
                    >
                      {d.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Field label="Abertura">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input type="time" value={settings.openTime} onChange={e => set("openTime", e.target.value)} className="bg-muted border-border text-xs h-9 pl-9" />
                  </div>
                </Field>
                <Field label="Fechamento">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input type="time" value={settings.closeTime} onChange={e => set("closeTime", e.target.value)} className="bg-muted border-border text-xs h-9 pl-9" />
                  </div>
                </Field>
                <Field label="Almoço Início">
                  <Input type="time" value={settings.lunchStart} onChange={e => set("lunchStart", e.target.value)} className="bg-muted border-border text-xs h-9" />
                </Field>
                <Field label="Almoço Fim">
                  <Input type="time" value={settings.lunchEnd} onChange={e => set("lunchEnd", e.target.value)} className="bg-muted border-border text-xs h-9" />
                </Field>
              </div>
            </Card>
          )}

          {/* ---- APARÊNCIA ---- */}
          {activeSection === "Aparência" && (
            <Card className="bg-card border-border p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <Palette className="h-4 w-4 text-primary" />
                <p className="text-xs font-mono font-bold uppercase text-muted-foreground">Identidade Visual</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground font-mono">Cor Primária</Label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={settings.primaryColor} onChange={e => set("primaryColor", e.target.value)} className="h-10 w-14 rounded-lg border border-border bg-muted cursor-pointer" />
                    <Input value={settings.primaryColor} onChange={e => set("primaryColor", e.target.value)} className="bg-muted border-border text-xs h-9 font-mono" />
                  </div>
                  <div className="h-8 rounded-lg transition-colors" style={{ backgroundColor: settings.primaryColor }} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground font-mono">Cor de Destaque</Label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={settings.accentColor} onChange={e => set("accentColor", e.target.value)} className="h-10 w-14 rounded-lg border border-border bg-muted cursor-pointer" />
                    <Input value={settings.accentColor} onChange={e => set("accentColor", e.target.value)} className="bg-muted border-border text-xs h-9 font-mono" />
                  </div>
                  <div className="h-8 rounded-lg transition-colors" style={{ backgroundColor: settings.accentColor }} />
                </div>
              </div>
              <div className="bg-muted/30 border border-border rounded-xl p-4 text-xs text-muted-foreground">
                <strong className="text-foreground">Nota:</strong> A personalização completa de cores está disponível com a integração ao backend (variáveis CSS dinâmicas via banco de dados). As cores configuradas acima serão sincronizadas na versão com Supabase.
              </div>
            </Card>
          )}

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 gap-1.5 px-6">
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
