"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getDemoSession, type DemoRole } from "@/lib/demo-auth"

export function DashboardAuthGuard({ role, children }: { role: DemoRole; children: React.ReactNode }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const session = getDemoSession()
    if (!session) {
      router.replace("/login")
      return
    }
    if (session.role !== role) {
      router.replace(`/dashboard/${session.role}`)
      return
    }
    setAuthorized(true)
  }, [role, router])

  if (!authorized) {
    return <div className="min-h-screen bg-background" aria-label="Verificando acesso" />
  }

  return children
}
