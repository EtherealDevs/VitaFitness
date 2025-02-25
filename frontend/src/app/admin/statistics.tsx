import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const attendanceData = [
  { name: "Lun", total: 45 },
  { name: "Mar", total: 42 },
  { name: "Mie", total: 48 },
  { name: "Jue", total: 38 },
  { name: "Vie", total: 35 },
  { name: "Sab", total: 30 },
]

const revenueData = [
  { name: "Ene", total: 1200 },
  { name: "Feb", total: 2400 },
  { name: "Mar", total: 3000 },
  { name: "Abr", total: 2800 },
  { name: "May", total: 3600 },
  { name: "Jun", total: 4200 },
]

export function Statistics() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Asistencia Semanal</CardTitle>
          <CardDescription>Número de alumnos por día de la semana</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ingresos Mensuales</CardTitle>
          <CardDescription>Total de ingresos por mes del año actual</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#0ea5e9" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

