"use client"

import { useState, useEffect } from "react"
import Button from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"

const images = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
]

export default function Hero() {
    const [currentImage, setCurrentImage] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <section className="relative h-screen overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentImage}
                    className="absolute inset-0 bg-cover bg-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    style={{ backgroundImage: `url(${images[currentImage]})` }}
                />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/75" />

            {/* Main Content Container */}
            <div className="relative z-10 h-full flex items-center justify-center md:justify-start">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-4xl mx-auto md:mx-0 space-y-8">
                        {/* Heading */}
                        <motion.h1
                            className="text-4xl font-impact sm:text-6xl mt-24 md:mt-0 md:text-7xl font-bold text-white"
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
                            En Vita Fitness, no solo entrenamos tu cuerpo, transformamos tu mentalidad para que cada día te acerques a
                            tu mejor versión
                        </motion.p>

                        {/* Schedule */}
                        <motion.div
                            className="w-full max-w-2xl mt-12 bg-black/50 p-8 rounded-xl backdrop-blur-sm"
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

            {/* Carousel Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-4 z-20">
                <button
                    onClick={prevImage}
                    className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-colors ${index === currentImage ? "bg-white" : "bg-gray-500"
                                }`}
                            onClick={() => setCurrentImage(index)}
                        />
                    ))}
                </div>
                <button
                    onClick={nextImage}
                    className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    )
}

