'use client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Users, Calendar, DollarSign, Activity } from 'lucide-react'
interface DashboardMetricsProps {
    total_students: number
    total_classes: number
    total_income: number
}
export function DashboardMetrics({
    total_students,
    total_classes,
    total_income,
}: DashboardMetricsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Alumnos
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{total_students}</div>
                    <p className="text-xs text-muted-foreground">
                        +4 desde el último mes
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Clases Hoy
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{total_classes}</div>
                    <p className="text-xs text-muted-foreground">
                        3 más que ayer
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ingresos
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${total_income}</div>
                    <p className="text-xs text-muted-foreground">
                        +15% este mes
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Asistencia
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-xs text-muted-foreground">
                        +2% desde la semana pasada
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
