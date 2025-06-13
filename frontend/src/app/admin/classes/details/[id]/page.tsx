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

    const [allStudents, setAllStudents] = useState<Student[]>([])
    const [allTeachers, setAllTeachers] = useState<Teacher[]>([])

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
            const res = await createClassStudent(formData)
            console.log(res)

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
            const res = await createClassTeacher(formData)
            console.log(res)

            // Refresh data
            const updatedSchedule = await getClassSchedule(params.id)
            setSchedule(updatedSchedule.classSchedule)
        } catch (error) {
            console.error('Error al agregar profesores:', error)
            alert('No se pudieron agregar los profesores')
        }
    }

    const onRemoveStudent = async (id: string, studentId: string) => {
        try {
            const res = await deleteClassStudent(studentId)
            console.log(res)

            // Refresh data
            const updatedSchedule = await getClassSchedule(params.id)
            setSchedule(updatedSchedule.classSchedule)
        } catch (error) {
            console.error('Error al eliminar estudiante:', error)
            alert('No se pudo eliminar el estudiante')
        }
    }

    const onRemoveTeacher = async (id: string, teacherId: string) => {
        try {
            const res = await deleteClassTeacher(teacherId)
            console.log(res)

            // Refresh data
            const updatedSchedule = await getClassSchedule(params.id)
            setSchedule(updatedSchedule.classSchedule)
        } catch (error) {
            console.error('Error al eliminar profesor:', error)
            alert('No se pudo eliminar el profesor')
        }
    }

    const handleAddStudents = () => {
        if (studentModal && onAddStudent) {
            onAddStudent(studentModal, selectedStudents)
        }
        setStudentModal(null)
        setSelectedStudents([])
        setSelectedTimeslotId('')
    }

    const handleAddTeachers = () => {
        if (teacherModal && onAddTeacher) {
            onAddTeacher(teacherModal, selectedTeachers)
        }
        setTeacherModal(null)
        setSelectedTeachers([])
        setSelectedTimeslotId('')
    }

    // Get active and inactive students
    const activeStudents =
        schedule?.students.filter(s => s.student.status === 'activo') || []
    const inactiveStudents =
        schedule?.students.filter(s => s.student.status === 'inactivo') || []
    const pendingStudents =
        schedule?.students.filter(s => s.student.status === 'pendiente') || []

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
                                    <div>
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
                                    </div>

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
                                            {schedule.timeslots.map(t => (
                                                <Badge
                                                    key={t.id}
                                                    variant="outline"
                                                    className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300">
                                                    {t.hour}
                                                </Badge>
                                            ))}
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
                                                            schedule.id,
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
                                        Estudiantes Activos (
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
                                        {activeStudents.map(student => (
                                            <li
                                                key={student.student.id}
                                                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                                                    <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                        Activo
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        onRemoveStudent(
                                                            schedule.id,
                                                            student.id,
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
                                                key={student.student.id}
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
                                                        onRemoveStudent(
                                                            schedule.id,
                                                            student.id,
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
                                                    key={student.student.id}
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
                                                            onRemoveStudent(
                                                                schedule.id,
                                                                student.id,
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

            {/* Add Student Dialog */}
            <Dialog
                open={!!studentModal}
                onOpenChange={open => !open && setStudentModal(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Agregar Estudiantes</DialogTitle>
                        <DialogDescription>
                            Selecciona los estudiantes y el horario al que
                            deseas agregarlos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label
                                htmlFor="students"
                                className="text-sm font-medium">
                                Estudiantes (mantén presionado Ctrl para
                                seleccionar varios)
                            </label>
                            <select
                                id="students"
                                multiple
                                className="border rounded p-2 h-40"
                                value={selectedStudents}
                                onChange={e =>
                                    setSelectedStudents(
                                        Array.from(
                                            e.target.selectedOptions,
                                            option => option.value,
                                        ),
                                    )
                                }>
                                {allStudents.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} {s.last_name} - {s.status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label
                                htmlFor="timeslot"
                                className="text-sm font-medium">
                                Horario
                            </label>
                            <select
                                id="timeslot"
                                className="w-full border p-2 rounded"
                                onChange={e =>
                                    setSelectedTimeslotId(e.target.value)
                                }
                                value={selectedTimeslotId}>
                                <option value="">Selecciona un horario</option>
                                {schedule.timeslots.map(timeslot => (
                                    <option
                                        key={timeslot.id}
                                        value={timeslot.id}>
                                        {timeslot.hour}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setStudentModal(null)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAddStudents}
                            disabled={
                                selectedStudents.length === 0 ||
                                !selectedTimeslotId
                            }>
                            Agregar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Teacher Dialog */}
            <Dialog
                open={!!teacherModal}
                onOpenChange={open => !open && setTeacherModal(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Agregar Profesores</DialogTitle>
                        <DialogDescription>
                            Selecciona los profesores y el horario al que deseas
                            agregarlos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label
                                htmlFor="teachers"
                                className="text-sm font-medium">
                                Profesores (mantén presionado Ctrl para
                                seleccionar varios)
                            </label>
                            <select
                                id="teachers"
                                multiple
                                className="border rounded p-2 h-40"
                                value={selectedTeachers}
                                onChange={e =>
                                    setSelectedTeachers(
                                        Array.from(
                                            e.target.selectedOptions,
                                            option => option.value,
                                        ),
                                    )
                                }>
                                {allTeachers.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} {t.last_name} - {t.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label
                                htmlFor="timeslot"
                                className="text-sm font-medium">
                                Horario
                            </label>
                            <select
                                id="timeslot"
                                className="w-full border p-2 rounded"
                                onChange={e =>
                                    setSelectedTimeslotId(e.target.value)
                                }
                                value={selectedTimeslotId}>
                                <option value="">Selecciona un horario</option>
                                {schedule.timeslots.map(timeslot => (
                                    <option
                                        key={timeslot.id}
                                        value={timeslot.id}>
                                        {timeslot.hour}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setTeacherModal(null)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAddTeachers}
                            disabled={
                                selectedTeachers.length === 0 ||
                                !selectedTimeslotId
                            }>
                            Agregar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
