"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authenticateDemo, demoAccounts, saveDemoSession } from "@/lib/demo-auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const account = authenticateDemo(email, password)
    if (!account) {
      setError("E-mail ou senha incorretos. Confira os dados e tente novamente.")
      return
    }

    setLoading(true)
    saveDemoSession(account)
    router.push(account.route)
  }

  const fillAccount = (index: number) => {
    const account = demoAccounts[index]
    setEmail(account.email)
    setPassword(account.password)
    setError("")
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-border pb-5">
          <Link href="/" aria-label="Voltar ao início"><Brand compact /></Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
        </header>

        <div className="grid min-h-[calc(100vh-7rem)] items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <section>
            <p className="eyebrow">Gestão da barbearia</p>
            <h1 className="mt-5 max-w-xl font-heading text-[clamp(2.8rem,9vw,5rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
              A agenda certa para cada função.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
              O proprietário acompanha o negócio inteiro. O barbeiro acessa somente sua rotina, clientes e disponibilidade.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
              <button type="button" onClick={() => fillAccount(0)} className="border border-border bg-card p-4 text-left transition-colors hover:border-primary">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Proprietário</span>
                <span className="mt-2 block text-sm font-medium">dono@barber.com</span>
                <span className="mt-1 block text-sm text-muted-foreground">Senha: dono123</span>
                <span className="mt-4 inline-flex items-center text-sm font-semibold">Preencher acesso <ArrowRight className="ml-2 h-4 w-4" /></span>
              </button>
              <button type="button" onClick={() => fillAccount(1)} className="border border-border bg-card p-4 text-left transition-colors hover:border-primary">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Barbeiro</span>
                <span className="mt-2 block text-sm font-medium">barbeiro@barber.com</span>
                <span className="mt-1 block text-sm text-muted-foreground">Senha: barbeiro123</span>
                <span className="mt-4 inline-flex items-center text-sm font-semibold">Preencher acesso <ArrowRight className="ml-2 h-4 w-4" /></span>
              </button>
            </div>
          </section>

          <section className="border border-border bg-card p-5 sm:p-8 lg:p-10" aria-labelledby="login-title">
            <div className="flex h-11 w-11 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h2 id="login-title" className="mt-6 font-heading text-3xl font-semibold tracking-[-0.035em]">Entrar no painel</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Use um dos acessos demonstrativos indicados ao lado.</p>

            <form onSubmit={submit} className="mt-7 space-y-5">
              <div>
                <Label htmlFor="login-email" className="text-sm">E-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite seu e-mail"
                  autoComplete="username"
                  className="mt-2 h-12 rounded-none bg-background px-4"
                  required
                />
              </div>

              <div>
                <Label htmlFor="login-password" className="text-sm">Senha</Label>
                <div className="relative mt-2">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    className="h-12 rounded-none bg-background px-4 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="border border-destructive/30 bg-destructive/10 p-3 text-sm leading-6 text-destructive" aria-live="polite">{error}</p>}

              <Button type="submit" disabled={loading} className="h-12 w-full rounded-none bg-primary text-base font-semibold text-primary-foreground">
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-7 border-t border-border pt-6 text-center">
              <p className="text-sm text-muted-foreground">Quer marcar um horário?</p>
              <Link href="/booking" className="mt-2 inline-flex items-center text-sm font-semibold text-primary hover:underline">
                Agendar sem fazer login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>

        <p className="pb-6 text-center text-xs leading-5 text-muted-foreground">
          Acessos públicos de demonstração. A versão comercial utiliza autenticação segura e senhas criptografadas.
        </p>
      </div>
    </main>
  )
}
