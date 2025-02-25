"use client"

import { DataTable } from "../components/ui/data-table"
import { Button } from "../components/ui/button"
import { Plus } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../components/ui/badge"

// Definimos el tipo Permission
type Permission = {
  id: string
  name: string
  role: string
  status: "active" | "inactive"
  lastUpdated: string
}

// Definimos las columnas con el tipo correcto
const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "role",
    header: "Rol",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "active" ? "success" : "destructive"}>
          {status === "active" ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Última Actualización",
  },
]

// Asegúrate de que los datos coincidan con el tipo Permission
const data: Permission[] = [
  {
    id: "1",
    name: "Crear usuarios",
    role: "Administrador",
    status: "active",
    lastUpdated: "2023-01-01",
  },
  {
    id: "2",
    name: "Editar usuarios",
    role: "Administrador",
    status: "inactive",
    lastUpdated: "2023-01-01",
  },
  {
    id: "3",
    name: "Eliminar usuarios",
    role: "Administrador",
    status: "active",
    lastUpdated: "2023-01-01",
  },
  {
    id: "4",
    name: "Ver reportes",
    role: "Supervisor",
    status: "active",
    lastUpdated: "2023-02-15",
  },
  {
    id: "5",
    name: "Gestionar clases",
    role: "Instructor",
    status: "active",
    lastUpdated: "2023-03-10",
  },
]

export default function PermissionsPage() {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Permisos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Permiso
        </Button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={data} filterColumn="name" filterPlaceholder="Filtrar permisos..." />
      </div>
    </div>
  )
}

