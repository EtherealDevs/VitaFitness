"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientTitle } from "@/components/ui/gradient-title"
import { Star } from "lucide-react"

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
        alt: "Featured Image",
        featured: true,
    },
    {
        id: 2,
        src: "/placeholder.svg?height=300&width=300",
        alt: "Gallery Image 2",
    },
    {
        id: 3,
        src: "/placeholder.svg?height=300&width=300",
        alt: "Gallery Image 3",
    },
    {
        id: 4,
        src: "/placeholder.svg?height=300&width=300",
        alt: "Gallery Image 4",
    },
    {
        id: 5,
        src: "/placeholder.svg?height=300&width=300",
        alt: "Gallery Image 5",
    },
    {
        id: 6,
        src: "/placeholder.svg?height=300&width=300",
        alt: "Gallery Image 6",
    },
]

const Reviews = () => {
    const [currentReview, setCurrentReview] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <section id="reviews" className="py-16 bg-gray-900">
            <div className="container mx-auto px-4">
                <GradientTitle className="text-center">Reseñas y Galería</GradientTitle>
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Reviews Section */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-white">Lo que dicen nuestros miembros</h3>
                        <div className="relative h-[400px] overflow-hidden">
                            <div
                                className="absolute w-full transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateY(-${currentReview * 100}%)` }}
                            >
                                {reviews.map((review, index) => (
                                    <Card key={index} className="bg-black border-gray-800 mb-4 snap-center">
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            <img
                                                src={review.avatar || "/placeholder.svg"}
                                                alt={review.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div>
                                                <CardTitle className="text-white">{review.name}</CardTitle>
                                                <div className="flex gap-1">
                                                    {Array.from({ length: review.rating }).map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-300">{review.comment}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-white">Galería</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {galleryImages.map((image, index) => (
                                <div
                                    key={image.id}
                                    className={`relative overflow-hidden rounded-lg transition-transform hover:scale-105 ${index === 0 ? "col-span-2 row-span-2" : ""
                                        }`}
                                >
                                    <img
                                        src={image.src || "/placeholder.svg"}
                                        alt={image.alt}
                                        className={`w-full h-full object-cover ${index === 0 ? "aspect-square" : "aspect-square"}`}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-white text-sm">
                                            Ver más
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Reviews

