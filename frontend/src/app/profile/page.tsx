'use client'

import { useState } from 'react'
import { Phone, Calendar, Home } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Class {
    name: string
    schedule: string
}

interface UserProfile {
    name: string
    phone: string
    avatar?: string
    classes: Class[]
}

export default function ProfileCard() {
    // Sample user data - in a real app, this would come from props or an API
    const [user] = useState<UserProfile>({
        name: 'María González',
        phone: '+34 612 345 678',
        avatar: '/placeholder.svg?height=100&width=100',
        classes: [
            { name: 'Yoga', schedule: 'Lunes y Miércoles, 18:00 - 19:30' },
            { name: 'Pilates', schedule: 'Martes y Jueves, 10:00 - 11:00' },
            { name: 'Meditación', schedule: 'Viernes, 19:00 - 20:00' },
        ],
    })

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            {/* Blurred background effect */}
            <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/40 via-emerald-600/30 to-black blur-3xl" />

            {/* Profile Card */}
            <div className="w-full max-w-md shadow-lg relative z-10 border border-opacity-50 rounded-lg bg-white/50 dark:bg-slate-900/80 backdrop-blur overflow-hidden">
                {/* Card Header */}
                <div className="flex flex-col items-center p-6 pb-2">
                    {/* Avatar */}
                    <div className="h-24 w-24 mb-4 rounded-full overflow-hidden border">
                        <Image
                            width={100}
                            height={100}
                            src={user.avatar || '/placeholder.svg'}
                            alt={user.name}
                            className="h-full w-full object-cover"
                            onError={e => {
                                const target = e.target as HTMLImageElement
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user.name,
                                )}&background=random`
                            }}
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700 text-center">
                        {user.name}
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Teléfono
                            </p>
                            <p className="font-medium text-gray-700 dark:text-gray-500">
                                {user.phone}
                            </p>
                        </div>
                    </div>

                    {/* Classes Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-500 text-lg">
                            Clases
                        </h3>
                        <div className="space-y-3">
                            {user.classes.map((cls, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-md">
                                            {cls.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>{cls.schedule}</span>
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
