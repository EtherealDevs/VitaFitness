"use client"

import { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

const reviews = [
    {
        name: "María G.",
        comment: "Increíble ambiente y excelentes entrenadores. ¡He visto resultados en solo 2 meses!",
        rating: 5,
        avatar: "/placeholder.svg?height=50&width=50",
    },
    {
        name: "Carlos R.",
        comment: "Las instalaciones son de primera y el personal siempre está dispuesto a ayudar.",
        rating: 5,
        avatar: "/placeholder.svg?height=50&width=50",
    },
    {
        name: "Ana L.",
        comment: "Me encanta la variedad de clases. Nunca me aburro de mi rutina de ejercicios.",
        rating: 4,
        avatar: "/placeholder.svg?height=50&width=50",
    },
    {
        name: "Juan P.",
        comment: "El plan premium vale cada centavo. Mi entrenador personal es excepcional.",
        rating: 5,
        avatar: "/placeholder.svg?height=50&width=50",
    },
]

const galleryImages = [
    {
        id: 1,
        src: "/placeholder.svg?height=600&width=600",
        alt: "Featured Image 1",
    },
    {
        id: 2,
        src: "/placeholder.svg?height=600&width=600",
        alt: "Featured Image 2",
    },
    {
        id: 3,
        src: "/placeholder.svg?height=600&width=600",
        alt: "Featured Image 3",
    },
]

const Reviews = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [direction, setDirection] = useState<"left" | "right">("right")

    const nextImage = useCallback(() => {
        if (isAnimating) return
        setDirection("right")
        setIsAnimating(true)
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
    }, [isAnimating])

    const prevImage = () => {
        if (isAnimating) return
        setDirection("left")
        setIsAnimating(true)
        setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
    }

    useEffect(() => {
        const timer = setInterval(() => {
            nextImage()
        }, 5000)
        return () => clearInterval(timer)
    }, [nextImage])

    return (
        <section className="min-h-screen bg-gradient-to-b from-black via-black to-zinc-900">
            <div className="relative p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-900/10 to-transparent" />

                <div className="relative max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                    {/* Reviews Section */}
                    <div>
                        <h2 className="text-4xl font-bold mb-6 relative w-fit text-white">
                            RESEÑAS
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#40E0D0] to-[#4834d4]" />
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {reviews.slice(0, 2).map((review, index) => (
                                <ReviewCard
                                    key={index}
                                    name={review.name}
                                    rating={review.rating}
                                    text={review.comment}
                                    avatar={review.avatar}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Gallery Section */}
                    <div>
                        <h2 className="text-4xl font-bold mb-6 relative w-fit text-white">
                            GALERIA
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#40E0D0] to-[#4834d4]" />
                        </h2>
                        <div className="relative flex items-center justify-center">
                            {/* Navigation Buttons */}
                            <button
                                onClick={prevImage}
                                className="absolute left-0 z-10 w-8 h-8 rounded-full bg-[#4834d4] text-white flex items-center justify-center hover:bg-[#4834d4]/80 transition-colors transform -translate-x-1/2"
                                disabled={isAnimating}
                            >
                                ←
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-0 z-10 w-8 h-8 rounded-full bg-[#4834d4] text-white flex items-center justify-center hover:bg-[#4834d4]/80 transition-colors transform translate-x-1/2"
                                disabled={isAnimating}
                            >
                                →
                            </button>

                            {/* Carousel Container */}
                            <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-xl overflow-hidden">
                                <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out">
                                    {/* Current Image */}
                                    <div className="relative min-w-full h-full">
                                        <Image
                                            src={galleryImages[currentImageIndex].src || "/placeholder.svg"}
                                            alt={galleryImages[currentImageIndex].alt}
                                            fill
                                            className={`object-cover transition-opacity duration-500 rounded-xl ${isAnimating ? "opacity-0" : "opacity-100"
                                                }`}
                                            onLoadingComplete={() => setIsAnimating(false)}
                                        />
                                    </div>
                                    {/* Next/Previous Image */}
                                    <div className="relative min-w-full h-full">
                                        <Image
                                            src={
                                                galleryImages[
                                                    direction === "right"
                                                        ? (currentImageIndex + 1) % galleryImages.length
                                                        : (currentImageIndex - 1 + galleryImages.length) % galleryImages.length
                                                ].src
                                            }
                                            alt="Next image"
                                            fill
                                            className={`object-cover transition-opacity duration-500 rounded-xl ${isAnimating ? "opacity-100" : "opacity-0"
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
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
    text,
    avatar,
}: {
    name: string
    rating: number
    text: string
    avatar: string
}) {
    return (
        <Card className="p-4 bg-black/50 backdrop-blur-sm border border-zinc-800">
            <div className="flex items-center gap-3 mb-3">
                <Image src={avatar || "/placeholder.svg"} alt={name} width={32} height={32} className="rounded-full" />
                <div>
                    <h3 className="font-semibold text-sm text-white">{name}</h3>
                    <div className="flex items-center gap-1">
                        <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-[#40E0D0] text-[#40E0D0]" : "text-zinc-600"}`}
                                />
                            ))}
                        </div>
                        <span className="text-[#40E0D0] text-sm ml-1">{rating}.0</span>
                    </div>
                </div>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">{text}</p>
        </Card>
    )
}

export default Reviews