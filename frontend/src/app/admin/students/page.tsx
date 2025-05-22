'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { useStudents } from '@/hooks/students'
import { Payment } from '@/hooks/payments'


// Types for our student data
interface Student {
    id: string
    name: string
    last_name: string
    phone: string
    dni: string
    registration_date: string
    status: 'activo' | 'inactivo' | 'pendiente'
    paymentDueDate: string
    daysOverdue: number
    daysUntilDue: number
    remainingClasses: number
    canAttend: boolean
    branch: string
    payments?: [Payment]
    attendances?: Attendances[]
    accountInfo?: AccountInfo
    // Additional details for the expanded view
    address?: string
    birthDate?: string
    memberSince?: string
    lastPaymentAmount?: number
    paymentHistory?: Payment[]
    attendanceHistory?: {
        date: string
        className: string
    }[]
}
interface Attendances {
    date: string
    classSchedule: ClassSchedule

}
interface ClassSchedule {
    id: string
    class: Class
}
interface Class {
    id: string
    name: string
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
const getRowColor = (daysOverdue: number, daysUntilDue: number) => {
    if (daysOverdue > 0)
        return 'bg-red-100/70 dark:bg-red-900/30 text-red-900 dark:text-red-100'
    if (daysUntilDue === 0 && daysOverdue === 0)
        return 'bg-yellow-100/70 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100'
    return 'dark:text-gray-100'
}

export default function StudentManagement() {
    const router = useRouter()
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Student
        direction: 'asc' | 'desc'
    } | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)

    const { getStudents } = useStudents()

    const deleteStudent = useCallback(async (id: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        // Use id in a comment to avoid the unused parameter warning
        console.log(`Deleting student with ID: ${id}`)
        // Return success
        return { success: true }
    }, [])

    // Toggle details view for mobile
    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    // Fetch student data
    useEffect(() => {
        let isMounted = true

        const fetchStudents = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getStudents()
                if (isMounted) {

                    const now = new Date();
                    
                    const processedStudents = response.students.map((student: Student) => {
                        let paymentDueDate: string | null = null;
                        let daysUntilDue = 0;
                        let daysOverdue = 0;

                        if (student.payments && student.payments.length > 0) {
                            // Get the latest unpaid or upcoming payment
                            const relevantPayment = student.payments
                                .filter((p: Payment) => p.expiration_date)
                                .sort((a: Payment, b: Payment) => new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime()).reverse()[0];

                            if (relevantPayment) {
                                const dueDate = new Date(relevantPayment.expiration_date);
                                paymentDueDate = dueDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
                                daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                                const timeDiff = dueDate.getTime() - now.getTime();
                                const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                                if (dayDiff < 0) {
                                    daysOverdue = Math.abs(dayDiff);
                                    daysUntilDue = 0;
                                } else {
                                    daysUntilDue = dayDiff;
                                    daysOverdue = 0;
                                }
                            }
                        }
                        

                        return {
                            ...student,
                            paymentDueDate,
                            daysUntilDue,
                            daysOverdue
                        };
                    });
                    setStudents(processedStudents)
                    setLoading(false)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar los datos de alumnos')
                    console.error(err)
                    setLoading(false)
                }
            }
        }

        fetchStudents()

        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false
        }
    }, [getStudents])

    // Handle sorting
    const handleSort = (key: keyof Student) => {
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
    const handleStudentClick = (student: Student) => {
        if (selectedStudent?.id === student.id) {
            setSelectedStudent(null) // Deselect if clicking the same student
            setAccountInfo(null)
        } else {
            const sortedDates = student.payments?.sort((a, b) => new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime()).reverse()
            const sortedAttendances = student.attendances?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).reverse()
            
            const accountInfo = {
                balance: 0,
                lastEntryDate: String(sortedAttendances?.[0]?.date),
                lastEntryTime: '',
                lastPaymentDate: String(sortedDates?.[0]?.payment_date), 
                lastPaymentPlan: String(sortedDates?.[0]?.classSchedule.class.name),
                lastPaymentAmount: Number(sortedDates?.[0]?.amount),
            }
            setSelectedStudent(student) // Select the clicked student
            setAccountInfo(accountInfo)
        }
    }

    // Handle student deletion
    const handleDeleteStudent = async (id: string) => {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar este alumno?',
        )
        if (!confirmDelete) return

        try {
            await deleteStudent(id)
            alert('Alumno eliminado correctamente')
            setStudents(prevStudents =>
                prevStudents.filter(student => student.id !== id),
            )
            if (selectedStudent?.id === id) {
                setSelectedStudent(null)
            }
        } catch (error) {
            console.error('Error al eliminar el alumno:', error)
            alert('No se pudo eliminar el alumno')
        }
    }

    // Apply sorting and filtering
    const filteredAndSortedStudents = [...students]
        .filter(
            student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.last_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (student.dni &&
                    student.dni
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
    const studentsPerPage = 20
    const totalPages = Math.ceil(
        filteredAndSortedStudents.length / studentsPerPage,
    )
    const paginatedStudents = filteredAndSortedStudents.slice(
        (currentPage - 1) * studentsPerPage,
        currentPage * studentsPerPage,
    )

    return (
        <div className="min-h-screen w-full p-4">
            {/* Main container */}
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header with title and actions */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Alumnos
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
                        <Link href="/admin/students/create">
                            <Button className="dark:text-white text-black">
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Alumno
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
                                placeholder="Buscar alumnos..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50  dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Students table */}
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
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('status')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Estado
                                            {sortConfig?.key === 'status' &&
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
                                                handleSort('paymentDueDate')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Vencimiento
                                            {sortConfig?.key ===
                                                'paymentDueDate' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        <button
                                            onClick={() =>
                                                handleSort('daysOverdue')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Días venc
                                            {sortConfig?.key ===
                                                'daysOverdue' &&
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
                                ) : filteredAndSortedStudents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No se encontraron alumnos
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedStudents.map(student => (
                                            <tr
                                                key={student.id}
                                                className={`${getRowColor(
                                                    student.daysOverdue, student.daysUntilDue,
                                                )} hover:bg-gray-50/50 dark:hover:bg-slate-800/70 ${
                                                    selectedStudent?.id ===
                                                    student.id
                                                        ? 'ring-2 ring-inset ring-purple-500'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    handleStudentClick(student)
                                                }>
                                                <td className="px-4 py-3">
                                                    {student.dni}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {student.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {student.last_name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {student.phone}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full ${
                                                            student.status ===
                                                            'activo'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                                : student.status ===
                                                                  'inactivo'
                                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                        }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {student.paymentDueDate == "" || student.paymentDueDate == undefined || student.paymentDueDate == null ? (
                                                        <span className="text-gray-500 dark:text-gray-400">
                                                            Sin fecha
                                                        </span>
                                                    ) : (formatDate(
                                                        student.paymentDueDate || "",
                                                    ))}
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    {student.daysOverdue || 0}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                router.push(`/admin/students/edit/${student.id}`)
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
                                                            handleDeleteStudent(
                                                                student.id,
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

                {/* Student details section - only visible when a student is selected */}
                {selectedStudent && (
                    <div className="mt-6 bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Detalles del Alumno: {selectedStudent.name}{' '}
                                {selectedStudent.last_name}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedStudent(null)}
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
                                                {selectedStudent.phone}
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Miembro desde
                                                </p>
                                                <p className="dark:text-white">
                                                    {selectedStudent.registration_date
                                                        ? formatDate(
                                                              selectedStudent.registration_date,
                                                          )
                                                        : 'No disponible'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                
                            </div>
                            {/* Attendance History */}
                                <div className="space-y-4">
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
                                </div>
                            {/* Payment History */}
                                <div className="space-y-4">
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
                                </div>

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
                            <Link href="/admin/students/create" className="w-full">
                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Alumno
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
