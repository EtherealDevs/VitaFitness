"use client"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Plus, UserPlus, FileText, Settings } from "lucide-react"

const quickActions = [
  {
    title: "Nuevo Alumno",
    description: "Registrar alumnos en el sistema",
    icon: UserPlus,
    href: "/admin/students/new",
  },
  {
    title: "Nueva Clase",
    description: "Programar una nueva clase",
    icon: Plus,
    href: "/admin/classes/new",
  },
  {
    title: "Permisos",
    description: "Gestionar permisos de usuarios",
    icon: FileText,
    href: "/admin/permissions",
  },
  {
    title: "Configuración",
    description: "Ajustes del sistema",
    icon: Settings,
    href: "/admin/configuration",
  },
]

export function QuickAccess() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {quickActions.map((action) => {
        const Icon = action.icon
        return (
          <Card key={action.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {action.title}
              </CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full cursor-pointer bg-slate-900 hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-800" asChild>
                <a href={action.href}>Acceder</a>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

