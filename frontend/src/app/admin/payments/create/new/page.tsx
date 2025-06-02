'use client'

import type React from 'react'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    User,
    DollarSign,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    Save,
    X,
    Phone,
    CreditCard,
    Info,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/admin/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/app/admin/components/ui/label'
import { Input } from '@/app/admin/components/ui/input'
import { useStudents } from '@/hooks/students'
import { usePayments } from '@/hooks/payments'

// Interfaces
interface Student {
    id: string
    name: string
    last_name: string
    phone: string
    dni: string
    status: string
    payments?: Payment[]
    accountInfo?: AccountInfo
    daysOverdue?: number
    paymentDueDate?: string
}

interface Payment {
    id: string
    amount: number
    payment_date: string
    expiration_date: string
    status: string
    classSchedule?: {
        class: {
            id: string
            name: string
        }
    }
}

interface AccountInfo {
    lastPaymentAmount: number
    lastPaymentPlan: string
    lastPaymentDate: string
}

interface Class {
    id: string
    name: string
}

interface FormData {
    student_id: string
    class_id: string
    amount: string
    status: string
    start_date: string
    payment_date: string
    expiration_date: string
}

export default function CreatePaymentPage() {
    const router = useRouter()
    const { getStudents } = useStudents()
    const { createPayment } = usePayments() // Eliminamos getClasses que no existe

    // Estados principales
    const [students, setStudents] = useState<Student[]>([])
    const [classes, setClasses] = useState<Class[]>([]) // Mantenemos el estado pero lo llenaremos de otra manera
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(false)
    const [fetchingData, setFetchingData] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Estado del formulario
    const [formData, setFormData] = useState<FormData>({
        student_id: '',
        class_id: '',
        amount: '',
        status: 'pendiente',
        start_date: '',
        payment_date: '',
        expiration_date: '',
    })

    // Función para formatear fechas

    // Función para formatear moneda
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    // Función para obtener fechas sugeridas
    const getSuggestedDates = useCallback(() => {
        const today = new Date()
        const nextMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate(),
        )

        return {
            today: today.toISOString().split('T')[0],
            nextMonth: nextMonth.toISOString().split('T')[0],
        }
    }, [])

    // Función para obtener clases (simulada ya que no existe getClasses)
    const fetchClasses = useCallback(async () => {
        try {
            // Simulamos la obtención de clases desde la API
            // Esto debe ser reemplazado por tu método real de obtener clases

            // Opción 1: Si tienes un endpoint específico para clases
            // const response = await fetch('/api/classes');
            // const data = await response.json();
            // return data.classes || [];

            // Opción 2: Si puedes extraer clases de los estudiantes
            const studentsResponse = await getStudents()
            const allClasses = new Map()

            // Extraer clases únicas de los pagos de los estudiantes
            studentsResponse.students.forEach((student: Student) => {
                if (student.payments) {
                    student.payments.forEach((payment: Payment) => {
                        if (payment.classSchedule?.class) {
                            const classItem = payment.classSchedule.class
                            allClasses.set(classItem.id, {
                                id: classItem.id,
                                name: classItem.name,
                            })
                        }
                    })
                }
            })

            // Convertir el Map a un array
            return Array.from(allClasses.values())
        } catch (error) {
            console.error('Error obteniendo clases:', error)
            return []
        }
    }, [getStudents])

    // Cargar datos iniciales
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setFetchingData(true)
                setError(null)

                // Cargar estudiantes
                const studentsResponse = await getStudents()
                setStudents(studentsResponse.students || [])

                // Cargar clases usando nuestra función personalizada
                const classesData = await fetchClasses()
                setClasses(classesData)

                    const dates = getSuggestedDates()
                    setFormData(prev => ({
                        ...prev,
                        payment_date: dates.today,
                        start_date: dates.today,
                        expiration_date: dates.nextMonth,
                    }))
            } catch (error) {
                console.error('Error cargando datos:', error)
                setError('Error al cargar los datos necesarios')
            } finally {
                setFetchingData(false)
            }
        }

        loadInitialData()
    }, [getStudents, fetchClasses, getSuggestedDates])

    // Manejar cambio de estudiante
    const handleStudentChange = (studentId: string) => {
        const student = students.find(s => s.id === studentId)
        setSelectedStudent(student || null)

        setFormData(prev => ({
            ...prev,
            student_id: studentId,
            amount:
                student?.accountInfo?.lastPaymentAmount?.toString() ||
                prev.amount,
        }))
    }

    // Manejar cambios en el formulario
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }))
        setError(null)
    }

    // Validar formulario
    const validateForm = () => {
        const errors: string[] = []

        if (!formData.student_id) errors.push('Debe seleccionar un alumno')
        if (!formData.class_id) errors.push('Debe seleccionar una clase')
        if (!formData.amount || Number.parseFloat(formData.amount) <= 0)
            errors.push('El monto debe ser mayor a 0')
        if (!formData.payment_date)
            errors.push('Debe ingresar la fecha de pago')
        if (!formData.start_date)
            errors.push('Debe ingresar la fecha de inicio')
        if (!formData.expiration_date)
            errors.push('Debe ingresar la fecha de expiración')

        // Validar fechas
        const startDate = new Date(formData.start_date)
        const expirationDate = new Date(formData.expiration_date)
        const paymentDate = new Date(formData.payment_date)

        if (expirationDate <= startDate) {
            errors.push(
                'La fecha de expiración debe ser posterior a la fecha de inicio',
            )
        }

        if (paymentDate > expirationDate) {
            errors.push(
                'La fecha de pago no puede ser posterior a la fecha de expiración',
            )
        }

        return errors
    }

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '))
            return
        }

        setLoading(true)
        setError(null)

        try {
            const paymentData = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                paymentData.append(key, value)
            })

            await createPayment(paymentData)
            setSuccess(true)

            // Limpiar localStorage
            localStorage.removeItem('selectedStudentForPayment')

            // Redirigir después de un breve delay
            setTimeout(() => {
                router.push('/admin/payments')
            }, 2000)
        } catch (error) {
            console.error('Error creando pago:', error)
            setError('Error al crear el pago. Por favor, intente nuevamente.')
        } finally {
            setLoading(false)
        }
    }
    if (fetchingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full p-4">
            <div className="w-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="dark:text-white dark:border-gray-600">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                Cargar Nuevo Pago
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Complete la información para registrar un nuevo
                                pago
                            </p>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <nav className="text-sm text-gray-500 dark:text-gray-400">
                        <Link href="/admin" className="hover:text-purple-600">
                            Admin
                        </Link>
                        {' > '}
                        <Link
                            href="/admin/students"
                            className="hover:text-purple-600">
                            Alumnos
                        </Link>
                        {' > '}
                        <span className="text-gray-900 dark:text-white">
                            Nuevo Pago
                        </span>
                    </nav>
                </div>

                {/* Mensaje de éxito */}
                {success && (
                    <Card className="mb-6 bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-medium">
                                    ¡Pago creado exitosamente! Redirigiendo...
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Mensaje de error */}
                {error && (
                    <Card className="mb-6 bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                                <AlertCircle className="h-5 w-5" />
                                <span>{error}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setError(null)}
                                    className="ml-auto">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg border border-opacity-50 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Información del Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Selección de Alumno y Clase */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="student_id">Alumno</Label>
                                    <select
                                        id="student_id"
                                        value={formData.student_id}
                                        onChange={e =>
                                            handleStudentChange(e.target.value)
                                        }
                                        disabled={loading}
                                        className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm p-2 text-sm dark:bg-[#363a3b] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        required>
                                        <option value="">
                                            Seleccionar alumno
                                        </option>
                                        {students.map(student => (
                                            <option
                                                key={student.id}
                                                value={student.id}>
                                                {student.name}{' '}
                                                {student.last_name} - DNI:{' '}
                                                {student.dni}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="class_id">Clase</Label>
                                    <select
                                        id="class_id"
                                        value={formData.class_id}
                                        onChange={e =>
                                            handleInputChange(
                                                'class_id',
                                                e.target.value,
                                            )
                                        }
                                        disabled={loading}
                                        className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm p-2 text-sm dark:bg-[#363a3b] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        required>
                                        <option value="">
                                            Seleccionar clase
                                        </option>
                                        {classes.map(classItem => (
                                            <option
                                                key={classItem.id}
                                                value={classItem.id}>
                                                {classItem.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Monto y Estado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label
                                        htmlFor="amount"
                                        className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        Monto
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.amount}
                                        onChange={e =>
                                            handleInputChange(
                                                'amount',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        disabled={loading}
                                        className="dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="status">Estado</Label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={e =>
                                            handleInputChange(
                                                'status',
                                                e.target.value,
                                            )
                                        }
                                        disabled={loading}
                                        className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm p-2 text-sm dark:bg-[#363a3b] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                                        <option value="pendiente">
                                            Pendiente
                                        </option>
                                        <option value="pagado">Pagado</option>
                                        <option value="vencido">Vencido</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fechas */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label
                                        htmlFor="start_date"
                                        className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Fecha de Inicio
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={e =>
                                            handleInputChange(
                                                'start_date',
                                                e.target.value,
                                            )
                                        }
                                        disabled={loading}
                                        className="dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="payment_date"
                                        className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Fecha de Pago
                                    </Label>
                                    <Input
                                        id="payment_date"
                                        type="date"
                                        value={formData.payment_date}
                                        onChange={e =>
                                            handleInputChange(
                                                'payment_date',
                                                e.target.value,
                                            )
                                        }
                                        disabled={loading}
                                        className="dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="expiration_date"
                                        className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Fecha de Expiración
                                    </Label>
                                    <Input
                                        id="expiration_date"
                                        type="date"
                                        value={formData.expiration_date}
                                        onChange={e =>
                                            handleInputChange(
                                                'expiration_date',
                                                e.target.value,
                                            )
                                        }
                                        disabled={loading}
                                        className="dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                    className="dark:text-white dark:border-gray-600">
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]">
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Guardando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            Guardar Pago
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}
