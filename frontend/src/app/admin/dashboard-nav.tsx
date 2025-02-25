"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, Users, FileText, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Alumnos", href: "/admin/students", icon: Users },
  { name: "Permisos", href: "/admin/permissions", icon: FileText },
  { name: "Estadísticas", href: "/admin/statistics", icon: BarChart2 },
  { name: "Configuración", href: "/admin/configuration", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1">
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("w-full justify-start gap-2", pathname === item.href && "bg-secondary")}
            asChild
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}

