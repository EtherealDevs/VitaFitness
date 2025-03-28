/* import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ui/ApplicationLogo'
import ApplicationLogo from '@/components/ui/ApplicationLogo' */
import React from 'react'

export const metadata = {
    title: 'Vitta',
}

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <div className="text-gray-900 antialiased">
                <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
