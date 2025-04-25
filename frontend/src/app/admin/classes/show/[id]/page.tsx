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
import AddStudentsModal from '@/components/ui/add-students-modal'
import AddTeachersModal from '@/components/ui/add-teachers-modal'
import { useClassSchedules } from '@/hooks/classSchedules'
import { useClassTeachers } from '@/hooks/classTeachers'
import { useClassStudents } from '@/hooks/classStudents'
import AddTimeslotModal from '@/components/ui/add-timeslot-modal'
import { useParams } from 'next/navigation'

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
interface ClassSchedule {
    id: string
    class: Class
    schedule: Schedule
    selectedDays: string[]
    timeslots: TimeSlot[]
    students: string[]
    teachers: string[]
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
    id: string
    hour: [string]
    students: string[]
    professors: string[]
    classStudents: ClassStudent[] // Added this property
    classTeachers: ClassTeacher[] // Added this property
}

export default function AdminSchedulePanel() {
    const { getClassSchedule } = useClassSchedules()
    const { deleteClassTeacher } = useClassTeachers()
    const { deleteClassStudent } = useClassStudents()
    const { id } = useParams()
    const params = { id: id as string }

    const [scheduleData, setScheduleData] = useState<ClassSchedule>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedDay] = useState<string | null>(null)
    const [isPanelOpen] = useState<boolean>(false)
    const [expandedTimeSlots, setExpandedTimeSlots] = useState<
        Record<string, boolean>
    >({})
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false)
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false)
    const [isTimeslotModalOpen, setIsTimeslotModalOpen] =
        useState<boolean>(false)

    // Fetch schedule data
    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            if (!isMounted) return

            setLoading(true)
            setError(null)

            try {
                const res = await getClassSchedule(params.id)

                if (isMounted) {
                    setScheduleData(res.classSchedule)
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
    }, [getClassSchedule, params.id])
    console.log(scheduleData)
    // Handle day selection

    // Get the selected day's schedule
    // const getSelectedDaySchedule = () => {
    //     return scheduleData.find(schedule => schedule.day === selectedDay)
    // }

    // Toggle time slot expansion
    const toggleTimeSlot = (timeSlotId: string) => {
        setExpandedTimeSlots(prev => ({
            ...prev,
            [timeSlotId]: !prev[timeSlotId],
        }))
    }
    const handleDeleteTeacher = async (id: string) => {
        try {
            const res = await deleteClassTeacher(id)
            console.log('Deleted successfully:', res)
            const isMounted = true

            const fetchData = async () => {
                if (!isMounted) return

                setLoading(true)
                setError(null)

                try {
                    const res = await getClassSchedule(params.id)

                    if (isMounted) {
                        setScheduleData(res.classSchedule)
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
        } catch (err) {
            console.error('Error deleting teacher:', err)
        }
    }
    const handleDeleteStudent = async (id: string) => {
        try {
            const res = await deleteClassStudent(id)
            console.log('Deleted successfully:', res)
            const isMounted = true

            const fetchData = async () => {
                if (!isMounted) return

                setLoading(true)
                setError(null)

                try {
                    const res = await getClassSchedule(params.id)

                    if (isMounted) {
                        setScheduleData(res.classSchedule)
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
        } catch (err) {
            console.error('Error deleting student:', err)
        }
    }

    // Handle deletion of items

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start p-4">
            {isStudentModalOpen && (
                <AddStudentsModal
                    onClose={() => setIsStudentModalOpen(false)}
                    classScheduleId={params.id}
                    timeslots={scheduleData?.timeslots || []}
                    isStudentModalOpen={isStudentModalOpen}
                />
            )}
            {isTeacherModalOpen && (
                <AddTeachersModal
                    onClose={() => setIsTeacherModalOpen(false)}
                    classScheduleId={params.id}
                    timeslots={scheduleData?.timeslots || []}
                    isTeacherModalOpen={isTeacherModalOpen}
                />
            )}
            {isTimeslotModalOpen && (
                <AddTimeslotModal
                    onClose={() => setIsTimeslotModalOpen(false)}
                    classScheduleId={params.id}
                    isTimeslotModalOpen={isTimeslotModalOpen}
                />
            )}

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
          md:w-1/3'`}>
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
                            {scheduleData?.selectedDays?.map(schedule => (
                                <div
                                    key={schedule}
                                    className={`w-full px-6 py-4 flex items-center justify-between text-left`}>
                                    <span className="font-medium">
                                        {schedule}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail panel - only visible when a day is selected */}
                <div
                    className={`bg-white/80 dark:bg-transparent backdrop-blur shadow-lg rounded-lg border border-opacity-50 overflow-hidden
            mt-4 md:mt-0 transition-all duration-300 ease-in-out md:w-2/3`}>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Horarios</h2>
                        <div className="flex justify-end mb-4">
                            <div className="relative inline-block admin-menu-container">
                                <button
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    <span>Administrar</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                                        <div className="py-1">
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                onClick={() => {
                                                    setIsTimeslotModalOpen(true)
                                                }}>
                                                <Clock className="h-4 w-4" />
                                                <span>Agregar horario</span>
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                onClick={() => {
                                                    setIsStudentModalOpen(true)
                                                }}>
                                                <UserPlus className="h-4 w-4" />
                                                <span>Agregar estudiante</span>
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                onClick={() => {
                                                    setIsTeacherModalOpen(true)
                                                }}>
                                                <Plus className="h-4 w-4" />
                                                <span>Agregar profesor</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {scheduleData?.timeslots?.map((slot, index) => {
                                const timeSlotId = `${selectedDay}-${slot.hour}-${index}`
                                const isExpanded =
                                    expandedTimeSlots[timeSlotId] || false

                                return (
                                    <div
                                        key={index}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                            <div
                                                className="flex-1"
                                                onClick={() =>
                                                    toggleTimeSlot(timeSlotId)
                                                }>
                                                <h3 className="font-medium text-purple-700 dark:text-purple-400">
                                                    {slot.hour}
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
                                                            // handleDelete(
                                                            //     'timeslot',
                                                            //     dayIndex,
                                                            //     index,
                                                            // )
                                                        }
                                                    }}
                                                    title="Eliminar horario">
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Eliminar horario
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
                                                    {slot.classStudents.length >
                                                    0 ? (
                                                        <ul className="pl-4">
                                                            {slot.classStudents.map(
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
                                                                            {student
                                                                                .student
                                                                                ?.name +
                                                                                ' ' +
                                                                                student
                                                                                    .student
                                                                                    ?.last_name +
                                                                                ' ' +
                                                                                student
                                                                                    .student
                                                                                    ?.dni}
                                                                        </span>
                                                                        <button
                                                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                                                                            onClick={() =>
                                                                                handleDeleteStudent(
                                                                                    student.id,
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
                                                            - Sin estudiantes -
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Profesores:
                                                    </p>
                                                    {slot.classTeachers.length >
                                                    0 ? (
                                                        <ul className="pl-4">
                                                            {slot.classTeachers.map(
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
                                                                            {professor
                                                                                .teacher
                                                                                ?.name +
                                                                                ' ' +
                                                                                professor
                                                                                    .teacher
                                                                                    ?.last_name +
                                                                                ' ' +
                                                                                professor
                                                                                    .teacher
                                                                                    ?.dni}
                                                                        </span>
                                                                        <button
                                                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                                                                            onClick={() =>
                                                                                handleDeleteTeacher(
                                                                                    professor.id,
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
                                                            - Sin profesores -
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
