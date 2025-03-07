"use client"

import { useState, useEffect } from "react"
import Button from "@/components/ui/Button"
import { motion } from "framer-motion"

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

    return (
        <section className="relative h-screen">
            {images.map((img, index) => (
                <motion.div
                    key={index}
                    className="absolute inset-0 bg-cover bg-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: index === currentImage ? 1 : 0 }}
                    transition={{ duration: 1 }}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            <div className="relative z-10 h-full flex flex-col justify-center items-start px-8 md:px-16 max-w-6xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
                    Transforma tu vida
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
                        con nosotros
                    </span>
                </h1>
                <p className="text-xl mb-8 max-w-2xl text-gray-300">
                    En Vita Fitness, no solo entrenamos tu cuerpo, transformamos tu mentalidad para que cada día te acerques a tu
                    mejor versión
                </p>
                <div className="space-x-4">
                    <Button className="bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90 text-white">
                        Reservar clase Ahora
                    </Button>
                    <Button className="border border-gray-500 hover:border-purple-500 text-white">
                        Explorar nuestros planes
                    </Button>
                </div>
                <div className="mt-12 bg-black bg-opacity-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
                        Horarios
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-white">
                        <div>
                            <p className="font-semibold">Lunes y Martes</p>
                            <p className="text-gray-400">8:00 AM - 10:00 PM</p>
                        </div>
                        <div>
                            <p className="font-semibold">Miércoles y Jueves</p>
                            <p className="text-gray-400">10:00 AM - 10:00 PM</p>
                        </div>
                        <div>
                            <p className="font-semibold">Viernes</p>
                            <p className="text-gray-400">8:00 AM - 8:00 PM</p>
                        </div>
                        <div>
                            <p className="font-semibold">Sábados</p>
                            <p className="text-gray-400">8:00 AM - 2:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${index === currentImage ? "bg-white" : "bg-gray-500"}`}
                        onClick={() => setCurrentImage(index)}
                    />
                ))}
            </div>
        </section>
    )
}

