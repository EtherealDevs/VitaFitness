"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Menu,
  X,
  ChevronRight,
  User,
  LogOut,
  Calendar,
  CreditCard,
  ChevronDown,
  LayoutDashboard,
  Clock,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NavbarProps {
  isLoggedIn?: boolean
  userRole?: "admin" | "user"
  userAvatar?: string
}

const Navbar = ({ isLoggedIn = false, userRole = "user", userAvatar = "/avatar.png" }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }

  const handleLogout = () => {
    // Implementar lógica de logout
    console.log("Logout")
  }

  return (
    <nav className="fixed w-full z-50 bg-black/95 backdrop-blur-md py-4 px-4 sm:px-8 border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <Image src="/img/LogoVita.png" alt="Vita Fitness Logo" width={100} height={40} className="object-contain" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 lg:space-x-8 text-white text-sm font-semibold">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Inicio
          </Link>
          <Link href="#services" className="hover:text-gray-300 transition-colors">
            Planes
          </Link>
          <Link href="#productos" className="hover:text-gray-300 transition-colors">
            Productos
          </Link>
          <Link href="#compromiso" className="hover:text-gray-300 transition-colors">
            Nuestro Compromiso
          </Link>
          <Link href="#resenas" className="hover:text-gray-300 transition-colors">
            Reseñas
          </Link>
          <Link href="#contact" className="hover:text-gray-300 transition-colors">
            Contacto
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                  <Image
                    src={userAvatar || "/placeholder.svg"}
                    alt="Usuario"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-md shadow-lg py-1 z-50">
                  <div className="flex items-center gap-2 p-2 border-b border-gray-800">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={userAvatar || "/placeholder.svg"}
                        alt="Usuario"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">Usuario</span>
                      <span className="text-xs text-gray-500">usuario@email.com</span>
                    </div>
                  </div>
                  <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                    <User className="inline-block w-4 h-4 mr-2" />
                    Mi Perfil
                  </Link>
                  <Link href="/asistencias" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                    <Clock className="inline-block w-4 h-4 mr-2" />
                    Mis Asistencias
                  </Link>
                  <Link href="/cuotas" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                    <CreditCard className="inline-block w-4 h-4 mr-2" />
                    Mis Cuotas
                  </Link>
                  <Link href="/reservas" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                    <Calendar className="inline-block w-4 h-4 mr-2" />
                    Mis Reservas
                  </Link>
                  {userRole === "admin" && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 border-t border-gray-800"
                    >
                      <LayoutDashboard className="inline-block w-4 h-4 mr-2" />
                      Panel de Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800 border-t border-gray-800"
                  >
                    <LogOut className="inline-block w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 text-white border border-white/20 rounded hover:bg-white/10 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-4 py-2 text-white bg-gradient-to-r from-green-400 to-purple-500 rounded hover:opacity-90 transition-opacity"
              >
                Registrarse
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white z-50 relative" onClick={toggleMenu} aria-label="Toggle menu">
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
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
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <div className="relative h-full flex flex-col pt-24 px-8">
              {!isLoggedIn && (
                <div className="flex flex-col gap-4 mb-8">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsLoginOpen(true)
                    }}
                    className="w-full py-3 text-lg text-white border border-white/20 rounded hover:bg-white/10 transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsRegisterOpen(true)
                    }}
                    className="w-full py-3 text-lg text-white bg-gradient-to-r from-green-400 to-purple-500 rounded hover:opacity-90 transition-opacity"
                  >
                    Registrarse
                  </button>
                </div>
              )}

              <div className="space-y-6">
                {[
                  { href: "/", label: "Inicio" },
                  { href: "#services", label: "Planes" },
                  { href: "#productos", label: "Productos" },
                  { href: "#compromiso", label: "Nuestro Compromiso" },
                  { href: "#resenas", label: "Reseñas" },
                  { href: "#contact", label: "Contacto" },
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between text-white text-2xl font-light hover:text-gray-300 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                      <ChevronRight className="h-6 w-6 text-gray-400" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Schedule Section */}
              <div className="mt-auto mb-8 bg-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Horarios</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white font-medium">Lunes y Martes</p>
                    <p className="text-gray-400">8:00 AM - 10:00 PM</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">Miércoles y Jueves</p>
                    <p className="text-gray-400">10:00 AM - 10:00 PM</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">Viernes</p>
                    <p className="text-gray-400">8:00 AM - 8:00 PM</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">Sábados</p>
                    <p className="text-gray-400">8:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Iniciar Sesión</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Iniciar Sesión
              </button>
            </form>
            <button onClick={() => setIsLoginOpen(false)} className="mt-4 text-sm text-gray-400 hover:text-white">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Registrarse</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Registrarse
              </button>
            </form>
            <button onClick={() => setIsRegisterOpen(false)} className="mt-4 text-sm text-gray-400 hover:text-white">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

