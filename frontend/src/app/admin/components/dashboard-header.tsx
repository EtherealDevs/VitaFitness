"use client"

import { UserNav } from "./user-nav"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { DashboardNav } from "./dashboard-nav"
import { ModeToggle } from "./client/mode-toggle"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center border-b bg-white px-4 dark:bg-gray-900">
      <div className="flex flex-1 items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-14 items-center border-b px-4">
              <img src="/placeholder.svg?height=32&width=32" alt="Logo" className="h-8 w-8" />
              <span className="ml-2 text-lg font-semibold">Training App</span>
            </div>
            <DashboardNav />
          </SheetContent>
        </Sheet>

        {/* Logo y nombre de la aplicación */}
        <div className="hidden md:flex md:items-center">
          <img src="/placeholder.svg?height=32&width=32" alt="Logo" className="h-8 w-8" />
          <span className="ml-2 text-lg font-semibold">Training App</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Botón de cambio de tema */}
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  )
}

