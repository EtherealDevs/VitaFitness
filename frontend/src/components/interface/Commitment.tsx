'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { GradientTitle } from '@/components/ui/gradient-title'
import Image from 'next/image'
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Branch, useBranches } from '@/hooks/branches'
// Datos para la sección de transformaciones
const transformations = [
    {
        name: 'Carlos M.',
        age: 32,
        duration: '3 meses',
        description:
            'Perdió 15kg y ganó masa muscular siguiendo nuestro programa de entrenamiento personalizado.',
        beforeImage:
            'https://images.unsplash.com/photo-1583500178450-e59e4309b57a?q=80&w=1000',
        afterImage:
            'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000',
    },
    {
        name: 'Laura S.',
        age: 28,
        duration: '4 meses',
        description:
            'Mejoró su resistencia y tonificó su cuerpo con nuestras clases de HIIT y nutrición personalizada.',
        beforeImage:
            'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=1000',
        afterImage:
            'https://images.unsplash.com/photo-1609899464926-c3d7b56fcf71?q=80&w=1000',
    },
    {
        name: 'Miguel A.',
        age: 45,
        duration: '6 meses',
        description:
            'Superó problemas de espalda y recuperó movilidad gracias a nuestro programa de rehabilitación.',
        beforeImage:
            'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1000',
        afterImage:
            'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=1000',
    },
]

