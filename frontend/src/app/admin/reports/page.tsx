'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Users,
    TrendingUp,
    DollarSign,
    Clock,
    Award,
    BarChart3,
    ArrowLeft,
    Download,
    RefreshCw,
    BookOpen,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/admin/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStudents } from '@/hooks/students'
import { useTeachers } from '@/hooks/teachers'
import type {
    Student,
    Teacher,
    StudentReportData,
    TeacherReportData,
    PaymentReportData,
} from '@/app/admin/types'

export default function ReportsPage() {
    const router = useRouter()
    const { getStudents } = useStudents()
    const { getTeachers } = useTeachers()

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [loading, setLoading] = useState<boolean>(true)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [studentData, setStudentData] = useState<StudentReportData>({
        totalStudents: 0,
        activeStudents: 0,
        inactiveStudents: 0,
        studentsWithDebt: 0,
        studentsByClass: [],
        studentsBySchedule: [],
        recentRegistrations: 0,
    })
    const [teacherData, setTeacherData] = useState<TeacherReportData>({
        totalTeachers: 0,
        teachersByStudents: [],
        teachersByClass: [],
    })
    const [paymentData, setPaymentData] = useState<PaymentReportData>({
        totalRevenue: 0,
        monthlyRevenue: 0,
        revenueByClass: [],
        averagePayment: 0,
        pendingPayments: 0,
        overduePayments: 0,
    })

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatMonthYear = (date: Date): string => {
        return new Intl.DateTimeFormat('es-AR', {
            month: 'long',
            year: 'numeric',
        }).format(date)
    }

    const goToPreviousMonth = (): void => {
        setSelectedDate(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(newDate.getMonth() - 1)
            return newDate
        })
    }

    const goToNextMonth = (): void => {
        const now = new Date()
        const nextMonth = new Date(selectedDate)
        nextMonth.setMonth(nextMonth.getMonth() + 1)

        // Don't allow going beyond current month
        if (nextMonth <= now) {
            setSelectedDate(nextMonth)
        }
    }

    const goToCurrentMonth = (): void => {
        setSelectedDate(new Date())
    }

    const isCurrentMonth = (): boolean => {
        const now = new Date()
        return (
            selectedDate.getMonth() === now.getMonth() &&
            selectedDate.getFullYear() === now.getFullYear()
        )
    }

    const fetchReportData = async (): Promise<void> => {
        try {
            setLoading(true)

            // Fetch students and teachers
            const [studentsResponse, teachersResponse] = await Promise.all([
                getStudents(),
                getTeachers(),
            ])

            const students: Student[] = studentsResponse.students || []
            const teachers: Teacher[] = teachersResponse.teachers || []

            const firstDayOfMonth = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                1,
            )
            const lastDayOfMonth = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth() + 1,
                0,
                23,
                59,
                59,
            )

            // Process student data
            const activeStudents = students.filter(
                s => s.status === 'activo',
            ).length
            const inactiveStudents = students.filter(
                s => s.status === 'inactivo',
            ).length
            const studentsWithDebt = students.filter(
                s => s.daysOverdue && s.daysOverdue > 0,
            ).length

            const classCounts = new Map<string, Set<string>>()
            students.forEach(student => {
                if (student.payments && student.payments.length > 0) {
                    student.payments.forEach(payment => {
                        const paymentDate = payment.payment_date
                            ? new Date(payment.payment_date)
                            : null
                        if (
                            paymentDate &&
                            paymentDate >= firstDayOfMonth &&
                            paymentDate <= lastDayOfMonth &&
                            payment.classSchedule?.class?.name
                        ) {
                            const className = payment.classSchedule.class.name
                            if (!classCounts.has(className)) {
                                classCounts.set(className, new Set())
                            }
                            classCounts.get(className)?.add(student.id)
                        }
                    })
                }
            })

            const studentsByClass = Array.from(classCounts.entries())
                .map(([className, studentIds]) => ({
                    className,
                    count: studentIds.size,
                }))
                .sort((a, b) => b.count - a.count)

            const scheduleCounts = new Map<string, Set<string>>()
            students.forEach(student => {
                if (student.payments && student.payments.length > 0) {
                    student.payments.forEach(payment => {
                        const paymentDate = payment.payment_date
                            ? new Date(payment.payment_date)
                            : null
                        if (
                            paymentDate &&
                            paymentDate >= firstDayOfMonth &&
                            paymentDate <= lastDayOfMonth &&
                            payment.classSchedule?.schedule?.timeslots
                        ) {
                            payment.classSchedule.schedule.timeslots.forEach(
                                timeslot => {
                                    const hour = Array.isArray(timeslot.hour)
                                        ? timeslot.hour[0]
                                        : timeslot.hour
                                    if (hour) {
                                        if (!scheduleCounts.has(hour)) {
                                            scheduleCounts.set(hour, new Set())
                                        }
                                        scheduleCounts
                                            .get(hour)
                                            ?.add(student.id)
                                    }
                                },
                            )
                        }
                    })
                }
            })

            const studentsBySchedule = Array.from(scheduleCounts.entries())
                .map(([schedule, studentIds]) => ({
                    schedule,
                    count: studentIds.size,
                }))
                .sort((a, b) => b.count - a.count)

            const recentRegistrations = students.filter(s => {
                if (s.registration_date) {
                    const regDate = new Date(s.registration_date)
                    return (
                        regDate >= firstDayOfMonth && regDate <= lastDayOfMonth
                    )
                }
                return false
            }).length

            setStudentData({
                totalStudents: students.length,
                activeStudents,
                inactiveStudents,
                studentsWithDebt,
                studentsByClass,
                studentsBySchedule: studentsBySchedule.slice(0, 10),
                recentRegistrations,
            })

            const teacherStudentCounts = new Map<string, Set<string>>()
            const teacherClassStudents = new Map<
                string,
                Map<string, Set<string>>
            >()

            students.forEach(student => {
                if (student.payments && student.payments.length > 0) {
                    student.payments.forEach(payment => {
                        const paymentDate = payment.payment_date
                            ? new Date(payment.payment_date)
                            : null
                        if (
                            paymentDate &&
                            paymentDate >= firstDayOfMonth &&
                            paymentDate <= lastDayOfMonth &&
                            payment.classSchedule?.schedule?.timeslots
                        ) {
                            payment.classSchedule.schedule.timeslots.forEach(
                                timeslot => {
                                    // Find teacher for this schedule
                                    teachers.forEach(teacher => {
                                        if (
                                            teacher.schedules &&
                                            teacher.schedules.length > 0
                                        ) {
                                            teacher.schedules.forEach(
                                                schedule => {
                                                    if (
                                                        schedule.timeslots &&
                                                        schedule.timeslots
                                                            .length > 0
                                                    ) {
                                                        schedule.timeslots.forEach(
                                                            teacherTimeslot => {
                                                                if (
                                                                    teacherTimeslot.id ===
                                                                    timeslot.id
                                                                ) {
                                                                    const teacherFullName = `${teacher.name} ${teacher.last_name}`

                                                                    // Count total students per teacher
                                                                    if (
                                                                        !teacherStudentCounts.has(
                                                                            teacherFullName,
                                                                        )
                                                                    ) {
                                                                        teacherStudentCounts.set(
                                                                            teacherFullName,
                                                                            new Set(),
                                                                        )
                                                                    }
                                                                    teacherStudentCounts
                                                                        .get(
                                                                            teacherFullName,
                                                                        )
                                                                        ?.add(
                                                                            student.id,
                                                                        )

                                                                    // Count students per teacher per class
                                                                    const className =
                                                                        payment
                                                                            .classSchedule
                                                                            ?.class
                                                                            ?.name ||
                                                                        'Sin clase'
                                                                    if (
                                                                        !teacherClassStudents.has(
                                                                            teacherFullName,
                                                                        )
                                                                    ) {
                                                                        teacherClassStudents.set(
                                                                            teacherFullName,
                                                                            new Map(),
                                                                        )
                                                                    }
                                                                    const teacherClasses =
                                                                        teacherClassStudents.get(
                                                                            teacherFullName,
                                                                        )!
                                                                    if (
                                                                        !teacherClasses.has(
                                                                            className,
                                                                        )
                                                                    ) {
                                                                        teacherClasses.set(
                                                                            className,
                                                                            new Set(),
                                                                        )
                                                                    }
                                                                    teacherClasses
                                                                        .get(
                                                                            className,
                                                                        )
                                                                        ?.add(
                                                                            student.id,
                                                                        )
                                                                }
                                                            },
                                                        )
                                                    }
                                                },
                                            )
                                        }
                                    })
                                },
                            )
                        }
                    })
                }
            })

            const teachersByStudents = Array.from(
                teacherStudentCounts.entries(),
            )
                .map(([teacherName, studentIds]) => ({
                    teacherName,
                    studentCount: studentIds.size,
                }))
                .sort((a, b) => b.studentCount - a.studentCount)

            const teachersByClass = Array.from(
                teacherClassStudents.entries(),
            ).flatMap(([teacherName, classes]) =>
                Array.from(classes.entries()).map(
                    ([className, studentIds]) => ({
                        teacherName,
                        className,
                        studentCount: studentIds.size,
                    }),
                ),
            )
            teachersByClass.sort((a, b) => b.studentCount - a.studentCount)

            setTeacherData({
                totalTeachers: teachers.length,
                teachersByStudents,
                teachersByClass: teachersByClass.slice(0, 10),
            })

            let totalRevenue = 0
            let monthlyRevenue = 0
            const classRevenue = new Map<string, number>()
            let pendingPayments = 0
            let overduePayments = 0

            const now = new Date()

            students.forEach(student => {
                if (student.payments && student.payments.length > 0) {
                    student.payments.forEach(payment => {
                        const amount = Number(payment.amount) || 0
                        const paymentDate = payment.payment_date
                            ? new Date(payment.payment_date)
                            : null

                        // Only count payments from selected month
                        if (
                            paymentDate &&
                            paymentDate >= firstDayOfMonth &&
                            paymentDate <= lastDayOfMonth
                        ) {
                            monthlyRevenue += amount

                            // Revenue by class
                            const className =
                                payment.classSchedule?.class?.name ||
                                'Sin clase'
                            classRevenue.set(
                                className,
                                (classRevenue.get(className) || 0) + amount,
                            )

                            // Pending and overdue payments
                            if (payment.status === 'pendiente') {
                                pendingPayments++
                            }
                            if (
                                payment.expiration_date &&
                                new Date(payment.expiration_date) < now
                            ) {
                                overduePayments++
                            }
                        }

                        // Total revenue (all time)
                        totalRevenue += amount
                    })
                }
            })

            const revenueByClass = Array.from(classRevenue.entries())
                .map(([className, revenue]) => ({ className, revenue }))
                .sort((a, b) => b.revenue - a.revenue)

            const monthlyPaymentsCount = students.reduce((sum, s) => {
                if (s.payments && s.payments.length > 0) {
                    const monthPayments = s.payments.filter(p => {
                        const paymentDate = p.payment_date
                            ? new Date(p.payment_date)
                            : null
                        return (
                            paymentDate &&
                            paymentDate >= firstDayOfMonth &&
                            paymentDate <= lastDayOfMonth
                        )
                    })
                    return sum + monthPayments.length
                }
                return sum
            }, 0)
            const averagePayment =
                monthlyPaymentsCount > 0
                    ? monthlyRevenue / monthlyPaymentsCount
                    : 0

            setPaymentData({
                totalRevenue,
                monthlyRevenue,
                revenueByClass,
                averagePayment,
                pendingPayments,
                overduePayments,
            })
        } catch (error) {
            console.error('Error fetching report data:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchReportData()
    }, [selectedDate])

    const handleRefresh = (): void => {
        setRefreshing(true)
        fetchReportData()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="dark:text-white dark:border-gray-600">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                    Informes y Estadísticas
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Vista general del rendimiento del gimnasio
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="dark:text-white dark:border-gray-600 bg-transparent">
                                <RefreshCw
                                    className={`h-4 w-4 mr-2 ${
                                        refreshing ? 'animate-spin' : ''
                                    }`}
                                />
                                Actualizar
                            </Button>
                            <Button
                                variant="outline"
                                className="dark:text-white dark:border-gray-600 bg-transparent">
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Link href="/admin" className="hover:text-purple-600">
                            Admin
                        </Link>
                        {' > '}
                        <span className="text-gray-900 dark:text-white">
                            Informes
                        </span>
                    </nav>

                    <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur border-gray-200 dark:border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToPreviousMonth}
                                    className="dark:text-white dark:border-gray-600 bg-transparent">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                            {formatMonthYear(selectedDate)}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {isCurrentMonth()
                                                ? 'Mes actual'
                                                : 'Rendimiento histórico'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!isCurrentMonth() && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={goToCurrentMonth}
                                            className="dark:text-white dark:border-gray-600 bg-transparent">
                                            Hoy
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={goToNextMonth}
                                        disabled={isCurrentMonth()}
                                        className="dark:text-white dark:border-gray-600 bg-transparent">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 dark:text-white text-black">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-90">
                                <Users className="h-4 w-4" />
                                Total Alumnos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {studentData.totalStudents}
                            </div>
                            <p className="text-xs opacity-80 mt-1">
                                {studentData.activeStudents} activos,{' '}
                                {studentData.inactiveStudents} inactivos
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 dark:text-white text-black">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-90">
                                <DollarSign className="h-4 w-4" />
                                Ingresos del Mes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {formatCurrency(paymentData.monthlyRevenue)}
                            </div>
                            <p className="text-xs opacity-80 mt-1">
                                {formatCurrency(paymentData.totalRevenue)} total
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 dark:text-white text-black">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-90">
                                <UserCheck className="h-4 w-4" />
                                Total Profesores
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {teacherData.totalTeachers}
                            </div>
                            <p className="text-xs opacity-80 mt-1">
                                {teacherData.teachersByStudents.length > 0
                                    ? `${teacherData.teachersByStudents[0].studentCount} alumnos (máx)`
                                    : 'Sin datos'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 dark:text-white text-black">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-90">
                                <TrendingUp className="h-4 w-4" />
                                Nuevas Inscripciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {studentData.recentRegistrations}
                            </div>
                            <p className="text-xs opacity-80 mt-1">
                                En {formatMonthYear(selectedDate)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Students by Class */}
                    <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Alumnos por Clase
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {studentData.studentsByClass.length > 0 ? (
                                <div className="space-y-3">
                                    {studentData.studentsByClass
                                        .slice(0, 8)
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                                        {item.className}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full max-w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-purple-500 rounded-full"
                                                            style={{
                                                                width: `${
                                                                    (item.count /
                                                                        studentData
                                                                            .studentsByClass[0]
                                                                            .count) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[2rem] text-right">
                                                        {item.count}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No hay datos disponibles
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Students by Schedule */}
                    <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                Alumnos por Horario
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {studentData.studentsBySchedule.length > 0 ? (
                                <div className="space-y-3">
                                    {studentData.studentsBySchedule.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {item.schedule}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full max-w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{
                                                                width: `${
                                                                    (item.count /
                                                                        studentData
                                                                            .studentsBySchedule[0]
                                                                            .count) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[2rem] text-right">
                                                        {item.count}
                                                    </span>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No hay datos disponibles
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Teachers by Students */}
                    <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                                Profesores con Más Alumnos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {teacherData.teachersByStudents.length > 0 ? (
                                <div className="space-y-3">
                                    {teacherData.teachersByStudents
                                        .slice(0, 8)
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                                        {item.teacherName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full max-w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500 rounded-full"
                                                            style={{
                                                                width: `${
                                                                    (item.studentCount /
                                                                        teacherData
                                                                            .teachersByStudents[0]
                                                                            .studentCount) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[2rem] text-right">
                                                        {item.studentCount}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No hay datos disponibles
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Revenue by Class */}
                    <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                Ingresos por Clase
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {paymentData.revenueByClass.length > 0 ? (
                                <div className="space-y-3">
                                    {paymentData.revenueByClass
                                        .slice(0, 8)
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                                        {item.className}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full max-w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-full"
                                                            style={{
                                                                width: `${
                                                                    (item.revenue /
                                                                        paymentData
                                                                            .revenueByClass[0]
                                                                            .revenue) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[4rem] text-right">
                                                        {formatCurrency(
                                                            item.revenue,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No hay datos disponibles
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pago Promedio
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(paymentData.averagePayment)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pagos Pendientes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {paymentData.pendingPayments}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pagos Vencidos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {paymentData.overduePayments}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Alumnos con Deuda
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {studentData.studentsWithDebt}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
