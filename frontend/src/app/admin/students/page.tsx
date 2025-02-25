import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const data = [
  {
    id: "1",
    name: "Juan Pérez",
    status: "active",
    email: "juan@example.com",
    phone: "123-456-7890",
    joinDate: "2024-01-15",
  },
]

export default function StudentsPage() {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alumnos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Alumno
        </Button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

