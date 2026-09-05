import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardAuthGuard } from "@/components/dashboard/auth-guard"

export default function BarberDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardAuthGuard role="barber">
      <div className="min-h-screen bg-background">
        <DashboardSidebar type="barber" className="hidden lg:block" />
        <main className="pl-0 lg:pl-64">{children}</main>
      </div>
    </DashboardAuthGuard>
  )
}
