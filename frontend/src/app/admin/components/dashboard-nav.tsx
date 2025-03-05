"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, UserRound, FileText, BarChart2, CornerUpLeft, UserRoundPen } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"

const navigation = [
  { name: "Volver a la Pagina", href: "/", icon: CornerUpLeft },
  { name: "Inicio", href: "/admin/dashboard", icon: Home },
  { name: "Alumnos", href: "/admin/students", icon: UserRound },
  { name: "Profesores", href: "/admin/teachers", icon: UserRoundPen },
  { name: "Permisos", href: "/admin/permissions", icon: FileText },
  { name: "Estadísticas", href: "/admin/statistics", icon: BarChart2 },
  { name: "Configuración", href: "/admin/configuration", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  // Función para verificar si una ruta está activa, incluyendo subrutas
  const isActive = (href: string) => {
    if (href === "/admin/dashboard" && pathname === "/admin") {
      return true
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="grid gap-1 py-4">
      {navigation.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href)
        return (
          <Button
            key={item.href}
            variant={active ? "secondary" : "ghost"}
            className={cn("w-full justify-start gap-2", active && "bg-secondary")}
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

