import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar type="admin" className="hidden lg:block" />
      <main className="pl-0 lg:pl-64">
        {children}
      </main>
    </div>
  )
}

