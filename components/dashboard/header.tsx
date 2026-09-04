"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { useState } from "react"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  type?: "customer" | "barber" | "admin"
}

export function DashboardHeader({ title, subtitle, type }: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-4 lg:px-6">
      {type && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 h-full bg-sidebar">
            <DashboardSidebar type={type} className="static h-full border-r-0 w-full" />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1">
        <h1 className="font-heading text-lg lg:text-xl tracking-wide text-foreground">{title.toUpperCase()}</h1>
        {subtitle && <p className="text-xs lg:text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <span className="hidden rounded-full border border-gold/20 bg-gold/10 px-3 py-1.5 text-xs text-gold sm:inline-flex">
        Dados demonstrativos
      </span>
    </header>
  )
}
