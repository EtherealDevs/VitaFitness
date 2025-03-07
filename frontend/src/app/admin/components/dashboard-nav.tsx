"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, Users, FileText, BarChart2, BookOpen, Calendar, CreditCard } from "lucide-react"
import { cn } from "../lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Alumnos", href: "/admin/students", icon: Users },
  { name: "Profesores", href: "/admin/teachers", icon: BookOpen },
  { name: "Calendario", href: "/admin/calendar", icon: Calendar },
  { name: "Pagos", href: "/admin/payments", icon: CreditCard },
  { name: "Permisos", href: "/admin/permissions", icon: FileText },
  { name: "Estadísticas", href: "/admin/statistics", icon: BarChart2 },
  { name: "Configuración", href: "/admin/configuration", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 p-4">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-foreground/60 hover:bg-accent/50 hover:text-accent-foreground",
            )}
          >
            <Icon
              className={cn(
                "mr-3 h-5 w-5",
                isActive ? "text-accent-foreground" : "text-foreground/60 group-hover:text-accent-foreground",
              )}
            />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

