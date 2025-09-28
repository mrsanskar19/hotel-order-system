import { DashboardSidebar, DashboardBottomNav, DashboardHeader } from "@/components/layout"
import { OrderProvider } from "@/hook/useOrder"

export default function DashboardLayout({ children }) {
  return (
    <OrderProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <DashboardSidebar />
          </div>
          {/* Main content with responsive padding */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
        {/* Mobile bottom navigation */}
        <div className="lg:hidden">
          <DashboardBottomNav />
        </div>
      </div>
    </OrderProvider>
  )
}
