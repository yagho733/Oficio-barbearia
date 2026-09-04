"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, BriefcaseBusiness, Loader2, Scissors, ShieldCheck, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const profiles = [
  {
    role: "customer",
    name: "Cliente demonstração",
    title: "Área do cliente",
    text: "Acompanhe horários, histórico e informações do perfil.",
    icon: UserRound,
    route: "/dashboard/customer",
  },
  {
    role: "barber",
    name: "Rafael Costa",
    title: "Área do profissional",
    text: "Veja a agenda, clientes, histórico e resumo de atendimentos.",
    icon: Scissors,
    route: "/dashboard/barber",
  },
  {
    role: "admin",
    name: "Administrador",
    title: "Gestão da barbearia",
    text: "Explore agenda, equipe, serviços, clientes e indicadores.",
    icon: BriefcaseBusiness,
    route: "/dashboard/admin",
  },
] as const

export default function LoginPage() {
  const router = useRouter()
  const [loadingRole, setLoadingRole] = useState<string | null>(null)

  const enterDemo = (profile: (typeof profiles)[number]) => {
    setLoadingRole(profile.role)
    localStorage.setItem("barbershop_demo_session", JSON.stringify({
      email: profile.role + "@demonstracao.local",
      name: profile.name,
      role: profile.role,
    }))
    router.push(profile.route)
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>

        <div className="mx-auto mt-12 max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/25 bg-primary/12 text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-gold">Ambiente de demonstração</p>
          <h1 className="display-title mt-3 text-[clamp(2.8rem,10vw,4.5rem)]">EXPLORE A GESTÃO COMPLETA</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Escolha um perfil para conhecer as telas disponíveis. Nenhuma conta ou senha real é necessária.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {profiles.map((profile) => {
            const Icon = profile.icon
            const loading = loadingRole === profile.role
            return (
              <Card key={profile.role} className="flex h-full flex-col border-white/10 bg-card/75 p-6 transition-all hover:-translate-y-1 hover:border-primary/45">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-6 font-heading text-2xl tracking-wide">{profile.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{profile.text}</p>
                <Button onClick={() => enterDemo(profile)} disabled={loadingRole !== null} className="gradient-primary mt-7 h-11 w-full border-0 text-primary-foreground">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Acessar demonstração
                </Button>
              </Card>
            )
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Os dados exibidos nos painéis são fictícios e existem apenas para demonstrar as funcionalidades.
        </p>
      </div>
    </main>
  )
}
