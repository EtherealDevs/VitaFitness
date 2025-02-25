import type React from "react"
import { ThemeProvider } from "./components/client/theme-provider"
import "./styles/admin.css"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin">
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  )
}

