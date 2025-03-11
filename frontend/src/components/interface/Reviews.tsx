"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

// Datos ampliados para las reseñas
const reviews = [
  {
    name: "María G.",
    comment: "Increíble ambiente y excelentes entrenadores. ¡He visto resultados en solo 2 meses!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    role: "Miembro Premium",
    date: "Hace 2 semanas",
  },
  {
    name: "Carlos R.",
    comment:
      "Las instalaciones son de primera y el personal siempre está dispuesto a ayudar. Recomiendo totalmente las clases de spinning.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    role: "Miembro Elite",
    date: "Hace 1 mes",
  },
  {
    name: "Ana L.",
    comment:
      "Me encanta la variedad de clases. Los entrenadores son muy profesionales y siempre te motivan a dar lo mejor.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
    role: "Miembro Regular",
    date: "Hace 3 semanas",
  },
  {
    name: "Juan P.",
    comment:
      "El plan premium vale cada centavo. Mi entrenador personal es excepcional y los resultados hablan por sí solos.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    role: "Miembro Premium",
    date: "Hace 1 semana",
  },
  {
    name: "Laura M.",
    comment: "El ambiente es muy motivador y las instalaciones siempre están impecables. ¡Me encanta entrenar aquí!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=200",
    role: "Miembro Elite",
    date: "Hace 5 días",
  },
  {
    name: "Diego S.",
    comment: "Las clases de CrossFit son increíbles. He mejorado mi condición física más de lo que esperaba.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200",
    role: "Miembro Regular",
    date: "Hace 2 días",
  },
]

// Datos ampliados para la galería
const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000",
    alt: "Instalaciones modernas",
    caption: "Área de entrenamiento principal",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1000",
    alt: "Área de pesas",
    caption: "Zona de peso libre",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000",
    alt: "Sala de cardio",
    caption: "Equipamiento cardiovascular",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000",
    alt: "Sala de clases grupales",
    caption: "Espacio para clases grupales",
  },
]

const Reviews = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const reviewsContainerRef = useRef<HTMLDivElement>(null)

  // Manejo del carrusel de la galería
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  useEffect(() => {
    const interval = setInterval(nextImage, 5000)
    return () => clearInterval(interval)
  }, [])

  // Manejo del carrusel de reseñas
  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  useEffect(() => {
    const interval = setInterval(nextReview, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reviews Section */}
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl font-bold font-impact mb-8 relative w-fit text-white">
              RESEÑAS
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#40E0D0] to-[#4834d4]" />
            </h2>
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
                >
                  {reviews.map((review, index) => (
                    <ReviewCard key={index} {...review} />
                  ))}
                </div>
              </div>
              <button
                onClick={prevReview}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextReview}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="flex justify-center mt-6 gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentReviewIndex ? "bg-[#40E0D0] w-6" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Gallery Section */}
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold mb-8 font-impact relative w-fit text-white">
              GALERIA
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#40E0D0] to-[#4834d4]" />
            </h2>
            <div className="relative rounded-xl overflow-hidden group">
              {/* Carousel Container */}
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={galleryImages[currentImageIndex].src || "/placeholder.svg"}
                  alt={galleryImages[currentImageIndex].alt}
                  fill
                  className="object-cover transition-all duration-700 ease-in-out transform scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-lg font-medium">{galleryImages[currentImageIndex].caption}</p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden ${
                    index === currentImageIndex ? "ring-2 ring-[#40E0D0]" : "opacity-50"
                  }`}
                >
                  <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
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
  role,
  date,
}: {
  name: string
  rating: number
  comment: string
  avatar: string
  role: string
  date: string
}) {
  return (
    <Card className="p-6 bg-gray-900/50 backdrop-blur-sm w-full flex-shrink-0 hover:bg-gray-900/70 transition-colors duration-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">{name}</h3>
          <p className="text-[#40E0D0] text-sm">{role}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-[#40E0D0] text-[#40E0D0]" : "text-zinc-600"}`}
                />
              ))}
            </div>
            <span className="text-[#40E0D0] text-sm ml-2">{rating}.0</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <Quote className="absolute top-0 left-0 w-8 h-8 text-[#40E0D0] opacity-20" />
        <p className="text-zinc-300 text-lg leading-relaxed mb-4 pl-10">{comment}</p>
      </div>
      <p className="text-zinc-500 text-sm">{date}</p>
    </Card>
  )
}

export default Reviews

