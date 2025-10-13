import { Sidebar } from "@/components/ui"
import { CartProvider } from "@/hook/useCart"
import { OrderProvider } from "@/hook/useOrder"

export default function AdminLayout({ children }) {
  const navlinks = []
  return (
    <CartProvider>
      <OrderProvider>
        <Sidebar title="Admin Dashboard" navlinks={navlinks}>
        <div className="flex flex-col min-h-screen bg-background">
          <div className="flex flex-1 overflow-hidden">
            {/* Desktop sidebar */}
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
        </Sidebar>
      </OrderProvider>
    </CartProvider>
  )
}
