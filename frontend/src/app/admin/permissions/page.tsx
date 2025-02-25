import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

type Permission = {
  id: string
  name: string
  role: string
  status: "active" | "inactive"
  lastUpdated: string
}

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
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "destructive"}>
        {row.original.status === "active" ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: "Última actualización",
  },
]

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
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

