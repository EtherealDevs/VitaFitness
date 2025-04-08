'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { User } from 'lucide-react'
import { Plan } from '@/hooks/plans'

interface PlanModalProps {
    isOpen: boolean
    onClose: () => void
    plan: Plan
}

export function PlanModal({ isOpen, onClose, plan }: PlanModalProps) {
    const handleWhatsAppRedirect = () => {
        const phoneNumber = '3794558125'
        const message = encodeURIComponent(
            `Hola, estoy interesado en el plan "${plan.name}". ¿Podrían darme más información?`,
        )
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black text-white border-gray-800 max-w-4xl p-0 overflow-hidden">
                <div className="relative h-64 w-full">
                    <Image
                        src={
                            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000'
                        }
                        alt={plan.name}
                        fill
                        className="object-cover brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

                    {/* <DialogClose className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
            <X className="h-6 w-6" />
          </DialogClose> */}

                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <h2 className="text-4xl font-bold text-white mb-2">
                            {plan.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                                <User className="w-4 h-4 text-green-400" />
                                <span>Con asistencia</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 gradient-text">
                                Descripción del Plan
                            </h3>
                            <p className="text-gray-300 mb-6">
                                {plan.description}
                            </p>

                            <h3 className="text-xl font-bold mb-4 gradient-text">
                                Características
                            </h3>
                            {/* <ul className="space-y-3">
                                {plan.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3 animate-fadeIn"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}>
                                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-200">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul> */}
                        </div>

                        <div className="bg-gray-900 rounded-lg p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4 gradient-text">
                                    Precio
                                </h3>
                                <div className="flex items-center justify-center p-6 bg-gray-800 rounded-lg">
                                    <span className="text-4xl font-bold gradient-text">
                                        {plan.classes?.[0]?.precio}
                                    </span>
                                    <span className="text-gray-400 ml-2">
                                        /mes
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-8">
                                <Button
                                    className="bg-transparent rounded-xl border border-gray-600 hover:border-green-400 hover:text-green-400 transition-colors w-full py-3"
                                    onClick={handleWhatsAppRedirect}>
                                    Inscribirme
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
