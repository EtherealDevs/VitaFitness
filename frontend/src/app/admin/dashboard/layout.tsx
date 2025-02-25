import type React from "react"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardNav } from "../components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
  )
}

