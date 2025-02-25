import { Button } from "../../components/ui/button"

export default function StudentProfile({ params }: { params: { id: string } }) {
  const student = {
    id: params.id,
    name: "Juan Pérez",
    status: "ACTIVO",
    statusCode: "AL-205",
    classes: [
      { name: "LBM", time: "10:00" },
      { name: "PILATES", time: "11:00" },
      { name: "FUNCIONAL", time: "12:00" },
      { name: "BICI", time: "13:00" },
    ],
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{student.name}</h1>
        <Button variant="destructive">Cancelar Plan</Button>
      </div>
      {/* ... resto del contenido ... */}
    </div>
  )
}

