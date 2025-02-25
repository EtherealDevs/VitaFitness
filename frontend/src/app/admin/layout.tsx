import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "./providers/theme-provider"
import "./styles/admin.css"
import { DashboardHeader } from "./components/dashboard-header"
import { DashboardNav } from "./components/dashboard-nav"

const inter = Inter({ subsets: ["latin"] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`admin ${inter.className}`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative flex min-h-screen flex-col">
          <DashboardHeader />
          <div className="flex-1">
            <div className="container grid md:grid-cols-[200px_1fr] md:gap-6 md:py-6">
              <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                <DashboardNav />
              </aside>
              <main>{children}</main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}

