'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/button'

const images = [
    '/placeholder.svg?height=1080&width=1920&text=Gym+1',
    '/placeholder.svg?height=1080&width=1920&text=Gym+2',
    '/placeholder.svg?height=1080&width=1920&text=Gym+3',
]

export default function Hero() {
    const [currentImage, setCurrentImage] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage(prev => (prev + 1) % images.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="relative h-screen">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                        index === currentImage ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            <div className="relative z-10 h-full flex flex-col justify-center items-start px-8 md:px-16 max-w-6xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold mb-4">
                    Transforma tu vida
                    <span className="block gradient-text">con nosotros</span>
                </h1>
                <p className="text-xl mb-8 max-w-2xl text-gray-300">
                    En Vita Fitness, no solo entrenamos tu cuerpo, transformamos
                    tu mentalidad para que cada día te acerques a tu mejor
                    versión
                </p>
                <div className="space-x-4">
                    <Button className="bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90">
                        Reservar clase Ahora
                    </Button>
                    <Button className="border-gray-500 hover:border-purple-500">
                        Explorar nuestros planes
                    </Button>
                </div>
                <div className="mt-12 bg-black bg-opacity-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 gradient-text">
                        Horarios
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
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
        </section>
    )
}
