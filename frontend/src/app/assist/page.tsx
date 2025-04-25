'use client'

/* eslint-disable react-hooks/rules-of-hooks */

import { useState, useEffect } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Home,
    Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useAttendances } from '@/hooks/attendances'

interface Class {
    id: string
    name: string
}
interface ClassSchedule {
    id: string
    class: Class
    time_start: string
    time_end: string
    selectedDays: string[]
}
interface Student {
    id: string
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
}
interface Attendance {
    id: string
    classSchedule: ClassSchedule
    student: Student
    status: string
    date: string
    created_at: string
    updated_at: string
}

interface ClassAttendance {
    name: string
    time: string
}

interface DayAttendance {
    date: number
    classes: ClassAttendance[]
}

const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1
}

const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
]

export default function Assists() {
    const { getAttendancesForCurrentStudent } = useAttendances()

    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [currentYear, setCurrentYear] = useState<number>(
        new Date().getFullYear(),
    )
    const [currentMonth, setCurrentMonth] = useState<number>(
        new Date().getMonth(),
    )
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedDay, setSelectedDay] = useState<
        DayAttendance | Attendance | null
    >(null)

    const today = new Date()

    useEffect(() => {
        let isMounted = true

        const fetchAttendances = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getAttendancesForCurrentStudent()
                if (isMounted) {
                    setAttendances(response.attendances)
                    setSelectedDay(null)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar los datos de asistencia')
                    console.error(err)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchAttendances()

        return () => {
            isMounted = false
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMonth, currentYear])

    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    const calendarDays = []
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day)
    }

    const getDayAttendance = (day: number) => {
        return (
            attendances?.find(
                a =>
                    new Date(a.date).getDate() === day &&
                    new Date(a.date).getFullYear() === currentYear &&
                    new Date(a.date).getMonth() === currentMonth,
            ) || null
        )
    }

    const navigateMonth = (direction: number) => {
        let newMonth = currentMonth + direction
        let newYear = currentYear

        if (newMonth < 0) {
            newMonth = 11
            newYear--
        } else if (newMonth > 11) {
            newMonth = 0
            newYear++
        }

        setCurrentMonth(newMonth)
        setCurrentYear(newYear)
    }

    const isToday = (day: number) => {
        return (
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear() &&
            day === today.getDate()
        )
    }

    const handleDaySelect = (day: number) => {
        const attendance = getDayAttendance(day)
        setSelectedDay(attendance)
    }

    const renderCalendarDay = (day: number | null, index: number) => {
        if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square"></div>
        }

        const attendance = getDayAttendance(day)
        const hasAttendance = !!attendance
        const dayIsToday = isToday(day)
        const isSelected = selectedDay?.date === day

        return (
            <button
                key={`day-${day}`}
                className={`aspect-square rounded-full flex items-center text-gray-400 justify-center text-sm relative
          ${
              hasAttendance
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium'
                  : dayIsToday
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
          ${isSelected ? 'ring-2 ring-purple-500 dark:ring-purple-400' : ''}
          ${dayIsToday ? 'ring-1 ring-purple-500 dark:ring-purple-400' : ''}`}
                onClick={() => handleDaySelect(day)}
                disabled={!hasAttendance}>
                {day}
                {hasAttendance && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 dark:bg-green-400 rounded-full"></span>
                )}
            </button>
        )
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 px-6 bg-black">
            {/* Blurred background effect */}
            <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/40 via-emerald-600/30 to-black blur-3xl" />

            {/* Assists Card */}
            <div className="w-full max-w-md shadow-lg relative z-10 border border-opacity-50 rounded-lg bg-white/85 dark:bg-slate-900/80 backdrop-blur overflow-hidden">
                {/* Card Header */}
                <div className="flex flex-col items-center p-6 pb-2">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        <h2 className="text-2xl font-bold text-gray-900 text-center">
                            Asistencias
                        </h2>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center justify-between w-full mb-4">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Mes anterior">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h3 className="text-lg text-gray-900 font-medium">
                            {monthNames[currentMonth]} {currentYear}
                        </h3>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Mes siguiente">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-4">
                    {/* Day names */}
                    <div className="grid grid-cols-7 mb-2">
                        {dayNames.map((day, i) => (
                            <div
                                key={i}
                                className="text-center text-sm font-medium text-gray-700">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-16">
                            {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, i) =>
                                renderCalendarDay(day, i),
                            )}
                        </div>
                    )}
                </div>

                {/* Attendance Details */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 text-lg mb-3">
                        {selectedDay
                            ? `Clases asistidas el día ${new Date(
                                  selectedDay.date,
                              ).getDate()}`
                            : 'Selecciona un día para ver detalles'}
                    </h3>
                    {selectedDay ? (
                        <div className="space-y-3">
                            <div className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-md">
                                        {'classSchedule' in selectedDay
                                            ? selectedDay.classSchedule.class
                                                  .name
                                            : ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {'classSchedule' in selectedDay
                                            ? selectedDay.classSchedule
                                                  .time_start
                                            : ''}
                                    </span>{' '}
                                    -{' '}
                                    <span>
                                        {'classSchedule' in selectedDay
                                            ? selectedDay.classSchedule.time_end
                                            : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                            {loading
                                ? 'Cargando datos...'
                                : 'No hay asistencias seleccionadas'}
                        </div>
                    )}
                </div>

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
