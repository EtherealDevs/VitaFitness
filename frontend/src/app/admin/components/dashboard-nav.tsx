'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import {
    Home,
    UserCheck,
    Settings,
    Users,
    FileText,
    BarChart2,
    BookOpen,
    Calendar,
    CreditCard,
    ArrowLeft,
    UserRoundPen,
    ShoppingBag,
    NotepadText,
    CalendarCheck2,
} from 'lucide-react'

const navigation = [
    { name: 'Volver a la Pagina', href: '/', icon: ArrowLeft },
    {
        name: 'Registro de Asistencia',
        href: '/access',
        icon: UserCheck,
        target: '_blank',
    },
    { name: 'Inicio', href: '/admin/dashboard', icon: Home },
    { name: 'Alumnos', href: '/admin/students', icon: Users },
    { name: 'Profesores', href: '/admin/teachers', icon: UserRoundPen },
    { name: 'Clases', href: '/admin/classes', icon: BookOpen },
    { name: 'Horarios', href: '/admin/schedules', icon: CalendarCheck2 },
    { name: 'Calendario', href: '/admin/calendar', icon: Calendar },
    { name: 'Pagos', href: '/admin/payments', icon: CreditCard },
    { name: 'Productos', href: '/admin/products', icon: ShoppingBag },
    { name: 'Planes', href: '/admin/plans', icon: NotepadText },
    { name: 'Permisos', href: '/admin/permissions', icon: FileText },
    { name: 'Estadísticas', href: '/admin/statistics', icon: BarChart2 },
    { name: 'Configuración', href: '/admin/configuration', icon: Settings },
]

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="space-y-1 p-4">
            {navigation.map(item => {
                const Icon = item.icon
                const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        target={item.target || '_self'}
                        rel={
                            item.target === '_blank'
                                ? 'noopener noreferrer'
                                : undefined
                        }
                        className={cn(
                            'group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800',
                            isActive
                                ? 'bg-gray-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-400',
                        )}>
                        <Icon
                            className={cn(
                                'mr-3 h-5 w-5',
                                isActive
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400',
                            )}
                        />
                        {item.name}
                    </Link>
                )
            })}
        </nav>
    )
}
