'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card'
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

interface attendanceData {
    name: string
    total: number
}
interface revenueData {
    name: string
    total: number
}
interface StatisticsProps {
    attendanceData: attendanceData[]
    revenueData: revenueData[]
}
export function Statistics({ attendanceData, revenueData }: StatisticsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
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
        </div>
    )
}
