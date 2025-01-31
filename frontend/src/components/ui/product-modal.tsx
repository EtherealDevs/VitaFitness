'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import Button from '@/components/ui/button'
import Image from 'next/image'

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
    }
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 text-white border-gray-800">
                <DialogHeader>
                    <DialogTitle className="gradient-text">
                        {product.title}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <Image
                        src={product.image || '/placeholder.svg'}
                        alt={product.title}
                        width={600}
                        height={400}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                    <p className="text-gray-300">{product.description}</p>
                    {product.sizes && (
                        <div>
                            <h4 className="font-semibold mb-2">
                                Tallas disponibles
                            </h4>
                            <div className="flex gap-2">
                                {product.sizes.map(size => (
                                    <Button
                                        key={size}
                                        className="border-gray-700 hover:border-purple-500">
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                    {product.colors && (
                        <div>
                            <h4 className="font-semibold mb-2">Colores</h4>
                            <div className="flex gap-2">
                                {product.colors.map(color => (
                                    <div
                                        key={color}
                                        className="w-8 h-8 rounded-full border-2 border-gray-700 cursor-pointer"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold gradient-text">
                            {product.price}
                        </span>
                        <Button className="bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90">
                            Añadir al carrito
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
