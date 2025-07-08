'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Image from 'next/image'

// Datos ampliados para las reseñas
const reviews = [
    {
        name: 'María G.',
        comment:
            'Increíble ambiente y excelentes entrenadores. ¡He visto resultados en solo 2 meses!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
        date: 'Hace 2 meses',
    },
    {
        name: 'Carlos R.',
        comment:
            'Las instalaciones son de primera y el personal siempre está dispuesto a ayudar. Recomiendo totalmente las clases de spinning.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
        date: 'Hace 1 mes',
    },
    {
        name: 'Ana L.',
        comment:
            'Me encanta la variedad de clases. Los entrenadores son muy profesionales y siempre te motivan a dar lo mejor.',
        rating: 4,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
        date: 'Hace 3 semanas',
    },
    {
        name: 'Laura M.',
        comment:
            'El ambiente es muy motivador y las instalaciones siempre están impecables. ¡Me encanta entrenar aquí!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=200',
        date: 'Hace 5 años',
    },
    {
        name: 'Diego S.',
        comment:
            'Las clases de Fit-Boxing son increíbles. He mejorado mi condición física más de lo que esperaba.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200',
        date: 'Hace 2 meses',
    },
]

// Datos ampliados para la galería
const galleryImages = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
        alt: 'Instalaciones modernas',
        caption: 'Área de entrenamiento principal',
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1000',
        alt: 'Área de pesas',
        caption: 'Zona de peso libre',
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000',
        alt: 'Sala de cardio',
        caption: 'Equipamiento cardiovascular',
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000',
        alt: 'Sala de clases grupales',
        caption: 'Espacio para clases grupales',
    },
]

const Reviews = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

    // Manejo del carrusel de la galería
    const nextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % galleryImages.length)
    }

    const prevImage = () => {
        setCurrentImageIndex(
            prev => (prev - 1 + galleryImages.length) % galleryImages.length,
        )
    }

    useEffect(() => {
        const interval = setInterval(nextImage, 5000)
        return () => clearInterval(interval)
    }, [])

    // Manejo del carrusel de reseñas
    const nextReview = () => {
        setCurrentReviewIndex(prev => (prev + 1) % reviews.length)
    }

    const prevReview = () => {
        setCurrentReviewIndex(
            prev => (prev - 1 + reviews.length) % reviews.length,
        )
    }

    useEffect(() => {
        const interval = setInterval(nextReview, 8000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="min-h-screen bg-black py-8 sm:py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Reviews Section */}
                    <div className="order-2 lg:order-1">
                        <h2 className="text-3xl sm:text-4xl font-bold font-impact mb-6 sm:mb-8 relative w-fit text-white">
                            RESEÑAS
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#40E0D0] to-[#4834d4]" />
                        </h2>
                        <div className="relative">
                            <div className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{
                                        transform: `translateX(-${
                                            currentReviewIndex * 100
                                        }%)`,
                                    }}>
                                    {reviews.map((review, index) => (
                                        <ReviewCard key={index} {...review} />
                                    ))}
                                </div>
                            </div>
                            {/* Controles más grandes en móvil */}
                            <button
                                onClick={prevReview}
                                className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10">
                                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                            </button>
                            <button
                                onClick={nextReview}
                                className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10">
                                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                            </button>
                        </div>
                        <div className="flex justify-center mt-4 sm:mt-6 gap-2">
                            {reviews.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentReviewIndex(index)}
                                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                                        index === currentReviewIndex
                                            ? 'bg-[#40E0D0] w-4 sm:w-6'
                                            : 'bg-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Gallery Section */}
                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 font-impact relative w-fit text-white">
                            GALERIA
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#40E0D0] to-[#4834d4]" />
                        </h2>
                        <div className="relative rounded-xl overflow-hidden group">
                            {/* Carousel Container */}
                            <div className="relative aspect-[16/9] w-full">
                                <Image
                                    src={
                                        galleryImages[currentImageIndex].src ||
                                        '/placeholder.svg' ||
                                        '/placeholder.svg'
                                    }
                                    alt={galleryImages[currentImageIndex].alt}
                                    fill
                                    className="object-cover transition-all duration-700 ease-in-out transform scale-105 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

                                {/* Caption */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        {
                                            galleryImages[currentImageIndex]
                                                .caption
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Navigation Buttons - Siempre visibles en móvil */}
                            <button
                                onClick={prevImage}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 text-white flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10">
                                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 text-white flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10">
                                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>
                        </div>

                        {/* Thumbnails - Scroll horizontal en móvil */}
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                            {galleryImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                                        index === currentImageIndex
                                            ? 'ring-2 ring-[#40E0D0]'
                                            : 'opacity-50'
                                    }`}>
                                    <Image
                                        src={image.src || '/placeholder.svg'}
                                        alt={image.alt}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function ReviewCard({
    name,
    rating,
    comment,
    avatar,
    date,
}: {
    name: string
    rating: number
    comment: string
    avatar: string
    date: string
}) {
    return (
        <Card className="p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm w-full flex-shrink-0 hover:bg-gray-900/70 transition-colors duration-300 mx-2 sm:mx-0">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src={avatar || '/placeholder.svg'}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-white truncate">
                        {name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                        <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                        i < Math.floor(rating)
                                            ? 'fill-[#40E0D0] text-[#40E0D0]'
                                            : 'text-zinc-600'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-[#40E0D0] text-xs sm:text-sm ml-2">
                            {rating}.0
                        </span>
                    </div>
                </div>
            </div>
            <div className="relative">
                <Quote className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 text-[#40E0D0] opacity-20" />
                <p className="text-zinc-300 text-sm sm:text-lg leading-relaxed mb-4 pl-8 sm:pl-10">
                    {comment}
                </p>
            </div>
            <p className="text-zinc-500 text-xs sm:text-sm">{date}</p>
        </Card>
    )
}

export default Reviews
