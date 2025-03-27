'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../components/ui/card'
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    Pie,
    PieChart,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
} from 'recharts'

const attendanceData = [
    { name: 'Lun', total: 45 },
    { name: 'Mar', total: 42 },
    { name: 'Mie', total: 48 },
    { name: 'Jue', total: 38 },
    { name: 'Vie', total: 35 },
    { name: 'Sab', total: 30 },
]

const revenueData = [
    { name: 'Ene', total: 1200 },
    { name: 'Feb', total: 2400 },
    { name: 'Mar', total: 3000 },
    { name: 'Abr', total: 2800 },
    { name: 'May', total: 3600 },
    { name: 'Jun', total: 4200 },
]

const classData = [
    { name: 'Matemáticas', students: 25 },
    { name: 'Historia', students: 18 },
    { name: 'Ciencias', students: 22 },
    { name: 'Inglés', students: 20 },
    { name: 'Arte', students: 15 },
]

const professorStudentData = [
    { name: 'Profesor A', students: 30 },
    { name: 'Profesor B', students: 40 },
    { name: 'Profesor C', students: 25 },
    { name: 'Profesor D', students: 35 },
]

const classScheduleData = [
    {
        time: '08:00',
        Monday: 2,
        Tuesday: 1,
        Wednesday: 2,
        Thursday: 3,
        Friday: 1,
    },
    {
        time: '10:00',
        Monday: 3,
        Tuesday: 2,
        Wednesday: 1,
        Thursday: 1,
        Friday: 4,
    },
    {
        time: '12:00',
        Monday: 1,
        Tuesday: 4,
        Wednesday: 2,
        Thursday: 3,
        Friday: 2,
    },
]

const trainingPlansData = [
    { name: 'Plan A', students: 15 },
    { name: 'Plan B', students: 20 },
    { name: 'Plan C', students: 30 },
]

const paymentsData = [
    { date: '2023-01-15', amount: 500 },
    { date: '2023-02-10', amount: 600 },
    { date: '2023-03-05', amount: 550 },
    { date: '2023-04-01', amount: 700 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0']

export default function Statistics() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Gráfico de Asistencia Semanal */}
            <Card>
                <CardHeader>
                    <CardTitle>Asistencia Semanal</CardTitle>
                    <CardDescription>
                        Número de alumnos por día de la semana
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={attendanceData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="total"
                                fill="#0ea5e9"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Gráfico de Ingresos Mensuales */}
            <Card>
                <CardHeader>
                    <CardTitle>Ingresos Mensuales</CardTitle>
                    <CardDescription>
                        Total de ingresos por mes del año actual
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#0ea5e9"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Gráfico de Distribución de Alumnos por Clase */}
            <Card>
                <CardHeader>
                    <CardTitle>Distribución de Alumnos por Clase</CardTitle>
                    <CardDescription>
                        Porcentaje de alumnos en cada materia
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Tooltip />
                            <Pie
                                data={classData}
                                dataKey="students"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label>
                                {classData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Gráfico de Profesores y Estudiantes */}
            <Card>
                <CardHeader>
                    <CardTitle>Profesores y Estudiantes</CardTitle>
                    <CardDescription>
                        Comparación de estudiantes por profesor
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={professorStudentData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="students"
                                fill="#0088FE"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Gráfico de Horarios y Días de Clases */}
            <Card>
                <CardHeader>
                    <CardTitle>Horarios y Días de Clases</CardTitle>
                    <CardDescription>
                        Distribución de clases por día y hora
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={classScheduleData}>
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="Monday" fill="#0088FE" />
                            <Bar dataKey="Tuesday" fill="#00C49F" />
                            <Bar dataKey="Wednesday" fill="#FFBB28" />
                            <Bar dataKey="Thursday" fill="#FF8042" />
                            <Bar dataKey="Friday" fill="#A020F0" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Gráfico de Planes de Entrenamiento */}
            <Card>
                <CardHeader>
                    <CardTitle>Planes de Entrenamiento</CardTitle>
                    <CardDescription>
                        Distribución de estudiantes en cada plan de
                        entrenamiento
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart
                            outerRadius={90}
                            width={730}
                            height={250}
                            data={trainingPlansData}>
                            <Radar
                                name="Estudiantes"
                                dataKey="students"
                                stroke="#0ea5e9"
                                fill="#0ea5e9"
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Gráfico de Pagos y Deudas */}
            <Card>
                <CardHeader>
                    <CardTitle>Pagos y Deudas</CardTitle>
                    <CardDescription>
                        Historial de pagos y montos recibidos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={paymentsData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#0ea5e9"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
