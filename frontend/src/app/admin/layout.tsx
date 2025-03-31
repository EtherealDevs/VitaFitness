'use client'
import type React from 'react'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './providers/theme-provider'
import './styles/admin.css'
import { DashboardHeader } from './components/dashboard-header'
import { DashboardNav } from './components/dashboard-nav'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Asegurar que Sanctum reconozca la sesión
                await axios.get('/sanctum/csrf-cookie')

                // Obtener el usuario autenticado
                const res = await axios.get('/api/user')

                const user: { roles: { name: string }[] } = res.data

                // Verificar si es admin
                if (!user.roles.some(role => role.name === 'admin')) {
                    router.push('/')
                } else {
                    setLoading(false)
                }
            } catch (error) {
                console.error('Acceso denegado:', error)
                router.push('/login')
            }
        }

        checkAuth()
    }, [router])
    if (loading) return <div>Loading...</div>
    return (
        <div
            className={`admin ${inter.className} min-h-screen bg-[#f8f9fa] text-black dark:text-white`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <div className="relative flex min-h-screen">
                    {/* Sidebar */}
                    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64  border-gray-200 bg-white px-4 dark:bg-zinc-950 md:block">
                        <div className="flex h-14 items-center border-b px-4">
                            <Image
                                src="/img/LogoVita.png"
                                alt="Logo"
                                width={'95'}
                                height={'95'}
                            />
                            {/* <span className="ml-2 text-lg font-semibold">
                                Training App
                            </span> */}
                        </div>
                        <DashboardNav />
                    </aside>

                    {/* Main content */}
                    <div className="flex-1 md:ml-64 text-black bg-[#EDEDED]  dark:bg-[#afafaf] ">
                        <DashboardHeader />
                        <main className="container p-4 md:p-6 lg:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </ThemeProvider>
        </div>
    )
}
