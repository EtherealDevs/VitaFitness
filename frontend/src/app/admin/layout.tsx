import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "./providers/theme-provider"
import "./styles/admin.css"

const inter = Inter({ subsets: ["latin"] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`admin ${inter.className}`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </div>
  )
}

