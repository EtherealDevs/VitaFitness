'use client'

import { useClassTimeslots } from '@/hooks/classTimeslots'
import React, { useEffect, useState } from 'react'

type ModalProps = {
    onClose: () => void
    classScheduleId: string
    isTimeslotModalOpen: boolean
}
interface Timeslot {
    id: string
    hour: string
}

export default function AddTimeslotModal({
    onClose,
    classScheduleId,
    isTimeslotModalOpen,
}: ModalProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { createClassTimeslot } = useClassTimeslots()

    const timeslots: Timeslot[] = [
        { id: '17', hour: '00:00' },
        { id: '18', hour: '01:00' },
        { id: '19', hour: '02:00' },
        { id: '20', hour: '03:00' },
        { id: '21', hour: '04:00' },
        { id: '22', hour: '05:00' },
        { id: '23', hour: '06:00' },
        { id: '24', hour: '07:00' },
        { id: '1', hour: '08:00' },
        { id: '2', hour: '09:00' },
        { id: '3', hour: '10:00' },
        { id: '4', hour: '11:00' },
        { id: '5', hour: '12:00' },
        { id: '6', hour: '13:00' },
        { id: '7', hour: '14:00' },
        { id: '8', hour: '15:00' },
        { id: '9', hour: '16:00' },
        { id: '10', hour: '17:00' },
        { id: '11', hour: '18:00' },
        { id: '12', hour: '19:00' },
        { id: '13', hour: '20:00' },
        { id: '14', hour: '21:00' },
        { id: '15', hour: '22:00' },
        { id: '16', hour: '23:00' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData()

            const target = e.target as HTMLFormElement
            formData.append(
                'timeslot_id',
                (target.elements.namedItem('timeslot_id') as HTMLSelectElement)
                    .value,
            )
            formData.append('class_schedule_id', classScheduleId)
            await createClassTimeslot(formData)
            onClose()
        } catch (error) {
            console.error('Error creating timeslot:', error)
            alert('Error al crear el timeslot:')
        } finally {
            setIsLoading(false)
            alert('Form submitted!')
            onClose()
        }
    }
    useEffect(() => {
        if (isTimeslotModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        // Clean up on unmount or when isOpen changes
        return () => {
            document.body.style.overflow = ''
        }
    }, [isTimeslotModalOpen])

    if (!isTimeslotModalOpen) return null

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
                            Hora
                        </label>
                        <select
                            name="timeslot_id"
                            id="timeslot_id"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            {timeslots?.map(timeslot => (
                                <option key={timeslot.id} value={timeslot.id}>
                                    {timeslot.hour}
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
