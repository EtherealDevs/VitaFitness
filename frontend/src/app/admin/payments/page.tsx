'use client'

import { useState, useEffect } from 'react'
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
    X,
    Clock,
    FileText,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/admin/components/ui/button'
import { type Payment, usePayments } from '@/hooks/payments'
import { Input } from '@/app/admin/components/ui/input'
import { Label } from '@/app/admin/components/ui/label'
import { useClassSchedules } from '@/hooks/classSchedules'

interface Plan {
    id: string
    name: string
    classSchedules: string[]
}

// Helper function to format date
const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha'
    try {
        const date = new Date(dateString)
        // Usar formato numérico para evitar problemas de localización
        return `${date.getDate().toString().padStart(2, '0')}/${(
            date.getMonth() + 1
        )
            .toString()
            .padStart(2, '0')}/${date.getFullYear()}`
    } catch {
        return 'Fecha inválida'
    }
}

// Helper function to determine row color based on payment status
const getRowColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pagado':
            return 'bg-green-100/70 dark:bg-green-900/30 text-green-900 dark:text-green-100'
        case 'pendiente':
            return 'bg-yellow-100/70 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100'
        case 'vencido':
            return 'bg-red-100/70 dark:bg-red-900/30 text-red-900 dark:text-red-100'
        default:
            return 'dark:text-gray-100'
    }
}

