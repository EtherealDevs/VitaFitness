'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Search,
    ChevronDown,
    ChevronUp,
    User,
    Plus,
    Edit2,
    Trash2,
    Clock,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/admin/components/ui/button'
import { useTeachers } from '@/hooks/teachers'
import { useClasses } from '@/hooks/classes'
import { useClassSchedules } from '@/hooks/classSchedules'
import { useClassStudents } from '@/hooks/classStudents'
import { useClassTeachers } from '@/hooks/classTeachers'

// Types for our student data
interface Teacher {
    id: string
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
    created_at: string
    updated_at: string
}
interface Student {
    id: string
    name: string
    last_name: string
    phone: string
    dni: string
    registration_date: string
    status: 'activo' | 'inactivo' | 'pendiente'
}
interface Schedule {
    class_id: string
    schedule_id: string
    classSchedule_id: string
    days: string[]
    timeslots: Timeslot[]

    teachers: Teacher[]
    students: Student[]
}
interface ScheduleData {
    class_id: string
    schedule_id: string
    classSchedule_id: string
    schedule_days: string[]
    timeslot_id: string
    timeslot_hour: string
    teachers: Teacher[]
    students: Student[]
}
interface Timeslot {
    id: string
    hour: string
}
interface ClassData {
    class_id: string
    plan_id: string
    plan_name: string
    plan_status: string
    branch_id: string
    branch_name: string
    max_students: number
    precio: number
    schedules: ScheduleData[]
}
interface Class {
    class_id: string
    plan_id: string
    plan_name: string
    plan_status: string
    plan: [plan_id: string, name: string]
    branch_id: string
    branch_name: string
    max_students: number
    precio: number
    schedules: Schedule[]
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

export default function ClassPage() {
    const router = useRouter()
    const [classes, setClasses] = useState<Class[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Class
        direction: 'asc' | 'desc'
    } | null>(null)
    const [selectedClass, setSelectedClass] = useState<Class | null>(null)
    const [showDetails, setShowDetails] = useState<boolean>(false)

    const { getClasses, createClass, deleteClass, updateClass } = useClasses()
    const {
        getClassSchedules,
        createClassSchedule,
        updateClassSchedule,
        deleteClassSchedule,
    } = useClassSchedules()
    const {
        getClassStudents,
        createClassStudent,
        updateClassStudent,
        deleteClassStudent,
    } = useClassStudents()
    const {
        getClassTeachers,
        createClassTeacher,
        updateClassTeacher,
        deleteClassTeacher,
    } = useClassTeachers()

    // Toggle details view for mobile
    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const fetchClasses = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await getClasses()

            const classes: Class[] = []
            const processedClasses = response.classes.map(
                (classe: ClassData) => {
                    const schedules: Schedule[] = []

                    // Guardar los datos originales
                    const originalScheduleData: ScheduleData[] =
                        classe.schedules || []
                    // Procesar los datos originales para crear Schedule[]
                    originalScheduleData.forEach(
                        (scheduleData: ScheduleData) => {
                            let newSchedule = schedules.find(
                                s =>
                                    s.schedule_id ===
                                        scheduleData.schedule_id &&
                                    s.class_id === scheduleData.class_id,
                            )
                            if (newSchedule === undefined) {
                                newSchedule = {
                                    class_id: scheduleData.class_id,
                                    schedule_id: scheduleData.schedule_id,
                                    classSchedule_id:
                                        scheduleData.classSchedule_id,
                                    days: scheduleData.schedule_days,
                                    timeslots: [],
                                    students: [],
                                    teachers: [],
                                }
                                schedules.push(newSchedule)
                            }
                            const newTimeslot: Timeslot = {
                                id: scheduleData.timeslot_id,
                                hour: scheduleData.timeslot_hour,
                            }
                            newSchedule.timeslots.push(newTimeslot)
                        },
                    )
                    let newClass = classes.find(
                        c => c.class_id === classe.class_id,
                    )
                    if (newClass === undefined) {
                        newClass = {
                            class_id: classe.class_id,
                            plan: [classe.plan_id, classe.plan_name],
                            plan_id: classe.plan_id,
                            plan_name: classe.plan_name,
                            plan_status: classe.plan_status,
                            branch_id: classe.branch_id,
                            branch_name: classe.branch_name,
                            max_students: classe.max_students,
                            precio: classe.precio,
                            schedules: schedules,
                        }
                        classes.push(newClass)
                    }

                    return {
                        ...classe,
                        classes,
                        schedules, // Schedule[] procesados
                        originalScheduleData, // ScheduleData[] originales
                    }
                },
            )
            console.log(classes)
            setClasses(processedClasses)
        } catch (err) {
            setError('Error al cargar los datos de clases')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [getClasses])

