import { AppSidebar, DashboardHeader, BottomNav } from "@/components/layout";
import { CartProvider } from "@/hook/useCart";
import { OrderProvider } from "@/hook/useOrder";

export default function AdminLayout({ children }) {
  return (
    <CartProvider>
      <OrderProvider>
        <div className="flex flex-col h-screen">
          <DashboardHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <main className="flex-grow p-4">{children}</main>
          </div>
          <BottomNav />
        </div>
      </OrderProvider>
    </CartProvider>
  );
}
