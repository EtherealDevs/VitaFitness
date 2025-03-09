'use client';
import { DataTable } from "../components/ui/data-table"
import { columns, type Student } from "./columns"
import { Button } from "../components/ui/button"
import { Plus } from "lucide-react"
import { useStudents } from "@/hooks/students"
import { useEffect, useState } from "react"

// Asegúrate de que los datos coincidan con el tipo Student

export default function StudentsPage() {
  const [students, setStudents] = useState<any>([])
  const { getStudents } = useStudents() // Recuperar los alumnos desde el hook

  const fetchData = async () => {
    try {
        const response = await getStudents()
        setStudents(response.students)
    } catch (error) {
        console.error(error)
        throw error
    }
}

  useEffect(() => {
    fetchData() // Llamar al hook para obtener los alumnos
  }, [])
  const data: Student[] = students;
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

