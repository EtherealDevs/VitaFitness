'use client'

import { useEffect, useState } from 'react'
import { Phone, Calendar, Home } from 'lucide-react'
// import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { Student } from '../admin/students/columns'
import axios from '@/lib/axios'

export default function ProfileCard() {
    const { user } = useAuth()
    const [student, setStudent] = useState<Student>()
    const fetchStudentData = async () => {
        if (!user?.dni) return
        try {
            const response = await axios.get('/api/student/search', {
                params: {
                    field: 'dni',
                    search: user.dni,
                },
            })
            const studentData = response.data.students[0]

            console.log(studentData.classes)
            setStudent(studentData)
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    useEffect(() => {
        if (user?.dni) {
            fetchStudentData()
        }
    }, [user])

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black">
            {/* Blurred background effect */}
            <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/40 via-emerald-600/30 to-black blur-3xl" />

            {/* Profile Card */}
            <div className="w-full max-w-md shadow-lg relative z-10 border border-opacity-50 rounded-lg bg-white/85   dark:bg-slate-900/80 backdrop-blur overflow-hidden">
                {/* Card Header */}
                <div className="flex flex-col items-center p-6 pb-2">
                    {/* Avatar */}
                    <div className="h-24 w-24 mb-4 rounded-full overflow-hidden border">
                        {/* <Image
                            width={100}
                            height={100}
                            src={user.avatar || '/placeholder.svg'}
                            alt={student?.name || 'Avatar'}
                            className="h-full w-full object-cover"
                            onError={e => {
                                const target = e.target as HTMLImageElement
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    student?.name || 'Usuario no encontrado',
                                )}&background=random`
                            }}
                        /> */}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700 text-center">
                        {student?.name || 'Usuario no encontrado'}
                    </h2>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-6">
                    {/* Phone Number */}
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                            <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-bold text-gray-700 dark:text-gray-400">
                                Teléfono
                            </p>
                            <p className="font-medium text-gray-700 dark:text-gray-500">
                                {student?.phone || 'Teléfono no encontrado'}
                            </p>
                        </div>
                    </div>

                    {/* Classes Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-500 text-lg">
                            Clases
                        </h3>
                        <div className="space-y-3">
                            {student?.classes?.map((cls, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-md">
                                            {cls.plan?.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        {cls.schedules?.map(
                                            (schedule, index) => (
                                                <span key={index}>
                                                    {schedule.selectedDays?.join(
                                                        ', ',
                                                    )}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Back to Main Page Button */}
                    <div className="pt-2">
                        <Link href="/">
                            <button className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Home className="h-5 w-5" />
                                Volver a la página principal
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
