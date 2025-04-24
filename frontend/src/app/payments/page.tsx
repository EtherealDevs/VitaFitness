'use client'

import { useState, useEffect } from 'react'
import { Home, CreditCard, CheckCircle, AlertCircle, Clock, XCircle, ClockAlert } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import { Student } from '../admin/students/columns'
import { Payment, usePayments } from '@/hooks/payments'

interface PaymentSummary {
    paidPayments: Payment[]
    isUpToDate: boolean
    nextPayments: Payment[]
    totalPaid: number
    paymentHistory: Payment[]
}
// interface nextPayment {
//     nextPaymentDate: string | null
//     nextPaymentAmount: number | null
//     nextPaymentClass: string | null
// }
// Format currency helper
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(amount)
}

// Format date helper
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

// Calculate days remaining or overdue
const getDaysRemaining = (dateString: string): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const targetDate = new Date(dateString)
    targetDate.setHours(0, 0, 0, 0)

    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
}


export default function PaymentHistory() {
    // State variables
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [paymentData, setPaymentData] = useState<PaymentSummary | null>(null)
    // Removed unused 'payment' state variable
    const [student, setStudent] = useState<Student>()
    const { getPaymentStudent, uploadComprobante } = usePayments()
    const { user } = useAuth()

    const fetchStudentData = async () => {
        if (!user?.dni) return
        try {
            const response = await axios.get('/api/student/search', {
                params: {
                    field: 'dni',
                    search: user.dni,
                },
            })
            const studentData = response.data.students[0]
            setStudent(studentData)
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const fetchPaymentData = async (
        payments: Payment[],
    ): Promise<PaymentSummary> => {
        const paidPayments = payments.filter(
            p => p.status.toLowerCase() === 'pagado',
        )

        const totalPaid = paidPayments.reduce(
            (sum, p) => sum + parseFloat(p.amount),
            0,
        )

        const sortedPayments = [...paidPayments].sort(
            (a, b) =>
                new Date(b.payment_date).getTime() -
                new Date(a.payment_date).getTime(),
        )

        const lastPayment = sortedPayments[0]

        const upcomingPayments = payments.filter(p => {
            if (!p.expiration_date) return false
            const daysRemaining = getDaysRemaining(p.expiration_date)
            return daysRemaining >= 0
        })
        console.log("upcoming payments")
        console.log(upcomingPayments)

        // const nextPayment = upcomingPayments.sort(
        //     (a, b) =>
        //         new Date(a.expiration_date).getTime() -
        //         new Date(b.expiration_date).getTime(),
        // )[0]
        const nextPayments = upcomingPayments.sort(
            (a, b) =>
                new Date(a.expiration_date).getTime() -
                new Date(b.expiration_date).getTime(),
        )

        console.log("next payments")
        console.log(nextPayments)
        
        return {
            paidPayments,
            isUpToDate: !payments.some(p => {
                if (!p.expiration_date || p.status.toLowerCase() === 'pagado')
                    return false
                return getDaysRemaining(p.expiration_date) < 0
            }),
            nextPayments: nextPayments,
            totalPaid,
            paymentHistory: payments.map(p => ({
                id: String(p.id),
                date: p.payment_date,
                amount: parseFloat(p.amount).toString(),
                className: p.classSchedule?.class?.name || 'Clase no disponible',
                status: p.status.toLowerCase(),
                classSchedule: p.classSchedule || null,
                classSchedule_id: p.classSchedule?.id || '',
                student_id: p.student_id || '',
                student: p.student || '',
                expiration_date: p.expiration_date || '',
                date_start: p.date_start || '',
                payment_date: p.payment_date || '',
                created_at: p.created_at || '',
                updated_at: p.updated_at || '',
            })),
        }
    }

    const fetchPayments = async () => {
        if (!student) return
        try {
            const response = await getPaymentStudent(student.id)
            const payments = response.payment
            const summary = await fetchPaymentData(payments)
            setPaymentData(summary)
        } catch (error) {
            console.error(error)
            setError('Error al obtener los pagos')
        }
    }

    // Fetch payment data on component mount
    useEffect(() => {
        setLoading(true)
        if (user?.dni) {
            fetchStudentData()
        }
    }, [user])
    useEffect(() => {
        if (student) {
            fetchPayments()
        }
        setLoading(false)
    }, [student])

    // Get status details for next payment
    const getNextPaymentStatus = (payment: Payment) => {
        if (!payment.expiration_date) return null
            const daysRemaining = getDaysRemaining(payment.expiration_date)

            if (payment.status === 'pendiente') {
                return {
                    label: 'Pago pendiente',
                    daysText: `Pago pendiente a confirmación.`,
                    colorClass: 'text-red-600 dark:text-red-400',
                    bgClass: 'bg-red-100 dark:bg-red-900/30',
                    icon: (
                        <ClockAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    ),
                    nextPaymentDate: "---",
                }
            } else if (daysRemaining < 0) {
                return {
                    label: 'Pago vencido',
                    daysText: `Vencido hace ${Math.abs(daysRemaining)} días`,
                    colorClass: 'text-red-600 dark:text-red-400',
                    bgClass: 'bg-red-100 dark:bg-red-900/30',
                    icon: (
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ),
                    nextPaymentDate: payment.expiration_date,
                }
            } else if (daysRemaining === 0) {
                return {
                    label: 'Pago hoy',
                    daysText: 'Vence hoy',
                    colorClass: 'text-amber-600 dark:text-amber-400',
                    bgClass: 'bg-amber-100 dark:bg-amber-900/30',
                    icon: (
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    ),
                    nextPaymentDate: payment.expiration_date,
                }
            } else if (daysRemaining <= 7) {
                return {
                    label: 'Próximo pago',
                    daysText: `Vence en ${daysRemaining} días`,
                    colorClass: 'text-amber-600 dark:text-amber-400',
                    bgClass: 'bg-amber-100 dark:bg-amber-900/30',
                    icon: (
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    ),
                }
            } else {
                return {
                    label: 'Próximo pago',
                    daysText: `Vence en ${daysRemaining} días`,
                    colorClass: 'text-green-600 dark:text-green-400',
                    bgClass: 'bg-green-100 dark:bg-green-900/30',
                    icon: (
                        <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ),
                    nextPaymentDate: payment.expiration_date,
                }
            }
    }
    const calculateAvailableClasses = (paidPayments: Payment[]) => {
        const availableClasses: Payment[] = []
        const seenClassNames = new Set()
    
        paidPayments.forEach(payment => {
            if (payment.status === 'pagado') {
                const className = payment.classSchedule?.class?.name
                if (className && !seenClassNames.has(className)) {
                    seenClassNames.add(className)
                    availableClasses.push(payment)
                }
            }
        })
    
        return availableClasses
    }
    const renderNextPaymentStatus = (paymentData: any) => {
        if (!paymentData?.nextPayments || paymentData.nextPayments.length === 0) {
            return null;
        }
    
        return paymentData.nextPayments
            .filter(p => p.expiration_date)
            .map((payment: Payment, index: number) => {
                const nextPaymentStatus = getNextPaymentStatus(payment);
                if (!nextPaymentStatus) return null;

                const renderUploadButton = () => {
                if (payment.status === 'pendiente' || payment.status === 'rechazado') {
                    return (
                        <div className="pt-2 space-y-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                ¿Ya realizaste el pago?
                            </p>
                            <label
                                htmlFor={`comprobante-${index}`}
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 cursor-pointer transition">
                                Cargar comprobante
                            </label>
                            <input
                                id={`comprobante-${index}`}
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        console.log('Archivo cargado:', file);
                                        const formData = new FormData();
                                        formData.append("comprobante", file);
                                        formData.append("payment_id", payment.id);
    
                                        try {
                                            const response = await uploadComprobante(formData);
                                            const data = await response.json();
                                            console.log("Archivo subido con éxito:", data);
                                        } catch (err) {
                                            console.error("Fallo en la carga:", err);
                                        }
                                    }
                                }}
                            />
                        </div>
                        )
                    }
                }
    
                return (
                    <div
                        key={index}
                        className={`rounded-lg p-4 space-y-2 ${nextPaymentStatus.bgClass}`}>
                        <div className="flex items-center gap-2">
                            {nextPaymentStatus.icon}
                            <h4 className={`font-semibold ${nextPaymentStatus.colorClass}`}>
                                {nextPaymentStatus.label}
                            </h4>
                        </div>
    
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {nextPaymentStatus.daysText}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fecha de vencimiento:{' '}
                            <span className="font-medium">
                                {nextPaymentStatus.nextPaymentDate === "---" ? "No disponible" : formatDate(nextPaymentStatus.nextPaymentDate)}
                            </span>
                        </p>
                        {renderUploadButton()}
                        
                    </div>
                );
            })
            .filter(Boolean); // Remove any nulls from invalid statuses
    };

    
    console.log(paymentData)
    // console.log(nextPaymentStatus)
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 px-10 bg-black">
            {/* Blurred background effect */}
            <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/40 via-emerald-600/30 to-black blur-3xl" />

            {/* Payment History Card */}
            <div className="w-full max-w-md shadow-lg relative z-10 border border-opacity-50 rounded-lg bg-white/85 dark:bg-slate-900/80 backdrop-blur overflow-hidden">
                {/* Card Header */}
                <div className="flex flex-col items-center p-6 pb-2">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                            Estado de Pagos
                        </h2>
                    </div>
                </div>

                {/* Card Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-16">
                        {error}
                    </div>
                ) : paymentData ? (
                    <div className="p-6 space-y-6">
                        {/* Payment Status Summary */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                            <div className="flex items-center gap-2">
                                {paymentData.isUpToDate ? (
                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                )}
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    {paymentData.isUpToDate
                                        ? 'Pagos al día'
                                        : 'Pagos pendientes'}
                                </h3>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total pagado
                                    </p>
                                    <p className="font-semibold text-gray-700 text-lg">
                                        {formatCurrency(paymentData.totalPaid)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Clases activas
                                    </p>
                                    <p className="font-medium text-purple-600">
                                        {calculateAvailableClasses(paymentData.paidPayments).map(payment => payment.classSchedule?.class?.name).join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {renderNextPaymentStatus(paymentData)}

                        {/* Payment History */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 text-lg">
                                Historial de pagos
                            </h3>

                            {paymentData.paymentHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {paymentData.paymentHistory.map(payment => (
                                        <div
                                            key={payment.id}
                                            className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                            <span
                                                className={`px-2 py-1 text-sm font-medium rounded-md
                                                    ${
                                                        payment.status === 'pagado'
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                            : payment.status === 'pendiente'
                                                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                                            : payment.status === 'rechazado'
                                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {payment.classSchedule?.class?.name}
                                            </span>
                                                <span className="text-sm text-gray-500 font-medium">
                                                    {formatDate(
                                                        payment.payment_date,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">

                                                    {payment.status === 'pagado' ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    ) : payment.status === 'pendiente' ? (
                                                        <ClockAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                    ) : payment.status === 'rechazado' ? (
                                                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                    ) : null}

                                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-gray-700">
                                                    {formatCurrency(
                                                        parseFloat(
                                                            payment.amount,
                                                        ),
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    No hay pagos registrados
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Back to Main Page Button */}
                <div className="p-4 pt-2">
                    <Link href="/">
                        <button className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Home className="h-5 w-5" />
                            Volver a la página principal
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
