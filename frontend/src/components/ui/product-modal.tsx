'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { Check, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Product } from '@/hooks/products'

interface ProductOption {
    key: string
    value: string
    product: Product & { options?: ProductOption[] }
}

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    product: Product
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const [selectedOptions, setSelectedOptions] = useState<
        Record<string, string>
    >({})

    const handleOptionSelect = (key: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [key]: value }))
    }
    const [quantity, setQuantity] = useState(1)

    // Función para generar el mensaje de WhatsApp con los detalles del producto
    const generateWhatsAppMessage = () => {
        console.log(selectedOptions)
        let message = `Hola, estoy interesado en el producto: ${product.name} (${product.price})`

        Object.entries(selectedOptions).forEach(([key, value]) => {
            message += `\n${key}: ${value}`
        })

        message += `\nCantidad: ${quantity}`
        message += '\n¿Podrían brindarme más información?'

        return encodeURIComponent(message)
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
                            src={product.images[0] || '/placeholder.svg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Información del producto */}
                    <div className="p-6 bg-gray-900">
                        <h2 className="text-2xl font-bold mb-2">
                            {product.name}
                        </h2>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold gradient-text">
                                {product.price}
                            </span>
                        </div>

                        <p className="text-gray-300 mb-6">
                            {product.description}
                        </p>

                        {Array.isArray(product.options) &&
                            (product.options as ProductOption[]).map(option => (
                                <div key={option.key} className="mb-6">
                                    <h3 className="text-sm font-medium mb-2">
                                        {option.key}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            key={option.value}
                                            className={`px-3 py-1 rounded-full text-sm border ${
                                                selectedOptions[option.key] ===
                                                option.value
                                                    ? 'border-green-400 text-green-400'
                                                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                                            }`}
                                            style={
                                                option.key.toLowerCase() ===
                                                'color'
                                                    ? {
                                                          backgroundColor:
                                                              option.value,
                                                          width: '2rem',
                                                          height: '2rem',
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                          justifyContent:
                                                              'center',
                                                          borderRadius: '50%',
                                                      }
                                                    : {}
                                            }
                                            onClick={() =>
                                                handleOptionSelect(
                                                    option.key,
                                                    option.value,
                                                )
                                            }>
                                            {option.key.toLowerCase() ===
                                            'color'
                                                ? selectedOptions[
                                                      option.key
                                                  ] === option.value && (
                                                      <Check className="w-4 h-4 text-white" />
                                                  )
                                                : option.value}
                                        </button>
                                    </div>
                                </div>
                            ))}
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
