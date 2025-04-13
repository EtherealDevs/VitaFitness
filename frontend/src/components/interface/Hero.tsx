'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % desktopImages.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % desktopImages.length)
    }

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + desktopImages.length) % desktopImages.length)
    }

    // COMPONENTE BASE
    const HeroContent = () => (
        <div className="relative z-10 h-full flex items-center justify-center md:justify-start">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-4xl mx-auto md:mx-0 space-y-8">
                    {/* Heading */}
                    <motion.h1
                        className="text-3xl sm:text-6xl md:text-7xl font-bold text-white mt-16 md:mt-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Transforma tu vida
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
                            con nosotros
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        className="text-lg sm:text-xl text-gray-300 max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        En Vita Fitness, no solo entrenamos tu cuerpo, transformamos tu mentalidad
                        para que cada día te acerques a tu mejor versión
                    </motion.p>

                    {/* Schedule */}
                    <motion.div
                        className="w-full max-w-2xl mt-12 bg-black/25 p-8 rounded-xl backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
                            Horarios
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white">
                            <div>
                                <p className="font-semibold text-lg">Lunes y Martes</p>
                                <p className="text-gray-400">8:00 AM - 10:00 PM</p>
                            </div>
                            <div>
                                <p className="font-semibold text-lg">Miércoles y Jueves</p>
                                <p className="text-gray-400">10:00 AM - 10:00 PM</p>
                            </div>
                            <div>
                                <p className="font-semibold text-lg">Viernes</p>
                                <p className="text-gray-400">8:00 AM - 8:00 PM</p>
                            </div>
                            <div>
                                <p className="font-semibold text-lg">Sábados</p>
                                <p className="text-gray-400">8:00 AM - 2:00 PM</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90 text-white text-lg">
                            Reservar clase Ahora
                        </Button>
                        <Button className="w-full sm:w-auto px-8 py-3 border-2 border-gray-500 hover:border-purple-500 text-white text-lg">
                            Explorar nuestros planes
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    )

    const CarouselControls = () => (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-4 z-20">
            <button onClick={prevImage} className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50">
                <ChevronLeft size={24} />
            </button>
            <div className="flex space-x-2">
                {desktopImages.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentImage ? 'bg-white' : 'bg-gray-500'
                            }`}
                        onClick={() => setCurrentImage(index)}
                    />
                ))}
            </div>
            <button onClick={nextImage} className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50">
                <ChevronRight size={24} />
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
                        style={{ backgroundImage: `url(${desktopImages[currentImage]})` }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/50" />
                {HeroContent()}
                {CarouselControls()}
            </section>

            {/* MOBILE VERSION */}
            <section className="block sm:hidden relative min-h-screen overflow-hidden py-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImage}
                        className="absolute inset-0 bg-cover bg-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        style={{ backgroundImage: `url(${mobileImages[currentImage]})` }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/50" />
                {HeroContent()}
                {CarouselControls()}
            </section>
        </>
    )
}