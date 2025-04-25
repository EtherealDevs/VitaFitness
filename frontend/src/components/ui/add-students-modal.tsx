'use client'
import { useClassStudents } from '@/hooks/classStudents'
import { TimeSlot } from '@/hooks/schedules'
import { useStudents } from '@/hooks/students'
import React, { useEffect, useState } from 'react'

type ModalProps = {
    onClose: () => void
    classScheduleId: string
    timeslots: TimeSlot[]
    isStudentModalOpen: boolean
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

export default function AddStudentsModal({
    onClose,
    timeslots,
    isStudentModalOpen,
}: ModalProps) {
    const [students, setStudents] = useState<Student[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { getStudents } = useStudents()
    const { createClassStudent } = useClassStudents()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData()
            const target = e.target as HTMLFormElement
            formData.append('students[]', target.students.value)
            formData.append('c_sch_ts_id', target.c_sch_ts_id.value)
            await createClassStudent(formData)
            onClose()
        } catch (error) {
            console.error('Error creating class student:', error)
            alert('Error al crear el estudiante')
        } finally {
            setIsLoading(false)
            alert('Form submitted!')
            onClose()
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getStudents()
                setStudents(res.students)
            } catch (error) {
                console.error('Error fetching class students:', error)
                alert('Error al obtener los estudiantes')
            }
        }
        fetchData()
    }, [])
    useEffect(() => {
        if (isStudentModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        // Clean up on unmount or when isOpen changes
        return () => {
            document.body.style.overflow = ''
        }
    }, [isStudentModalOpen])

    if (!isStudentModalOpen) return null
    console.log(students)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    ✕
                </button>

                <h2 className="text-lg font-semibold">Formulario</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Horarios
                        </label>
                        <select
                            name="c_sch_ts_id"
                            id="timeslots"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            {timeslots?.map(timeslot => (
                                <option key={timeslot.id} value={timeslot.id}>
                                    {timeslot.hour}
                                </option>
                            ))}
                        </select>
                        <label className="block text-sm font-medium text-gray-700">
                            Estudiantes (se pueden seleccionar varios
                            manteniendo apretado la tecla CTRL)
                        </label>
                        <select
                            name="students[]"
                            id="students"
                            multiple
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            {students?.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        {isLoading ? 'Cargando...' : 'Enviar'}
                    </button>
                </form>
            </div>
        </div>
    )
}
