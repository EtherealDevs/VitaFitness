'use client'

import { useEffect, useState } from 'react'
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react'
import {
    Bar,
    BarChart,
    Pie,
    PieChart as RechartsPieChart,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts'
import axios from '@/lib/axios'

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

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

export default function Statistics() {
    const [statistics, setStatistics] = useState<Statistics>({
        students_per_plan: {},
        students_per_teacher: {},
        students_per_class: {
            classes: [],
        },
    })
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        const fetchStatistics = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await axios.get('/api/statistics')
                if (isMounted) {
                    setStatistics(response.data)
                    setLoading(false)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar las estadísticas')
                    console.error(err)
                    setLoading(false)
                }
            }
        }

        fetchStatistics()

        return () => {
            isMounted = false
        }
    }, [])

    const trainingPlansData = Object.entries(statistics.students_per_plan).map(
        ([name, students]) => ({
            name,
            students,
        }),
    )

    const professorStudentData = Object.entries(
        statistics.students_per_teacher,
    ).map(([name, students]) => ({
        name,
        students,
    }))

    const classData =
        statistics.students_per_class?.classes?.map(c => ({
            name: `Clase ${c.class_id} (${c.plan})`,
            students: c.students_count,
        })) ?? []

    if (loading) {
        return (
            <div className="min-h-screen w-full p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen w-full p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="text-center text-red-500 dark:text-red-400 h-64 flex items-center justify-center">
                        <div>
                            <BarChart3 className="mx-auto mb-4 w-12 h-12" />
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full p-4">
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        Estadísticas
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Análisis y métricas del sistema de gestión estudiantil
                    </p>
                </div>

                {/* Statistics Grid */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                    {/* Distribución de Alumnos por Clase */}
                    <div className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Distribución por Clase
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Porcentaje de alumnos en cada materia
                            </p>
                        </div>
                        <div className="p-6">
                            {classData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPieChart>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'rgba(31, 33, 34, 0.9)',
                                                border: '1px solid rgba(107, 114, 128, 0.3)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                            }}
                                        />
                                        <Pie
                                            data={classData}
                                            dataKey="students"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ name, percent }) =>
                                                `${name}: ${(
                                                    percent * 100
                                                ).toFixed(0)}%`
                                            }
                                            labelLine={false}>
                                            {classData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                                    <div className="text-center">
                                        <PieChart className="mx-auto mb-2 w-8 h-8" />
                                        <p>No hay datos disponibles</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profesores y Estudiantes */}
                    <div className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Profesores y Estudiantes
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Comparación de estudiantes por profesor
                            </p>
                        </div>
                        <div className="p-6">
                            {professorStudentData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={professorStudentData}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#6b7280"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#6b7280"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'rgba(31, 33, 34, 0.9)',
                                                border: '1px solid rgba(107, 114, 128, 0.3)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                            }}
                                        />
                                        <Bar
                                            dataKey="students"
                                            fill="#8b5cf6"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                                    <div className="text-center">
                                        <Users className="mx-auto mb-2 w-8 h-8" />
                                        <p>No hay datos disponibles</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Planes de Entrenamiento */}
                    <div className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Planes de Entrenamiento
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Distribución de estudiantes en cada plan
                            </p>
                        </div>
                        <div className="p-6">
                            {trainingPlansData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart
                                        outerRadius={90}
                                        data={trainingPlansData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="name" />
                                        <PolarRadiusAxis />
                                        <Radar
                                            name="Estudiantes"
                                            dataKey="students"
                                            stroke="#8b5cf6"
                                            fill="#8b5cf6"
                                            fillOpacity={0.3}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'rgba(31, 33, 34, 0.9)',
                                                border: '1px solid rgba(107, 114, 128, 0.3)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                            }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                                    <div className="text-center">
                                        <TrendingUp className="mx-auto mb-2 w-8 h-8" />
                                        <p>No hay datos disponibles</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Estudiantes
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {Object.values(
                                        statistics.students_per_plan,
                                    ).reduce((a, b) => a + b, 0)}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>

                    <div className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Profesores
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {
                                        Object.keys(
                                            statistics.students_per_teacher,
                                        ).length
                                    }
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>

                    <div className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Clases
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {statistics.students_per_class?.classes
                                        ?.length || 0}
                                </p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
