'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Search,
    ChevronDown,
    ChevronUp,
    User,
    Calendar,
    Phone,
    Plus,
    Edit2,
    Trash2,
    Clock,
    BookOpen,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/admin/components/ui/button'
import { useTeachers } from '@/hooks/teachers'

// Types for our student data
interface Teacher {
    id: string
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
    schedules: Schedule[]
    originalScheduleData: ScheduleData[] // Datos originales del servidor
    classes: Class[]
    created_at: string
    updated_at: string
}
interface Schedule {
    schedule_id: string
    days: string[]
    timeslots: Timeslot[]
}
interface ScheduleData {
    schedule_id: string
    schedule_days: string[]
    timeslot_id: string
    timeslot_hour: string
}
interface Timeslot {
    id: string
    hour: string
}
interface Class {
    class_id: string
    plan: [plan_id: string, name: string]
}

// Interface for teacher data as it comes from the server
interface TeacherFromServer {
    id: string
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
    schedules: ScheduleData[] // Raw schedule data from server
    classes: Class[]
    created_at: string
    updated_at: string
}

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

// Helper function to get day name in Spanish
const getDayName = (day: string) => {
    const dayNames: { [key: string]: string } = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    }
    return dayNames[day.toLowerCase()] || day
}

export default function TeacherIndex() {
    const router = useRouter()
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Teacher
        direction: 'asc' | 'desc'
    } | null>(null)
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
    const [showDetails, setShowDetails] = useState<boolean>(false)

    const { getTeachers, deleteTeacher } = useTeachers()

    // Toggle details view for mobile
    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const fetchTeachers = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await getTeachers()

            const processedTeachers = response.teachers.map(
                (teacher: TeacherFromServer) => {
                    const schedules: Schedule[] = []
                    teacher.last_name = capitalize(teacher.last_name)

                    // Guardar los datos originales
                    const originalScheduleData: ScheduleData[] =
                        teacher.schedules || []

                    // Procesar los datos originales para crear Schedule[]
                    originalScheduleData.forEach(
                        (scheduleData: ScheduleData) => {
                            let newSchedule = schedules.find(
                                s => s.schedule_id === scheduleData.schedule_id,
                            )
                            if (newSchedule === undefined) {
                                newSchedule = {
                                    schedule_id: scheduleData.schedule_id,
                                    days: scheduleData.schedule_days,
                                    timeslots: [],
                                }
                                schedules.push(newSchedule)
                            }
                            const newTimeslot: Timeslot = {
                                id: scheduleData.timeslot_id,
                                hour: scheduleData.timeslot_hour,
                            }
                            newSchedule?.timeslots.push(newTimeslot)
                        },
                    )

                    return {
                        ...teacher,
                        schedules, // Schedule[] procesados
                        originalScheduleData, // ScheduleData[] originales
                    }
                },
            )
            setTeachers(processedTeachers)
        } catch (err) {
            setError('Error al cargar los datos de profes')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [getTeachers])

    // Fetch teacher data
    useEffect(() => {
        let isMounted = true

        const safeFetch = async () => {
            if (isMounted) await fetchTeachers()
        }

        safeFetch()

        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false
        }
    }, [fetchTeachers])

    // Handle sorting
    const handleSort = (key: keyof Teacher) => {
        let direction: 'asc' | 'desc' = 'asc'

        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'asc'
        ) {
            direction = 'desc'
        }

        setSortConfig({ key, direction })
    }

    // Handle student selection
    const handleTeacherClick = (teacher: Teacher) => {
        if (selectedTeacher?.id === teacher.id) {
            setSelectedTeacher(null) // Deselect if clicking the same teacher
        } else {
            setSelectedTeacher(teacher) // Select the clicked student
        }
    }

    // Handle teacher deletion
    const handleDeleteTeacher = async (id: string) => {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar este profe?',
        )
        if (!confirmDelete) return

        try {
            await deleteTeacher(id)
            alert('Profe eliminado correctamente')
            setSelectedTeacher(prev => (prev?.id === id ? null : prev))
            setTeachers(prev => prev.filter(teacher => teacher.id !== id))
            // Re-fetch the latest teacher list
            await fetchTeachers()
        } catch (error) {
            console.error('Error al eliminar el profe:', error)
            alert('No se pudo eliminar el profe')
        }
    }

    // Apply sorting and filtering
    const filteredAndSortedTeachers = [...teachers]
        .filter(
            teacher =>
                teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.last_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (teacher.dni &&
                    teacher.dni
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())),
        )
        .sort((a, b) => {
            if (!sortConfig) return 0

            const { key, direction } = sortConfig

            // Use type assertion to tell TypeScript that these properties exist
            const aValue = a[key] as string | number | boolean
            const bValue = b[key] as string | number | boolean

            if (aValue < bValue) return direction === 'asc' ? -1 : 1
            if (aValue > bValue) return direction === 'asc' ? 1 : -1
            return 0
        })

    // Function to render quick overview of classes and schedules
    const renderQuickClassOverview = (teacher: Teacher) => {
        if (!teacher.classes || teacher.classes.length === 0) {
            return (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Sin clases asignadas
                </div>
            )
        }

        return (
            <div className="space-y-3">
                {teacher.classes.map(classItem => (
                    <div
                        key={classItem.class_id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <h6 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                {classItem.plan[1] || 'Plan sin nombre'}
                            </h6>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                            {teacher.schedules.length > 0 ? (
                                teacher.schedules.map(schedule => (
                                    <div
                                        key={schedule.schedule_id}
                                        className="flex flex-wrap gap-1">
                                        {schedule.days.map(day => (
                                            <span
                                                key={day}
                                                className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                                                {getDayName(day)}
                                            </span>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <span>Sin horarios asignados</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Function to render detailed schedule table for all plans
    const renderDetailedScheduleTable = (teacher: Teacher) => {
        if (!teacher.classes || teacher.classes.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Sin planes asignados
                    </p>
                    {teacher.schedules && teacher.schedules.length > 0 && (
                        <div>
                            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                Horarios generales
                            </h5>
                            {renderScheduleTableForPlan(
                                teacher.schedules,
                                'Horarios generales',
                            )}
                        </div>
                    )}
                </div>
            )
        }

        return (
            <div className="space-y-6">
                {teacher.classes.map(classItem => (
                    <div key={classItem.class_id}>
                        {renderScheduleTableForPlan(
                            teacher.schedules,
                            classItem.plan[1] || 'Plan sin nombre',
                        )}
                    </div>
                ))}
            </div>
        )
    }

    // Function to render schedule table for a specific plan
    const renderScheduleTableForPlan = (
        schedules: Schedule[],
        planName: string,
    ) => {
        if (!schedules || schedules.length === 0) {
            return (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Sin horarios asignados
                </div>
            )
        }

        // Get all unique days from all schedules
        const allDays = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
        ]
        const daysWithSchedules = new Set()

        schedules.forEach(schedule => {
            schedule.days.forEach(day =>
                daysWithSchedules.add(day.toLowerCase()),
            )
        })

        const activeDays = allDays.filter(day => daysWithSchedules.has(day))

        if (activeDays.length === 0) {
            return (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Sin horarios asignados
                </div>
            )
        }

        return (
            <div className="mb-6">
                <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    {planName}
                </h5>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 dark:border-gray-600 rounded-lg">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                                {activeDays.map(day => (
                                    <th
                                        key={day}
                                        className="px-6 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                                        {getDayName(day)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {activeDays.map(day => {
                                    // Find schedules for this day
                                    const daySchedules = schedules.filter(
                                        schedule =>
                                            schedule.days.some(
                                                scheduleDay =>
                                                    scheduleDay.toLowerCase() ===
                                                    day,
                                            ),
                                    )

                                    return (
                                        <td
                                            key={day}
                                            className="px-4 py-6 text-center border-r border-gray-200 dark:border-gray-600 last:border-r-0 align-top">
                                            {daySchedules.length > 0 ? (
                                                <div className="space-y-2">
                                                    {daySchedules.map(
                                                        schedule =>
                                                            schedule.timeslots.map(
                                                                timeslot => (
                                                                    <div
                                                                        key={`${schedule.schedule_id}-${timeslot.id}`}
                                                                        className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-md font-medium">
                                                                        {
                                                                            timeslot.hour
                                                                        }
                                                                    </div>
                                                                ),
                                                            ),
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const [currentPage, setCurrentPage] = useState(1)
    const teachersPerPage = 20
    const totalPages = Math.ceil(
        filteredAndSortedTeachers.length / teachersPerPage,
    )
    const paginatedTeachers = filteredAndSortedTeachers.slice(
        (currentPage - 1) * teachersPerPage,
        currentPage * teachersPerPage,
    )

    return (
        <div className="min-h-screen w-full p-4">
            {/* Main container */}
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header with title and actions */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Profes
                    </h1>
                    <div className="flex sm:hidden justify-center mt-2">
                        <Button
                            onClick={toggleDetails}
                            variant="outline"
                            className="w-full sm:w-auto dark:text-white dark:border-gray-600">
                            {showDetails
                                ? 'Ocultar detalles'
                                : 'Mostrar más detalles'}
                        </Button>
                    </div>
                    <div className="hidden sm:flex justify-end gap-2">
                        <Link href="/admin/teachers/create">
                            <Button className="dark:text-white text-black">
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo profesor
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Buscar profes..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50  dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Teachers table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/80 dark:bg-[#272b2b] text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('dni')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            DNI
                                            {sortConfig?.key === 'dni' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Nombre
                                            {sortConfig?.key === 'name' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() =>
                                                handleSort('last_name')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Apellido
                                            {sortConfig?.key === 'last_name' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('phone')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Teléfono
                                            {sortConfig?.key === 'phone' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-8 text-center text-red-500 dark:text-red-400">
                                            {error}
                                        </td>
                                    </tr>
                                ) : filteredAndSortedTeachers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No se encontraron profesores
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedTeachers.map(teacher => (
                                        <tr
                                            key={teacher.id}
                                            className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/70 ${
                                                selectedTeacher?.id ===
                                                teacher.id
                                                    ? 'ring-2 ring-inset ring-purple-500'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleTeacherClick(teacher)
                                            }>
                                            <td className="px-4 py-3">
                                                {teacher.dni}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {teacher.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {teacher.last_name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {teacher.phone}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            router.push(
                                                                `/admin/teachers/edit/${teacher.id}`,
                                                            )
                                                        }}
                                                        className="h-8 w-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={e => {
                                                        e.stopPropagation()
                                                        handleDeleteTeacher(
                                                            teacher.id,
                                                        )
                                                    }}
                                                    className="h-8 w-8 p-0">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 border-t dark:border-gray-700 bg-white dark:bg-[#1f2122]">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}>
                            ← Anterior
                        </Button>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}>
                            Siguiente →
                        </Button>
                    </div>

                    {/* Mobile toggle details button */}
                    <div className="sm:hidden flex justify-center p-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="outline"
                            onClick={toggleDetails}
                            className="w-full dark:text-white dark:border-gray-600">
                            {showDetails
                                ? 'Ocultar detalles'
                                : 'Mostrar más detalles'}
                        </Button>
                    </div>
                </div>

                {/* Teacher details section - only visible when a teacher is selected */}
                {selectedTeacher && (
                    <div className="mt-6 bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Detalles del Profe: {selectedTeacher.name}{' '}
                                {selectedTeacher.last_name}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedTeacher(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                Cerrar
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                    Información Personal
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Teléfono
                                            </p>
                                            <p className="dark:text-white">
                                                {selectedTeacher.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Registrado desde
                                            </p>
                                            <p className="dark:text-white">
                                                {selectedTeacher.created_at
                                                    ? formatDate(
                                                          selectedTeacher.created_at,
                                                      )
                                                    : 'No disponible'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Class Overview */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Clases Asignadas
                                </h4>
                                <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-lg max-h-80 overflow-y-auto">
                                    {renderQuickClassOverview(selectedTeacher)}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Schedule Table Section - Replaces payment info */}
                        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-[#1f2122] backdrop-blur">
                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    Horarios Detallados
                                </h4>
                                {renderDetailedScheduleTable(selectedTeacher)}
                            </div>
                        </div>

                        {/* Mobile new student button */}
                        <div className="sm:hidden flex justify-center p-4 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href="/admin/teachers/create"
                                className="w-full">
                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Profe
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
