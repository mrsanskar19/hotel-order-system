import { DashboardSidebar, DashboardBottomNav, DashboardHeader } from "@/components/layout";
import { OrderProvider } from "@/hook/useOrder"; 
import { AuthProvider } from "@/hook/useAuth"; 

export default function DashboardLayout({ children }) {
  return (
      <OrderProvider>
        <div className="flex flex-col h-screen">
          <DashboardHeader />
          <div className="flex flex-1">
            <DashboardSidebar />
            <main className="flex-grow p-4">{children}</main>
          </div>
          <DashboardBottomNav />
        </div>
      </OrderProvider>
  );
}
