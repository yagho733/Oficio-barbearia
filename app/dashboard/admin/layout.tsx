import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardAuthGuard } from "@/components/dashboard/auth-guard"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardAuthGuard role="admin">
      <div className="min-h-screen bg-background">
        <DashboardSidebar type="admin" className="hidden lg:block" />
        <main className="pl-0 lg:pl-64">{children}</main>
      </div>
    </DashboardAuthGuard>
  )
}
