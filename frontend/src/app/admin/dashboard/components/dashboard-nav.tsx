import { Home, CreditCard, Users, FileText, Settings, BarChart, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/pagos", label: "Valor y Pagos", icon: CreditCard },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/reservas", label: "Reservas Nuevas", icon: FileText },
    { href: "/gestion", label: "Gestión de Clases", icon: Clock },
    { href: "/usuarios", label: "Usuarios y permisos", icon: Users },
    { href: "/reportes", label: "Reportes y estadísticas", icon: BarChart },
    { href: "/acciones", label: "Gestión de Acciones", icon: Settings },
    { href: "/planes", label: "Gestión de Planes", icon: FileText },
]

export function DashboardNav() {
    return (
        <div className="w-64 h-screen bg-white border-r flex flex-col">
            <div className="p-4 border-b">
                <Image
                    src="https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzZ8fHBlb3BsZSUyMHRyYWluaW5nfGVufDB8fDB8fHww"
                    alt="Logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                />
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700">
                    <Settings className="w-4 h-4" />
                    Configuración del Sistema
                </div>
            </div>
        </div>
    )
}

