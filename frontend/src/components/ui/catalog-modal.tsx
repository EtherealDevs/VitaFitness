"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import Button from "@/components/ui/Button"
import Image from "next/image"
import { X, ShoppingCart } from "lucide-react"

interface Product {
  title: string
  description: string
  price: string
  image: string
  sizes?: string[]
  colors?: string[]
}

interface CatalogModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onSelectProduct: (product: Product) => void
}

export function CatalogModal({ isOpen, onClose, products, onSelectProduct }: CatalogModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="gradient-text text-2xl">Catálogo de Productos</DialogTitle>
          <DialogClose className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 cursor-pointer"
              onClick={() => {
                onSelectProduct(product)
                onClose()
              }}
            >
              <div className="aspect-square relative">
                <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded-full">
                  <span className="text-white font-bold">{product.price}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-2">{product.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{product.description}</p>
                <Button className="w-full bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90 text-sm py-1">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

