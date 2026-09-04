"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Scissors, 
  Calendar, 
  History, 
  User, 
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  BarChart3,
  Package,
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  type: "customer" | "barber" | "admin"
  className?: string
}

const customerLinks = [
  { href: "/dashboard/customer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/booking", label: "Novo Agendamento", icon: Calendar },
  { href: "/dashboard/customer/appointments", label: "Meus Agendamentos", icon: Calendar },
  { href: "/dashboard/customer/history", label: "Histórico", icon: History },
  { href: "/dashboard/customer/profile", label: "Perfil", icon: User },
]

const barberLinks = [
  { href: "/dashboard/barber", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/barber/schedule", label: "Agenda", icon: Calendar },
  { href: "/dashboard/barber/clients", label: "Clientes", icon: Users },
  { href: "/dashboard/barber/history", label: "Histórico", icon: History },
  { href: "/dashboard/barber/billing", label: "Faturamento", icon: DollarSign },
  { href: "/dashboard/barber/profile", label: "Perfil", icon: User },
]

const adminLinks = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/appointments", label: "Agendamentos", icon: Calendar },
  { href: "/dashboard/admin/customers", label: "Clientes", icon: Users },
  { href: "/dashboard/admin/barbers", label: "Barbeiros", icon: User },
  { href: "/dashboard/admin/services", label: "Serviços", icon: Scissors },
  { href: "/dashboard/admin/financial", label: "Financeiro", icon: DollarSign },
  { href: "/dashboard/admin/analytics", label: "Relatórios", icon: BarChart3 },
  { href: "/dashboard/admin/settings", label: "Configurações", icon: Settings },
]

export function DashboardSidebar({ type, className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  
  const links = type === "customer" 
    ? customerLinks 
    : type === "barber" 
    ? barberLinks 
    : adminLinks

  const title = type === "customer" 
    ? "Cliente" 
    : type === "barber" 
    ? "Barbeiro" 
    : "Admin"

  const handleLogout = () => {
    localStorage.removeItem("american_barber_session")
    sessionStorage.removeItem("american_barber_session")
    router.push("/login")
  }

  return (
    <aside className={cn("fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar bg-card transition-all", className)}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="Logotipo American Barber"
              className="h-9 w-9 rounded-full object-contain filter drop-shadow-md" 
            />
            <div className="flex flex-col leading-none">
              <span className="font-heading text-sm tracking-wider text-foreground">AMERICAN</span>
              <span className="text-[9px] tracking-[0.15em] text-muted-foreground font-mono">BARBER</span>
            </div>
          </Link>
        </div>

        {/* Dashboard Type Badge */}
        <div className="px-6 py-4">
          <div className="bg-muted/40 border border-border rounded-lg px-3 py-2 text-left">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Painel</p>
            <p className="font-heading text-base tracking-wide text-foreground font-bold">{title.toUpperCase()}</p>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all text-left",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <link.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        <Separator className="bg-border" />

        {/* Footer */}
        <div className="p-4 space-y-2">
          {type === "customer" && (
            <Link href="/booking">
              <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground border-0 font-bold text-xs" size="sm">
                <Calendar className="mr-1.5 h-4 w-4" />
                Agendar Horário
              </Button>
            </Link>
          )}
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 justify-center font-bold text-xs" 
            size="sm"
          >
            <LogOut className="mr-1.5 h-4 w-4" />
            Trocar perfil
          </Button>
        </div>
      </div>
    </aside>
  )
}
