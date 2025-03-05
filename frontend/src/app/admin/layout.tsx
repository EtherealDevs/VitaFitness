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
    <div className={`admin ${inter.className} min-h-screen bg-[#f8f9fa]`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative flex min-h-screen">
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-200 bg-white md:block">
            <div className="flex h-14 items-center border-b px-4">
              <img src="/placeholder.svg?height=32&width=32" alt="Logo" className="h-8 w-8" />
              <span className="ml-2 text-lg font-semibold">Training App</span>
            </div>
            <DashboardNav />
          </aside>

          {/* Main content */}
          <div className="flex-1 md:ml-64">
            <DashboardHeader />
            <main className="container p-4 md:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}

