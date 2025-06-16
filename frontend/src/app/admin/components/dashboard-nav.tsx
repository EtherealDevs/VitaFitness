'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import {
    Home,
    UserCheck,
    Users,
    FileText,
    BarChart2,
    BookOpen,
    CreditCard,
    ArrowLeft,
    UserRoundPen,
    ShoppingBag,
    NotepadText,
    CalendarCheck2,
    Building,
} from 'lucide-react'

const navigation = [
    { name: 'Volver a la Pagina', href: '/', icon: ArrowLeft },
    // Este lo manejamos manualmente
    {
        name: 'Registro de Asistencia',
        href: '/access',
        icon: UserCheck,
        customHandler: true,
    },
    { name: 'Inicio', href: '/admin/dashboard', icon: Home },
    { name: 'Alumnos', href: '/admin/students', icon: Users },
    { name: 'Profesores', href: '/admin/teachers', icon: UserRoundPen },
    { name: 'Clases', href: '/admin/classes', icon: BookOpen },
    { name: 'Horarios', href: '/admin/schedules/create', icon: CalendarCheck2 },
    { name: 'Pagos', href: '/admin/payments', icon: CreditCard },
    { name: 'Productos', href: '/admin/products', icon: ShoppingBag },
    { name: 'Planes', href: '/admin/plans', icon: NotepadText },
    { name: 'Sucursales', href: '/admin/branches', icon: Building },
    { name: 'Permisos', href: '/admin/permissions', icon: FileText },
    { name: 'Estadísticas', href: '/admin/statistics', icon: BarChart2 },
]

export function DashboardNav() {
    const pathname = usePathname()

    const handleOpenExternalWindow = () => {
        const screenWidth = window.screen.availWidth
        const screenHeight = window.screen.availHeight

        const screenLeft =
            window.screenLeft !== undefined ? window.screenLeft : window.screenX
        const screenTop =
            window.screenTop !== undefined ? window.screenTop : window.screenY

        const left = screenLeft + screenWidth
        const top = screenTop

        const features = `popup=yes,left=${left},top=${top},width=${screenWidth},height=${screenHeight},resizable=yes`

        const win = window.open('/access?fullscreen=true', '_blank', features)

        if (!win) {
            alert('El navegador bloqueó la ventana emergente. Permití pop-ups.')
            return
        }

        win.focus()
    }

    return (
        <nav className="space-y-1 p-4">
            {navigation.map(item => {
                const Icon = item.icon
                const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)

                return item.customHandler ? (
                    <div
                        key={item.name}
                        onClick={handleOpenExternalWindow}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleOpenExternalWindow()
                            }
                        }}
                        className={cn(
                            'group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800',
                            'text-gray-700 dark:text-white cursor-pointer select-none',
                        )}>
                        <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-white" />
                        {item.name}
                    </div>
                ) : (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800',
                            isActive
                                ? 'text-gray-600 dark:bg-gray-800 dark:text-gray-100'
                                : 'text-gray-700 dark:text-white',
                        )}>
                        <Icon
                            className={cn(
                                'mr-3 h-5 w-5',
                                isActive
                                    ? 'text-blue-600 dark:text-white'
                                    : 'text-gray-400 group-hover:text-gray-500 dark:text-white',
                            )}
                        />
                        {item.name}
                    </Link>
                )
            })}
        </nav>
    )
}