    // Fetch teacher data
    useEffect(() => {
        let isMounted = true

        const safeFetch = async () => {
            if (isMounted) await fetchClasses()
        }

        safeFetch()

        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false
        }
    }, [fetchClasses])

    // Handle sorting
    const handleSort = (key: keyof Class) => {
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

    // Handle class selection
    const handleClassClick = (classe: Class) => {
        if (selectedClass?.class_id === classe.class_id) {
            setSelectedClass(null) // Deselect if clicking the same teacher
        } else {
            setSelectedClass(classe) // Select the clicked student
        }
    }

    // Handle teacher deletion
    const handleDeleteClass = async (id: string) => {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar esta clase?',
        )
        if (!confirmDelete) return

        try {
            await deleteClass(id)
            alert('Clase  eliminada correctamente')
            setSelectedClass(prev => (prev?.class_id === id ? null : prev))
            setClasses(prev => prev.filter(classe => classe.class_id !== id))
            // Re-fetch the latest teacher list
            await fetchClasses()
        } catch (error) {
            console.error('Error al eliminar la clase:', error)
            alert('No se pudo eliminar la clase')
        }
    }

    // Apply sorting and filtering
    const filteredAndSortedClasses = [...classes]
        .filter(
            classe =>
                classe.plan_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                classe.branch_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                classe.max_students
                    .toString()
                    .includes(searchTerm.toLowerCase()) ||
                classe.precio.toString().includes(searchTerm.toLowerCase()),
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

    // Function to render detailed schedule table for all plans
    const renderDetailedScheduleTable = (classe: Class) => {
        if (!classe.schedules || classe.schedules.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Sin horarios asignados
                    </p>
                    <div className="hidden sm:flex justify-center gap-2">
                        <Link href="/admin/schedules/create">
                            <Button className="dark:text-white text-black">
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar horario
                            </Button>
                        </Link>
                    </div>
                    {classe.schedules && classe.schedules.length > 0 && (
                        <div>
                            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                Horarios generales
                            </h5>
                            {renderScheduleTableForPlan(
                                classe.schedules,
                                'Horarios generales',
                                null,
                            )}
                        </div>
                    )}
                </div>
            )
        }
        console.log(classe, classe.schedules)
        return (
            <div className="space-y-6">
                {classe.schedules.map(schedule => (
                    <div key={schedule.schedule_id}>
                        {renderScheduleTableForPlan(
                            classe.schedules,
                            classe.plan_name || 'Plan sin nombre',
                            schedule,
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
        schedule: Schedule | null | undefined,
    ) => {
        if (!schedules || schedules.length === 0) {
            return (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <p>Sin horarios asignados</p>
                    <div className="hidden sm:flex justify-end gap-2">
                        <Button className="dark:text-white text-black">
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar horario
                        </Button>
                    </div>
                </div>
            )
        }

        // Get all unique days from all schedules
        const allDays = [
            'lunes',
            'martes',
            'miercoles',
            'jueves',
            'viernes',
            'sabado',
            'domingo',
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

        if (!schedule) {
            return (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Sin horarios asignados
                </div>
            )
        }
        const classe = classes.find(c => c.class_id === schedule.class_id)
        if (!classe) {
            return (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Clase no encontrada
                </div>
            )
        }
        console.log(schedule.schedule_id)
        return (
            <div className="mb-6">
                <div className="overflow-x-auto">
                    {/* Tabla de horarios */}
                    <table className="w-full border border-gray-200 dark:border-gray-600 rounded-lg">
                        {/* Cabecera de la tabla */}
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                                {/* Días de la semana */}
                                {schedule.days.map(day => (
                                    <th
                                        key={day}
                                        className="px-6 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                                        {capitalize(day)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {/* Cuerpo de la tabla */}
                        <tbody>
                            <tr>
                                {/* Días de la semana */}
                                {schedule.days.map(day => {
                                    return (
                                        <td
                                            key={day}
                                            className="px-4 py-6 text-center border-r border-gray-200 dark:border-gray-600 last:border-r-0 align-top">
                                            {schedule.timeslots.length > 0 ? (
                                                <div className="space-y-2">
                                                    {schedule.timeslots.map(
                                                        timeslot => (
                                                            <div
                                                                key={`${schedule.schedule_id}-${timeslot.id}`}
                                                                className="text-sm bg-violet-100 dark:bg-blue-900 text-violet-500 dark:text-blue-200 px-3 py-2 rounded-md font-medium">
                                                                {timeslot.hour}
                                                            </div>
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
                    <Button
                        className="mt-4 w-full bg-[rgb(152,87,226)] sm:w-auto text-white dark:border-gray-600"
                        onClick={e => {
                            e.stopPropagation()
                            router.push(
                                `/admin/classes/details/${schedule.classSchedule_id}`,
                            )
                        }}>
                        Ver estudiantes y alumnos
                    </Button>
                </div>
            </div>
        )
    }

    const [currentPage, setCurrentPage] = useState(1)
    const classesPerPage = 20
    const totalPages = Math.ceil(
        filteredAndSortedClasses.length / classesPerPage,
    )
    const paginatedClasses = filteredAndSortedClasses.slice(
        (currentPage - 1) * classesPerPage,
        currentPage * classesPerPage,
    )

    return (
        <div className="min-h-screen w-full p-4">
            {/* Main container */}
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header with title and actions */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Clases
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
                        <Link href="/admin/classes/create">
                            <Button className="dark:text-white text-black">
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva clase
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
                                placeholder="Buscar clases..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50  dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Classes table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/80 dark:bg-[#272b2b] text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() =>
                                                handleSort('plan_name')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Plan
                                            {sortConfig?.key === 'plan_name' &&
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
                                                handleSort('branch_name')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Sucursal
                                            {sortConfig?.key ===
                                                'branch_name' &&
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
                                                handleSort('max_students')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Max. Alumnos
                                            {sortConfig?.key ===
                                                'max_students' &&
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
                                            onClick={() => handleSort('precio')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Precio
                                            {sortConfig?.key === 'precio' &&
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
                                                handleSort('plan_status')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Estado
                                            {sortConfig?.key ===
                                                'plan_status' &&
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
                                ) : filteredAndSortedClasses.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No se encontraron clases
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedClasses.map(classe => (
                                        <tr
                                            key={classe.class_id}
                                            className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/70 ${
                                                selectedClass?.class_id ===
                                                classe.class_id
                                                    ? 'ring-2 ring-inset ring-purple-500'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleClassClick(classe)
                                            }>
                                            <td className="px-4 py-3">
                                                {classe.plan_name}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {classe.branch_name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {classe.max_students}
                                            </td>
                                            <td className="px-4 py-3">
                                                {classe.precio}
                                            </td>
                                            <td className="px-4 py-3">
                                                {capitalize(classe.plan_status)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            router.push(
                                                                `/admin/classes/edit/${classe.class_id}`,
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
                                                        handleDeleteClass(
                                                            classe.class_id,
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
                {selectedClass && (
                    <div className="mt-6 bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Detalles de la clase: {selectedClass.plan_name}
                                {' | '}
                                {selectedClass.branch_name}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedClass(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                Cerrar
                            </Button>
                        </div>

                        {/* Detailed Schedule Table Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-[#1f2122] backdrop-blur">
                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    Horarios Detallados
                                </h4>
                                {renderDetailedScheduleTable(selectedClass)}
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
