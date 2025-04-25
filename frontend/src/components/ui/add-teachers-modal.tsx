'use client'
import { useClassTeachers } from '@/hooks/classTeachers'
import { TimeSlot } from '@/hooks/schedules'
import { useTeachers } from '@/hooks/teachers'
import React, { useEffect, useState } from 'react'

type ModalProps = {
    onClose: () => void
    classScheduleId: string
    timeslots: TimeSlot[]
    isTeacherModalOpen: boolean
}
interface Teacher {
    id: number
    name: string
}

export default function AddTeachersModal({
    onClose,
    timeslots,
    isTeacherModalOpen,
}: ModalProps) {
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { getTeachers } = useTeachers()
    const { createClassTeacher } = useClassTeachers()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData()
            const target = e.target as HTMLFormElement
            formData.append('teachers[]', target.teachers.value)

            formData.append(
                'c_sch_ts_id',
                (e.target as HTMLFormElement).c_sch_ts_id.value,
            )
            await createClassTeacher(formData)
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
                const res = await getTeachers()
                setTeachers(res.teachers)
            } catch (error) {
                console.error('Error fetching class teachers:', error)
                alert('Error al obtener los profes')
            }
        }
        fetchData()
    }, [getTeachers])
    useEffect(() => {
        if (isTeacherModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        // Clean up on unmount or when isOpen changes
        return () => {
            document.body.style.overflow = ''
        }
    }, [isTeacherModalOpen])

    if (!isTeacherModalOpen) return null
    console.log(teachers)

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
                            Profes (se pueden seleccionar varios manteniendo
                            apretado la tecla CTRL)
                        </label>
                        <select
                            name="teachers[]"
                            id="teachers"
                            multiple
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            {teachers?.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name}
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
