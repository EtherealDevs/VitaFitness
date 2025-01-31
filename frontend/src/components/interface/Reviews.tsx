import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Reviews = () => {
    const reviews = [
        {
            name: "María G.",
            comment: "Increíble ambiente y excelentes entrenadores. ¡He visto resultados en solo 2 meses!",
        },
        { name: "Carlos R.", comment: "Las instalaciones son de primera y el personal siempre está dispuesto a ayudar." },
        { name: "Ana L.", comment: "Me encanta la variedad de clases. Nunca me aburro de mi rutina de ejercicios." },
        { name: "Juan P.", comment: "El plan premium vale cada centavo. Mi entrenador personal es excepcional." },
    ]

    return (
        <section id="reviews" className="py-16 bg-gray-900">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">Reseñas y Galería</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-2xl font-semibold mb-6">Lo que dicen nuestros miembros</h3>
                        <div className="space-y-4">
                            {reviews.map((review, index) => (
                                <Card key={index} className="bg-black">
                                    <CardHeader>
                                        <CardTitle>{review.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{review.comment}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-6">Galería</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((item) => (
                                <img
                                    key={item}
                                    src={`/placeholder.svg?height=200&width=300&text=Imagen+${item}`}
                                    alt={`Galería ${item}`}
                                    className="w-full h-auto rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Reviews

