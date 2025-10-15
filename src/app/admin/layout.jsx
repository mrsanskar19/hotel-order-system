import { Sidebar } from "@/components/ui";
import { CartProvider } from "@/hook/useCart";
import { OrderProvider } from "@/hook/useOrder";
import { SocketProvider } from "@/providers/SocketProvider";

export default function AdminLayout({ children }) {
  const navlinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Hotels", href: "/admin/hotels" },
    { name: "Users", href: "/admin/users" },
    { name: "Settings", href: "/admin/settings" },
  ];

  return (
    <SocketProvider>
      <CartProvider>
        <OrderProvider>
          <Sidebar title="Admin Dashboard" navlinks={navlinks}>
            <div className="flex flex-col min-h-screen bg-background">
              <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                  <div className="mx-auto max-w-7xl">{children}</div>
                </main>
              </div>
            </div>
          </Sidebar>
        </OrderProvider>
      </CartProvider>
    </SocketProvider>
  );
}
