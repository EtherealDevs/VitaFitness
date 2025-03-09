"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }

  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-sm py-4 px-4 sm:px-8">
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

        {/* Avatar and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image src="/avatar.png" alt="Usuario" width={40} height={40} className="object-cover" />
          </div>
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

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-md"
              style={{ zIndex: 40 }}
            />

            {/* Menu content */}
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 bg-gradient-to-b from-black to-neutral-900 md:hidden"
              style={{ zIndex: 45 }}
            >
              <div className="relative h-full">
                {/* Background image with overlay */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/placeholder.svg?height=1080&width=1920&text=Gym+Background"
                    alt="Gym background"
                    fill
                    className="object-cover opacity-20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/95" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full pt-24 px-8">
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        href="/reservar"
                        className="block w-full py-4 px-6 bg-gradient-to-r from-green-400 to-purple-500 text-white rounded-full text-center text-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        Reservar clase ahora
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        href="/prueba"
                        className="block w-full py-4 px-6 border border-white/20 text-white rounded-full text-center text-lg font-semibold hover:bg-white/10 transition-colors"
                      >
                        Prueba gratuita
                      </Link>
                    </motion.div>
                  </div>

                  {/* Navigation Links */}
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
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center justify-between text-white text-3xl font-light hover:text-gray-300 transition-colors"
                          onClick={toggleMenu}
                        >
                          {item.label}
                          <ChevronRight className="h-6 w-6 text-gray-400" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Schedule Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-auto mb-8 bg-white/5 rounded-2xl p-6 backdrop-blur-sm"
                  >
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
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar

