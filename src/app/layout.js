import "./globals.css"
import { SidebarProvider } from "@/components/layout"
import { AuthProvider } from "@/hook/useAuth"
import { SocketProvider } from "@/providers/SocketProvider"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <SocketProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
