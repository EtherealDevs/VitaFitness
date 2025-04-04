'use client'

import type React from 'react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { MessageCircle, Search } from 'lucide-react'
import { useState } from 'react'
import { Product } from '@/hooks/products'

interface CatalogModalProps {
    isOpen: boolean
    onClose: () => void
    products: Product[]
    onSelectProduct: (product: Product) => void
}

export function CatalogModal({
    isOpen,
    onClose,
    products,
    onSelectProduct,
}: CatalogModalProps) {
    const [searchTerm, setSearchTerm] = useState('')

    // Extraer categorías únicas de los producto

    // Filtrar productos según búsqueda y categoría
    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    // Función para generar el mensaje de WhatsApp
    const generateWhatsAppMessage = (product: Product) => {
        let message = `Hola, estoy interesado en el producto: ${product.name} (${product.price})`
        message +=
            '\n¿Podrían brindarme más información sobre disponibilidad y envíos?'
        return encodeURIComponent(message)
    }

    // Función para abrir WhatsApp con el mensaje
    const openWhatsApp = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation() // Evitar que se abra el modal de producto
        const message = generateWhatsAppMessage(product)
        const whatsappNumber = '3794798404'
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black text-white border-gray-800 max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between sticky top-0 bg-black z-10 py-4">
                    <DialogTitle className="gradient-text text-2xl">
                        Catálogo de Productos
                    </DialogTitle>
                    {/*  <DialogClose className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </DialogClose> */}
                </DialogHeader>

                {/* Barra de búsqueda y filtros */}
                <div className="mb-6 sticky top-16 bg-black z-10 pt-2 pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-green-400"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-gray-400 mb-2">
                            No se encontraron productos
                        </p>
                        <button
                            className="text-green-400 hover:underline"
                            onClick={() => {
                                setSearchTerm('')
                            }}>
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredProducts.map((product, index) => (
                            <div
                                key={index}
                                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-green-400 transition-all duration-300 group">
                                <div
                                    className="aspect-square relative overflow-hidden cursor-pointer"
                                    onClick={() => onSelectProduct(product)}>
                                    <Image
                                        src={
                                            product.images[0] ||
                                            '/placeholder.svg'
                                        }
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>

                                    {/* Categoría y precio */}
                                    <div className="absolute bottom-3 left-0 w-full px-3 flex justify-between items-center">
                                        <div className="bg-black/70 px-2 py-1 rounded-full">
                                            <span className="text-white font-bold text-sm">
                                                {product.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold text-white mb-2 text-lg">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                        {product.description}
                                    </p>

                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1 bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90 text-sm py-2"
                                            onClick={e =>
                                                openWhatsApp(product, e)
                                            }>
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Consultar
                                        </Button>

                                        <Button
                                            className="bg-gray-800 hover:bg-gray-700 text-sm py-2"
                                            onClick={() =>
                                                onSelectProduct(product)
                                            }>
                                            Ver Detalles
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Estilo para ocultar la barra de desplazamiento pero mantener la funcionalidad */}
                <style jsx global>{`
                    .no-scrollbar {
                        -ms-overflow-style: none; /* IE and Edge */
                        scrollbar-width: none; /* Firefox */
                    }
                    .no-scrollbar::-webkit-scrollbar {
                        display: none; /* Chrome, Safari and Opera */
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    )
}
