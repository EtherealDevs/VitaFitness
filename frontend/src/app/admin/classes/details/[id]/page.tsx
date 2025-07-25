'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStudents } from '@/hooks/students'
import { useTeachers } from '@/hooks/teachers'
import { useClassSchedules } from '@/hooks/classSchedules'
import { useClassStudents } from '@/hooks/classStudents'
import { useClassTeachers } from '@/hooks/classTeachers'
import { useParams } from 'next/navigation'
import { Button } from '@/app/admin/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    UserPlus,
    UserMinus,
    ChevronDown,
    ChevronUp,
    Edit,
    Trash,
    AlertCircle,
    X,
    Users,
    Clock,
    Search,
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/app/admin/components/ui/badge'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/app/admin/components/ui/tooltip'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/app/admin/components/ui/alert'

// Types for our student data
interface Teacher {
    id: string
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
    created_at: string
    updated_at: string
}

interface ClassStudent {
    id: string
    student: Student
    student_id: string
    schedule_timeslot: ScheduleTimeslot
    timeslot: Timeslot
    timeslotsArray?: CompoundTimeslot[]
}
interface CompoundTimeslot {
    classStudentId: string
    scheduleTimeslotId: string
    hour: string
}

interface ClassTeacher {
    id: string
    teacher: Teacher
    teacher_id: string
}

interface Student {
    id: string
    name: string
    last_name: string
    phone: string
    dni: string
    registration_date: string
    status: 'activo' | 'inactivo' | 'pendiente'
}
interface ScheduleTimeslot {
    id: string
}

interface Timeslot {
    id: string
    hour: string
}

interface Schedule {
    id: number
    days: string[]
}

interface ClassSchedule {
    id: string
    class: { id: string; name: string; branch_id: string; branch_name: string }
    schedule: Schedule
    selectedDays: string[]
    timeslots: Timeslot[]
    students: ClassStudent[]
    teachers: ClassTeacher[]
}

