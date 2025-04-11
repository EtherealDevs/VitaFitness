'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Menu,
    X,
    ChevronRight,
    User,
    LogOut,
    CreditCard,
    ChevronDown,
    LayoutDashboard,
    Clock,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/app/admin/components/ui/avatar'
import { useAuth } from '@/hooks/auth'
import { cn } from '@/lib/utils'

interface NavbarProps {
    isLoggedIn?: boolean
    user?: {
        name: string
        email: string
        roles: { name: string }[]
    } | null
}

const Navbar = ({ isLoggedIn = false, user = null }: NavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('inicio')
    const { logout } = useAuth()

    // Detectar scroll para cambiar el estilo del navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Detectar sección activa basada en el scroll
    useEffect(() => {
        const handleSectionScroll = () => {
            const sections = [
                'inicio',
                'planes',
                'productos',
                'compromiso',
                'resenas',
                'contacto',
            ]

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(section)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleSectionScroll)
        return () => window.removeEventListener('scroll', handleSectionScroll)
    }, [])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }

    const handleLogout = () => {
        logout()
        setIsUserMenuOpen(false)
        console.log('Logout')
    }

    // Navegación a secciones con scroll suave
    const scrollToSection = (sectionId: string) => {
        setIsMenuOpen(false)
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    // Opciones de navegación principal
    const navItems = [
        { id: 'inicio', label: 'Inicio', route: '/' },
        { id: 'productos', label: 'Planes y Productos', route: '#productos' },
        { id: 'compromiso', label: 'Nuestro Compromiso', route: '#compromiso' },
        { id: 'resenas', label: 'Reseñas', route: '#resenas' },
        { id: 'contact', label: 'Contacto', route: '#contact' },
    ]

    return (
        <nav
            className={cn(
                'sticky top-0 w-full z-50 transition-all duration-300 px-4 sm:px-8 border-b border-white/10',
                isScrolled ? 'bg-black/95 backdrop-blur-md' : 'bg-black',
            )}>
            <div className="container mx-auto flex justify-between items-center h-16 md:h-20">
                {/* Logo */}
                <Link href="/" className="relative z-50">
                    <Image
                        src="/img/LogoVita.png"
                        alt="Vita Fitness Logo"
                        width={100}
                        height={40}
                        className="object-contain"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4 lg:space-x-8 text-white text-sm font-semibold">
                    {navItems.map(item => (
                        <Link
                            key={item.id}
                            href={item.route}
                            onClick={e => {
                                if (item.route.startsWith('#')) {
                                    e.preventDefault()
                                    scrollToSection(item.id)
                                }
                            }}
                            className={cn(
                                'hover:text-gray-300 transition-colors relative py-2',
                                activeSection === item.id
                                    ? 'text-white'
                                    : 'text-gray-300',
                            )}>
                            {item.label}
                            {activeSection === item.id && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Auth Section */}
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                onClick={() =>
                                    setIsUserMenuOpen(!isUserMenuOpen)
                                }>
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 hover:border-green-500 focus:border-green-500 duration-100">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src="/avatars/01.png"
                                            alt="@username"
                                        />
                                        <AvatarFallback className="text-xl font-bold pt-0.5 pl-0.5">
                                            {user?.name
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <ChevronDown className="w-4 h-4 text-white" />
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-md shadow-lg py-1 z-50">
                                    <div className="flex items-center gap-2 p-2 border-b border-gray-800">
                                        <div className="w-8 h-8 rounded-full overflow-hidden">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src="/avatars/01.png"
                                                    alt="@username"
                                                />
                                                <AvatarFallback>
                                                    {user?.name
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">
                                                {user?.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                                        onClick={() =>
                                            setIsUserMenuOpen(false)
                                        }>
                                        <User className="inline-block w-4 h-4 mr-2" />
                                        Mi Perfil
                                    </Link>
                                    <Link
                                        href="/assist"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                                        onClick={() =>
                                            setIsUserMenuOpen(false)
                                        }>
                                        <Clock className="inline-block w-4 h-4 mr-2" />
                                        Mis Asistencias
                                    </Link>
                                    <Link
                                        href="/payments"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                                        onClick={() =>
                                            setIsUserMenuOpen(false)
                                        }>
                                        <CreditCard className="inline-block w-4 h-4 mr-2" />
                                        Mis Cuotas
                                    </Link>
                                    {user?.roles.some(
                                        role => role.name === 'admin',
                                    ) && (
                                        <Link
                                            href="/admin"
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 border-t border-gray-800"
                                            onClick={() =>
                                                setIsUserMenuOpen(false)
                                            }>
                                            <LayoutDashboard className="inline-block w-4 h-4 mr-2" />
                                            Panel de Admin
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800 border-t border-gray-800">
                                        <LogOut className="inline-block w-4 h-4 mr-2" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href="/login"
                                className="px-4 py-2 text-white border border-white/20 rounded hover:bg-white/10 transition-colors">
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 text-white bg-gradient-to-r from-green-400 to-purple-500 rounded hover:opacity-90 transition-opacity">
                                Registrarse
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white z-50 relative"
                        onClick={toggleMenu}
                        aria-label="Toggle menu">
                        <AnimatePresence mode="wait">
                            {isMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}>
                                    <X size={24} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}>
                                    <Menu size={24} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-md">
                        <div className="relative h-full flex flex-col pt-24 px-8">
                            {isLoggedIn ? (
                                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-900/50 rounded-lg">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage
                                                src="/avatars/01.png"
                                                alt="@username"
                                            />
                                            <AvatarFallback className="text-xl font-bold">
                                                {user?.name
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-medium text-white">
                                            {user?.name}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 mb-8">
                                    <Link
                                        href="/login"
                                        className="w-full py-3 text-lg text-white border border-white/20 rounded hover:bg-white/10 transition-colors text-center"
                                        onClick={() => setIsMenuOpen(false)}>
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="w-full py-3 text-lg text-white bg-gradient-to-r from-green-400 to-purple-500 rounded hover:opacity-90 transition-opacity text-center"
                                        onClick={() => setIsMenuOpen(false)}>
                                        Registrarse
                                    </Link>
                                </div>
                            )}

                            <div className="space-y-6">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.1 + index * 0.1,
                                        }}>
                                        <Link
                                            href={item.route}
                                            className={cn(
                                                'flex items-center justify-between text-2xl font-light transition-colors',
                                                activeSection === item.id
                                                    ? 'text-white'
                                                    : 'text-gray-300 hover:text-white',
                                            )}
                                            onClick={e => {
                                                if (
                                                    item.route.startsWith('#')
                                                ) {
                                                    e.preventDefault()
                                                    scrollToSection(item.id)
                                                } else {
                                                    setIsMenuOpen(false)
                                                }
                                            }}>
                                            {item.label}
                                            <ChevronRight className="h-6 w-6 text-gray-400" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {isLoggedIn && (
                                <div className="mt-8 space-y-4 border-t border-gray-800 pt-6">
                                    <Link
                                        href="/profile"
                                        className="flex items-center text-gray-300 hover:text-white"
                                        onClick={() => setIsMenuOpen(false)}>
                                        <User className="w-5 h-5 mr-3" />
                                        <span className="text-lg">
                                            Mi Perfil
                                        </span>
                                    </Link>
                                    <Link
                                        href="/assist"
                                        className="flex items-center text-gray-300 hover:text-white"
                                        onClick={() => setIsMenuOpen(false)}>
                                        <Clock className="w-5 h-5 mr-3" />
                                        <span className="text-lg">
                                            Mis Asistencias
                                        </span>
                                    </Link>
                                    <Link
                                        href="/payments"
                                        className="flex items-center text-gray-300 hover:text-white"
                                        onClick={() => setIsMenuOpen(false)}>
                                        <CreditCard className="w-5 h-5 mr-3" />
                                        <span className="text-lg">
                                            Mis Cuotas
                                        </span>
                                    </Link>
                                    {user?.roles.some(
                                        role => role.name === 'admin',
                                    ) && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center text-gray-300 hover:text-white"
                                            onClick={() =>
                                                setIsMenuOpen(false)
                                            }>
                                            <LayoutDashboard className="w-5 h-5 mr-3" />
                                            <span className="text-lg">
                                                Panel de Admin
                                            </span>
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center text-red-500 hover:text-red-400 w-full text-left">
                                        <LogOut className="w-5 h-5 mr-3" />
                                        <span className="text-lg">
                                            Cerrar Sesión
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
