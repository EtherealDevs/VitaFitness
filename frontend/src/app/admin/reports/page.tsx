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
    Search,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/admin/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Input from '@/components/ui/Input'
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
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [activeTab, setActiveTab] = useState<
        'overview' | 'classes' | 'teachers' | 'revenue'
    >('overview')

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
                studentsBySchedule,
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
                teachersByClass,
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

                        if (
                            paymentDate &&
                            paymentDate >= firstDayOfMonth &&
                            paymentDate <= lastDayOfMonth
                        ) {
                            monthlyRevenue += amount

                            const className =
                                payment.classSchedule?.class?.name ||
                                'Sin clase'
                            classRevenue.set(
                                className,
                                (classRevenue.get(className) || 0) + amount,
                            )

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
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    const filteredClassesData = studentData.studentsByClass.filter(item =>
        item.className.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredTeachersData = teacherData.teachersByClass.filter(
        item =>
            item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.className.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredRevenueData = paymentData.revenueByClass.filter(item =>
        item.className.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="px-4 md:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.back()}
                                className="dark:border-gray-600">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <BarChart3 className="h-6 w-6 text-purple-600" />
                                    Informes
                                </h1>
                                <nav className="text-xs text-gray-500 dark:text-gray-400">
                                    <Link
                                        href="/admin"
                                        className="hover:text-purple-600">
                                        Admin
                                    </Link>
                                    {' / '}
                                    <span>Informes</span>
                                </nav>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="dark:border-gray-600 bg-transparent">
                                <RefreshCw
                                    className={`h-4 w-4 ${
                                        refreshing ? 'animate-spin' : ''
                                    }`}
                                />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="dark:border-gray-600 bg-transparent">
                                <Download className="h-4 w-4 mr-1" />
                                Exportar
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={goToPreviousMonth}
                            className="h-8 w-8 p-0">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                {formatMonthYear(selectedDate)}
                            </span>
                            {!isCurrentMonth() && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={goToCurrentMonth}
                                    className="h-6 text-xs px-2">
                                    Hoy
                                </Button>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={goToNextMonth}
                            disabled={isCurrentMonth()}
                            className="h-8 w-8 p-0">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6 max-w-full">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Total Alumnos
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {studentData.totalStudents}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {studentData.activeStudents} activos
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 opacity-75" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Ingresos Mes
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {formatCurrency(
                                            paymentData.monthlyRevenue,
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {formatCurrency(
                                            paymentData.averagePayment,
                                        )}{' '}
                                        promedio
                                    </p>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 opacity-75" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Profesores
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {teacherData.totalTeachers}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        activos
                                    </p>
                                </div>
                                <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-75" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Nuevos
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {studentData.recentRegistrations}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        inscripciones
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400 opacity-75" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
                    <div className="flex gap-1 px-4 pt-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                                activeTab === 'overview'
                                    ? 'bg-gray-50 dark:bg-gray-900 text-purple-600 border-t border-x border-gray-200 dark:border-gray-700'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}>
                            Vista General
                        </button>
                        <button
                            onClick={() => setActiveTab('classes')}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                                activeTab === 'classes'
                                    ? 'bg-gray-50 dark:bg-gray-900 text-purple-600 border-t border-x border-gray-200 dark:border-gray-700'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}>
                            Por Clase
                        </button>
                        <button
                            onClick={() => setActiveTab('teachers')}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                                activeTab === 'teachers'
                                    ? 'bg-gray-50 dark:bg-gray-900 text-purple-600 border-t border-x border-gray-200 dark:border-gray-700'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}>
                            Por Profesor
                        </button>
                        <button
                            onClick={() => setActiveTab('revenue')}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                                activeTab === 'revenue'
                                    ? 'bg-gray-50 dark:bg-gray-900 text-purple-600 border-t border-x border-gray-200 dark:border-gray-700'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}>
                            Ingresos
                        </button>
                    </div>
                </div>

                <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            id='placeholder'
                            name='placeholder'
                            placeholder="Buscar en la tabla..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        />
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Students by Class Table */}
                        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-purple-600" />
                                    Alumnos por Clase
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-auto max-h-96">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                            <tr>
                                                <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                                                    #
                                                </th>
                                                <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                                                    Clase
                                                </th>
                                                <th className="text-right px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                                                    Alumnos
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentData.studentsByClass
                                                .length > 0 ? (
                                                studentData.studentsByClass.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                                                                {item.className}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold">
                                                                {item.count}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                        No hay datos disponibles
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Students by Schedule Table */}
                        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    Alumnos por Horario
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-auto max-h-96">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                            <tr>
                                                <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                                                    Horario
                                                </th>
                                                <th className="text-right px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                                                    Alumnos
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentData.studentsBySchedule
                                                .length > 0 ? (
                                                studentData.studentsBySchedule.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                                            <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                                                                {item.schedule}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold">
                                                                {item.count}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={2}
                                                        className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                        No hay datos disponibles
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'classes' && (
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-purple-600" />
                                Detalle de Clases
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-auto">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                #
                                            </th>
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                Clase
                                            </th>
                                            <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                Alumnos
                                            </th>
                                            <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                % del Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClassesData.length > 0 ? (
                                            filteredClassesData.map(
                                                (item, index) => {
                                                    const percentage =
                                                        studentData.totalStudents >
                                                        0
                                                            ? (
                                                                  (item.count /
                                                                      studentData.totalStudents) *
                                                                  100
                                                              ).toFixed(1)
                                                            : '0.0'
                                                    return (
                                                        <tr
                                                            key={index}
                                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                                                                {item.className}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold">
                                                                {item.count}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                                                                {percentage}%
                                                            </td>
                                                        </tr>
                                                    )
                                                },
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                    {searchTerm
                                                        ? 'No se encontraron resultados'
                                                        : 'No hay datos disponibles'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'teachers' && (
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Award className="h-4 w-4 text-green-600" />
                                Profesores por Clase
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-auto">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                #
                                            </th>
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                Profesor
                                            </th>
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                Clase
                                            </th>
                                            <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                Alumnos
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTeachersData.length > 0 ? (
                                            filteredTeachersData.map(
                                                (item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                                                            {item.teacherName}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                            {item.className}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold">
                                                            {item.studentCount}
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                    {searchTerm
                                                        ? 'No se encontraron resultados'
                                                        : 'No hay datos disponibles'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'revenue' && (
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                Ingresos por Clase
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-auto">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                #
                                            </th>
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                Clase
                                            </th>
                                            <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                Ingresos
                                            </th>
                                            <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                                % del Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRevenueData.length > 0 ? (
                                            filteredRevenueData.map(
                                                (item, index) => {
                                                    const percentage =
                                                        paymentData.monthlyRevenue >
                                                        0
                                                            ? (
                                                                  (item.revenue /
                                                                      paymentData.monthlyRevenue) *
                                                                  100
                                                              ).toFixed(1)
                                                            : '0.0'
                                                    return (
                                                        <tr
                                                            key={index}
                                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                                                                {item.className}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold">
                                                                {formatCurrency(
                                                                    item.revenue,
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                                                                {percentage}%
                                                            </td>
                                                        </tr>
                                                    )
                                                },
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                    {searchTerm
                                                        ? 'No se encontraron resultados'
                                                        : 'No hay datos disponibles'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot className="border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                                                TOTAL:
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(
                                                    paymentData.monthlyRevenue,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                                                100%
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                Pago Promedio
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                {formatCurrency(paymentData.averagePayment)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                Pagos Pendientes
                            </p>
                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
                                {paymentData.pendingPayments}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                Pagos Vencidos
                            </p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">
                                {paymentData.overduePayments}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                Con Deuda
                            </p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">
                                {studentData.studentsWithDebt}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
