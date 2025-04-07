'use client'
import { useEffect, useState } from 'react'
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
import axios from '@/lib/axios'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0']

export default function Statistics() {
    interface Class {
        class_id: string
        plan: string
        students_count: number
    }

    interface Statistics {
        students_per_plan: Record<string, number>
        students_per_teacher: Record<string, number>
        students_per_class: {
            classes: Class[]
        }
    }

    const [statistics, setStatistics] = useState<Statistics>({
        students_per_plan: {},
        students_per_teacher: {},
        students_per_class: {
            classes: [],
        },
    })

    useEffect(() => {
        axios.get('/api/statistics').then(res => {
            setStatistics(res.data)
        })
    }, [])
    const trainingPlansData = Object.entries(statistics.students_per_plan).map(
        ([name, students]) => ({ name, students }),
    )
    const professorStudentData = Object.entries(
        statistics.students_per_teacher,
    ).map(([name, students]) => ({ name, students }))
    const classData =
        statistics.students_per_class?.classes?.map(c => ({
            name: `Clase ${c.class_id} (${c.plan})`,
            students: c.students_count,
        })) ?? []
    console.log('classData', statistics.students_per_class.classes)
    return (
        <div className="grid gap-4 md:grid-cols-3">
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
        </div>
    )
}
