import { DataTable } from "../components/ui/data-table"
import { columns, type Student } from "./columns"
import { Button } from "../components/ui/button"
import { Plus } from "lucide-react"

// Asegúrate de que los datos coincidan con el tipo Student
const data: Student[] = [
  {
    id: "1",
    name: "Juan Pérez",
    status: "active",
    email: "juan@example.com",
    phone: "123-456-7890",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "María López",
    status: "pending",
    email: "maria@example.com",
    phone: "123-456-7891",
    joinDate: "2024-02-10",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    status: "inactive",
    email: "carlos@example.com",
    phone: "123-456-7892",
    joinDate: "2023-11-05",
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
        <DataTable columns={columns} data={data} filterColumn="name" filterPlaceholder="Filtrar alumnos..." />
      </div>
    </div>
  )
}

