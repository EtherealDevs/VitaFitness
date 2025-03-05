"use client"

import { UserNav } from "./user-nav"
import { Menu, Search } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { DashboardNav } from "./dashboard-nav"
import { Input } from "./ui/input"
import Image from "next/image"

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
              <Image src="/logo.svg" alt="Logo" className="h-8 w-8" />
              <span className="ml-2 text-lg font-semibold">Panel de Administracion</span>
            </div>
            <DashboardNav />
          </SheetContent>
        </Sheet>

        {/* Search bar */}
        <div className="flex flex-1 items-center md:ml-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input type="search" placeholder="Buscar..." className="w-full bg-gray-50 pl-8 dark:bg-gray-800" />
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <UserNav />
      </div>
    </header>
  )
}

