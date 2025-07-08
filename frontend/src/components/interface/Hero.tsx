'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { getWhatsAppLink } from '@/utils/whatsapp'
import Link from 'next/link'

// Carrusel para desktop
const desktopImages = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1920&q=80',
]

// Carrusel para mobile
const mobileImages = [
    'https://images.unsplash.com/photo-1741732311628-e9ffa874d7b3?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1742183635084-64c141301176?q=80&w=2616&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1742138162252-363d0d38a063?q=80&w=3436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

export default function Hero() {
    const [currentImage, setCurrentImage] = useState(0)
    const classInfo =
        'Hola vi tu pagina y quiero saber más sobre tu clases y disponibilidad'

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage(prev => (prev + 1) % desktopImages.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const nextImage = () => {
        setCurrentImage(prev => (prev + 1) % desktopImages.length)
    }

    const prevImage = () => {
        setCurrentImage(
            prev => (prev - 1 + desktopImages.length) % desktopImages.length,
        )
    }

    // COMPONENTE BASE - Mejorado para móvil
    const HeroContent = () => (
        <div className="relative z-10 h-full flex items-center justify-center md:justify-start">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-4xl mx-auto md:mx-0 space-y-6 sm:space-y-8">
                    {/* Heading - Responsive mejorado */}
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mt-8 sm:mt-12 md:mt-0 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}>
                        Transforma tu vida
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
                            con nosotros
                        </span>
                    </motion.h1>

                    {/* Description - Responsive mejorado */}
                    <motion.p
                        className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}>
                        En Vita Fitness, no solo entrenamos tu cuerpo,
                        transformamos tu mentalidad para que cada día te
                        acerques a tu mejor versión
                    </motion.p>

                    {/* Schedule - Responsive mejorado */}
                    <motion.div
                        className="w-full max-w-2xl mt-8 sm:mt-12 bg-black/25 p-4 sm:p-6 md:p-8 rounded-xl backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
                            Horarios
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-white">
                            <div>
                                <p className="font-semibold text-base sm:text-lg">
                                    Lunes y Martes
                                </p>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    8:00 AM - 10:00 PM
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-base sm:text-lg">
                                    Miércoles y Jueves
                                </p>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    10:00 AM - 10:00 PM
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-base sm:text-lg">
                                    Viernes
                                </p>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    8:00 AM - 8:00 PM
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-base sm:text-lg">
                                    Sábados
                                </p>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    8:00 AM - 2:00 PM
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Buttons - Responsive mejorado */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}>
                        <a
                            href={getWhatsAppLink(classInfo)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90 text-white text-base sm:text-lg">
                                Reservar clase Ahora
                            </Button>
                        </a>
                        <Link
                            href="#productos"
                            passHref
                            className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-gray-500 hover:border-purple-500 text-white text-base sm:text-lg">
                                Explorar nuestros planes
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    )

    // Controles del carrusel - Mejorados para móvil
    const CarouselControls = () => (
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center items-center space-x-3 sm:space-x-4 z-20">
            <button
                onClick={prevImage}
                className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors">
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <div className="flex space-x-1 sm:space-x-2">
                {desktopImages.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                            index === currentImage ? 'bg-white' : 'bg-gray-500'
                        }`}
                        onClick={() => setCurrentImage(index)}
                    />
                ))}
            </div>
            <button
                onClick={nextImage}
                className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors">
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
        </div>
    )

    return (
        <>
            {/* DESKTOP VERSION */}
            <section className="hidden sm:block relative h-screen overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImage}
                        className="absolute inset-0 bg-cover bg-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        style={{
                            backgroundImage: `url(${desktopImages[currentImage]})`,
                        }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/50" />
                {HeroContent()}
                {CarouselControls()}
            </section>

            {/* MOBILE VERSION - Mejorado */}
            <section className="block sm:hidden relative min-h-screen overflow-hidden py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImage}
                        className="absolute inset-0 bg-cover bg-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        style={{
                            backgroundImage: `url(${mobileImages[currentImage]})`,
                        }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/50" />
                {HeroContent()}
                {CarouselControls()}
            </section>
        </>
    )
}
