'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { Tag, Star, Check, MessageCircle } from 'lucide-react'
import { useState } from 'react'

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    product: {
        title: string
        description: string
        price: string
        image: string
        sizes?: string[]
        colors?: string[]
        rating?: number
        category?: string
        discount?: string
    }
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(
        product.sizes ? product.sizes[0] : null,
    )
    const [selectedColor, setSelectedColor] = useState<string | null>(
        product.colors ? product.colors[0] : null,
    )
    const [quantity, setQuantity] = useState(1)

    // Función para generar el mensaje de WhatsApp con los detalles del producto
    const generateWhatsAppMessage = () => {
        let message = `Hola, estoy interesado en el producto: ${product.title} (${product.price})`

        if (selectedSize) {
            message += `\nTalle: ${selectedSize}`
        }

        if (selectedColor) {
            // Convertir código de color a nombre más amigable
            const colorName = getColorName(selectedColor)
            message += `\nColor: ${colorName}`
        }

        message += `\nCantidad: ${quantity}`
        message += '\n¿Podrían brindarme más información?'

        return encodeURIComponent(message)
    }

    // Función para convertir códigos de color a nombres
    const getColorName = (hexColor: string) => {
        const colorMap: Record<string, string> = {
            '#000000': 'Negro',
            '#ffffff': 'Blanco',
            '#ff0000': 'Rojo',
            '#0000ff': 'Azul',
            '#008000': 'Verde',
            '#6a0dad': 'Púrpura',
        }

        return colorMap[hexColor] || hexColor
    }

    // Función para abrir WhatsApp con el mensaje
    const openWhatsApp = () => {
        const message = generateWhatsAppMessage()
        const whatsappNumber = '3794798404'
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black text-white border-gray-800 max-w-4xl p-0 overflow-hidden">
                {/* <DialogClose className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
          <X className="h-6 w-6" />
        </DialogClose> */}

                <div className="grid md:grid-cols-2 gap-0">
                    {/* Imagen del producto */}
                    <div className="relative h-full min-h-[400px]">
                        <Image
                            src={product.image || '/placeholder.svg'}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.discount && (
                                <div className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">
                                    {product.discount} OFF
                                </div>
                            )}
                            {product.category && (
                                <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                                    <Tag className="w-4 h-4 text-gray-300" />
                                    <span className="text-sm">
                                        {product.category}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Rating */}
                        {product.rating && (
                            <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm">
                                    {product.rating} / 5
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Información del producto */}
                    <div className="p-6 bg-gray-900">
                        <h2 className="text-2xl font-bold mb-2">
                            {product.title}
                        </h2>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold gradient-text">
                                {product.price}
                            </span>
                            {product.discount && (
                                <span className="text-gray-400 line-through text-sm">
                                    $
                                    {Number.parseFloat(
                                        product.price.replace('$', ''),
                                    ) * 1.2}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-300 mb-6">
                            {product.description}
                        </p>

                        {/* Selección de tallas */}
                        {product.sizes && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-2">
                                    Talle
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`px-3 py-1 rounded-full text-sm border ${
                                                selectedSize === size
                                                    ? 'border-green-400 text-green-400'
                                                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                                            }`}
                                            onClick={() =>
                                                setSelectedSize(size)
                                            }>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Selección de colores */}
                        {product.colors && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-2">
                                    Color
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                selectedColor === color
                                                    ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-gray-900'
                                                    : ''
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() =>
                                                setSelectedColor(color)
                                            }>
                                            {selectedColor === color && (
                                                <Check className="w-4 h-4 text-white" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cantidad */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-2">
                                Cantidad
                            </h3>
                            <div className="flex items-center">
                                <button
                                    className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded-l-md hover:bg-gray-800"
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }>
                                    -
                                </button>
                                <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-600">
                                    {quantity}
                                </div>
                                <button
                                    className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded-r-md hover:bg-gray-800"
                                    onClick={() => setQuantity(quantity + 1)}>
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Botón de consulta por WhatsApp */}
                        <div className="flex flex-col gap-3 mb-6">
                            <Button
                                className="bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90 w-full py-3 flex items-center justify-center gap-2"
                                onClick={openWhatsApp}>
                                <MessageCircle className="w-5 h-5" />
                                CONSULTAR POR WHATSAPP
                            </Button>
                            <p className="text-xs text-gray-400 text-center">
                                Al hacer clic se abrirá WhatsApp con un mensaje
                                predefinido sobre este producto
                            </p>
                        </div>

                        {/* Información adicional */}
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <h3 className="text-sm font-medium mb-3">
                                Información adicional
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    • Consulta por disponibilidad de talles y
                                    colores
                                </li>
                                <li>• Envíos a todo el país</li>
                                <li>• Retiro en tienda disponible</li>
                                <li>• Garantía de calidad</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
