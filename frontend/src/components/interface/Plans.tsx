'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { GradientTitle } from '@/components/ui/gradient-title'
import { PlanModal } from '@/components/ui/plan-modal'
import { ProductModal } from '@/components/ui/product-modal'
import { CatalogModal } from '@/components/ui/catalog-modal'
import Image from 'next/image'
import { User, ArrowRight, ShoppingCart } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Product, useProducts } from '@/hooks/products'
import { Plan, usePlans } from '@/hooks/plans'
import { getWhatsAppLink } from '@/utils/whatsapp'
import Link from 'next/link'

export default function Services() {
    const { getProducts } = useProducts()
    // const [allProducts, setProducts] = useState<Product[]>([])
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const [allProducts, setProducts] = useState<Product[]>([])
    const [fullCatalog, setFullCatalog] = useState<Product[]>([])
    const { getPlans } = usePlans()
    const [plans, setPlans] = useState<Plan[]>([])
    const [selectedProduct, setSelectedProduct] = useState<
        (typeof allProducts)[0] | null
    >(null)
    const [isCatalogOpen, setIsCatalogOpen] = useState(false)
    const [visiblePlans, setVisiblePlans] = useState<number>(2)
    const [visibleProducts, setVisibleProducts] = useState<number>(4)
    const plansContainerRef = useRef<HTMLDivElement>(null)
    const productsContainerRef = useRef<HTMLDivElement>(null)
    const plansInfo =
        'Hola, vi tu pagina y quiero más información sobre los planes'
    const fetchProducts = useCallback(async () => {
        try {
            const response = await getProducts()
            setProducts(response.products)
            setFullCatalog(response.products)
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [getProducts])
    const fetchPlans = useCallback(async () => {
        try {
            const response = await getPlans()
            //filtrar solo los planes activos
            const activePlans = response.plans.filter(
                (plan: Plan) => plan.status === 'activo',
            )
            setPlans(activePlans)
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [getPlans])

    useEffect(() => {
        const fetchAllData = async () => {
            await fetchProducts()
            await fetchPlans()
        }
        fetchAllData()
    }, [fetchProducts, fetchPlans])
    // Función para manejar el scroll dentro del contenedor de planes
    const handlePlansScroll = () => {
        if (!plansContainerRef.current) return

        const { scrollTop, scrollHeight, clientHeight } =
            plansContainerRef.current
        const scrollPosition = scrollTop + clientHeight

        // Si estamos cerca del final del scroll, mostrar más planes
        if (
            scrollHeight - scrollPosition < 100 &&
            visiblePlans < plans.length
        ) {
            setVisiblePlans(prev => Math.min(prev + 1, plans.length))
        }
    }

    // Función para manejar el scroll dentro del contenedor de productos
    const handleProductsScroll = () => {
        if (!productsContainerRef.current) return

        const { scrollTop, scrollHeight, clientHeight } =
            productsContainerRef.current
        const scrollPosition = scrollTop + clientHeight

        // Si estamos cerca del final del scroll, mostrar más productos
        if (
            scrollHeight - scrollPosition < 100 &&
            visibleProducts < allProducts.length
        ) {
            setVisibleProducts(prev => Math.min(prev + 2, allProducts.length))
        }
    }

    return (
        <section id="services" className="py-16 bg-black">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Planes Section */}
                    <div>
                        <GradientTitle className="text-3xl font-impact mb-6">
                            PLANES
                        </GradientTitle>
                        <p className="text-gray-400 mb-8">
                            Descubre los diferentes planes que ofrecemos para
                            adaptarnos a tus necesidades y objetivos de fitness.
                            ¡Elige el que mejor se ajuste a ti y comienza tu
                            transformación hoy mismo!
                        </p>

                        {/* Contenedor con scroll propio */}
                        <div
                            ref={plansContainerRef}
                            className="h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                            onScroll={handlePlansScroll}>
                            <div className="grid gap-6">
                                {plans
                                    .slice(0, visiblePlans)
                                    .map((plan, index) => (
                                        <Card
                                            key={index}
                                            className="relative h-[300px] overflow-hidden cursor-pointer group animate-fadeIn"
                                            style={{
                                                animationDelay: `${
                                                    index * 150
                                                }ms`,
                                                opacity: 0,
                                                animation: `fadeIn 0.5s ease-out ${
                                                    index * 150
                                                }ms forwards`,
                                            }}
                                            onClick={() =>
                                                setSelectedPlan(plan)
                                            }>
                                            <div className="absolute inset-0">
                                                <Image
                                                    src={
                                                        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000'
                                                    }
                                                    alt={plan.name}
                                                    fill
                                                    className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                                            </div>
                                            <CardContent className="relative h-full z-10 p-6">
                                                {/* Título siempre visible */}
                                                <h3 className="text-white text-3xl font-bold absolute top-6 left-6">
                                                    {plan.name}
                                                </h3>

                                                {/* Contenido visible en hover */}
                                                <div className="absolute inset-0 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="px-6 pt-20">
                                                        {' '}
                                                        {/* Padding extra arriba para no solapar con el título */}
                                                        <div className="flex justify-between items-center mb-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center gap-2">
                                                                    <User className="w-5 h-5 text-white" />
                                                                    <span className="text-sm text-white">
                                                                        Con
                                                                        asistencia
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-300 text-sm mb-4">
                                                            {plan.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Botones siempre visibles en la parte inferior */}
                                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                                    <button className="text-white flex items-center gap-2 hover:text-green-400 transition-colors">
                                                        Ver Detalle
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white">
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            className="w-4 h-4 fill-current">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                {/* Indicador de carga si hay más planes por mostrar */}
                                {visiblePlans < plans.length && (
                                    <div className="flex justify-center py-4">
                                        <div className="loader">
                                            <div
                                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: '0ms',
                                                }}></div>
                                            <div
                                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: '150ms',
                                                }}></div>
                                            <div
                                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: '300ms',
                                                }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                href={getWhatsAppLink(plansInfo)}
                                target="_blank"
                                rel="noopener noreferrer">
                                <Button className="bg-transparent rounded-xl border">
                                    SOLICITAR INFO
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Tienda Section */}
                    <div id="productos">
                        <GradientTitle className="text-3x font-impact mb-6">
                            TIENDA
                        </GradientTitle>
                        <p className="text-gray-400 mb-8">
                            Encuentra tus productos favoritos para el gym aquí.
                            Desde ropa deportiva diseñada para maximizar tu
                            comodidad y rendimiento, hasta accesorios esenciales
                            para tus entrenamientos.
                        </p>

                        {/* Contenedor con scroll propio para productos */}
                        <div
                            ref={productsContainerRef}
                            className="h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                            onScroll={handleProductsScroll}>
                            <div className="grid grid-cols-2 gap-4">
                                {allProducts
                                    .slice(0, visibleProducts)
                                    .map((product, index) => (
                                        <Card
                                            key={index}
                                            className="relative bg-gray-900 border-gray-800 hover:border-green-400 transition-all duration-300 cursor-pointer overflow-hidden animate-fadeIn"
                                            style={{
                                                animationDelay: `${
                                                    index * 150
                                                }ms`,
                                                opacity: 0,
                                                animation: `fadeIn 0.5s ease-out ${
                                                    index * 150
                                                }ms forwards`,
                                            }}
                                            onClick={() =>
                                                setSelectedProduct(product)
                                            }>
                                            <div className="aspect-square relative overflow-hidden">
                                                <Image
                                                    src={
                                                        product.images[0] ||
                                                        '/placeholder.svg'
                                                    }
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                                                {/* Etiquetas y badges */}
                                            </div>

                                            <CardContent className="p-4">
                                                <h3 className="font-bold text-white mb-1 uppercase">
                                                    {product.name}
                                                </h3>
                                                <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                                                    {product.description}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <span className="gradient-text font-bold">
                                                        {product.price}
                                                    </span>
                                                    <button className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors text-sm">
                                                        <ShoppingCart className="w-4 h-4" />
                                                        <span>Comprar</span>
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>

                            {/* Indicador de carga si hay más productos por mostrar */}
                            {visibleProducts < allProducts.length && (
                                <div className="flex justify-center py-4 mt-4">
                                    <div className="loader">
                                        <div
                                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                            style={{
                                                animationDelay: '0ms',
                                            }}></div>
                                        <div
                                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                            style={{
                                                animationDelay: '150ms',
                                            }}></div>
                                        <div
                                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                            style={{
                                                animationDelay: '300ms',
                                            }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                href={getWhatsAppLink(
                                    'Hola, vi tu pagina y quiero más información sobre los productos',
                                )}
                                target="_blank"
                                rel="noopener noreferrer">
                                <Button className="bg-transparent rounded-xl border">
                                    VER CATALOGO
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modales */}
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

            <CatalogModal
                isOpen={isCatalogOpen}
                onClose={() => setIsCatalogOpen(false)}
                products={fullCatalog}
                onSelectProduct={product => setSelectedProduct(product)}
            />

            {/* Estilos para la animación */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #4ade80, #a855f7);
                    border-radius: 10px;
                }

                .loader {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </section>
    )
}
