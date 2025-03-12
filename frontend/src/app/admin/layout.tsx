import type React from 'react'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './providers/theme-provider'
import './styles/admin.css'
import { DashboardHeader } from './components/dashboard-header'
import { DashboardNav } from './components/dashboard-nav'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
