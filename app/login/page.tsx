"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Scissors, LogIn, UserPlus, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// --- Inner component that uses useSearchParams ---
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get("redirect")

  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)

  // Register Form States
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")

  useEffect(() => {
    // If there is already an active session, redirect them to the appropriate dashboard
    const savedSession = localStorage.getItem("american_barber_session") || sessionStorage.getItem("american_barber_session")
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession)
        if (redirectParam) {
          router.push(redirectParam)
        } else if (parsed.role === "admin") {
          router.push("/dashboard/admin")
        } else if (parsed.role === "barber") {
          router.push("/dashboard/barber")
        } else {
          router.push("/dashboard/customer")
        }
      } catch {
        localStorage.removeItem("american_barber_session")
      }
    }
  }, [router, redirectParam])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) return

    setIsLoading(true)
    setErrorMessage(null)

    // Simulate database lookup network latency
    await new Promise((resolve) => setTimeout(resolve, 800))

    let role: "customer" | "barber" | "admin" = "customer"
    const lowerEmail = loginEmail.toLowerCase()

    if (lowerEmail.includes("admin") || lowerEmail.includes("dono")) {
      role = "admin"
    } else if (lowerEmail.includes("barbeiro") || lowerEmail.includes("func")) {
      role = "barber"
    }

    const sessionData = {
      email: loginEmail,
      name: role === "admin" ? "Administrador Geral" : role === "barber" ? "Marcus Johnson" : "Cliente American Barber",
      role
    }

    if (rememberMe) {
      localStorage.setItem("american_barber_session", JSON.stringify(sessionData))
    } else {
      sessionStorage.setItem("american_barber_session", JSON.stringify(sessionData))
    }

    setIsLoading(false)

    // Routing rules
    if (redirectParam) {
      router.push(redirectParam)
    } else if (role === "admin") {
      router.push("/dashboard/admin")
    } else if (role === "barber") {
      router.push("/dashboard/barber")
    } else {
      router.push("/dashboard/customer")
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName || !regEmail || !regPhone || !regPassword || !regConfirmPassword) {
      setErrorMessage("Por favor, preencha todos os campos.")
      return
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("As senhas não coincidem.")
      return
    }

    if (regPassword.length < 6) {
      setErrorMessage("A senha deve ter no mínimo 6 caracteres.")
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    // Simulate API registration network latency
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Registrations default to 'customer'
    const sessionData = {
      email: regEmail,
      name: regName,
      phone: regPhone,
      role: "customer" as const
    }

    // Save session
    localStorage.setItem("american_barber_session", JSON.stringify(sessionData))

    // In a real app we would add this user to database profiles table
    // For now we persist their register details in localstorage to retrieve later
    const userProfile = {
      id: Math.random().toString(36).substring(2, 9),
      name: regName,
      email: regEmail,
      phone: regPhone,
      role: "customer"
    }
    const currentUsers = JSON.parse(localStorage.getItem("american_barber_users") || "[]")
    localStorage.setItem("american_barber_users", JSON.stringify([...currentUsers, userProfile]))

    setIsLoading(false)

    // Redirect to customer dashboard or requested booking
    if (redirectParam) {
      router.push(redirectParam)
    } else {
      router.push("/dashboard/customer")
    }
  }

  return (
    <Card className="w-full max-w-md p-8 border-border bg-card shadow-2xl space-y-6 relative z-10">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
          <Scissors className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          AMERICAN BARBER
        </h1>
        <p className="text-xs text-muted-foreground">
          Experiência premium de barbearia e agendamento inteligente
        </p>
      </div>

      {errorMessage && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center font-medium animate-in fade-in-50 duration-200">
          {errorMessage}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "login" | "register"); setErrorMessage(null); }} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6 bg-muted">
          <TabsTrigger value="login" className="text-xs font-semibold gap-1.5 py-2.5">
            <LogIn className="h-3.5 w-3.5" /> Entrar
          </TabsTrigger>
          <TabsTrigger value="register" className="text-xs font-semibold gap-1.5 py-2.5">
            <UserPlus className="h-3.5 w-3.5" /> Criar Conta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-bold text-muted-foreground uppercase">E-mail</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="exemplo@barber.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="h-10 bg-background border-border text-xs focus-visible:ring-primary"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="login-pass" className="text-xs font-bold text-muted-foreground uppercase">Senha</Label>
                <button type="button" className="text-[10px] text-primary hover:underline font-semibold">Esqueceu a senha?</button>
              </div>
              <div className="relative">
                <Input
                  id="login-pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="h-10 bg-background border-border text-xs focus-visible:ring-primary pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-background border-border text-primary focus:ring-0 accent-primary"
                  disabled={isLoading}
                />
                Manter sessão ativa neste dispositivo
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 font-bold text-xs h-10 mt-2 text-primary-foreground border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Autenticando...
                </>
              ) : "Entrar no Sistema"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name" className="text-xs font-bold text-muted-foreground uppercase">Nome Completo</Label>
              <Input
                id="reg-name"
                type="text"
                placeholder="Seu nome"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="h-10 bg-background border-border text-xs focus-visible:ring-primary"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-xs font-bold text-muted-foreground uppercase">E-mail</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="seu@email.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="h-10 bg-background border-border text-xs focus-visible:ring-primary"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-phone" className="text-xs font-bold text-muted-foreground uppercase">Telefone</Label>
              <Input
                id="reg-phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="h-10 bg-background border-border text-xs focus-visible:ring-primary"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-pass" className="text-xs font-bold text-muted-foreground uppercase">Senha</Label>
              <Input
                id="reg-pass"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="h-10 bg-background border-border text-xs focus-visible:ring-primary"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-confirm-pass" className="text-xs font-bold text-muted-foreground uppercase">Confirmar Senha</Label>
              <Input
                id="reg-confirm-pass"
                type="password"
                placeholder="Repita a senha"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                className="h-10 bg-background border-border text-xs focus-visible:ring-primary"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 font-bold text-xs h-10 mt-2 text-primary-foreground border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Registrando...
                </>
              ) : "Concluir Cadastro"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

// --- Page wrapper providing the required Suspense boundary ---
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <Suspense
        fallback={
          <Card className="w-full max-w-md p-8 border-border bg-card shadow-2xl flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </Card>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