export default function CommitmentSection() {
    const [activeTransformation, setActiveTransformation] = useState(0)
    const transformationsRef = useRef<HTMLDivElement>(null)
    const [branchs, setBranchs] = useState<Branch[]>([])
    const { getBranches } = useBranches()
    const fetchBranchs = useCallback(async () => {
        try {
            const response = await getBranches()
            setBranchs(response.branches)
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [getBranches])

    const nextTransformation = () => {
        setActiveTransformation(prev => (prev + 1) % transformations.length)
    }

    const prevTransformation = () => {
        setActiveTransformation(
            prev =>
                (prev - 1 + transformations.length) % transformations.length,
        )
    }

    // Cambiar automáticamente las transformaciones
    useEffect(() => {
        fetchBranchs()
        const interval = setInterval(() => {
            nextTransformation()
        }, 8000)
        return () => clearInterval(interval)
    }, [fetchBranchs])
    console.log(branchs)
    return (
        <section className="py-16 bg-black">
            <div className="container mx-auto px-4">
                {/* Título y descripción principal */}
                <div className="mb-12 relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-green-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
                    <GradientTitle className="text-4xl mb-4 font-impact relative z-10">
                        NUESTRO COMPROMISO
                    </GradientTitle>

                    <p className="text-gray-400 max-w-xl relative z-10">
                        Descubre los diferentes planes que ofrecemos para
                        adaptarnos a tus necesidades y objetivos de fitness.
                        ¡Elige el que mejor se ajuste a ti y comienza tu
                        transformación hoy mismo!
                    </p>
                </div>

                {/* Grid principal */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Columna izquierda */}
                    <div className="space-y-8">
                        {/* Por qué elegirnos */}
                        <div className="bg-gray-900/50 p-6 rounded-lg border-l-4 border-gradient relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <h2 className="text-2xl text-white mb-4 font-bold">
                                ¿POR QUÉ ELEGIR A VITA?
                            </h2>
                            <p className="text-gray-300 relative z-10">
                                The smartest & most effective workout in 50
                                minutes. VITA is functional fitness at its
                                finest & will have your body feeling strong &
                                sculpted fast.
                            </p>
                            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-r from-green-400/10 to-purple-500/10 rounded-full blur-xl"></div>
                        </div>

                        {/* Nuestras sedes */}
                        <div>
                            <GradientTitle className="text-2xl font-impact mt-12 mb-6">
                                NUESTRAS SEDES
                            </GradientTitle>
                            <div className="grid grid-cols-2 gap-4">
                                {branchs.map((branch, index) => (
                                    <Card
                                        key={index}
                                        className="relative h-[200px] overflow-hidden group">
                                        <Image
                                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000"
                                            alt="Sede Corrientes 1"
                                            fill
                                            className="object-cover brightness-50 group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                            <h3 className="text-2xl font-bold text-white">
                                                {branch.name}
                                            </h3>
                                            <div>
                                                <p className="text-gray-200 text-sm mb-2">
                                                    {branch.address}
                                                </p>
                                                <button className="text-green-400 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    Ver mapa{' '}
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                {/* Sede 1 */}

                                {/* Sede 2 */}
                                {/* <Card className="relative h-[200px] overflow-hidden group">
                                    <Image
                                        src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1000"
                                        alt="Sede Corrientes 2"
                                        fill
                                        className="object-cover brightness-50 group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                        <h3 className="text-2xl font-bold text-white">
                                            CORRIENTES II
                                        </h3>
                                        <div>
                                            <p className="text-gray-200 text-sm mb-2">
                                                España y Belgrano
                                            </p>
                                            <button className="text-green-400 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                Ver mapa{' '}
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </Card> */}
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="space-y-6">
                        {/* Resultados */}
                        <Card className="relative h-[250px] overflow-hidden group">
                            <Image
                                src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=1000"
                                alt="Resultados"
                                fill
                                className="object-cover brightness-50 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                <h3 className="text-3xl font-bold text-white">
                                    RESULTADOS
                                </h3>
                                <div>
                                    <p className="text-gray-200 mb-3">
                                        En vita fitnes nuestros miembros
                                        experimentan mejoras en resistencia,
                                        cardio, energía
                                    </p>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Nuestra Visión */}
                        <Card className="relative h-[250px] overflow-hidden group">
                            <Image
                                src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1000"
                                alt="Nuestra Visión"
                                fill
                                className="object-cover brightness-50 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                <h3 className="text-3xl font-bold text-white">
                                    NUESTRA VISION
                                </h3>
                                <div>
                                    <p className="text-gray-200 mb-3">
                                        En vita fitness nuestra visión es
                                        ofrecer un ambiente inclusivo y
                                        motivador donde cualquier persona pueda
                                        alcanzar sus objetivos de bienestar y
                                        salud.
                                    </p>
                                    <button className="text-green-400 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Conoce más{' '}
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Sección de transformaciones - Ancho completo */}
            <div className="w-full bg-gray-950 py-16" ref={transformationsRef}>
                <div className="container mx-auto px-4">
                    <GradientTitle className="text-3xl mb-8 font-impact text-center">
                        TRANSFORMACIONES REALES
                    </GradientTitle>

                    <div className="relative">
                        {/* Controles de navegación */}
                        <button
                            onClick={prevTransformation}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 p-2 rounded-full text-white"
                            aria-label="Transformación anterior">
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                            onClick={nextTransformation}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 p-2 rounded-full text-white"
                            aria-label="Transformación siguiente">
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Carrusel de transformaciones */}
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{
                                    transform: `translateX(-${
                                        activeTransformation * 100
                                    }%)`,
                                }}>
                                {transformations.map(
                                    (transformation, index) => (
                                        <div
                                            key={index}
                                            className="w-full flex-shrink-0">
                                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                                {/* Imágenes antes/después */}
                                                <div className="relative h-[400px] md:h-[500px] flex">
                                                    <div className="w-1/2 relative overflow-hidden">
                                                        <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full z-10">
                                                            <span className="text-white text-sm font-bold">
                                                                ANTES
                                                            </span>
                                                        </div>
                                                        <Image
                                                            src={
                                                                transformation.beforeImage ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={`${transformation.name} antes`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="w-1/2 relative overflow-hidden">
                                                        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-purple-500 px-3 py-1 rounded-full z-10">
                                                            <span className="text-white text-sm font-bold">
                                                                DESPUÉS
                                                            </span>
                                                        </div>
                                                        <Image
                                                            src={
                                                                transformation.afterImage ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={`${transformation.name} después`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <div className="absolute inset-0 border-l-2 border-white/50"></div>
                                                    </div>
                                                </div>

                                                {/* Información de la transformación */}
                                                <div className="p-6 bg-gray-900/50 rounded-lg">
                                                    <h3 className="text-2xl font-bold text-white mb-2">
                                                        {transformation.name},{' '}
                                                        {transformation.age}{' '}
                                                        años
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <span className="bg-gradient-to-r from-green-400 to-purple-500 px-3 py-1 rounded-full text-white text-sm font-bold">
                                                            {
                                                                transformation.duration
                                                            }
                                                        </span>
                                                        <div className="flex gap-1">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map(star => (
                                                                <Star
                                                                    key={star}
                                                                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-300 mb-6">
                                                        {
                                                            transformation.description
                                                        }
                                                    </p>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-full bg-gray-800 h-2 rounded-full">
                                                                <div className="bg-gradient-to-r from-green-400 to-purple-500 h-2 rounded-full w-[85%]"></div>
                                                            </div>
                                                            <span className="text-white font-bold">
                                                                85%
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-400">
                                                            Porcentaje de
                                                            objetivos alcanzados
                                                        </p>
                                                    </div>
                                                    <Button className="mt-6 bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90">
                                                        COMIENZA TU
                                                        TRANSFORMACIÓN
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Indicadores */}
                        <div className="flex justify-center gap-2 mt-8">
                            {transformations.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === activeTransformation
                                            ? 'bg-gradient-to-r from-green-400 to-purple-500 w-8'
                                            : 'bg-gray-600'
                                    }`}
                                    onClick={() =>
                                        setActiveTransformation(index)
                                    }
                                    aria-label={`Ver transformación ${
                                        index + 1
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .border-gradient {
                    border-image: linear-gradient(to bottom, #4ade80, #a855f7) 1
                        100%;
                }
            `}</style>
        </section>
    )
}
