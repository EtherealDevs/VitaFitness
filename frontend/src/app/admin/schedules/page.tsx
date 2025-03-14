'use client'
import { Schedule, useSchedules } from '@/hooks/schedules'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Schedules() {
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(false)
    const { getSchedules, deleteSchedule } = useSchedules()

    async function fetchData() {
        setLoading(true)
        try {
            const response = await getSchedules()
            setSchedules(response.schedules)
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDelete = async (id: string) => {
        try {
            await deleteSchedule(id)
            fetchData()
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return loading ? (
        <div>
            <h1>Loading...</h1>
        </div>
    ) : (
        <div className="space-y-4 overflow-x-auto">
            <div className="flex justify-between align-bottom">
                <h1>Horarios</h1>
                <Link href={'/admin/schedules/create'}>
                    <button className="py-2 px-4 bg-blue-600  rounded-xl">
                        nuevo horario
                    </button>
                </Link>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 rounded-lg">
                {/* desktop view */}
                <table
                    className="w-full text-sm text-left text-gray-500 dark:text-gray-400
                ">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-200 dark:bg-zinc-950">
                        <tr>
                            <th scope="col" className="py-3 px-6">
                                id
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Dia
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Hora de inicio
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Hora de fin
                            </th>
                            <th scope="col" colSpan={2} className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {schedules.map((schedule, index) => (
                            <tr key={index}>
                                <td className="py-4 px-6">{schedule.id}</td>
                                <td className="px-6 py-4">{schedule.day}</td>
                                <td className="px-6 py-4">
                                    {schedule.start_time}
                                </td>
                                <td className="px-6 py-4">
                                    {schedule.end_time}
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/schedules/${schedule.id}/edit`}>
                                        Edit
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        type="button"
                                        className="py-2 px-4 bg-red-600 text-white rounded-lg w-full hover:bg-red-700"
                                        aria-label={`Eliminar ${schedule.id}`}
                                        onClick={() =>
                                            handleDelete(schedule.id)
                                        }>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* mobile view */}
            </div>
        </div>
    )
}
