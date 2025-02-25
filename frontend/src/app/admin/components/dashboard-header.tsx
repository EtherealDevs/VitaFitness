import { DashboardNav } from "./dashboard-nav"
import { ModeToggle } from "./client/mode-toggle"
import Image from "next/image"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" width={12} height={12} alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-semibold">Training App</span>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <DashboardNav />
        </div>
      </div>
    </header>
  )
}