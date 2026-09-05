export const DEMO_SESSION_KEY = "barbershop_demo_session"

export type DemoRole = "admin" | "barber"

export interface DemoSession {
  email: string
  name: string
  role: DemoRole
  barberId?: string
}

export const demoAccounts = [
  {
    email: "dono@barber.com",
    password: "dono123",
    name: "Proprietário",
    role: "admin" as const,
    route: "/dashboard/admin",
  },
  {
    email: "barbeiro@barber.com",
    password: "barbeiro123",
    name: "Rafael",
    role: "barber" as const,
    barberId: "1",
    route: "/dashboard/barber",
  },
] as const

export function authenticateDemo(email: string, password: string) {
  return demoAccounts.find(
    (account) => account.email === email.trim().toLowerCase() && account.password === password,
  ) ?? null
}

export function saveDemoSession(account: (typeof demoAccounts)[number]) {
  const session: DemoSession = {
    email: account.email,
    name: account.name,
    role: account.role,
    ...(account.role === "barber" ? { barberId: account.barberId } : {}),
  }
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session))
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(DEMO_SESSION_KEY) || sessionStorage.getItem(DEMO_SESSION_KEY)
  if (!stored) return null

  try {
    const session = JSON.parse(stored) as DemoSession
    const knownAccount = demoAccounts.find(
      (account) => account.email === session.email && account.role === session.role,
    )
    return knownAccount ? session : null
  } catch {
    return null
  }
}

export function clearDemoSession() {
  localStorage.removeItem(DEMO_SESSION_KEY)
  sessionStorage.removeItem(DEMO_SESSION_KEY)
}