export default function AdminClassDetails() {
    const router = useRouter()
    const { id } = useParams()
    const params = { id: id as string }

    const [schedule, setSchedule] = useState<ClassSchedule>()
    const [loading, setLoading] = useState<boolean>(true)
    const [studentModal, setStudentModal] = useState<string | null>(null)
    const [teacherModal, setTeacherModal] = useState<string | null>(null)
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<boolean>(false)
    const [selectedStudents, setSelectedStudents] = useState<string[]>([])
    const [selectedTeachers, setSelectedTeachers] = useState<string[]>([])
    const [selectedTimeslotId, setSelectedTimeslotId] = useState<string>('')
    const [showInactiveStudents, setShowInactiveStudents] =
        useState<boolean>(false)

    const [filteredActiveStudents, setFilteredActiveStudents] = useState<ClassStudent[]>([])
    const [activeStudentFilterBoolean, setActiveStudentFilterBoolean] = useState<boolean>(false)
    // const [filteredInactiveStudents, setFilteredInactiveStudents] = useState<string[]>([])
    // const [filteredPendingStudents, setFilteredPendingStudents] = useState<string[]>([])

    const [allStudents, setAllStudents] = useState<Student[]>([])
    const [allTeachers, setAllTeachers] = useState<Teacher[]>([])

    // Search term states
    const [studentSearchTerm, setStudentSearchTerm] = useState<string>('')
    const [teacherSearchTerm, setTeacherSearchTerm] = useState<string>('')

    // State for editing student schedule
    const [editingStudent, setEditingStudent] = useState<ClassStudent | null>(
        null,
    )
    const [selectedTimeslotsForEdit, setSelectedTimeslotsForEdit] = useState<
        string[]
    >([])

    const { getClassSchedule, deleteClassSchedule } = useClassSchedules()
    const { createClassTeacher, deleteClassTeacher } = useClassTeachers()
    const { createClassStudent, deleteClassStudent } = useClassStudents()
    const { getStudents } = useStudents()
    const { getTeachers } = useTeachers()

    // Fetch class data
    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            if (!isMounted) return
            setLoading(true)
            try {
                const res = await getClassSchedule(params.id)
                const students = await getStudents()
                const teachers = await getTeachers()

                if (isMounted) {
                    setSchedule(res.classSchedule)
                    setAllStudents(students.students)
                    setAllTeachers(teachers.teachers)
                }
            } catch (err) {
                if (isMounted) {
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
    }, [getClassSchedule, params.id, getStudents, getTeachers])

    const onEdit = (id: string) => {
        router.push(`/admin/classes/edit/${id}`)
    }

    const onDelete = async () => {
        if (!schedule) return

        try {
            await deleteClassSchedule(schedule.id)
            router.push('/admin/classes')
        } catch (error) {
            console.error('Error al eliminar la clase:', error)
            alert('No se pudo eliminar la clase')
        }

        setDeleteConfirmModal(false)
    }

    const onAddStudent = async (id: string, students: string[]) => {
        // Turn an array of student IDs into formData
        const formData = new FormData()
        students.forEach(studentId => {
            formData.append('students[]', studentId)
        })
        formData.append('c_sch_ts_id', selectedTimeslotId)

        try {
            // Send the formData to the backend
            await createClassStudent(formData)

            // Refresh data
            const updatedSchedule = await getClassSchedule(params.id)
            setSchedule(updatedSchedule.classSchedule)
        } catch (error) {
            console.error('Error al agregar estudiantes:', error)
            alert('No se pudieron agregar los estudiantes')
        }
    }

    const onAddTeacher = async (id: string, teachers: string[]) => {
        // Turn an array of teacher IDs into formData
        const formData = new FormData()
        teachers.forEach(teacherId => {
            formData.append('teachers[]', teacherId)
        })
        formData.append('c_sch_ts_id', selectedTimeslotId)

        try {
            // Send the formData to the backend
            await createClassTeacher(formData)

            // Refresh data
            const updatedSchedule = await getClassSchedule(params.id)
            setSchedule(updatedSchedule.classSchedule)
        } catch (error) {
            console.error('Error al agregar profesores:', error)
            alert('No se pudieron agregar los profesores')
        }
    }

    const onRemoveStudentFromClass = async (student: ClassStudent) => {
        if (!student.timeslotsArray || student.timeslotsArray.length === 0) {
            console.warn(
                'Attempted to remove a student with no assigned timeslots.',
            )
            return
        }
        try {
            const removePromises = student.timeslotsArray.map(timeslot =>
                deleteClassStudent(timeslot.classStudentId),
            )
            await Promise.all(removePromises)

            // Refresh data
            const updatedSchedule = await getClassSchedule(params.id)
            setSchedule(updatedSchedule.classSchedule)
        } catch (error) {
            console.error('Error al eliminar al estudiante de la clase:', error)
            alert('No se pudo eliminar al estudiante de la clase.')
        }
    }

    const onRemoveTeacher = async (teacherId: string) => {
        try {
            await deleteClassTeacher(teacherId)

            // Refresh data
            const updatedSchedule = await getClassSchedule(params.id)
            setSchedule(updatedSchedule.classSchedule)
        } catch (error) {
            console.error('Error al eliminar profesor:', error)
            alert('No se pudo eliminar el profesor')
        }
    }

    const handleUpdateStudentSchedule = async () => {
        if (!editingStudent) return
        const originalTimeslotIds =
            editingStudent.timeslotsArray?.map(
                (t: CompoundTimeslot) => t.scheduleTimeslotId,
            ) || []

        const timeslotsToAdd = selectedTimeslotsForEdit.filter(
            id => !originalTimeslotIds.includes(id),
        )

        const timeslotsToRemove =
            editingStudent.timeslotsArray?.filter(
                (t: CompoundTimeslot) =>
                    !selectedTimeslotsForEdit.includes(t.scheduleTimeslotId),
            ) || []

        try {
            // Promises for adding new timeslots
            const addPromises = timeslotsToAdd.map(timeslotId => {
                const formData = new FormData()
                
                formData.append('students[]', editingStudent.student.id)
                formData.append('c_sch_ts_id', timeslotId)

                return createClassStudent(formData)
            })

            // Promises for removing deselected timeslots
            const removePromises = timeslotsToRemove.map(timeslot =>
                deleteClassStudent(timeslot.classStudentId),
            )

            await Promise.all([...addPromises, ...removePromises])

            // Refresh data and close the modal
            const updatedSchedule = await getClassSchedule(params.id)
            setSchedule(updatedSchedule.classSchedule)
            setEditingStudent(null)
            setSelectedTimeslotsForEdit([]) // Limpiar el estado
        } catch (error) {
            console.error(
                'Error al actualizar el horario del estudiante:',
                error,
            )
            alert('No se pudo actualizar el horario.')
        }
    }

    // Función para manejar el cambio de checkbox en el modal de edición
    const handleTimeslotToggle = (timeslotId: string, checked: boolean) => {
        setSelectedTimeslotsForEdit(prev => {
            if (checked) {
                // Agregar si no está presente
                return prev.includes(timeslotId) ? prev : [...prev, timeslotId]
            } else {
                // Remover si está presente
                return prev.filter(id => id !== timeslotId)
            }
        })
    }

    // Filter functions
    const filteredStudents = allStudents.filter(student => {
        const searchTerm = studentSearchTerm.toLowerCase()
        return (
            student.name.toLowerCase().includes(searchTerm) ||
            student.last_name.toLowerCase().includes(searchTerm) ||
            `${student.name} ${student.last_name}`
                .toLowerCase()
                .includes(searchTerm) ||
            student.dni.toLowerCase().includes(searchTerm)
        )
    })

    const filteredTeachers = allTeachers.filter(teacher => {
        const searchTerm = teacherSearchTerm.toLowerCase()
        return (
            teacher.name.toLowerCase().includes(searchTerm) ||
            teacher.last_name.toLowerCase().includes(searchTerm) ||
            `${teacher.name} ${teacher.last_name}`
                .toLowerCase()
                .includes(searchTerm) ||
            teacher.email.toLowerCase().includes(searchTerm)
        )
    })

    // Handlers for modals
    const handleAddStudents = () => {
        if (studentModal && onAddStudent) {
            onAddStudent(studentModal, selectedStudents)
        }
        setStudentModal(null)
        setSelectedStudents([])
        setSelectedTimeslotId('')
        setStudentSearchTerm('') // Clear search
    }

    const handleAddTeachers = () => {
        if (teacherModal && onAddTeacher) {
            onAddTeacher(teacherModal, selectedTeachers)
        }
        setTeacherModal(null)
        setSelectedTeachers([])
        setSelectedTimeslotId('')
        setTeacherSearchTerm('') // Clear search
    }

    const filterStudentsByTimeslot = (timeslot: string) => {
        const newStudentMap = new Map()

        schedule?.students
            .filter(s => s.student.status === 'activo')
            .filter(s => s.timeslot.hour === timeslot)
            .forEach(s => {
            const compoundTimeslot: CompoundTimeslot = {
                classStudentId: s.id,
                scheduleTimeslotId: s.schedule_timeslot.id,
                hour: s.timeslot.hour,
            }

            if (!newStudentMap.has(s.student.id)) {
                s.timeslotsArray = [compoundTimeslot]
                newStudentMap.set(s.student.id, s)
            } else {
                newStudentMap
                    .get(s.student.id)
                    .timeslotsArray.push(compoundTimeslot)
            }
        })
            setActiveStudentFilterBoolean(true)
            setFilteredActiveStudents(Array.from(newStudentMap.values()) || [])
    }
    console.log(filteredActiveStudents);

    // Process students to group them by status and aggregate their timeslots
    const studentMap = new Map()
    schedule?.students
        .filter(s => s.student.status === 'activo')
        .forEach(s => {
            const compoundTimeslot: CompoundTimeslot = {
                classStudentId: s.id,
                scheduleTimeslotId: s.schedule_timeslot.id,
                hour: s.timeslot.hour,
            }

            if (!studentMap.has(s.student.id)) {
                s.timeslotsArray = [compoundTimeslot]
                studentMap.set(s.student.id, s)
            } else {
                studentMap
                    .get(s.student.id)
                    .timeslotsArray.push(compoundTimeslot)
            }
        })
    const activeStudents = Array.from(studentMap.values()) || []

    const inactiveStudentMap = new Map()
    schedule?.students
        .filter(s => s.student.status === 'inactivo')
        .forEach(s => {
            const compoundTimeslot: CompoundTimeslot = {
                classStudentId: s.id,
                scheduleTimeslotId: s.schedule_timeslot.id,
                hour: s.timeslot.hour,
            }

            if (!inactiveStudentMap.has(s.student.id)) {
                s.timeslotsArray = [compoundTimeslot]
                inactiveStudentMap.set(s.student.id, s)
            } else {
                inactiveStudentMap
                    .get(s.student.id)
                    .timeslotsArray.push(compoundTimeslot)
            }
        })
    const inactiveStudents = Array.from(inactiveStudentMap.values()) || []

    const pendingStudentMap = new Map()
    schedule?.students
        .filter(s => s.student.status === 'pendiente')
        .forEach(s => {
            const compoundTimeslot: CompoundTimeslot = {
                classStudentId: s.id,
                scheduleTimeslotId: s.schedule_timeslot.id,
                hour: s.timeslot.hour,
            }

            if (!pendingStudentMap.has(s.student.id)) {
                s.timeslotsArray = [compoundTimeslot]
                pendingStudentMap.set(s.student.id, s)
            } else {
                pendingStudentMap
                    .get(s.student.id)
                    .timeslotsArray.push(compoundTimeslot)
            }
        })
    const pendingStudents = Array.from(pendingStudentMap.values()) || []

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 dark:border-violet-400"></div>
            </div>
        )
    }

    if (!schedule) {
        return (
            <Alert variant="destructive" className="max-w-md mx-auto mt-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    No se encontró la información de la clase. Por favor,
                    verifica el ID o intenta nuevamente.
                </AlertDescription>
            </Alert>
        )
    }

    const renderedStudents = () => {
        if (activeStudents.length === 0) {
            return (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    No hay estudiantes activos
                </div>
            )
        }
        if (activeStudentFilterBoolean === false) {
            return activeStudents.map(student => (
            <li
                key={`active-${student.student.id}`}
                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center flex-grow">
                    <div className="flex-grow">
                        <div className="font-medium">
                            {
                                student.student
                                    .name
                            }{' '}
                            {
                                student.student
                                    .last_name
                            }
                        </div>
                        <div className="text-sm text-gray-500">
                            DNI:{' '}
                            {
                                student.student
                                    .dni
                            }
                        </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-1 ml-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Activo
                        </Badge>
                        {student.timeslotsArray?.map(
                            (
                                timeslot: CompoundTimeslot,
                            ) => (
                                <Badge
                                    key={
                                        timeslot.scheduleTimeslotId
                                    }
                                    className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300">
                                    {
                                        timeslot.hour
                                    }
                                </Badge>
                            ),
                        )}
                    </div>
                </div>
                <div className="flex items-center ml-2 flex-shrink-0">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger
                                asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setEditingStudent(
                                            student,
                                        )
                                        // Inicializar correctamente con los IDs de schedule_timeslot
                                        setSelectedTimeslotsForEdit(
                                            student.timeslotsArray?.map(
                                                (
                                                    t: CompoundTimeslot,
                                                ) =>
                                                    t.scheduleTimeslotId,
                                            ) ||
                                                [],
                                        )
                                    }}
                                    className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Editar
                                    Horarios
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger
                                asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        onRemoveStudentFromClass(
                                            student,
                                        )
                                    }
                                    className="hover:bg-red-50 hover:text-red-600 transition-colors">
                                    <UserMinus className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Quitar
                                    Estudiante
                                    de la Clase
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </li>
        ))
        }
        if (filteredActiveStudents.length > 0) {
            return filteredActiveStudents.map(student => (
            <li
                key={`active-${student.student.id}`}
                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center flex-grow">
                    <div className="flex-grow">
                        <div className="font-medium">
                            {
                                student.student
                                    .name
                            }{' '}
                            {
                                student.student
                                    .last_name
                            }
                        </div>
                        <div className="text-sm text-gray-500">
                            DNI:{' '}
                            {
                                student.student
                                    .dni
                            }
                        </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-1 ml-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Activo
                        </Badge>
                        {student.timeslotsArray?.map(
                            (
                                timeslot: CompoundTimeslot,
                            ) => (
                                <Badge
                                    key={
                                        timeslot.scheduleTimeslotId
                                    }
                                    className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300">
                                    {
                                        timeslot.hour
                                    }
                                </Badge>
                            ),
                        )}
                    </div>
                </div>
                <div className="flex items-center ml-2 flex-shrink-0">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger
                                asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setEditingStudent(
                                            student,
                                        )
                                        // Inicializar correctamente con los IDs de schedule_timeslot
                                        setSelectedTimeslotsForEdit(
                                            student.timeslotsArray?.map(
                                                (
                                                    t: CompoundTimeslot,
                                                ) =>
                                                    t.scheduleTimeslotId,
                                            ) ||
                                                [],
                                        )
                                    }}
                                    className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Editar
                                    Horarios
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger
                                asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        onRemoveStudentFromClass(
                                            student,
                                        )
                                    }
                                    className="hover:bg-red-50 hover:text-red-600 transition-colors">
                                    <UserMinus className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Quitar
                                    Estudiante
                                    de la Clase
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </li>
        ))
        }
        if (filteredActiveStudents.length === 0 && activeStudentFilterBoolean === true) { 
            return (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    No hay estudiantes activos en el horario especificado
                </div>
            )
        }
        // if (filteredActiveStudents == null || filteredActiveStudents.length == 0) {
        //     return (
        //         <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
        //             No hay estudiantes activos
        //         </div>
        //     )
        // }
    }

    return (
        <div className="grid gap-6 p-4">
            <Card className="shadow-lg">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {schedule.class.name}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-sm">
                                    {schedule.class.branch_name}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                    ID: {schedule.id}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                onEdit(schedule.class.id)
                                            }
                                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Editar clase</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() =>
                                                setDeleteConfirmModal(true)
                                            }
                                            className="hover:bg-red-700 transition-colors">
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Eliminar clase</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <h3 className="text-lg font-medium mb-2">
                                    Información de Horario
                                </h3>
                                <div className="space-y-2">
                                    {/* <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Días seleccionados:
                                        </span>{' '}
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {schedule.selectedDays.map(day => (
                                                <Badge
                                                    key={day}
                                                    variant="secondary">
                                                    {day}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div> */}

                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Días de clase:
                                        </span>{' '}
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {schedule.schedule.days.map(day => (
                                                <Badge
                                                    key={day}
                                                    variant="outline">
                                                    {day}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Horarios:
                                        </span>{' '}
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            <Badge
                                                onClick={() => setActiveStudentFilterBoolean(false)}
                                                variant="outline"
                                                className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300">
                                                Reset filter
                                            </Badge>
                                            {schedule.timeslots.map(
                                                (t: Timeslot) => (
                                                    <Badge
                                                        onClick={() => filterStudentsByTimeslot(t.hour)}
                                                        key={t.id}
                                                        variant="outline"
                                                        className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300">
                                                        {t.hour}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-medium">
                                        Profesores
                                    </h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setTeacherModal(schedule.id)
                                        }
                                        className="hover:bg-violet-50 hover:text-violet-600 transition-colors">
                                        <UserPlus className="w-4 h-4 mr-1" />{' '}
                                        Agregar Profesor
                                    </Button>
                                </div>

                                {schedule.teachers.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        No hay profesores asignados
                                    </div>
                                ) : (
                                    <ul className="space-y-2">
                                        {schedule.teachers.map(teacher => (
                                            <li
                                                key={teacher.teacher.id}
                                                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div>
                                                    <div className="font-medium">
                                                        {teacher.teacher.name}{' '}
                                                        {
                                                            teacher.teacher
                                                                .last_name
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {teacher.teacher.email}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        onRemoveTeacher(
                                                            teacher.id,
                                                        )
                                                    }
                                                    className="hover:bg-red-50 hover:text-red-600 transition-colors">
                                                    <UserMinus className="w-4 h-4 mr-1" />{' '}
                                                    Quitar
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-medium">
                                        Total de estudiantes activos (
                                        {activeStudents.length})
                                    </h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setStudentModal(schedule.id)
                                        }
                                        className="hover:bg-violet-50 hover:text-violet-600 transition-colors">
                                        <UserPlus className="w-4 h-4 mr-1" />{' '}
                                        Agregar Estudiante
                                    </Button>
                                </div>

                                {activeStudents.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        No hay estudiantes activos
                                    </div>
                                ) : (
                                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                        {renderedStudents()}
                                    </ul>
                                )}
                            </div>

                            {pendingStudents.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-medium">
                                            Estudiantes Pendientes (
                                            {pendingStudents.length})
                                        </h3>
                                    </div>

                                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                        {pendingStudents.map(student => (
                                            <li
                                                key={`pending-${student.student.id}`}
                                                className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="font-medium">
                                                            {
                                                                student.student
                                                                    .name
                                                            }{' '}
                                                            {
                                                                student.student
                                                                    .last_name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            DNI:{' '}
                                                            {
                                                                student.student
                                                                    .dni
                                                            }
                                                        </div>
                                                    </div>
                                                    <Badge className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                        Pendiente
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        onRemoveStudentFromClass(
                                                            student,
                                                        )
                                                    }
                                                    className="hover:bg-red-50 hover:text-red-600 transition-colors">
                                                    <UserMinus className="w-4 h-4 mr-1" />{' '}
                                                    Quitar
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {inactiveStudents.length > 0 && (
                                <div className="mb-4">
                                    <button
                                        onClick={() =>
                                            setShowInactiveStudents(
                                                !showInactiveStudents,
                                            )
                                        }
                                        className="flex justify-between items-center w-full mb-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <h3 className="text-lg font-medium">
                                            Estudiantes Inactivos (
                                            {inactiveStudents.length})
                                        </h3>
                                        {showInactiveStudents ? (
                                            <ChevronUp className="w-5 h-5" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5" />
                                        )}
                                    </button>

                                    {showInactiveStudents && (
                                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                            {inactiveStudents.map(student => (
                                                <li
                                                    key={`inactive-${student.student.id}`}
                                                    className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="font-medium">
                                                                {
                                                                    student
                                                                        .student
                                                                        .name
                                                                }{' '}
                                                                {
                                                                    student
                                                                        .student
                                                                        .last_name
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                DNI:{' '}
                                                                {
                                                                    student
                                                                        .student
                                                                        .dni
                                                                }
                                                            </div>
                                                        </div>
                                                        <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                                            Inactivo
                                                        </Badge>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            onRemoveStudentFromClass(
                                                                student,
                                                            )
                                                        }
                                                        className="hover:bg-red-50 hover:text-red-600 transition-colors">
                                                        <UserMinus className="w-4 h-4 mr-1" />{' '}
                                                        Quitar
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Student Modal */}
            {studentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 dark:bg-[#1f2122]/95 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Agregar Estudiantes a la Clase
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setStudentModal(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Seleccionar Estudiantes
                                    </label>
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre, apellido o DNI..."
                                            value={studentSearchTerm}
                                            onChange={e =>
                                                setStudentSearchTerm(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        Mantén presionado Ctrl (Cmd en Mac) para
                                        seleccionar múltiples estudiantes
                                    </p>
                                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                        <select
                                            multiple
                                            className="w-full h-48 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                            value={selectedStudents}
                                            onChange={e =>
                                                setSelectedStudents(
                                                    Array.from(
                                                        e.target
                                                            .selectedOptions,
                                                        option => option.value,
                                                    ),
                                                )
                                            }>
                                            {filteredStudents.length === 0 ? (
                                                <option
                                                    disabled
                                                    className="text-gray-500 dark:text-gray-400">
                                                    {studentSearchTerm
                                                        ? 'No se encontraron estudiantes'
                                                        : 'No hay estudiantes disponibles'}
                                                </option>
                                            ) : (
                                                filteredStudents.map(
                                                    student => (
                                                        <option
                                                            key={student.id}
                                                            value={student.id}
                                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                            {student.name}{' '}
                                                            {student.last_name}{' '}
                                                            - {student.status}{' '}
                                                            (DNI: {student.dni})
                                                        </option>
                                                    ),
                                                )
                                            )}
                                        </select>
                                    </div>
                                    {studentSearchTerm && (
                                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                Mostrando{' '}
                                                {filteredStudents.length} de{' '}
                                                {allStudents.length} estudiantes
                                            </p>
                                        </div>
                                    )}
                                    {selectedStudents.length > 0 && (
                                        <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                                            <p className="text-sm text-purple-700 dark:text-purple-300">
                                                {selectedStudents.length}{' '}
                                                estudiante(s) seleccionado(s)
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Clock className="inline h-4 w-4 mr-1" />
                                        Horario de Clase
                                    </label>
                                    <select
                                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        onChange={e =>
                                            setSelectedTimeslotId(
                                                e.target.value,
                                            )
                                        }
                                        value={selectedTimeslotId}>
                                        <option value="">
                                            Selecciona un horario
                                        </option>
                                        {schedule?.timeslots.map(timeslot => (
                                            <option
                                                key={timeslot.id}
                                                value={timeslot.id}>
                                                {timeslot.hour}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedStudents.length > 0 &&
                                    selectedTimeslotId
                                        ? `Listo para agregar ${selectedStudents.length} estudiante(s)`
                                        : 'Selecciona estudiantes y horario para continuar'}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStudentModal(null)}>
                                        <p className="dark:text-white">
                                            Cancelar
                                        </p>
                                    </Button>
                                    <Button
                                        onClick={handleAddStudents}
                                        disabled={
                                            selectedStudents.length === 0 ||
                                            !selectedTimeslotId
                                        }
                                        className="bg-purple-600 hover:bg-purple-700 text-white">
                                        Agregar Estudiantes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Teacher Modal */}
            {teacherModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 dark:bg-[#1f2122]/95 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Agregar Profesores a la Clase
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTeacherModal(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Seleccionar Profesores
                                    </label>
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre, apellido o email..."
                                            value={teacherSearchTerm}
                                            onChange={e =>
                                                setTeacherSearchTerm(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        Mantén presionado Ctrl (Cmd en Mac) para
                                        seleccionar múltiples profesores
                                    </p>
                                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                        <select
                                            multiple
                                            className="w-full h-48 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                            value={selectedTeachers}
                                            onChange={e =>
                                                setSelectedTeachers(
                                                    Array.from(
                                                        e.target
                                                            .selectedOptions,
                                                        option => option.value,
                                                    ),
                                                )
                                            }>
                                            {filteredTeachers.length === 0 ? (
                                                <option
                                                    disabled
                                                    className="text-gray-500 dark:text-gray-400">
                                                    {teacherSearchTerm
                                                        ? 'No se encontraron profesores'
                                                        : 'No hay profesores disponibles'}
                                                </option>
                                            ) : (
                                                filteredTeachers.map(
                                                    teacher => (
                                                        <option
                                                            key={teacher.id}
                                                            value={teacher.id}
                                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                            {teacher.name}{' '}
                                                            {teacher.last_name}{' '}
                                                            - {teacher.email}
                                                        </option>
                                                    ),
                                                )
                                            )}
                                        </select>
                                    </div>
                                    {teacherSearchTerm && (
                                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                Mostrando{' '}
                                                {filteredTeachers.length} de{' '}
                                                {allTeachers.length} profesores
                                            </p>
                                        </div>
                                    )}
                                    {selectedTeachers.length > 0 && (
                                        <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                                            <p className="text-sm text-purple-700 dark:text-purple-300">
                                                {selectedTeachers.length}{' '}
                                                profesor(es) seleccionado(s)
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Clock className="inline h-4 w-4 mr-1" />
                                        Horario de Clase
                                    </label>
                                    <select
                                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        onChange={e =>
                                            setSelectedTimeslotId(
                                                e.target.value,
                                            )
                                        }
                                        value={selectedTimeslotId}>
                                        <option value="">
                                            Selecciona un horario
                                        </option>
                                        {schedule?.timeslots.map(timeslot => (
                                            <option
                                                key={timeslot.id}
                                                value={timeslot.id}>
                                                {timeslot.hour}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedTeachers.length > 0 &&
                                    selectedTimeslotId
                                        ? `Listo para agregar ${selectedTeachers.length} profesor(es)`
                                        : 'Selecciona profesores y horario para continuar'}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setTeacherModal(null)}>
                                        <p className="dark:text-white">
                                            Cancelar
                                        </p>
                                    </Button>
                                    <Button
                                        onClick={handleAddTeachers}
                                        disabled={
                                            selectedTeachers.length === 0 ||
                                            !selectedTimeslotId
                                        }
                                        className="bg-purple-600 hover:bg-purple-700 text-white">
                                        Agregar Profesores
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Student Schedule Modal - CORREGIDO */}
            {editingStudent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 dark:bg-[#1f2122]/95 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Editar Horario de {editingStudent.student.name}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setEditingStudent(null)
                                    setSelectedTimeslotsForEdit([])
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Selecciona los horarios para este estudiante:
                            </label>
                            <div className="space-y-3 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                                {schedule?.timeslots.map(
                                    (timeslot: Timeslot) => {
                                        const isChecked =
                                            selectedTimeslotsForEdit.includes(
                                                timeslot.id,
                                            )

                                        return (
                                            <div
                                                key={timeslot.id}
                                                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    id={`timeslot-edit-${timeslot.id}`}
                                                    checked={isChecked}
                                                    onChange={e =>
                                                        handleTimeslotToggle(
                                                            timeslot.id,
                                                            e.target.checked,
                                                        )
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2"
                                                />
                                                <label
                                                    htmlFor={`timeslot-edit-${timeslot.id}`}
                                                    className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer select-none">
                                                    {timeslot.hour}
                                                </label>
                                                {isChecked && (
                                                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 text-xs">
                                                        Seleccionado
                                                    </Badge>
                                                )}
                                            </div>
                                        )
                                    },
                                )}
                            </div>

                            {/* Mostrar resumen de selección */}
                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    <strong>Horarios seleccionados:</strong>{' '}
                                    {selectedTimeslotsForEdit.length}
                                </p>
                                {selectedTimeslotsForEdit.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {selectedTimeslotsForEdit.map(
                                            timeslotId => {
                                                const timeslot =
                                                    schedule?.timeslots.find(
                                                        t =>
                                                            t.id === timeslotId,
                                                    )
                                                return timeslot ? (
                                                    <Badge
                                                        key={timeslotId}
                                                        variant="outline"
                                                        className="text-xs">
                                                        {timeslot.hour}
                                                    </Badge>
                                                ) : null
                                            },
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50">
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditingStudent(null)
                                        setSelectedTimeslotsForEdit([])
                                    }}>
                                    <p className="dark:text-white">Cancelar</p>
                                </Button>
                                <Button
                                    onClick={handleUpdateStudentSchedule}
                                    disabled={
                                        selectedTimeslotsForEdit.length === 0
                                    }
                                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50">
                                    Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmModal}
                onOpenChange={open => !open && setDeleteConfirmModal(false)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar esta clase?
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={onDelete}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
