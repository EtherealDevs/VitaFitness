'use client'

import { useState, useEffect, use } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Home,
    Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useAttendances } from '@/hooks/attendances'

// Types for our attendance data

interface Class {
    id: string
    name: string
}
interface Branch {
    id: string
    name: string
    address: string
}
interface Plan {
    id: string
    name: string
    description: string
    status: string
}
interface ClassSchedule {
    id: string
    class: Class
    timeStart: string
    timeEnd: string
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

interface MonthAttendance {
    month: number // 0-11 (JavaScript month)
    year: number
    days: DayAttendance[]
}



// Helper functions for calendar
const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay()
    // Convert to Monday-first format (0 = Monday, 6 = Sunday)
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

// Mock API function to simulate fetching attendance data
const fetchAttendanceData = async (
    year: number,
    month: number,
): Promise<MonthAttendance> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Generate some random attendance data for the month
    const daysInMonth = getDaysInMonth(year, month)
    const days: DayAttendance[] = []

    // Current date
    const today = new Date()
    const isCurrentMonth =
        today.getFullYear() === year && today.getMonth() === month

    // Generate between 5-10 attendance days
    const numAttendanceDays = Math.floor(Math.random() * 6) + 5
    const classTypes = ['Yoga', 'Pilates', 'Meditación', 'Zumba', 'Spinning']
    const classTimes = [
        '08:00 - 09:00',
        '10:00 - 11:00',
        '18:00 - 19:30',
        '19:00 - 20:00',
    ]

    // Generate past attendance for current month, or random attendance for other months
    const usedDays = new Set<number>()

    for (let i = 0; i < numAttendanceDays; i++) {
        // For current month, only generate attendance for past days
        let day
        let attempts = 0

        // Try to find an unused day (with a limit to prevent infinite loops)
        while (attempts < 20) {
            if (isCurrentMonth) {
                // Generate a day between 1 and today's date
                day = Math.floor(Math.random() * today.getDate()) + 1
            } else {
                // Generate a day between 1 and days in month
                day = Math.floor(Math.random() * daysInMonth) + 1
            }

            // Check if this day is already used
            if (!usedDays.has(day)) {
                usedDays.add(day)
                break
            }

            attempts++
        }

        // If we couldn't find an unused day after several attempts, skip this iteration
        if (attempts >= 20) continue

        // Generate 1-2 classes for this day
        const numClasses = Math.floor(Math.random() * 2) + 1
        const classes: ClassAttendance[] = []

        for (let j = 0; j < numClasses; j++) {
            const classType =
                classTypes[Math.floor(Math.random() * classTypes.length)]
            const classTime =
                classTimes[Math.floor(Math.random() * classTimes.length)]

            classes.push({
                name: classType,
                time: classTime,
            })
        }

        days.push({
            date: day ?? 0, // Default to 0 if day is undefined
            classes,
        })
    }

    // Sort days in ascending order
    days.sort((a, b) => a.date - b.date)

    return {
        month,
        year,
        days,
    }
}


export default function Assists() {
    const { getAttendancesForCurrentStudent } = useAttendances()
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const fetchAttendances = async () => {
        try {
            const response = await getAttendancesForCurrentStudent()
            setAttendances(response.attendances)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    useEffect(() => {
        fetchAttendances()
    }, [])
    console.log(attendances)
    
    // Get current date
    const today = new Date()

    // Define all state variables at the top level
    const [currentYear, setCurrentYear] = useState<number>(today.getFullYear())
    const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth())
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [attendanceData, setAttendanceData] =
        useState<MonthAttendance | null>(null)
    const [selectedDay, setSelectedDay] = useState<DayAttendance | null | Attendance>(null)
    console.log(selectedDay)
    // Fetch attendance data when month/year changes
    useEffect(() => {
        let isMounted = true

        const getAttendanceData = async () => {
            if (!isMounted) return

            setLoading(true)
            setError(null)

            try {
                const data = await fetchAttendances()

                if (isMounted) {
                    setAttendanceData(data)
                    setSelectedDay(null) // Reset selected day when month changes
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

        getAttendanceData()

        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false
        }
    }, [currentMonth, currentYear])

    // Calendar calculations
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    // Create calendar grid
    const calendarDays = []

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day)
    }

    // Function to check if a day has attendance
    const getDayAttendance = (day: number) => {
        return attendances?.find(a => new Date(a.date).getDate() === day && new Date(a.date).getFullYear() === currentYear && new Date(a.date).getMonth() === currentMonth) || null
    }

    // Function to navigate between months
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

    // Check if a day is today
    const isToday = (day: number) => {
        return (
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear() &&
            day === today.getDate()
        )
    }

    // Function to handle day selection
    const handleDaySelect = (day: number) => {
        const attendance = getDayAttendance(day)
        setSelectedDay(attendance)
    }

    // Render calendar day
    const renderCalendarDay = (day: number | null, index: number) => {
        if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square"></div>
        }

        const attendance = getDayAttendance(day)
        const hasAttendance = !!attendance
        const scheduledDays = attendance?.classSchedule.selectedDays
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
                            ? `Clases asistidas el día ${ new Date(selectedDay.date).getDate()}` 
                            : 'Selecciona un día para ver detalles'}
                    </h3>
                    {selectedDay ? (
                        <div className="space-y-3">
                                <div
                                    className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-md">
                                            {selectedDay.classSchedule.class.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>{selectedDay.classSchedule.time_start}</span> - <span>{selectedDay.classSchedule.time_end}</span>
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