export default function PaymentsPage() {
    const router = useRouter()
    const { getPayments, deletePayment, getPayment } = usePayments()
    const { getClassScheduleClassNames } = useClassSchedules()
    const [payments, setPayments] = useState<Payment[]>([])
    const [planNames, setPlanNames] = useState<Plan[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filterPlan, setFilterPlan] = useState<string>('')
    const [filterStartDate, setFilterStartDate] = useState('')
    const [filterPaymentDate, setFilterPaymentDate] = useState('')
    const [filterExpirationDate, setFilterExpirationDate] = useState('')
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Payment
        direction: 'asc' | 'desc'
    } | null>({ key: 'id', direction: 'desc' })
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const [showPaymentDetailsModal, setShowPaymentDetailsModal] =
        useState<boolean>(false)

    // Toggle details view for mobile
    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    // Open payment details modal
    const openPaymentDetailsModal = () => {
        setShowPaymentDetailsModal(true)
    }

    // Close payment details modal
    const closePaymentDetailsModal = () => {
        setShowPaymentDetailsModal(false)
    }

    // Fetch payment data
    useEffect(() => {
        let isMounted = true

        const fetchPayments = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getPayments()
                if (isMounted) {
                    setPayments(response.payments)
                    setLoading(false)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar los datos de pagos')
                    console.error(err)
                    setLoading(false)
                }
            }
        }

        fetchPayments()

        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false
        }
    }, [getPayments])
    // Fetch planNames
    useEffect(() => {
        let isMounted = true

        const fetchPlanNames = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getClassScheduleClassNames()
                if (isMounted) {
                    setPlanNames(response.planNames)
                    setLoading(false)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar los datos de pagos')
                    console.error(err)
                    setLoading(false)
                }
            }
        }

        fetchPlanNames()

        return () => {
            isMounted = false
        }
    }, [getClassScheduleClassNames])

    // Handle sorting
    const handleSort = (key: keyof Payment) => {
        let direction: 'asc' | 'desc' = 'desc'

        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'desc'
        ) {
            direction = 'asc'
        }

        setSortConfig({ key, direction })
    }

    // Handle payment selection
    const handlePaymentClick = async (payment: Payment) => {
        if (selectedPayment?.id === payment.id) {
            setSelectedPayment(null) // Deselect if clicking the same payment
        } else {
            try {
                const response = await getPayment(payment.id)
                setSelectedPayment(response.payment) // Select the clicked payment
            } catch (error) {
                console.error('Error al cargar detalles del pago:', error)
                // Si falla la carga de detalles, usar los datos básicos
                setSelectedPayment(payment)
            }
        }
    }

    // Handle payment deletion
    const handleDeletePayment = async (id: string) => {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar este pago?',
        )
        if (!confirmDelete) return

        try {
            await deletePayment(id)
            alert('Pago eliminado correctamente')
            setPayments(prevPayments =>
                prevPayments.filter(payment => payment.id !== id),
            )
            if (selectedPayment?.id === id) {
                setSelectedPayment(null)
            }
        } catch (error) {
            console.error('Error al eliminar el pago:', error)
            alert('No se pudo eliminar el pago')
        }
    }

    // Apply filtering - FIXED
    const filteredPayments = payments.filter(payment => {
        // Mejorar la funcionalidad de búsqueda para trabajar con los nuevos campos
        const searchTerms = searchTerm
            .toLowerCase()
            .split(/\s+/)
            .filter(term => term.length > 0)

        // Si no hay términos de búsqueda, no filtrar por búsqueda
        const matchesSearch =
            searchTerms.length === 0
                ? true
                : searchTerms.some(term => {
                      return (
                          // Buscar en el nombre completo del estudiante (nuevo campo)
                          payment.student_full_name
                              ?.toLowerCase()
                              .includes(term) ||
                          // Buscar en campos individuales si están disponibles
                          payment.student?.name?.toLowerCase().includes(term) ||
                          payment.student?.last_name
                              ?.toLowerCase()
                              .includes(term) ||
                          // Buscar en estado del pago
                          payment.status?.toLowerCase().includes(term) ||
                          // Buscar en monto (convertir a string)
                          String(payment.amount).includes(term) ||
                          // Buscar en ID del pago
                          String(payment.id).toLowerCase().includes(term) ||
                          // Buscar en ID del estudiante
                          String(payment.student_id || '')
                              .toLowerCase()
                              .includes(term)
                      )
                  })
        // Filtrar por plan
        
        const planObject = planNames.find(plan => plan.id == filterPlan)
        let noPlanFiltered = null
        if (filterPlan == '') {
            noPlanFiltered = true
        }
        const matchesPlan =
            noPlanFiltered || planObject?.classSchedules.includes(payment.classSchedule_id)
        // Mejorar el filtrado de fechas
        const matchesStartDate =
            !filterStartDate ||
            (payment.date_start && payment.date_start.includes(filterStartDate))

        const matchesPaymentDate =
            !filterPaymentDate ||
            (payment.payment_date &&
                payment.payment_date.includes(filterPaymentDate))

        const matchesExpirationDate =
            !filterExpirationDate ||
            (payment.expiration_date &&
                payment.expiration_date.includes(filterExpirationDate))

        return (
            matchesSearch &&
            matchesStartDate &&
            matchesPaymentDate &&
            matchesExpirationDate &&
            matchesPlan
        )
    })

    // Apply sorting - FIXED with proper types
    const sortedPayments = [...filteredPayments].sort((a, b) => {
        if (!sortConfig) return 0

        const { key, direction } = sortConfig

        // Manejar casos especiales de ordenamiento con tipos apropiados
        let aValue: string | number
        let bValue: string | number

        switch (key) {
            case 'student_full_name':
                aValue =
                    a.student_full_name ||
                    (a.student
                        ? `${a.student.name} ${a.student.last_name}`
                        : '')
                bValue =
                    b.student_full_name ||
                    (b.student
                        ? `${b.student.name} ${b.student.last_name}`
                        : '')
                break
            case 'amount':
                aValue = Number(a.amount) || 0
                bValue = Number(b.amount) || 0
                break
            case 'id':
                aValue = Number(a.id) || 0
                bValue = Number(b.id) || 0
                break
            case 'payment_date':
            case 'expiration_date':
            case 'date_start':
                aValue = a[key] ? new Date(a[key] as string).getTime() : 0
                bValue = b[key] ? new Date(b[key] as string).getTime() : 0
                break
            case 'status':
                aValue = a.status || ''
                bValue = b.status || ''
                break
            default:
                // Para otros campos, convertir a string
                aValue = String(a[key] || '')
                bValue = String(b[key] || '')
        }

        // Comparar valores
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            const aLower = aValue.toLowerCase()
            const bLower = bValue.toLowerCase()
            if (aLower < bLower) return direction === 'asc' ? -1 : 1
            if (aLower > bLower) return direction === 'asc' ? 1 : -1
            return 0
        }

        // Para valores numéricos
        if (aValue < bValue) return direction === 'asc' ? -1 : 1
        if (aValue > bValue) return direction === 'asc' ? 1 : -1
        return 0
    })

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        }).format(amount)
    }

    const [currentPage, setCurrentPage] = useState(1)
    const paymentsPerPage = 20
    const totalPages = Math.ceil(sortedPayments.length / paymentsPerPage)
    const paginatedPayments = sortedPayments.slice(
        (currentPage - 1) * paymentsPerPage,
        currentPage * paymentsPerPage,
    )

    return (
        <div className="min-h-screen w-full p-4">
            {/* Payment Details Modal */}
            {showPaymentDetailsModal && selectedPayment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 dark:bg-[#1f2122]/95 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Detalles Completos del Pago - ID:{' '}
                                {selectedPayment.id}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={closePaymentDetailsModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                            Información del Estudiante
                                        </h4>
                                        <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                                            <p className="text-sm flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Nombre:
                                                </span>
                                                <span className="font-medium dark:text-white">
                                                    {selectedPayment.student_full_name ||
                                                        selectedPayment.student
                                                            ?.name +
                                                            ' ' +
                                                            selectedPayment
                                                                .student
                                                                ?.last_name ||
                                                        'No disponible'}
                                                </span>
                                            </p>
                                            <p className="text-sm flex items-center gap-2 mt-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    ID Estudiante:
                                                </span>
                                                <span className="font-medium dark:text-white">
                                                    {selectedPayment.student_id}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                            Información del Pago
                                        </h4>
                                        <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                                            <p className="text-sm flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Monto:
                                                </span>
                                                <span className="font-medium text-green-600">
                                                    {formatCurrency(
                                                        Number(
                                                            selectedPayment.amount,
                                                        ),
                                                    )}
                                                </span>
                                            </p>
                                            <p className="text-sm flex items-center gap-2 mt-2">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Estado:
                                                </span>
                                                <span
                                                    className={`px-2 py-0.5 text-xs rounded-full ${
                                                        selectedPayment.status?.toLowerCase() ===
                                                        'pagado'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                            : selectedPayment.status?.toLowerCase() ===
                                                              'pendiente'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                    }`}>
                                                    {selectedPayment.status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                        Fechas
                                    </h4>
                                    <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Fecha de inicio
                                                </p>
                                                <p className="font-medium dark:text-white">
                                                    {formatDate(
                                                        selectedPayment.date_start ||
                                                            '',
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Fecha de pago
                                                </p>
                                                <p className="font-medium dark:text-white">
                                                    {formatDate(
                                                        selectedPayment.payment_date ||
                                                            '',
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Fecha de expiración
                                                </p>
                                                <p className="font-medium dark:text-white">
                                                    {formatDate(
                                                        selectedPayment.expiration_date ||
                                                            '',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                        Clase
                                    </h4>
                                    <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                                        <p className="text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                ID de Clase:
                                            </span>{' '}
                                            <span className="font-medium dark:text-white">
                                                {selectedPayment.classSchedule_id ||
                                                    'No asignado'}
                                            </span>
                                        </p>
                                        {selectedPayment.classSchedule && (
                                            <p className="text-sm mt-2">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Nombre de Clase:
                                                </span>{' '}
                                                <span className="font-medium dark:text-white">
                                                    {selectedPayment
                                                        .classSchedule.class
                                                        ?.name ||
                                                        'No especificado'}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50">
                            <div className="flex justify-end gap-2">
                                <Link
                                    href={`/admin/payments/edit/${selectedPayment.id}`}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 dark:text-white">
                                        <Edit2 className="h-4 w-4" />
                                        Editar Pago
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex items-center gap-2 dark:text-red-500"
                                    onClick={() => {
                                        closePaymentDetailsModal()
                                        handleDeletePayment(selectedPayment.id)
                                    }}>
                                    <Trash2 className="h-4 w-4" />
                                    Eliminar Pago
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main container */}
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header with title and actions */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Pagos
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
                        <Link href="/admin/payments/create/new">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                                <Plus className="mr-2 h-4 w-4" />
                                Cargar un Pago
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                    {/* Search and Filters */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative w-full md:w-64 mb-4">
                            <input
                                type="text"
                                placeholder="Buscar por estudiante, ID, monto o estado..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label className="text-sm text-gray-600 dark:text-gray-400">
                                    Fecha de inicio
                                </Label>
                                <Input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={e =>
                                        setFilterStartDate(e.target.value)
                                    }
                                    className="mt-1 dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600 dark:text-gray-400">
                                    Fecha de pago
                                </Label>
                                <Input
                                    type="date"
                                    value={filterPaymentDate}
                                    onChange={e =>
                                        setFilterPaymentDate(e.target.value)
                                    }
                                    className="mt-1 dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600 dark:text-gray-400">
                                    Fecha de expiración
                                </Label>
                                <Input
                                    type="date"
                                    value={filterExpirationDate}
                                    onChange={e =>
                                        setFilterExpirationDate(e.target.value)
                                    }
                                    className="mt-1 dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Plan
                                </p>
                                <p className="font-medium dark:text-white">
                                    <select onChange={e => setFilterPlan(e.target.value)} value={filterPlan} className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option value="">
                                            Sin plan
                                        </option>
                                        {planNames.map(plan => (
                                            <option key={plan.id} value={plan.id}>
                                                {plan.name}
                                            </option>
                                        ))}
                                    </select>
                                </p>
                            </div>
                        </div>
                        {/* Mostrar resultados de búsqueda */}
                        {searchTerm && (
                            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                Mostrando {filteredPayments.length} de{' '}
                                {payments.length} pagos
                                {filteredPayments.length !==
                                    payments.length && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400">
                                        Limpiar búsqueda
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Payments table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/80 dark:bg-[#272b2b] text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('id')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            ID
                                            {sortConfig?.key === 'id' &&
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
                                                handleSort('student_full_name')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Estudiante
                                            {sortConfig?.key ===
                                                'student_full_name' &&
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
                                            onClick={() => handleSort('amount')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Monto
                                            {sortConfig?.key === 'amount' &&
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
                                                handleSort('payment_date')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Fecha de Pago
                                            {sortConfig?.key ===
                                                'payment_date' &&
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
                                                handleSort('expiration_date')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Vencimiento
                                            {sortConfig?.key ===
                                                'expiration_date' &&
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
                                    <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-red-500 dark:text-red-400">
                                            {error}
                                        </td>
                                    </tr>
                                ) : paginatedPayments.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            {searchTerm ||
                                            filterStartDate ||
                                            filterPaymentDate ||
                                            filterExpirationDate ||
                                            filterPlan
                                                ? 'No se encontraron pagos que coincidan con los filtros'
                                                : 'No se encontraron pagos'}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedPayments.map(payment => (
                                        <tr
                                            key={payment.id}
                                            className={`${getRowColor(
                                                payment.status || '',
                                            )} hover:bg-gray-50/50 dark:hover:bg-slate-800/70 ${
                                                selectedPayment?.id ===
                                                payment.id
                                                    ? 'ring-2 ring-inset ring-purple-500'
                                                    : ''
                                            } cursor-pointer`}
                                            onClick={() =>
                                                handlePaymentClick(payment)
                                            }>
                                            <td className="px-4 py-3">
                                                {payment.id}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {payment.student_full_name ||
                                                    (payment.student
                                                        ? `${payment.student.name} ${payment.student.last_name}`
                                                        : 'No disponible')}
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatCurrency(
                                                    Number(payment.amount),
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatDate(
                                                    payment.payment_date || '',
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatDate(
                                                    payment.expiration_date ||
                                                        '',
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        payment.status?.toLowerCase() ===
                                                        'pagado'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                            : payment.status?.toLowerCase() ===
                                                              'pendiente'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            router.push(
                                                                `/admin/payments/edit/${payment.id}`,
                                                            )
                                                        }}
                                                        className="h-8 w-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            handleDeletePayment(
                                                                payment.id,
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
                            onClick={() => setCurrentPage(prev => prev - 1)}>
                            <p className="dark:text-white">← Anterior</p>
                        </Button>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}>
                            <p className="dark:text-white">Siguiente →</p>
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

                {/* Payment details section - only visible when a payment is selected */}
                {selectedPayment && (
                    <div className="mt-6 bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Detalles del Pago: #{selectedPayment.id}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPayment(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                Cerrar
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {/* Student Information */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                    Información del Estudiante
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Nombre
                                            </p>
                                            <p className="dark:text-white">
                                                {selectedPayment.student_full_name ||
                                                    (selectedPayment.student
                                                        ? `${selectedPayment.student.name} ${selectedPayment.student.last_name}`
                                                        : 'No disponible')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                ID Estudiante
                                            </p>
                                            <p className="dark:text-white">
                                                {selectedPayment.student_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                    Información del Pago
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Monto
                                            </p>
                                            <p className="text-green-600 dark:text-green-400 font-semibold">
                                                {formatCurrency(
                                                    Number(
                                                        selectedPayment.amount,
                                                    ),
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Estado
                                            </p>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    selectedPayment.status?.toLowerCase() ===
                                                    'pagado'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                        : selectedPayment.status?.toLowerCase() ===
                                                          'pendiente'
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                }`}>
                                                {selectedPayment.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                    Fechas
                                </h4>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 p-2 rounded-md">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Fecha de inicio:
                                            </span>
                                            <span className="font-medium dark:text-white">
                                                {formatDate(
                                                    selectedPayment.date_start ||
                                                        '',
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 p-2 rounded-md">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Fecha de pago:
                                            </span>
                                            <span className="font-medium dark:text-white">
                                                {formatDate(
                                                    selectedPayment.payment_date ||
                                                        '',
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 p-2 rounded-md">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Fecha de expiración:
                                            </span>
                                            <span className="font-medium dark:text-white">
                                                {formatDate(
                                                    selectedPayment.expiration_date ||
                                                        '',
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Class Information */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                    Información de Clase
                                </h4>
                                <div className="bg-gray-50/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                    <p className="text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            ID de Clase:
                                        </span>{' '}
                                        <span className="font-medium dark:text-white">
                                            {selectedPayment.classSchedule_id ||
                                                'No asignado'}
                                        </span>
                                    </p>
                                    {selectedPayment.classSchedule && (
                                        <p className="text-sm mt-2">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Nombre de Clase:
                                            </span>{' '}
                                            <span className="font-medium dark:text-white">
                                                {selectedPayment.classSchedule
                                                    .class?.name ||
                                                    'No especificado'}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="md:col-span-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-[#1f2122] backdrop-blur">
                                <div className="flex justify-between items-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={openPaymentDetailsModal}
                                        className="text-purple-600 border-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-900/20">
                                        Ver detalles completos
                                    </Button>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/payments/edit/${selectedPayment.id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2 dark:text-white">
                                                <Edit2 className="h-4 w-4" />
                                                Editar
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex items-center gap-2 dark:text-red-500"
                                            onClick={() =>
                                                handleDeletePayment(
                                                    selectedPayment.id,
                                                )
                                            }>
                                            <Trash2 className="h-4 w-4" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile new payment button */}
                <div className="sm:hidden flex justify-center mt-6">
                    <Link href="/admin/payments/create/new" className="w-full">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Cargar un Pago
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
