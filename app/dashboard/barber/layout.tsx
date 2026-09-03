import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function BarberDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar type="barber" className="hidden lg:block" />
      <main className="pl-0 lg:pl-64">
        {children}
      </main>
    </div>
  )
}

