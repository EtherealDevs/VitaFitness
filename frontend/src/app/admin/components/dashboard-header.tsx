"use client"

import Link from "next/link"
import { ModeToggle } from "./client/mode-toggle"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { DashboardNav } from "./dashboard-nav"
import Image from "next/image"

export function DashboardHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Image src="/logo.svg" width={12} height={12} alt="Logo" className="h-8 w-8" />
              <span className="text-lg font-semibold">Training App</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <DashboardNav />
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      {showMobileMenu && (
        <div className="fixed inset-0 top-14 z-40 bg-background md:hidden">
          <DashboardNav />
        </div>
      )}
    </>
  )
}

