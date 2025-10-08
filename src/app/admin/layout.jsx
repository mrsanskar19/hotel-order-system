import { AppSidebar, DashboardHeader, BottomNav } from "@/components/layout"
import { CartProvider } from "@/hook/useCart"
import { OrderProvider } from "@/hook/useOrder"

export default function AdminLayout({ children }) {
  return (
    <CartProvider>
      <OrderProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <DashboardHeader />
          <div className="flex flex-1 overflow-hidden">
            {/* Desktop sidebar */}
            <div className="hidden lg:block">
              <AppSidebar />
            </div>
            {/* Main content with responsive design */}
            <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </div>
          {/* Mobile bottom navigation */}
          {/* <div className="lg:hidden">
            <BottomNav />
          </div> */}
        </div>
      </OrderProvider>
    </CartProvider>
  )
}
