'use client'

import { useState, useEffect, useCallback} from 'react'
import {
    Search,
    ChevronDown,
    ChevronUp,
    DollarSign,
    User,
    Calendar,
    Phone,
    Plus,
    Edit2,
    Trash2
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
    schedules: ScheduleData[]
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
    plan: [
        plan_id: string,
        name: string
    ]
}

interface AccountInfo {
    balance: number
    lastEntryDate: string
    lastEntryTime: string
    lastPaymentDate: string
    lastPaymentPlan: string
    lastPaymentAmount: number
}

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

// Helper function to determine row color based on payment status
// const getRowColor = (daysOverdue: number, daysUntilDue: number) => {
//     if (daysOverdue > 0)
//         return 'bg-red-100/70 dark:bg-red-900/30 text-red-900 dark:text-red-100'
//     if (daysUntilDue === 0 && daysOverdue === 0)
//         return 'bg-yellow-100/70 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100'
//     return 'dark:text-gray-100'
// }

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
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)

    const { getTeachers, deleteTeacher } = useTeachers()

    // Toggle details view for mobile
    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }
    
    const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const fetchTeachers = useCallback(async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getTeachers()

                const processedTeachers = response.teachers.map((teacher: Teacher) => {

                    const schedules: Schedule[] = [];
                    teacher.last_name = capitalize(teacher.last_name);
                    teacher.schedules.forEach((schedule: ScheduleData) => {
                        let newSchedule = schedules.find(s => s.schedule_id === schedule.schedule_id);
                        if (newSchedule === undefined) {
                            newSchedule = {
                                schedule_id: schedule.schedule_id,
                                days: schedule.schedule_days,
                                timeslots: []
                            };
                            schedules.push(newSchedule);
                        }
                        const newTimeslot: Timeslot = {
                            id: schedule.timeslot_id,
                            hour: schedule.timeslot_hour
                        };
                        newSchedule?.timeslots.push(newTimeslot);
                        });

                        return {
                            ...teacher,
                            schedules
                        };
                    });
                setTeachers(processedTeachers)
            } catch (err) {
                setError('Error al cargar los datos de profes')
                console.error(err)
            }
            finally {
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
            setAccountInfo(null)
        } else {
            // const sortedDates = student.payments?.sort((a, b) => new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime()).reverse()
            // const sortedAttendances = student.attendances?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).reverse()
            
            // const accountInfo = {
            //     balance: 0,
            //     lastEntryDate: String(sortedAttendances?.[0]?.date),
            //     lastEntryTime: '',
            //     lastPaymentDate: String(sortedDates?.[0]?.payment_date), 
            //     lastPaymentPlan: String(sortedDates?.[0]?.classSchedule.class.name),
            //     lastPaymentAmount: Number(sortedDates?.[0]?.amount),
            // }
            setSelectedTeacher(teacher) // Select the clicked student
            // setAccountInfo(accountInfo)
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

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(amount)
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
                                                                router.push(`/admin/teachers/edit/${teacher.id}`)
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                    Información Personal
                                </h4>
                                <div className="space-y-2">
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

                                
                            </div>
                            {/* Attendance History */}
                                {/* <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                        Historial de Asistencias
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedStudent.attendanceHistory &&
                                        selectedStudent.attendanceHistory.length >
                                            0 ? (
                                            selectedStudent.attendanceHistory.map(
                                                (attendance, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/70 rounded-md">
                                                        <p className="text-sm font-medium dark:text-white">
                                                            {formatDate(
                                                                attendance.date,
                                                            )}
                                                        </p>
                                                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded">
                                                            {attendance.className}
                                                        </span>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 italic">
                                                No hay historial de asistencias
                                                disponible
                                            </p>
                                        )}
                                    </div>
                                </div> */}
                            {/* Payment History */}
                                {/* <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                        Historial de Pagos
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedStudent.payments &&
                                        selectedStudent.payments.length >
                                            0 ? (
                                            selectedStudent.payments.map(
                                                (payment, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/70 rounded-md">
                                                        <div>
                                                            <p className="text-sm font-medium dark:text-white">
                                                                {payment.payment_date ? (
                                                                    formatDate(
                                                                        payment.payment_date,
                                                                    )
                                                                ) : (
                                                                    <span className="text-gray-500 dark:text-gray-400">
                                                                        Sin fecha de inicio
                                                                    </span>
                                                                )} {" - "}
                                                                {payment.expiration_date ? (
                                                                    <span className="text-gray-500 dark:text-gray-400">
                                                                        {payment.expiration_date
                                                                            ? formatDate(
                                                                                  payment.expiration_date,
                                                                              )
                                                                            : ""}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-500 dark:text-gray-400">
                                                                        Sin fecha de vencimiento
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                { payment.classSchedule.class.name ? payment.classSchedule.class.name : "Sin clase" }
                                                            </p>
                                                        </div>
                                                        <span className="font-medium dark:text-white">
                                                            {formatCurrency(
                                                                Number(payment.amount),
                                                            )}
                                                        </span>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 italic">
                                                No hay historial de pagos
                                                disponible
                                            </p>
                                        )}
                                    </div>
                                </div> */}

                            {/* Account info and actions */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-[#1f2122] backdrop-blur md:col-span-3">
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Account balance */}
                                    <div className="flex flex-col">
                                        <div className="mt-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Promoción Principal:
                                            </span>
                                            <span className="ml-2 font-medium dark:text-white">
                                                {accountInfo?.lastPaymentPlan == "" || accountInfo?.lastPaymentPlan == "undefined" || accountInfo?.lastPaymentPlan == undefined || accountInfo?.lastPaymentPlan == null ? "Sin plan" : accountInfo?.lastPaymentPlan}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Last payment */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium dark:text-white">
                                                Último Pago Cuota
                                            </span>
                                            <button className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
                                                Ver Historial
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between dark:text-white">
                                                {accountInfo?.lastPaymentDate == "undefined" || accountInfo?.lastPaymentDate == "null" || accountInfo?.lastPaymentDate == "" || accountInfo?.lastPaymentDate == null || accountInfo?.lastPaymentDate == undefined ? (
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Sin fecha
                                                    </span>
                                                ) : (
                                                    <span>
                                                {formatDate(
                                                        accountInfo?.lastPaymentDate,
                                                    )}
                                                    </span>
                                                )}
                                            <span>
                                                {accountInfo?.lastPaymentPlan == "" || accountInfo?.lastPaymentPlan == "undefined" || accountInfo?.lastPaymentPlan == undefined || accountInfo?.lastPaymentPlan == null ? "Sin plan" : accountInfo?.lastPaymentPlan}
                                            </span>
                                            <span className="font-semibold">
                                                {formatCurrency(
                                                    accountInfo?.lastPaymentAmount || 0,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            {/* Action buttons */}
                            <div className="flex justify-end mt-4 gap-2">
                                <p className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Cobrar Cuota
                                </p>
                                <p className="bg-purple-600 hover:bg-purple-700 text-white">
                                    Otros Abonos
                                </p>
                            </div>
                        </div>

                        </div>

                        {/* Mobile new student button */}
                        <div className="sm:hidden flex justify-center mt-6">
                            <Link href="/admin/teachers/create" className="w-full">
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
