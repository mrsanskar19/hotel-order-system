import "./globals.css";
import { SidebarProvider } from "@/components/layout" 
import { AuthProvider } from "@/hook/useAuth"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
