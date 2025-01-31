'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GradientTitle } from '@/components/ui/gradient-title'
import { PlanModal } from '@/components/ui/plan-modal'
import { ProductModal } from '@/components/ui/product-modal'
import Image from 'next/image'

const plans = [
    {
        title: 'Plan HIIT',
        description: 'Entrenamiento de alta intensidad para máximos resultados',
        features: [
            'Sesiones de 45 minutos',
            'Entrenador especializado',
            'Seguimiento personalizado',
            'Acceso a app de ejercicios',
        ],
        price: '$49.99/mes',
        image: '/placeholder.svg?height=400&width=600',
    },
    {
        title: 'Cardio',
        description: 'Mejora tu resistencia y quema calorías',
        features: [
            'Clases grupales',
            'Equipamiento moderno',
            'Rutinas personalizadas',
            'Evaluación mensual',
        ],
        price: '$39.99/mes',
        image: '/placeholder.svg?height=400&width=600',
    },
]

const products = [
    {
        title: 'Conjunto Deportivo',
        description:
            'Conjunto deportivo de alta calidad para máximo rendimiento',
        price: '$59.99',
        image: '/placeholder.svg?height=400&width=600',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#000000', '#ffffff', '#ff0000'],
    },
    {
        title: 'Suplementos Premium',
        description:
            'Suplementos de alta calidad para optimizar tus resultados',
        price: '$29.99',
        image: '/placeholder.svg?height=400&width=600',
    },
]

export default function Services() {
    const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(
        null,
    )
    const [selectedProduct, setSelectedProduct] = useState<
        (typeof products)[0] | null
    >(null)

    return (
        <section id="services" className="py-16 bg-black">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <GradientTitle>Planes</GradientTitle>
                        <div className="space-y-6">
                            {plans.map((plan, index) => (
                                <Card
                                    key={index}
                                    className="bg-gray-900 border-gray-800 card-hover cursor-pointer"
                                    onClick={() => setSelectedPlan(plan)}>
                                    <CardHeader>
                                        <CardTitle className="text-white">
                                            {plan.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-400">
                                            {plan.description}
                                        </p>
                                        <span className="block mt-4 text-xl font-bold gradient-text">
                                            {plan.price}
                                        </span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div>
                        <GradientTitle>Tienda</GradientTitle>
                        <div className="grid grid-cols-2 gap-4">
                            {products.map((product, index) => (
                                <Card
                                    key={index}
                                    className="bg-gray-900 border-gray-800 card-hover cursor-pointer"
                                    onClick={() => setSelectedProduct(product)}>
                                    <CardHeader>
                                        <div className="aspect-square relative overflow-hidden rounded-lg">
                                            <Image
                                                src={
                                                    product.image ||
                                                    '/placeholder.svg'
                                                }
                                                alt={product.title}
                                                layout="fill"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <h3 className="font-bold text-white mb-2">
                                            {product.title}
                                        </h3>
                                        <span className="gradient-text font-bold">
                                            {product.price}
                                        </span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedPlan && (
                <PlanModal
                    isOpen={!!selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                    plan={selectedPlan}
                />
            )}

            {selectedProduct && (
                <ProductModal
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    product={selectedProduct}
                />
            )}
        </section>
    )
}
