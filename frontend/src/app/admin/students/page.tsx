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
    Trash2,
    Eye,
} from 'lucide-react'
import Link from 'next/link'
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
const getRowColor = (daysOverdue: number) => {
    if (daysOverdue > 0)
        return 'bg-red-100/70 dark:bg-red-900/30 text-red-900 dark:text-red-100'
    if (daysOverdue === 0)
        return 'bg-yellow-100/70 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100'
    return 'dark:text-gray-100'
}

// Mock student data
// const mockStudents: Student[] = [
//     {
//         id: '1',
//         name: 'Eliana',
//         last_name: 'Aguirre',
//         phone: '+54 11 5555-1234',
//         dni: '32456789',
//         status: 'activo',
//         paymentDueDate: '2025-04-18',
//         daysOverdue: 4,
//         remainingClasses: 25,
//         canAttend: true,
//         branch: 'Principal',
//         address: 'Av. Corrientes 1234, CABA',
//         birthDate: '1990-05-15',
//         memberSince: '2023-01-10',
//         lastPaymentAmount: 25000,
//         paymentHistory: [
//             { date: '2025-03-18', amount: 25000, concept: 'FUNCIONAL 21hs' },
//             { date: '2025-02-18', amount: 25000, concept: 'FUNCIONAL 21hs' },
//             { date: '2025-01-18', amount: 23000, concept: 'FUNCIONAL 21hs' },
//         ],
//         attendanceHistory: [
//             { date: '2025-04-15', className: 'Funcional 21hs' },
//             { date: '2025-04-13', className: 'Funcional 21hs' },
//             { date: '2025-04-10', className: 'Funcional 21hs' },
//             { date: '2025-04-08', className: 'Funcional 21hs' },
//         ],
//     },
//     {
//         id: '10',
//         name: 'Gladys',
//         last_name: 'Kurylo',
//         phone: '+54 11 5555-5678',
//         dni: '28765432',
//         status: 'activo',
//         paymentDueDate: '2025-04-23',
//         daysOverdue: 0,
//         remainingClasses: 15,
//         canAttend: true,
//         branch: 'Principal',
//         address: 'Av. Santa Fe 4321, CABA',
//         birthDate: '1985-08-22',
//         memberSince: '2024-02-15',
//         lastPaymentAmount: 29000,
//         paymentHistory: [
//             { date: '2025-03-23', amount: 29000, concept: 'FUNCIONAL 21hs' },
//             { date: '2025-02-23', amount: 29000, concept: 'FUNCIONAL 21hs' },
//         ],
//         attendanceHistory: [
//             { date: '2025-04-20', className: 'Funcional 21hs' },
//             { date: '2025-04-18', className: 'Funcional 21hs' },
//             { date: '2025-04-16', className: 'Funcional 21hs' },
//         ],
//     },
// ]
const getDaysRemaining = (dateString: string): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const targetDate = new Date(dateString)
    targetDate.setHours(0, 0, 0, 0)

    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
}
export default function StudentManagement() {
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
                    setStudents(response.students)
                    setLoading(false)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar los datos de estudiantes')
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
            let sortedDates = student.payments?.sort((a, b) => new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime()).reverse()
            let sortedAttendances = student.attendances?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).reverse()
            console.log(sortedDates)
            
            let accountInfo = {
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
        console.log(students[0]),
        (
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
                                <Button className=" text-white">
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
                                    placeholder="Buscar estudiantes..."
                                    value={searchTerm}
                                    onChange={e =>
                                        setSearchTerm(e.target.value)
                                    }
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
                                                onClick={() =>
                                                    handleSort('dni')
                                                }
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
                                                onClick={() =>
                                                    handleSort('name')
                                                }
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
                                                {sortConfig?.key ===
                                                    'last_name' &&
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
                                                    handleSort('phone')
                                                }
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
                                                onClick={() =>
                                                    handleSort('status')
                                                }
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
                                    ) : filteredAndSortedStudents.length ===
                                      0 ? (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                No se encontraron estudiantes
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedStudents.map(student => (
                                            <tr
                                                key={student.id}
                                                className={`${getRowColor(
                                                    student.daysOverdue,
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
                                                    {formatDate(
                                                        student.payments?.[0]
                                                            ?.expiration_date || "",
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    {getDaysRemaining(
                                                        student.payments?.[0]
                                                            ?.expiration_date || "",
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                handleStudentClick(
                                                                    student,
                                                                )
                                                            }}
                                                            className="h-8 w-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Link
                                                            href={`/admin/students/edit/${student.id}`}
                                                            onClick={e =>
                                                                e.stopPropagation()
                                                            }>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
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
                                                    </div>
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
                                onClick={() =>
                                    setCurrentPage(prev => prev - 1)
                                }>
                                ← Anterior
                            </Button>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Página {currentPage} de {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage(prev => prev + 1)
                                }>
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
                                    Detalles del Estudiante:{' '}
                                    {selectedStudent.name}{' '}
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
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Fecha de Nacimiento
                                                </p>
                                                <p className="dark:text-white">
                                                    {selectedStudent.birthDate
                                                        ? formatDate(
                                                              selectedStudent.birthDate,
                                                          )
                                                        : 'No disponible'}
                                                </p>
                                            </div>
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
                                                                {formatDate(
                                                                    payment.payment_date,
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {
                                                                    payment.classSchedule.class.name
                                                                }
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

                                {/* Attendance History */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                        Historial de Asistencias
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedStudent.attendances &&
                                        selectedStudent.attendances
                                            .length > 0 ? (
                                            selectedStudent.attendances.map(
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
                                                            {
                                                                attendance.classSchedule.class.name
                                                            }
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
                            </div>

                            {/* Account info and actions */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-[#1f2122] backdrop-blur">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Account balance */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Saldo Cta Cte:
                                            </span>
                                            <span className="font-semibold dark:text-white">
                                                {formatCurrency(
                                                    accountInfo?.balance || 0,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-end">
                                            <button className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
                                                Ver Detalle Saldo
                                            </button>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Promoción Principal:
                                            </span>
                                            <span className="ml-2 font-medium dark:text-white">
                                                {accountInfo?.lastPaymentPlan}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Last entry */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium dark:text-white">
                                                Último Ingreso
                                            </span>
                                            <button className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
                                                Ver Historial
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 dark:text-white">
                                            <span>
                                                {accountInfo?.lastEntryDate}
                                            </span>
                                            <span>
                                                {accountInfo?.lastEntryTime}
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
                                            <span>
                                                {accountInfo?.lastPaymentDate}
                                            </span>
                                            <span>
                                                {accountInfo?.lastPaymentPlan}
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
                                    <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Cobrar Cuota
                                    </Button>
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                        Otros Abonos
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

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
            </div>
        )
    )
}
