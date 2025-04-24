'use client'

import {
    ChevronRight,
    ChevronDown,
    Plus,
    Trash2,
    UserPlus,
    Clock,
    UserX,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface Timeslot {
    id: number
    hour: string
    classStudents: ClassStudent[]
    classTeachers: ClassTeacher[]
}

interface Schedule {
    id: number
    selectedDays: string[]
    timeslots: Timeslot[]
    time_start: string
    time_end: string
}

interface Plan {
    id: number
    name: string
    description: string
    status: string
}

interface Branch {
    id: number
    name: string
    address: string
}

interface Class {
    id: string
    name: string
    max_students: number
    plan: Plan
    branch: Branch
    precio: number
    schedules: Schedule[]
    timeslots: Timeslot[]
}
interface ClassStudent {
    id: string
    student: Student
}
interface ClassTeacher {
    id: string
    teacher: Teacher
}
interface Student {
    id: string
    name: string
    last_name: string
    registration_date: string
    status: 'activo' | 'inactivo' | 'pendiente'
    email: string
    phone: string
    dni: string
}
interface Teacher {
    id: string
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
}
interface TimeSlot {
    time: string
    students: string[]
    professors: string[]
}

interface DaySchedule {
    day: string
    timeSlots: TimeSlot[]
}

// Mock data for schedules
const mockScheduleData: DaySchedule[] = [
    {
        day: 'Lunes',
        timeSlots: [
            {
                time: '08:00:00',
                students: [
                    'First Student Name',
                    'Second Student Name',
                    'Third Student Name',
                ],
                professors: [],
            },
            {
                time: '09:00:00',
                students: [
                    'First Student Name',
                    'Second Student Name',
                    'Third Student Name',
                ],
                professors: [],
            },
            {
                time: '10:00:00',
                students: ['First Student Name'],
                professors: [],
            },
            {
                time: '11:00:00',
                students: [],
                professors: [],
            },
            {
                time: '12:00:00',
                students: [],
                professors: [],
            },
        ],
    },
    {
        day: 'Martes',
        timeSlots: [
            {
                time: '08:00:00',
                students: ['Maria González', 'Juan Pérez'],
                professors: ['Prof. Rodriguez'],
            },
            {
                time: '09:00:00',
                students: ['Ana López', 'Carlos Sánchez'],
                professors: ['Prof. Martinez'],
            },
        ],
    },
    {
        day: 'Miércoles',
        timeSlots: [
            {
                time: '10:00:00',
                students: ['Laura Díaz', 'Pedro Fernández'],
                professors: ['Prof. Gómez'],
            },
            {
                time: '11:00:00',
                students: ['Sofia Ruiz'],
                professors: ['Prof. Hernández'],
            },
        ],
    },
    {
        day: 'Jueves',
        timeSlots: [
            {
                time: '09:00:00',
                students: ['Miguel Torres', 'Isabel Vargas'],
                professors: ['Prof. López'],
            },
            {
                time: '10:00:00',
                students: ['Roberto Mendoza'],
                professors: ['Prof. Sánchez'],
            },
        ],
    },
    {
        day: 'Viernes',
        timeSlots: [
            {
                time: '08:00:00',
                students: ['Carmen Ortiz', 'Daniel Morales'],
                professors: ['Prof. Flores'],
            },
            {
                time: '12:00:00',
                students: ['Elena Castro'],
                professors: ['Prof. Ramírez'],
            },
        ],
    },
]

export default function AdminSchedulePanel() {
    const [scheduleData, setScheduleData] = useState<DaySchedule[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedDay, setSelectedDay] = useState<string | null>(null)
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false)
    const [expandedTimeSlots, setExpandedTimeSlots] = useState<
        Record<string, boolean>
    >({})
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    // Fetch schedule data
    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            if (!isMounted) return

            setLoading(true)
            setError(null)

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800))

                if (isMounted) {
                    setScheduleData(mockScheduleData)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar los horarios')
                    console.error(err)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, [])

    // Handle day selection
    const handleDayClick = (day: string) => {
        if (selectedDay === day) {
            // If clicking the same day, toggle the panel
            setIsPanelOpen(!isPanelOpen)
        } else {
            // If clicking a different day, select it and open the panel
            setSelectedDay(day)
            setIsPanelOpen(true)
        }
    }

    // Get the selected day's schedule
    const getSelectedDaySchedule = () => {
        return scheduleData.find(schedule => schedule.day === selectedDay)
    }

    // Toggle time slot expansion
    const toggleTimeSlot = (timeSlotId: string) => {
        setExpandedTimeSlots(prev => ({
            ...prev,
            [timeSlotId]: !prev[timeSlotId],
        }))
    }

    // Handle deletion of items
    const handleDelete = (
        type: 'timeslot' | 'student' | 'professor',
        dayIndex: number,
        slotIndex: number,
        itemIndex?: number,
    ) => {
        // Create a deep copy of the schedule data
        const newScheduleData = JSON.parse(JSON.stringify(scheduleData))

        if (type === 'timeslot') {
            // Remove the entire timeslot
            newScheduleData[dayIndex].timeSlots.splice(slotIndex, 1)
        } else if (type === 'student' && itemIndex !== undefined) {
            // Remove a specific student
            newScheduleData[dayIndex].timeSlots[slotIndex].students.splice(
                itemIndex,
                1,
            )
        } else if (type === 'professor' && itemIndex !== undefined) {
            // Remove a specific professor
            newScheduleData[dayIndex].timeSlots[slotIndex].professors.splice(
                itemIndex,
                1,
            )
        }

        setScheduleData(newScheduleData)

        // Show confirmation message
        alert(`Elemento eliminado correctamente`)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (isMenuOpen && !target.closest('.admin-menu-container')) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start p-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-purple-700 dark:text-purple-400">
                Ver Clases y Horarios
            </h2>
            {/* Main container with responsive behavior */}
            <div
                className={`relative z-10 flex flex-col md:flex-row w-full max-w-4xl transition-all duration-300 ease-in-out
        ${isPanelOpen ? 'md:space-x-4' : 'md:space-x-0'}`}>
                {/* Days panel - always visible but shifts left when detail panel opens */}
                <div
                    className={`bg-white/80 dark:bg-transparent  backdrop-blur shadow-lg rounded-lg border border-opacity-50 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isPanelOpen ? 'md:w-1/3' : 'w-full'}`}>
                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-16">
                            {error}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {scheduleData.map(schedule => (
                                <button
                                    key={schedule.day}
                                    onClick={() => handleDayClick(schedule.day)}
                                    className={`w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors
                    ${
                        selectedDay === schedule.day
                            ? 'bg-gray-100 dark:bg-gray-800/50'
                            : ''
                    }`}>
                                    <span className="font-medium">
                                        {schedule.day}
                                    </span>
                                    {selectedDay === schedule.day &&
                                    isPanelOpen ? (
                                        <ChevronDown className="h-5 w-5 text-dark" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-dark" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail panel - only visible when a day is selected */}
                {isPanelOpen && (
                    <div
                        className={`bg-white/80 dark:bg-transparent backdrop-blur shadow-lg rounded-lg border border-opacity-50 overflow-hidden
            mt-4 md:mt-0 transition-all duration-300 ease-in-out md:w-2/3`}>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Horarios
                            </h2>
                            <div className="flex justify-end mb-4">
                                <div className="relative inline-block admin-menu-container">
                                    <button
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                                        onClick={() =>
                                            setIsMenuOpen(!isMenuOpen)
                                        }>
                                        <span>Administrar</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </button>

                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                                            <div className="py-1">
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                    onClick={() => {
                                                        setIsMenuOpen(false)
                                                        alert(
                                                            'Agregar horario - Funcionalidad a implementar',
                                                        )
                                                    }}>
                                                    <Clock className="h-4 w-4" />
                                                    <span>Agregar horario</span>
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                    onClick={() => {
                                                        setIsMenuOpen(false)
                                                        alert(
                                                            'Agregar estudiante - Funcionalidad a implementar',
                                                        )
                                                    }}>
                                                    <UserPlus className="h-4 w-4" />
                                                    <span>
                                                        Agregar estudiante
                                                    </span>
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                    onClick={() => {
                                                        setIsMenuOpen(false)
                                                        alert(
                                                            'Agregar profesor - Funcionalidad a implementar',
                                                        )
                                                    }}>
                                                    <Plus className="h-4 w-4" />
                                                    <span>
                                                        Agregar profesor
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedDay && getSelectedDaySchedule() ? (
                                <div className="space-y-4">
                                    {getSelectedDaySchedule()?.timeSlots.map(
                                        (slot, index) => {
                                            const timeSlotId = `${selectedDay}-${slot.time}-${index}`
                                            const isExpanded =
                                                expandedTimeSlots[timeSlotId] ||
                                                false
                                            const dayIndex =
                                                scheduleData.findIndex(
                                                    day =>
                                                        day.day === selectedDay,
                                                )

                                            return (
                                                <div
                                                    key={index}
                                                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                                        <div
                                                            className="flex-1"
                                                            onClick={() =>
                                                                toggleTimeSlot(
                                                                    timeSlotId,
                                                                )
                                                            }>
                                                            <h3 className="font-medium text-purple-700 dark:text-purple-400">
                                                                {slot.time}
                                                            </h3>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            '¿Estás seguro de que deseas eliminar este horario?',
                                                                        )
                                                                    ) {
                                                                        handleDelete(
                                                                            'timeslot',
                                                                            dayIndex,
                                                                            index,
                                                                        )
                                                                    }
                                                                }}
                                                                title="Eliminar horario">
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    Eliminar
                                                                    horario
                                                                </span>
                                                            </button>
                                                            {isExpanded ? (
                                                                <ChevronDown
                                                                    className="h-5 w-5 text-purple-600 dark:text-purple-400"
                                                                    onClick={() =>
                                                                        toggleTimeSlot(
                                                                            timeSlotId,
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <ChevronRight
                                                                    className="h-5 w-5 text-purple-600 dark:text-purple-400"
                                                                    onClick={() =>
                                                                        toggleTimeSlot(
                                                                            timeSlotId,
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="p-4 space-y-3">
                                                            <div>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    Estudiantes:
                                                                </p>
                                                                {slot.students
                                                                    .length >
                                                                0 ? (
                                                                    <ul className="pl-4">
                                                                        {slot.students.map(
                                                                            (
                                                                                student,
                                                                                idx,
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        idx
                                                                                    }
                                                                                    className="text-gray-800 dark:text-gray-200 flex items-center justify-between group">
                                                                                    <span>
                                                                                        {
                                                                                            student
                                                                                        }
                                                                                    </span>
                                                                                    <button
                                                                                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                                                                                        onClick={() =>
                                                                                            handleDelete(
                                                                                                'student',
                                                                                                dayIndex,
                                                                                                index,
                                                                                                idx,
                                                                                            )
                                                                                        }
                                                                                        title="Eliminar estudiante">
                                                                                        <UserX className="h-3.5 w-3.5" />
                                                                                        <span className="sr-only">
                                                                                            Eliminar
                                                                                            estudiante
                                                                                        </span>
                                                                                    </button>
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-gray-500 dark:text-gray-400 italic">
                                                                        - Sin
                                                                        estudiantes
                                                                        -
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    Profesores:
                                                                </p>
                                                                {slot.professors
                                                                    .length >
                                                                0 ? (
                                                                    <ul className="pl-4">
                                                                        {slot.professors.map(
                                                                            (
                                                                                professor,
                                                                                idx,
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        idx
                                                                                    }
                                                                                    className="text-gray-800 dark:text-gray-200 flex items-center justify-between group">
                                                                                    <span>
                                                                                        {
                                                                                            professor
                                                                                        }
                                                                                    </span>
                                                                                    <button
                                                                                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                                                                                        onClick={() =>
                                                                                            handleDelete(
                                                                                                'professor',
                                                                                                dayIndex,
                                                                                                index,
                                                                                                idx,
                                                                                            )
                                                                                        }
                                                                                        title="Eliminar profesor">
                                                                                        <UserX className="h-3.5 w-3.5" />
                                                                                        <span className="sr-only">
                                                                                            Eliminar
                                                                                            profesor
                                                                                        </span>
                                                                                    </button>
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-gray-500 dark:text-gray-400 italic">
                                                                        - Sin
                                                                        profesores
                                                                        -
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        },
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    Selecciona un día para ver los horarios
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
