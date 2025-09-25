import "./globals.css";
import { SidebarProvider } from "@/components/layout"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
        {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
